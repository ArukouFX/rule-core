# RuleCore Engine

**RuleCore** es un motor de inferencia lógica basado en reglas (**Rule Engine**) desarrollado en TypeScript y ejecutado sobre Docker. El sistema permite desacoplar la lógica de negocio de la implementación técnica, utilizando un algoritmo de **Forward Chaining** (encadenamiento hacia adelante) para la toma de decisiones automatizada.

## Alcance del Proyecto (Scope)

El objetivo de este motor es procesar estados complejos y transformarlos a través de un ciclo de inferencia reactivo y transparente.

* **Evaluación Booleana Compleja:** Soporta lógica anidada mediante operadores `all_of` (AND) y `any_of` (OR).
* **Inferencia Cíclica (Forward Chaining):** El motor re-evalúa las reglas automáticamente si una acción previa modifica el estado, permitiendo reacciones en cadena lógicas.
* **Transparencia (Explainer):** Sistema de trazabilidad integrado que justifica cada decisión tomada por el motor (XAI - Explainable AI).
* **Persistencia de Estado:** Capacidad de capturar "snapshots" del estado final en archivos JSON para su posterior análisis o consumo.
* **Infraestructura Inmutable:** Despliegue estandarizado mediante Docker y configuración dinámica vía Bind Mounts para los archivos YAML.

---

## Arquitectura del Sistema

El motor se divide en cuatro capas fundamentales:

1.  **Capa de Hechos (Facts/State):** El objeto JSON que representa la realidad actual del sistema.
2.  **Capa de Reglas (Knowledge Base):** Archivos YAML donde se definen las condiciones (`when`) y acciones (`then`).
3.  **Motor de Inferencia (Reasoning Engine):** El ciclo `Match-Resolve-Act` que procesa las reglas según su prioridad y detecta cambios de estado.
4.  **Capa de Acción (Handlers):** Ejecutores que modifican el estado (absolutos o relativos) o disparan eventos externos.



---

## Instalación y Uso

### Requisitos
* Docker y Docker Compose.
* Node.js (para desarrollo local).

### Ejecución con Bind Mount
Para trabajar en tiempo real y ver cómo los cambios en tus reglas o código afectan al motor sin reconstruir la imagen de Docker:

```bash
docker run -v $(pwd):/app rule-core-engine
```



---

## Ejemplo de Regla
Las reglas se definen de forma declarativa, permitiendo que la lógica sea legible y fácil de mantener:
```
- id: "PROG_001_LEVEL_UP"
  priority: 10
  description: "Sube de nivel si el progreso es completo"
  when:
    all_of:
      - { fact: "user.progress", operator: "GTE", value: 100 }
      - { fact: "user.currentLevel", operator: "LT", value: 5 }
  then:
    - type: "UPDATE_FACT"
      params: { path: "user.currentLevel", value: "+1" }
    - type: "SET_STATE"
      params: { path: "user.progress", value: 0 }
    - type: "EMIT_EVENT"
      params: { name: "LEVEL_UP_CELEBRATION" }
```



---

## Mecanismos de Seguridad
* **Loop Protection:** Límite máximo de seguridad (por defecto 10 ciclos) para evitar el agotamiento de recursos.
* **Fired Rules Set:** Registro de reglas ejecutadas que evita la re-activación redundante de la misma lógica dentro de un mismo proceso de inferencia.



---

## Licencia
Este proyecto está bajo la Licencia MIT. Esto significa que puedes usarlo, copiarlo, modificarlo y distribuirlo libremente, siempre y cuando se incluya el aviso de copyright original.



---

Desarrollado como Side-Project para exploración de Arquitecturas de Sistemas.