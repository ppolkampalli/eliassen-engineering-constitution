---
name: code-review-assistant
description: Use when reviewing a pull request, diff, or code change in a constitution-governed project. Runs the article-organized review checklist, expresses every verdict as a law citation, and applies the LAW-7.4 verify-never-assume lens to AI-generated code.
---

# Code Review Assistant

Reviews changes against the constitution, article by article. Every verdict line
cites a specific law per
[citation-format.md](../constitution-enforcer/reference/citation-format.md);
severities per
[violation-severity.md](../constitution-enforcer/reference/violation-severity.md).

## Review Procedure

1. **Read the work item first** — acceptance criteria (LAW-8.1) define what
   "correct" means; scope (LAW-8.4) defines what belongs in the diff.
2. **Check AI disclosure** — `[Claude-assisted]` commits / PR AI section (LAW-7.3)?
   If AI-assisted, engage the LAW-7.4 lens below.
3. **Walk the checklist by article** (below).
4. **Emit findings with citations and severities**; conclude with a verdict.

## Checklist (by article)

**Article 1 — Foundations**
- [ ] Every function understandable in 30 seconds (LAW-1.1)
- [ ] No TODO without ticket+context (LAW-1.2)
- [ ] No project-local convention deviations (LAW-1.3)

**Article 2 — Code Standards**
- [ ] Naming per table; no `I` prefix; is/has/can booleans; kebab-case files (LAW-2.1)
- [ ] No manual formatting; Prettier output (LAW-2.2)
- [ ] No `any` — including hidden ones: `as any`, implicit (LAW-2.3)
- [ ] Exported functions: explicit return types (LAW-2.4)
- [ ] Import groups ordered (LAW-2.5)
- [ ] Functions ≤30 lines, one job; no magic numbers (LAW-2.6)

**Article 3 — Testing**
- [ ] Evidence of test-first (test commits/PR description) (LAW-3.1)
- [ ] Floors hold; no threshold edits in the diff (LAW-3.2)
- [ ] AAA; should/when names (LAW-3.3)
- [ ] Isolated, fast, order-independent (LAW-3.4)
- [ ] No unticketed skips; every test can fail (LAW-3.5)

**Article 4 — Architecture**
- [ ] Dependencies point downward; no layer skips (LAW-4.1)
- [ ] SOLID one-line tests pass (LAW-4.2)
- [ ] No cycles (LAW-4.3)
- [ ] Sanctioned patterns where required (LAW-4.4)
- [ ] ADR present for structural decisions (LAW-4.5)

**Article 5 — Security** (delegate deep passes to security-checker / Security persona)
- [ ] External input allowlist-validated (LAW-5.1)
- [ ] Queries parameterized (LAW-5.2)
- [ ] No secrets in code/config/logs (LAW-5.3)
- [ ] No custom auth/crypto (LAW-5.4)
- [ ] New deps evaluated; lockfile intact (LAW-5.5)
- [ ] TLS/at-rest expectations hold (LAW-5.6)

**Article 6 — Review & Docs**
- [ ] JSDoc on public surfaces (LAW-6.3)
- [ ] Comments are WHY, not WHAT (LAW-6.4)
- [ ] Affected docs updated in this PR (LAW-6.5)

**Articles 7–9 — Governance & Ops (when applicable)**
- [ ] AI disclosure complete (LAW-7.3); identical standards applied (LAW-7.4)
- [ ] In scope, or PO sign-off recorded (LAW-8.4); business rules cited (LAW-8.2)
- [ ] IaC for infra; rollback documented; cost estimate + tags; licenses (LAW-9.1–9.4)

## AI-Generated Code — the LAW-7.4 Lens

**Verify, never assume.** For tagged (or suspected) AI-generated portions:
- Confirm claimed APIs exist in the real documentation — invented methods are the
  signature failure
- Test the boundaries: off-by-one, empty, null, max — plausible logic hides
  inverted edge conditions
- Inspect generated tests for hollowness (LAW-3.5): do they assert outcomes or
  merely that mocks were called?
- Reviewer attention scales UP for generated code, never down

## Verdict Format

```text
REVIEW VERDICT: [APPROVE | APPROVE WITH MINOR FIXES | REQUEST CHANGES | BLOCKED]
FINDING [SEVERITY]: <issue> at <location>
CITATION: [LAW-X.Y vN.N] "<quoted statement>"
RATIONALE: <law's rationale, applied>
REQUIRED FIX: <concrete remedy>
(one block per finding; minor items inline: `(per [LAW-2.5 v1.0])`)
```

A skill review supplements — never replaces — the two human approvals (LAW-6.1).
