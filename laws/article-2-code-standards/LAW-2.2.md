---
id: LAW-2.2
title: Formatting via Prettier
article: 2
article_name: Code Standards
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [software-engineer, quality]
enforcement: automated
enforcement_mechanism: "Prettier with configs/.prettierrc.json; format check in CI quality.yml and pre-commit hook"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-2.2: Formatting via Prettier

## Statement (quotable)

> All code is formatted by Prettier using the constitution's shared
> configuration: 2-space indentation, 100-character line width, single
> quotes, semicolons, ES5 trailing commas. Formatting is never performed
> or adjusted manually, never debated in review, and never overridden
> per project. If the formatter's output is wrong, amend the shared
> configuration for everyone.

## Rationale (the WHY — always citable alongside the statement)

Every minute spent formatting — or arguing about formatting in review —
is waste, and review bottlenecks were a founding pain point. Mechanical
formatting produces minimal diffs (changes show logic, not whitespace),
eliminates an entire category of review comments, and guarantees that
AI-generated and human-written code are visually indistinguishable in
style. The specific settings matter less than their uniformity; they are
fixed here so they are never re-litigated (LAW-1.3).

## Compliance Examples

VIOLATION:
```text
PR review comment thread:
  "nit: align these params"  /  "I prefer double quotes here"
Hand-adjusted alignment that the next save destroys.
```

COMPLIANT:
```bash
npx prettier --write .       # pre-commit hook does this automatically
npx prettier --check .       # CI verifies (quality.yml)
```

## Related Laws
- LAW-1.3 (Consistency Enables Collaboration)
- LAW-2.1 (Naming Conventions)
- LAW-6.2 (Quality Gates Are Inviolable)

## Citation Format
[LAW-2.2 v1.0] "All code is formatted by Prettier with the shared config (2-space, 100-char, single quotes, semicolons, ES5 trailing commas); formatting is never manual."
