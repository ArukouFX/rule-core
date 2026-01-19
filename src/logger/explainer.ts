import type { Operator } from '../types/index.js';

export interface Trace {
  fact: string;
  operator: Operator;
  actual: any;
  expected: any;
  success: boolean;
}

interface RuleLog {
  ruleId: string;
  success: boolean;
  traces: Trace[];
}

export class Explainer {
  private static logs: RuleLog[] = [];
  private static currentTraces: Trace[] = [];

  // Registra comparaciones individuales (se llama desde el Evaluator)
  static record(trace: Trace): void {
    this.currentTraces.push(trace);
  }

  // Registra el resultado final de una regla (se llama desde el Engine)
  static registerRule(ruleId: string, success: boolean): void {
    this.logs.push({
      ruleId,
      success,
      traces: [...this.currentTraces]
    });
    this.currentTraces = []; // Limpiamos para la siguiente regla
  }

  static clear(): void {
    this.logs = [];
    this.currentTraces = [];
  }

  /**
   * Imprime una tabla con el resumen y detalles técnicos
   */
  static showSummary(): void {
    if (this.logs.length === 0) return;

    console.log("\n🔍 RESUMEN DE EVALUACIÓN:");
    
    const summaryTable = this.logs.map(log => {
      // Tomamos el primer rastro fallido o el último exitoso para el motivo
      const relevantTrace = log.traces.find(t => !t.success) || log.traces[0];
      const motivo = relevantTrace 
        ? `${relevantTrace.fact} (${relevantTrace.actual}) ${relevantTrace.operator} ${relevantTrace.expected}`
        : "Sin condiciones";

      return {
        "Regla": log.ruleId,
        "Estado": log.success ? "V: ACTIVADA" : "X: SALTADA",
        "Detalle Técnico": motivo
      };
    });

    console.table(summaryTable);
    this.clear(); // Limpiar después de mostrar
  }
}