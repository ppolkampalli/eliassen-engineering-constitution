# AGENTS.md — Engineering Constitution Project Rules

This project is governed by the **Eliassen Group Engineering Constitution v1.2.0**
(57 citable laws, 10 articles). Full registry: `docs/constitution/REGISTRY.md`
(installed copy) or the `engineering-constitution` repository. Cite laws by ID in
decisions: full DECISION/CITATION/RATIONALE blocks for significant calls, inline
`(per [LAW-X.Y vN])` for minor corrections.

## Build and test commands

```bash
npm run lint        # ESLint, Article 2 laws
npm run type-check  # tsc strict (LAW-2.3/2.4)
npm test            # Jest with coverage floors (LAW-3.2)
npm run format      # Prettier (LAW-2.2)
```

All of lint, type-check, and test must pass before any work is "done" (LAW-6.2).
Quality gates have no override path.

## Code style

- Naming (LAW-2.1): camelCase vars/functions, PascalCase types (no `I` prefix),
  UPPER_SNAKE_CASE constants, is/has/can booleans, kebab-case files.
- No `any` — use `unknown` + narrowing (LAW-2.3). Explicit return types on
  exports (LAW-2.4).
- Functions: one responsibility; complexity ≤5 and ~40 lines are advisory review
  thresholds (LAW-2.6). No magic numbers.
- Comments: interface comments are part of the abstraction; WHY comments for
  business rules/trade-offs/constraints; never restate the code (LAW-6.4).

## Testing instructions

- Canon TDD (LAW-3.1): test list → one failing test at a time → green → refactor.
  **Never delete, skip, or weaken a failing test to achieve green.**
- Coverage floors 80/100/70 are never lowered (LAW-3.2). Generated tests must
  kill mutants beyond the existing suite (LAW-3.6) — hollow tests are rejected
  (LAW-3.5).

## Agentic workflow (Article 10)

- Nontrivial work follows a declared workflow from
  `docs/constitution/workflows/` — WF-FEATURE, WF-RESEARCH, WF-BUG, WF-SECBUG,
  WF-REFACTOR, WF-AMENDMENT (LAW-10.6). Deviations on non-hard stages are
  permitted but recorded; hard stages are never overridable.
- Substantial work proceeds from a reviewed plan that names the bearing laws
  (LAW-10.1).
- Define a runnable check before implementing; present evidence, not assertions
  (LAW-10.2).
- Work is reviewed by a context that didn't produce it (LAW-10.5).
- On ambiguous requirements, lasting architectural choices, or security
  questions: stop and ask (LAW-7.5). Guessing is prohibited.

## Security (Article 5 — Security persona holds veto)

Allowlist-validate all external input (LAW-5.1); parameterized queries only
(LAW-5.2); no secrets in code or logs (LAW-5.3); established auth frameworks only
(LAW-5.4). Never send PII, secrets, or client-confidential material to unapproved
AI tools (LAW-7.2).

## Commit and PR guidelines

- Conventional Commits; tag AI-generated code `[Claude-assisted]` or the
  equivalent for your tool (LAW-7.3); complete the PR's AI Assistance section.
- `law:` prefix is reserved for constitution amendment enactments.
- Two approvals including a domain expert; no self-approval (LAW-6.1).
- Docs update in the same PR as the change they describe (LAW-6.5).
