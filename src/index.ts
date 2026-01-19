import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

import type { Rule } from './types/index.js';
import { Engine } from './engine/core.js'; // Nueva clase
import { SchemaValidator } from './engine/validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let state = {
  user: { name: "Luis", progress: 95, currentLevel: 1, errors: 0, isPremium: true, hasBadge: false },
  system: { suggestion: "NONE" }
};

try {
  const rulesPath = path.join(__dirname, '../data/rules.yaml');
  const fileContents = fs.readFileSync(rulesPath, 'utf8');
  const data = yaml.load(fileContents) as { rules: Rule[] };

  // 1. VALIDACIÓN
  const validationErrors = SchemaValidator.validateRuleset(data.rules);
  if (validationErrors.length > 0) {
      validationErrors.forEach(err => console.error(`X: ${err}`));
      process.exit(1);
  }

  // 2. EJECUCIÓN
  const engine = new Engine(data.rules);
  const finalState = engine.run(state);

  // 3. PERSISTENCIA
  const outputPath = path.join(__dirname, '../data/last_state.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalState, null, 2), 'utf8');
  
  console.log("Estado final persistido con éxito.");

} catch (error) {
  console.error("Error crítico:", error);
  process.exit(1);
}