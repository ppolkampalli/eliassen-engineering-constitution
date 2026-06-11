---
id: LAW-1.1
title: Code is Written for Humans First
article: 1
article_name: Foundational Principles
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [software-engineer, quality]
enforcement: review
enforcement_mechanism: "Code review; 30-second readability check per checklists/code-review-checklist.md"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-1.1: Code is Written for Humans First

## Statement (quotable)

> Code is written for human readers first and machines second. A competent
> engineer unfamiliar with the code must be able to understand what any
> function does within 30 seconds of reading it. Comments explain WHY —
> business rules, trade-offs, constraints — never WHAT the code already
> says. Code that requires tribal knowledge to understand is defective,
> regardless of whether it works.

## Rationale (the WHY — always citable alongside the statement)

In a distributed team of 20–50 engineers, code is read tens of times for
every time it is written. Clever or opaque code shifts its cost onto every
future reader, slows reviews (a founding pain point of this constitution),
and multiplies onboarding time. AI-assisted development raises the stakes:
generated code that no human fully understands cannot be owned per LAW-7.1.
The 30-second test makes readability concrete and reviewable instead of a
matter of taste.

## Compliance Examples

VIOLATION:
```typescript
// increment i
const r = u.filter((x) => x.s === 1 && D.now() - x.t > 864e5).map((x) => x.i);
```

COMPLIANT:
```typescript
const MS_PER_DAY = 86_400_000;
// Accounts inactive >24h are eligible for the re-engagement campaign
// (marketing rule MKT-112).
const reEngagementCandidateIds = users
  .filter((user) => user.status === UserStatus.Active)
  .filter((user) => Date.now() - user.lastSeenAt > MS_PER_DAY)
  .map((user) => user.id);
```

## Related Laws
- LAW-2.1 (Naming Conventions)
- LAW-2.6 (Function Size and Responsibility)
- LAW-6.4 (Comments Explain WHY)

## Citation Format
[LAW-1.1 v1.0] "Code is written for human readers first; any function must be understandable within 30 seconds, and comments explain WHY, never WHAT."
