# Configuration → Law Map

Every configuration file in this directory mechanically enforces specific laws.
Pure-JSON files cannot carry comments, so this document is their law-mapping header.
JS configs additionally carry an `// Enforces:` header inline.

Changing any setting here changes what a law enforces — such changes go through the
[amendment process](../amendments/AMENDMENT-PROCESS.md) (LAW-1.3: conventions change
for everyone or not at all).

## `.eslintrc.json`
**Enforces: LAW-2.1, LAW-2.3, LAW-2.4, LAW-2.5, LAW-4.3, Article 5 (no-eval), LAW-1.3**

| Setting | Law | What it enforces |
|---|---|---|
| `@typescript-eslint/naming-convention` | LAW-2.1 | camelCase variables/functions/params; PascalCase types; interfaces banned from `I` prefix; UPPER_CASE constant option; is/has/can boolean prefixes |
| `@typescript-eslint/no-explicit-any: error` | LAW-2.3 | Prohibition of `any` |
| `@typescript-eslint/explicit-function-return-type: warn` | LAW-2.4 | Explicit return types (exported surfaces enforced to error level in review) |
| `import/order` (builtin → external → internal, alphabetized, newlines between) | LAW-2.5 | Import ordering |
| `import/no-cycle: error` | LAW-4.3 | No circular dependencies |
| `complexity: ["warn", 5]`, `max-lines-per-function: ["warn", 40]` | LAW-2.6 v1.1 | Advisory thresholds — review scrutiny beyond CC 5 / ~40 LOC, not automatic rejection |
| `no-eval: error`, `no-implied-eval: error` | Article 5 (LAW-5.1 spirit) | Eval-class injection surface removed |
| `no-console: warn` (allow `warn`/`error`) | LAW-5.3 (log hygiene), LAW-1.1 | Stray debug logging flagged |
| `extends: ...recommended + type-checked + prettier` | LAW-1.3, LAW-2.2 | One shared baseline; formatting delegated to Prettier |

## `.prettierrc.json`
**Enforces: LAW-2.2**

| Setting | Value | Law |
|---|---|---|
| `semi` | `true` | LAW-2.2 |
| `singleQuote` | `true` | LAW-2.2 |
| `printWidth` | `100` | LAW-2.2 |
| `tabWidth` | `2` | LAW-2.2 |
| `trailingComma` | `"es5"` | LAW-2.2 |
| `arrowParens` | `"always"` | LAW-2.2 |

## `tsconfig.base.json`
**Enforces: LAW-2.3, LAW-2.4 (strict type regime)**

All strict-family flags on: `strict`, `noImplicitAny` (LAW-2.3's compiler half),
`strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`,
`strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, plus
`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` (LAW-2.4 support),
`noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`,
`forceConsistentCasingInFileNames` (LAW-2.1 kebab-case cross-OS safety),
`esModuleInterop`, `skipLibCheck`.

Weakening any strict flag is a LAW-2.3/LAW-6.2 violation (CRITICAL per the
[violation severity matrix](../.claude/skills/constitution-enforcer/reference/violation-severity.md)).

## `jest.config.js`
**Enforces: LAW-3.2, LAW-3.4**

| Setting | Law | What it enforces |
|---|---|---|
| `coverageThreshold.global: 80%` | LAW-3.2 | Business-logic floor |
| `coverageThreshold['src/utils/']: 100%` | LAW-3.2 | Utilities floor |
| `coverageThreshold['src/controllers/']: 70%` | LAW-3.2 | Controllers floor |
| `clearMocks`/`restoreMocks: true` | LAW-3.4 | No mock state bleeding between tests |

## `lint-staged.config.js` + `hooks/pre-commit`
**Enforces: LAW-6.2 (pre-commit stage), LAW-2.2, Article 2**

The hook runs `eslint --fix` + `prettier --write` on staged files, then
`npm run type-check`; failure messages cite the violated law. The hook is the local
echo of the CI gates — CI (`ci/github/quality.yml`) remains the authoritative,
inviolable gate (LAW-6.2): bypassing the hook locally (`--no-verify`) only moves the
failure to CI, it cannot merge past it.
