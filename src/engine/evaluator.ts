import { Explainer } from '../logger/explainer.js';
import type { Condition } from '../types/index.js';
import { evaluateOperator } from './operators.js';

/**
 * Evalúa una condición de forma recursiva.
 * @param condition La condición a evaluar (puede ser un átomo o un grupo)
 * @param state El estado actual del sistema (los hechos)
 */
export function evaluateCondition(condition: Condition, state: any): boolean {
  // Caso 1: Es un grupo "all_of" (AND lógico)
  if (condition.all_of) {
    return condition.all_of.every((subCond) => evaluateCondition(subCond, state));
  }

  // Caso 2: Es un grupo "any_of" (OR lógico)
  if (condition.any_of) {
    return condition.any_of.some((subCond) => evaluateCondition(subCond, state));
  }

  // Caso 3: Es una condición atómica (fact, operator, value)
  if (condition.fact && condition.operator) {
    const actualValue = getNestedValue(state, condition.fact);
    const success = evaluateOperator(condition.operator, actualValue, condition.value);

    // MANDAMOS LA INFORMACIÓN AL EXPLAINER
    Explainer.record({
      fact: condition.fact,
      operator: condition.operator,
      actual: actualValue,
      expected: condition.value,
      success: success
    });

    return success;
  }

  return false;
}

/**
 * Accede a propiedades anidadas usando strings (ej: "user.points")
 */
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
}