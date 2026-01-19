import type { Rule } from "../types/index.js"; // Importación de tipo corregida

export class SchemaValidator {
  /**
   * Valida un array de reglas antes de que el motor las procese.
   */
  static validateRuleset(rules: Rule[]): string[] { // Usamos 'Rule' aquí para que sea leído
    const errors: string[] = [];

    if (!Array.isArray(rules)) {
      return ["El archivo de reglas debe contener una lista bajo la clave 'rules'."];
    }

    rules.forEach((rule, index) => {
      const ruleId = rule.id || `Índice ${index}`;
      
      if (!rule.id) errors.push(`Regla en índice ${index} no tiene 'id'.`);
      if (!rule.when) errors.push(`La regla [${ruleId}] no tiene condición 'when'.`);
      if (!rule.then) errors.push(`La regla [${ruleId}] no tiene acciones 'then'.`);
      
      if (rule.then && !Array.isArray(rule.then)) {
        errors.push(`Regla [${ruleId}]: 'then' debe ser una lista de acciones.`);
      }
    });

    return errors;
  }
}