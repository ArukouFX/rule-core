import type { Operator } from '../types/index.js';

// Definimos la estructura de un "pista" o rastro de comparación
export interface Trace {
  fact: string;
  operator: Operator;
  actual: any;
  expected: any;
  success: boolean;
}

export class Explainer {
  private static traces: Trace[] = [];

  // Registra un intento de comparación
  static record(trace: Trace): void {
    this.traces.push(trace);
  }

  // Limpia los rastros (útil antes de evaluar una nueva regla)
  static clear(): void {
    this.traces = [];
  }

  // Genera un reporte legible
  static getReport(): string {
    if (this.traces.length === 0) return "  (No hay datos evaluados)";
    
    return this.traces.map(t => {
      const icon = t.success ? 'V: ' : 'X: ';
      return `  ${icon} [${t.fact}]: valor ${t.actual} ${t.success ? 'cumple' : 'NO cumple'} ser ${t.operator} que ${t.expected}`;
    }).join('\n');
  }
}