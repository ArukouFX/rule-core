/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Usamos el preset específico para ESM
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  // Indicamos que los archivos .ts deben tratarse como módulos de ES
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // Este regex es vital: permite que Jest encuentre "file.js" aunque el archivo real sea "file.ts"
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // Configuramos ts-jest para que use soporte ESM
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};