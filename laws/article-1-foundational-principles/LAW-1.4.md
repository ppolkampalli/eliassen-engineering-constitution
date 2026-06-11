---
id: LAW-1.4
title: Architecture Decisions Are Intentional
article: 1
article_name: Foundational Principles
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [architect]
enforcement: review
enforcement_mechanism: "Architect persona review; ADR presence checked in PR review per LAW-4.5"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-1.4: Architecture Decisions Are Intentional

## Statement (quotable)

> System structure is the product of deliberate decisions, never accident
> or accretion. Every significant architectural decision — a new service,
> a new layer, a new cross-cutting dependency, a departure from sanctioned
> patterns — must be made consciously, weighed against alternatives, and
> recorded in an Architecture Decision Record before the implementing
> change merges. "It grew that way" is not an architecture.

## Rationale (the WHY — always citable alongside the statement)

Undocumented architecture is rediscovered at the worst possible time — by
the next engineer, mid-incident, or during an audit. Accidental structure
hardens into constraint: each unexamined decision narrows the options of
every decision after it. Recording decisions with their alternatives and
trade-offs (LAW-4.5) keeps the system explainable, makes reversals
possible because the original reasoning is known, and gives AI agents the
context they need to extend the system without violating its intent.

## Compliance Examples

VIOLATION:
```text
PR #214 "add redis caching layer" — introduces a new infrastructure
dependency and a new caching tier. No ADR. Reviewer approves because
"the code looks fine."
```

COMPLIANT:
```text
PR #214 "add redis caching layer" — includes docs/adr/0007-introduce-
redis-read-cache.md recording: context (p95 latency SLO breach),
options considered (in-process LRU, Redis, CDN), decision, and
consequences. Architect persona review cites [LAW-4.5 v1.0].
```

## Related Laws
- LAW-4.5 (ADR Requirement)
- LAW-4.1 (Layered Architecture)
- LAW-4.4 (Sanctioned Patterns)

## Citation Format
[LAW-1.4 v1.0] "System structure is the product of deliberate, recorded decisions; significant architectural choices require an ADR before merge."
