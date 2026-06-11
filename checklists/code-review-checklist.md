# Code Review Checklist

Every item annotated with its law. Findings cite laws per
[citation-format.md](../.claude/skills/constitution-enforcer/reference/citation-format.md);
severities per
[violation-severity.md](../.claude/skills/constitution-enforcer/reference/violation-severity.md).
Two approvals required, one domain expert, no self-approval (LAW-6.1).

## Before Reading Code

- [ ] Work item has acceptance criteria; I know what "correct" means here (LAW-8.1)
- [ ] Diff is within agreed scope, or PO sign-off is recorded (LAW-8.4)
- [ ] AI Assistance section completed; tagged commits present if applicable (LAW-7.3)

## Readability & Standards

- [ ] Every changed function understandable in 30 seconds (LAW-1.1)
- [ ] Naming per table: camelCase / PascalCase no-`I` / UPPER_SNAKE_CASE / is-has-can / kebab-case files (LAW-2.1)
- [ ] No manual formatting artifacts (LAW-2.2)
- [ ] No `any` — including `as any` and implicit (LAW-2.3)
- [ ] Exported functions declare return types (LAW-2.4)
- [ ] Imports grouped and ordered (LAW-2.5)
- [ ] Functions ≤30 lines, single responsibility, no magic numbers (LAW-2.6)
- [ ] No TODO without ticket+context (LAW-1.2)

## Tests

- [ ] Failing test preceded implementation — evidence in commits/PR (LAW-3.1)
- [ ] Coverage floors hold; no threshold edits in this diff (LAW-3.2)
- [ ] AAA structure; "should X when Y" names (LAW-3.3)
- [ ] Unit tests isolated (no network/db/clock), <1s, order-independent (LAW-3.4)
- [ ] Every test can fail; no unticketed `.skip`; assertions verify outcomes (LAW-3.5)

## Architecture

- [ ] Dependencies point downward; no layer skips (LAW-4.1)
- [ ] SOLID one-line tests pass on new/changed units (LAW-4.2)
- [ ] No new import cycles (LAW-4.3)
- [ ] DI/Repository/Factory/Strategy used where their situations apply (LAW-4.4)
- [ ] ADR present for significant structural decisions (LAW-4.5, LAW-1.4)

## Security (escalate to Security persona / security-checker for depth)

- [ ] All external input allowlist-validated at the boundary (LAW-5.1)
- [ ] No string-built queries — parameterized only (LAW-5.2)
- [ ] No secrets in code, config, or logs (LAW-5.3)
- [ ] No custom auth/crypto; established frameworks only (LAW-5.4)
- [ ] New deps evaluated (CVEs, maintenance, license); lockfile intact (LAW-5.5, LAW-9.4)
- [ ] TLS/at-rest expectations hold for data paths touched (LAW-5.6)

## Documentation

- [ ] JSDoc with @param/@returns/@throws/@example on public surfaces (LAW-6.3)
- [ ] Comments explain WHY; no WHAT-restatements (LAW-6.4)
- [ ] README/API docs/runbooks updated in this PR (LAW-6.5)
- [ ] Business rules cite their documented source (LAW-8.2)
- [ ] Compliance map updated if mapped paths changed (LAW-8.3)

## AI-Generated Code (when present)

- [ ] Verify, never assume: claimed APIs checked against real docs (LAW-7.4)
- [ ] Edge cases tested, not trusted (LAW-7.4)
- [ ] Generated tests inspected for hollowness (LAW-3.5)
- [ ] Author can explain every line (LAW-7.1)

## Ops (when infra/deploy touched)

- [ ] Infrastructure changes are IaC, not console (LAW-9.1)
- [ ] Rollback documented before release; expand-migrate-contract for migrations (LAW-9.2)
- [ ] Cost estimate present for material changes; resources tagged (LAW-9.3)
