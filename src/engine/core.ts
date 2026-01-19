import type { Rule } from '../types/index.js';
import { evaluateCondition } from './evaluator.js';
import { ActionHandler } from './actions.js';
import { Explainer } from '../logger/explainer.js';

export class Engine {
  private rules: Rule[];
  private maxCycles: number;

  constructor(rules: Rule[], maxCycles: number = 10) {
    this.rules = [...rules].sort((a, b) => b.priority - a.priority);
    this.maxCycles = maxCycles;
  }

  public run(initialState: any): any {
    let state = { ...initialState };
    let currentCycle = 0;
    let stateChanged = true;
    const firedRuleIds = new Set<string>();

    console.log("=== INICIANDO MOTOR DE REGLAS ===");

    while (stateChanged && currentCycle < this.maxCycles) {
      stateChanged = false;
      currentCycle++;
      
      console.log(`\n--- CICLO DE EVALUACIÓN #${currentCycle} ---`);
      
      for (const rule of this.rules) {
        // Evitar que una regla que ya se disparó se vuelva a disparar (Forward Chaining estándar)
        if (firedRuleIds.has(rule.id)) continue;

        const isMatch = evaluateCondition(rule.when, state);
        
        // Notificamos al explainer el resultado
        Explainer.registerRule(rule.id, isMatch);

        if (isMatch) {
          const previousStateStr = JSON.stringify(state);
          
          // RE-ACTIVACIÓN: Aquí ejecutamos las acciones realmente
          state = ActionHandler.executeAll(rule.then, state);
          
          firedRuleIds.add(rule.id);
          
          // Si el estado cambió tras las acciones, marcamos para otro ciclo
          if (JSON.stringify(state) !== previousStateStr) {
            stateChanged = true; 
          }
        }
      }

      // Mostramos la tabla resumen del ciclo actual
      Explainer.showSummary();
    }

    if (currentCycle >= this.maxCycles) {
      console.warn("\n!: Límite de ciclos alcanzado. Se detuvo para evitar bucles.");
    }

    console.log("\n=== MOTOR FINALIZADO ===");
    return state;
  }
}