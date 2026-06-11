---
id: LAW-X.Y
title: <Short Imperative Title>
article: X
article_name: <Article Name>
status: PROPOSED          # ACTIVE | AMENDED | REPEALED | PROPOSED
version: 1.0
effective_date: YYYY-MM-DD
owner_personas: [<persona>, <persona>]
enforcement: manual       # automated | review | persona | manual
enforcement_mechanism: "<tool rule, CI job, review step, or persona that enforces this law>"
amendment_history:
  - amendment: AMD-YYYY-NNN
    date: YYYY-MM-DD
    change: "Initial ratification"
---

# LAW-X.Y: <Short Imperative Title>

## Statement (quotable)

> <The complete, binding text of the law. Written so it can be quoted
> verbatim in a citation. State the rule, its scope, and any exception
> path (who may grant an exception and how it is recorded).>

## Rationale (the WHY — always citable alongside the statement)

<Why this law exists: the failure mode it prevents, the incident or pain
point that motivated it, and the cost of violating it. Agents and reviewers
cite this alongside the statement so decisions carry their reasoning.>

## Compliance Examples

VIOLATION:
```typescript
// <minimal example that violates the law>
```

COMPLIANT:
```typescript
// <minimal example that satisfies the law>
```

## Related Laws
- LAW-A.B (<title>)
- LAW-C.D (<title>)

## Citation Format
[LAW-X.Y v1.0] "<One-sentence quotable form of the statement.>"
