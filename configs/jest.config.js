// Enforces: LAW-3.2 (Coverage Floors), LAW-3.4 (Test Isolation — fast unit runs)
// See configs/CONFIG-LAW-MAP.md for the full config→law mapping.
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.ts',
  ],
  // LAW-3.2: global floor 80% (business logic). Per-path floors below raise
  // utilities to 100% and allow controllers 70%. Never lower to pass a build.
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
    'src/utils/': { lines: 100, branches: 100, functions: 100, statements: 100 },
    'src/controllers/': { lines: 70, branches: 70, functions: 70, statements: 70 },
  },
  clearMocks: true,
  restoreMocks: true,
};
