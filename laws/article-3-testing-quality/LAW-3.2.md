---
id: LAW-3.2
title: Coverage Floors
article: 3
article_name: Testing & Quality
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, software-engineer]
enforcement: automated
enforcement_mechanism: "jest.config.js coverageThreshold; enforced in CI quality.yml — build fails below floor"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-3.2: Coverage Floors

## Statement (quotable)

> Minimum line coverage is enforced by CI and may not be lowered to make
> a build pass: 80% for business logic (services, domain), 100% for
> shared utilities, 70% for controllers/route handlers. Coverage floors
> are a floor, not a target — meeting the number with hollow assertions
> violates LAW-3.5.

## Rationale (the WHY — always citable alongside the statement)

Low test coverage was a founding pain point: untested paths are where
production incidents live. The floors are differentiated by blast
radius — a shared utility's bug propagates to every caller (hence 100%),
business logic carries the domain's correctness (80%), while controllers
are thin translation layers whose complexity should live below them
(70%; if a controller needs more, logic is in the wrong layer, see
LAW-4.1). CI enforcement removes the floor from negotiation — coverage
debates end at the gate, not in the review thread (LAW-6.2).

## Compliance Examples

VIOLATION:
```js
// jest.config.js, edited in a feature PR
coverageThreshold: { global: { lines: 60 } }  // lowered to make CI pass
```

COMPLIANT:
```js
// jest.config.js — constitution config, unchanged
coverageThreshold: { global: { lines: 80, branches: 80, functions: 80 } }
// Feature PR adds the missing tests instead of moving the floor.
```

## Related Laws
- LAW-3.1 (Test-First Development)
- LAW-3.5 (No Skipped or Hollow Tests)
- LAW-6.2 (Quality Gates Are Inviolable)

## Citation Format
[LAW-3.2 v1.0] "CI enforces coverage floors — 80% business logic, 100% utilities, 70% controllers — and they may not be lowered to make a build pass."
