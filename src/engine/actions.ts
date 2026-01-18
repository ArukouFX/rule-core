import type { Action } from '../types/index.js';

export class ActionHandler {
  static executeAll(actions: Action[], state: any): any {
    let newState = { ...state };

    for (const action of actions) {
      console.log(`[Action] Ejecutando: ${action.type}`);
      
      if (action.type === 'UPDATE_FACT') {
        const { path, value } = action.params;
        newState = this.updateNestedValue(newState, path, value);
      }
      
      if (action.type === 'SET_STATE') {
        const { path, value } = action.params;
        newState = this.updateNestedValue(newState, path, value);
      }

      if (action.type === 'EMIT_EVENT') {
        console.log(`>> EVENTO DISPARADO: ${action.params.name}`);
      }
    }

    return newState;
  }

  private static updateNestedValue(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;

    for (const key of keys) {
      if (!current[key]) current[key] = {};
      current = current[key];
    }

    // Lógica para incrementos/decrementos relativos
    if (typeof value === 'string' && (value.startsWith('+') || value.startsWith('-'))) {
      const currentValue = current[lastKey] || 0;
      const delta = parseInt(value, 10);
      current[lastKey] = currentValue + delta;
    } else {
      // Reemplazo absoluto
      current[lastKey] = value;
    }

    return obj;
  }
}