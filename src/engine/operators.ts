import type { Operator } from "../types/index.js"

// Definimos el tipo de la función de comparación
type OperatorFn = (a: any, b: any) => boolean;

// El diccionario de "Leyes Lógicas"
export const operators: Record<Operator, OperatorFn> = {
  EQ: (a, b) => a === b,
  NEQ: (a, b) => a !== b,
  GT: (a, b) => typeof a === 'number' && a > b,
  GTE: (a, b) => typeof a === 'number' && a >= b,
  LT: (a, b) => typeof a === 'number' && a < b,
  LTE: (a, b) => typeof a === 'number' && a <= b,
  CONTAINS: (a, b) => Array.isArray(a) && a.includes(b),
};

/**
 * Función segura para evaluar comparaciones
 */
export function evaluateOperator(operator: Operator, actual: any, expected: any): boolean {
  const fn = operators[operator];
  if (!fn) {
    throw new Error(`Operador no soportado: ${operator}`);
  }
  return fn(actual, expected);
}