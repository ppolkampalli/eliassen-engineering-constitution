# Engineering Standards — Working Reference

The day-to-day developer view of the constitution. Every standard here is a law;
the law is the authority — when this page and a law file disagree, the law file
wins, and the discrepancy is a bug in this page (LAW-6.5).

## Code Style (Article 2)

**Naming (LAW-2.1)**

| Element | Convention | Example |
|---|---|---|
| Variables, functions, methods, parameters | `camelCase` | `orderTotal`, `calculateTax()` |
| Classes, interfaces, types, enums | `PascalCase` (no `I` prefix) | `PaymentGateway` |
| Module constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Booleans | `is`/`has`/`can` prefix | `isActive`, `canRetry` |
| Files, directories | `kebab-case` | `payment-service.ts` |

**Formatting (LAW-2.2):** Prettier, shared config, never manual: 2-space, 100-char,
single quotes, semicolons, ES5 trailing commas.

**Types (LAW-2.3, LAW-2.4):** No `any` — `unknown` + narrowing; exceptions need an
inline justification and Quality persona approval. Exported functions declare
return types. All strict tsconfig flags on (see configs/tsconfig.base.json).

**Structure (LAW-2.5, LAW-2.6 v1.1):** Imports stdlib → third-party → local,
alphabetized. Functions: one responsibility, depth of abstraction as the goal;
complexity ≤5 and ~40 lines are advisory review thresholds; no magic numbers.

## Testing (Article 3)

- Canon TDD: test list → one failing test at a time → green → refactor; never
  delete/skip/weaken a failing test to reach green (LAW-3.1 v1.1)
- Floors: 80% business logic, 100% utilities, 70% controllers — CI-enforced,
  never lowered (LAW-3.2)
- AAA structure; "should <expectation> when <scenario>" names (LAW-3.3)
- Unit tests: externals mocked, <1s, order-independent (LAW-3.4)
- No unticketed `.skip`; every test must be able to fail (LAW-3.5)
- Mutation testing (StrykerJS): AI-generated tests must kill additional
  mutants; mutation-score baselines ratchet upward (LAW-3.6)

Full guide: [testing-guide.md](testing-guide.md).

## Architecture (Article 4)

- Domain-first organization: top-level modules mirror business domains, with
  Presentation → Application → Domain logic → Persistence inside each;
  cross-domain access via public interfaces; modular-monolith default with
  ADR-gated service extraction (LAW-4.1 v1.1)
- SOLID, applied via the one-line tests in LAW-4.2
- `import/no-cycle: error` (LAW-4.3)
- Sanctioned patterns: DI (external deps), Repository (persistence), Factory
  (complex construction), Strategy (variant behavior); others need an ADR (LAW-4.4)
- ADR in `docs/adr/` **before** structurally significant merges (LAW-4.5, LAW-1.4)
- Resilience on every network boundary: explicit timeouts, bounded
  backoff+jitter retries, idempotency keys, circuit breakers with defined
  degraded modes (LAW-4.6)

## Security (Article 5)

- Allowlist-validate every external input at the boundary (LAW-5.1)
- Parameterized queries only — zero concatenation (LAW-5.2)
- Secrets via env/secret manager; committed-once = rotate (LAW-5.3)
- OAuth2/OIDC/JWT/SAML via vetted libraries; never roll your own (LAW-5.4)
- Weekly + per-PR scans; criticals ≤24h; lockfiles pinned (LAW-5.5)
- TLS 1.2+ everywhere (internal too); sensitive data encrypted at rest (LAW-5.6)

## Review & Docs (Article 6)

- 2 approvals, 1 domain expert, no self-approval (LAW-6.1)
- Gates (lint, types, tests, coverage, format, security) green before merge — no
  override path (LAW-6.2)
- JSDoc on public APIs with @throws and @example (LAW-6.3)
- Comments = WHY (LAW-6.4); docs in the same PR (LAW-6.5)

## AI-Assisted Work (Article 7)

- You own every line you merge (LAW-7.1)
- Protected data only to approved tools (LAW-7.2)
- `[Claude-assisted]` tag + PR disclosure (LAW-7.3)
- Same standards, verify-never-assume review (LAW-7.4)
- Stop and ask on ambiguity — never guess (LAW-7.5)
- Duplication/churn metrics per release; regressions become ticketed
  refactoring work; never individual KPIs (LAW-7.6)

## Requirements & Ops (Articles 8–9)

- Acceptance criteria before code (LAW-8.1); business rules cited (LAW-8.2);
  compliance map maintained (LAW-8.3); scope changes need PO sign-off (LAW-8.4)
- IaC only (LAW-9.1); rollback before release (LAW-9.2); cost estimates + tags
  (LAW-9.3); licenses evaluated, copyleft → legal (LAW-9.4)
- SLOs with product+dev+ops sign-off (LAW-9.5); error budgets with
  release-freeze consequences and >20% postmortem trigger (LAW-9.6); quarterly
  failure-injection/game days — untested recovery is assumed broken (LAW-9.7)

## Agentic Development (Article 10)

- Substantial agent work starts from a reviewed plan naming the bearing laws (LAW-10.1)
- Define a runnable check first; present evidence, not assertions (LAW-10.2)
- Autonomous runs: filesystem AND network sandbox + explicit tool allowlists (LAW-10.3)
- CLAUDE.md/AGENTS.md are code: reviewed, concise, pruned; always-rules become
  hooks, not prose (LAW-10.4)
- Agent output is reviewed by a context that didn't produce it (LAW-10.5)
- Nontrivial work follows a declared workflow (WF-FEATURE/RESEARCH/BUG/SECBUG/
  REFACTOR/AMENDMENT); deviations recorded; hard stages never overridable
  (LAW-10.6; catalog: workflows/, orchestrated by workflow-orchestrator)

## Looking Things Up

- `./scripts/law-lookup.sh LAW-X.Y` — full law record
- [laws/REGISTRY.md](../laws/REGISTRY.md) — all 45 laws
- law-clerk skill — topic search, amendment history, "why does this law exist?"
