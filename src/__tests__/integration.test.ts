import { Engine } from '../engine/core.js';
import type { Rule } from '../types/index.js';

describe('Engine Integration Tests', () => {

  const rules: Rule[] = [
    {
      id: 'level-up-logic',
      priority: 10,
      // No ponemos description porque ahora es opcional (?)
      when: { fact: 'user.exp', operator: 'GTE' as const, value: 100 },
      then: [
        { 
          type: 'UPDATE_FACT', 
          params: { path: 'user.level', value: 2 } 
        }
      ]
    },
    {
      id: 'suggestion-logic',
      priority: 5,
      when: { fact: 'user.level', operator: 'EQ' as const, value: 2 },
      then: [
        { 
          type: 'SET_STATE', 
          params: { path: 'system.suggestion', value: 'GO_TO_ARENA' } 
        }
      ]
    }
  ];

  test('Debería ejecutar reglas en cadena (Efecto Dominó)', () => {
    const initialState = {
      user: { exp: 150, level: 1 },
      system: { suggestion: 'NONE' }
    };

    const engine = new Engine(rules);
    const finalState = engine.run(initialState);

    // Verificamos que ambas reglas se procesaron correctamente
    expect(finalState.user.level).toBe(2);
    expect(finalState.system.suggestion).toBe('GO_TO_ARENA');
  });
});