// Enforces LAW-3.2 (coverage floors): 100% on pure domain logic (src/lib) and
// the server's security boundary (server/), 90% on hooks, 70% on components —
// mirrors crm-demo's 100%-domain convention and user-training-onboarding's
// 70-80%-presentation convention.
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/server'],
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/style-mock.js',
  },
  setupFiles: ['<rootDir>/test/resize-observer-mock.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'server/**/*.ts',
    '!src/**/*.spec.{ts,tsx}',
    '!server/**/*.spec.ts',
    '!src/main.tsx',
    '!src/theme.ts',
  ],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
    './src/lib/': { lines: 100, branches: 100, functions: 100, statements: 100 },
    './server/': { lines: 100, branches: 100, functions: 100, statements: 100 },
    './src/hooks/': { lines: 90, branches: 90, functions: 90, statements: 90 },
    './src/components/': { lines: 70, branches: 70, functions: 70, statements: 70 },
  },
  clearMocks: true,
  restoreMocks: true,
};
