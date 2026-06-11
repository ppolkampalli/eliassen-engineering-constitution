---
id: LAW-7.4
title: Identical Standards for AI Code
article: 7
article_name: AI Governance
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, security]
enforcement: review
enforcement_mechanism: "Code review; code-review-assistant skill applies the verify-never-assume lens to tagged changes"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-7.4: Identical Standards for AI Code

## Statement (quotable)

> AI-generated code is held to every standard in this constitution —
> naming, types, tests-first, coverage, security, documentation, review —
> with no relaxation and no shortcut. Review of AI-generated code
> follows one rule: **verify, never assume.** Plausibility is not
> correctness; fluent style is not sound logic. Claimed APIs are checked
> against real documentation, edge cases are tested rather than trusted,
> and generated tests are inspected for hollowness (LAW-3.5) with the
> same rigor as generated code.

## Rationale (the WHY — always citable alongside the statement)

AI output is optimized to look right — that is precisely what makes it
dangerous to review casually. Its characteristic failures (invented
methods, subtly wrong boundary conditions, tests that assert the
implementation's own behavior) hide behind impeccable formatting that
human sloppiness would have flagged. A relaxed standard for AI code
would also create a laundering channel: anything could merge under-
reviewed by routing it through generation. Holding one bar for all code,
regardless of origin, keeps LAW-7.1 ownership meaningful and keeps the
constitution's guarantees independent of how code is produced.

## Compliance Examples

VIOLATION:
```text
"It's generated boilerplate, just approve it" — 400 generated lines
merged unread; generated test suite asserts mocks were called but
never checks an outcome (hollow per LAW-3.5).
```

COMPLIANT:
```text
Reviewer treats the tagged PR as untrusted input: confirms the SDK
method exists in the vendor docs (it didn't — renamed in v3), runs
the edge-case tests, rejects two hollow tests with citations
[LAW-3.5 v1.0], approves after fixes.
```

## Related Laws
- LAW-7.1 (Human Accountability)
- LAW-3.5 (No Skipped or Hollow Tests)
- LAW-6.1 (Two-Approval Review)

## Citation Format
[LAW-7.4 v1.0] "AI-generated code meets every constitutional standard with no relaxation; review verifies, never assumes — plausibility is not correctness."
