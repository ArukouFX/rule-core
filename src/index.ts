import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

import type { Rule } from './types/index.js';
import { evaluateCondition } from './engine/evaluator.js';
import { ActionHandler } from './engine/actions.js';
import { Explainer } from './logger/explainer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let state = {
  user: {
    name: "Luis",
    progress: 95,
    currentLevel: 1,
    errors: 0,
    isPremium: true,
    hasBadge: false
  },
  system: {
    suggestion: "NONE"
  }
};

try {
  const rulesPath = path.join(__dirname, '../data/rules.yaml');
  const fileContents = fs.readFileSync(rulesPath, 'utf8');
  const data = yaml.load(fileContents) as { rules: Rule[] };

  console.log("=== INICIANDO EVALUACIÓN DEL SISTEMA ===");
  
  const MAX_CYCLES = 10;
  let currentCycle = 0;
  let stateChanged = true;
  
  // REGISTRO DE REGLAS DISPARADAS
  const firedRuleIds = new Set<string>();

  const sortedRules = data.rules.sort((a, b) => b.priority - a.priority);

  while (stateChanged && currentCycle < MAX_CYCLES) {
    stateChanged = false;
    currentCycle++;
    
    console.log(`\n--- CICLO DE EVALUACIÓN #${currentCycle} ---`);
    
    for (const rule of sortedRules) {
      // Si la regla ya se disparó antes, la saltamos para evitar bucles
      if (firedRuleIds.has(rule.id)) continue;

      Explainer.clear();
      const isMatch = evaluateCondition(rule.when, state);

      if (isMatch) {
        const previousStateStr = JSON.stringify(state);
        
        console.log(`\nV: REGLA ACTIVADA: [${rule.id}]`);
        state = ActionHandler.executeAll(rule.then, state);
        
        // Marcamos la regla como disparada
        firedRuleIds.add(rule.id);
        
        if (JSON.stringify(state) !== previousStateStr) {
          stateChanged = true; 
        }
      }
    }

    if (!stateChanged) {
      console.log("\n!: El sistema ha alcanzado un estado estable (No hubo más cambios).");
    }
  }

  if (currentCycle >= MAX_CYCLES) {
    console.warn("\n!: Límite de ciclos alcanzado. Se detuvo para evitar bucles infinitos.");
  }

  console.log("\n=== EVALUACIÓN FINALIZADA ===");
  console.log("Estado final resultante:", JSON.stringify(state, null, 2));

  const outputPath = path.join(__dirname, '../data/last_state.json');
  const stateJson = JSON.stringify(state, null, 2);
  fs.writeFileSync(outputPath, stateJson, 'utf8');
  
  console.log(`\nEstado persistido exitosamente en: ${outputPath}`);

} catch (error) {
  console.error("Error crítico en el motor:", error);
}