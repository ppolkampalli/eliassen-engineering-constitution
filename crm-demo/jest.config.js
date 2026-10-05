// Enforces LAW-3.2 (coverage floors — domain/application logic 100%) and
// LAW-3.4 (isolation: use-cases take injected repositories, no real I/O in unit tests).
/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true, tsconfig: { module: 'ESNext', verbatimModuleSyntax: false } }],
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/demo.ts'],
  coverageThreshold: {
    global: { lines: 100, branches: 90, functions: 100, statements: 100 },
  },
  clearMocks: true,
  restoreMocks: true,
};
