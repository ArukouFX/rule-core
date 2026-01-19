import type { Operator } from "../types/index.js"

type OperatorFn = (a: any, b: any) => boolean;

export const operators: Record<Operator, OperatorFn> = {
  EQ: (a, b) => a === b,
  NEQ: (a, b) => a !== b,
  
  // Seguridad: Verificamos que ambos sean números para evitar comparaciones basura
  GT: (a, b) => typeof a === 'number' && typeof b === 'number' && a > b,
  GTE: (a, b) => typeof a === 'number' && typeof b === 'number' && a >= b,
  LT: (a, b) => typeof a === 'number' && typeof b === 'number' && a < b,
  LTE: (a, b) => typeof a === 'number' && typeof b === 'number' && a <= b,

  // CONTAINS mejorado: Soporta Arrays y Strings
  CONTAINS: (a, b) => {
    if (Array.isArray(a)) return a.includes(b);
    if (typeof a === 'string') return a.includes(b);
    return false;
  },
};

export function evaluateOperator(operator: Operator, actual: any, expected: any): boolean {
  const fn = operators[operator];
  if (!fn) {
    console.error(`[Operators] Operador no soportado: ${operator}`);
    return false; // Retornamos false en lugar de romper el hilo de ejecución
  }
  
  try {
    return fn(actual, expected);
  } catch (error) {
    console.error(`[Operators] Error evaluando ${operator}:`, error);
    return false;
  }
}