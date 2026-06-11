---
id: LAW-6.2
title: Quality Gates Are Inviolable
article: 6
article_name: Review & Documentation
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality]
enforcement: automated
enforcement_mechanism: "CI quality.yml + security.yml required status checks; no admin bypass; devops persona owns pipeline integrity"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-6.2: Quality Gates Are Inviolable

## Statement (quotable)

> No change merges unless every quality gate is green: lint, type-check,
> full test suite, coverage floors, format check, and security scan.
> There is no override path — not for administrators, not for hotfixes,
> not for deadlines. If a gate itself is defective, the gate is fixed
> through a reviewed change; it is never bypassed, disabled, or marked
> optional to let a build through.

## Rationale (the WHY — always citable alongside the statement)

A gate with an override path is a suggestion, and every suggestion loses
to a deadline eventually. The first bypass becomes precedent; within a
quarter the gate is theater. Inviolability is also what makes gates
*kind*: no engineer can be pressured into shipping around a red build,
because no path exists — the argument ends at the machine (LAW-1.5 makes
the same move for security findings). Hotfixes get no exemption because
production emergencies are precisely when discipline pays: a hotfix that
breaks type-checking is a second incident in flight. Every gate maps to
laws this constitution already requires; the gate is merely where they
become physics.

## Compliance Examples

VIOLATION:
```text
"Tests are failing on the release branch — admin-merge it, we'll fix
after the demo."  /  CI edited in the same PR to add `continue-on-error:
true` to the test job.
```

COMPLIANT:
```text
Red build on the release branch → fix the failing test first (or revert
the breaking commit), gates go green, merge proceeds. Demo waits or
demos the previous build.
```

## Related Laws
- LAW-3.2 (Coverage Floors)
- LAW-1.5 (Security is Everybody's Responsibility)
- LAW-9.2 (Deployment Safety)

## Citation Format
[LAW-6.2 v1.0] "No change merges unless lint, type-check, tests, coverage, format, and security gates are all green; no override path exists for anyone."
