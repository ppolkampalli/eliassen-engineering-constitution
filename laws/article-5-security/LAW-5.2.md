---
id: LAW-5.2
title: Parameterized Queries Only
article: 5
article_name: Security
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [security]
enforcement: review
enforcement_mechanism: "Security persona review lens item 2; CodeQL injection queries in CI security.yml"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-5.2: Parameterized Queries Only

## Statement (quotable)

> Database queries are constructed exclusively with parameterized
> statements or a query builder/ORM that parameterizes by design. String
> concatenation or template interpolation of any runtime value into query
> text is prohibited — including values believed safe, internal, or
> already validated. The same rule applies to NoSQL operators, LDAP
> filters, and shell commands: data is passed as data, never spliced
> into executable text.

## Rationale (the WHY — always citable alongside the statement)

SQL injection has been the most exploited vulnerability class for over
two decades, and every instance begins with one engineer concatenating
"just this one" value. The prohibition is absolute precisely so it is
auditable: "no concatenation anywhere" can be verified mechanically;
"concatenation only where the value is safe" cannot — value provenance
changes with every refactor, and yesterday's constant is tomorrow's user
input. Parameterization makes the query's shape immutable regardless of
the data's content, eliminating the class rather than patching instances.

## Compliance Examples

VIOLATION:
```typescript
const rows = await db.query(
  `SELECT * FROM orders WHERE customer_id = '${customerId}'`  // injectable
);
```

COMPLIANT:
```typescript
const rows = await db.query(
  'SELECT * FROM orders WHERE customer_id = $1',
  [customerId]                                   // data passed as data
);
```

## Related Laws
- LAW-5.1 (Universal Input Validation)
- LAW-1.5 (Security is Everybody's Responsibility)

## Citation Format
[LAW-5.2 v1.0] "Queries are built exclusively with parameterized statements; concatenating or interpolating any runtime value into query text is prohibited."
