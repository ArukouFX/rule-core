import { evaluateCondition } from '../engine/evaluator.js';

describe('Evaluator Core - Complete Operator Suite', () => {
  
  // --- OPERADORES DE IGUALDAD ---
  test('Operador EQ: Debería validar igualdad estricta', () => {
    const state = { status: 'active' };
    expect(evaluateCondition({ fact: 'status', operator: 'EQ' as const, value: 'active' }, state)).toBe(true);
    expect(evaluateCondition({ fact: 'status', operator: 'EQ' as const, value: 'inactive' }, state)).toBe(false);
  });

  test('Operador NEQ: Debería validar desigualdad', () => {
    const state = { role: 'admin' };
    expect(evaluateCondition({ fact: 'role', operator: 'NEQ' as const, value: 'guest' }, state)).toBe(true);
    expect(evaluateCondition({ fact: 'role', operator: 'NEQ' as const, value: 'admin' }, state)).toBe(false);
  });

  // --- OPERADORES NUMÉRICOS ---
  test('Operadores GTE y LTE: Debería validar límites inclusive', () => {
    const state = { score: 100 };
    // GTE (Greater Than or Equal)
    expect(evaluateCondition({ fact: 'score', operator: 'GTE' as const, value: 100 }, state)).toBe(true);
    expect(evaluateCondition({ fact: 'score', operator: 'GTE' as const, value: 101 }, state)).toBe(false);
    
    // LTE (Less Than or Equal)
    expect(evaluateCondition({ fact: 'score', operator: 'LTE' as const, value: 100 }, state)).toBe(true);
    expect(evaluateCondition({ fact: 'score', operator: 'LTE' as const, value: 99 }, state)).toBe(false);
  });

  test('Operador LT: Debería validar estrictamente menor', () => {
    const state = { age: 17 };
    expect(evaluateCondition({ fact: 'age', operator: 'LT' as const, value: 18 }, state)).toBe(true);
    expect(evaluateCondition({ fact: 'age', operator: 'LT' as const, value: 17 }, state)).toBe(false);
  });

  // --- OPERADORES DE COLECCIÓN / TEXTO ---
  test('Operador CONTAINS: Debería buscar subcadenas o elementos en arrays', () => {
    const state = { 
      tags: ['typescript', 'docker', 'rules'],
      message: "hola mundo" 
    };
    
    // En Arrays
    expect(evaluateCondition({ fact: 'tags', operator: 'CONTAINS' as const, value: 'docker' }, state)).toBe(true);
    // En Strings
    expect(evaluateCondition({ fact: 'message', operator: 'CONTAINS' as const, value: 'hola' }, state)).toBe(true);
    // Fallo
    expect(evaluateCondition({ fact: 'tags', operator: 'CONTAINS' as const, value: 'java' }, state)).toBe(false);
  });

  // --- VALIDACIÓN DE ROBUSTEZ (TIPOS) ---
  test('Seguridad: Debería retornar false si el fact no existe', () => {
    const state = { a: 1 };
    expect(evaluateCondition({ fact: 'b.c.d', operator: 'EQ' as const, value: 10 }, state)).toBe(false);
  });

  test('Seguridad: No debería explotar con valores null o undefined en el estado', () => {
    const state = { data: null };
    expect(evaluateCondition({ fact: 'data', operator: 'GT' as const, value: 0 }, state)).toBe(false);
  });
});