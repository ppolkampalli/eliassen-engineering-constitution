// Enforces: LAW-3.2 (Coverage Floors — domain utilities 100%, presentation 70%,
// global 80%), LAW-3.4 (isolation — jsdom, no network).
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/style-mock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
    'src/domain/': { lines: 100, branches: 100, functions: 100, statements: 100 },
    'src/components/': { lines: 70, branches: 70, functions: 70, statements: 70 },
    'src/pages/': { lines: 70, branches: 70, functions: 70, statements: 70 },
  },
  clearMocks: true,
  restoreMocks: true,
};
