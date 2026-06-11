---
id: LAW-2.1
title: Naming Conventions
article: 2
article_name: Code Standards
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [software-engineer, quality]
enforcement: automated
enforcement_mechanism: "ESLint rule @typescript-eslint/naming-convention; kebab-case files checked in review"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-2.1: Naming Conventions

## Statement (quotable)

> All identifiers follow these conventions, without exception:
>
> | Element | Convention | Example |
> |---|---|---|
> | Variables, functions, methods, parameters | `camelCase` | `orderTotal`, `calculateTax()` |
> | Classes, interfaces, type aliases, enums | `PascalCase` — interfaces take **no** `I` prefix | `PaymentGateway`, `OrderStatus` |
> | Module-level constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
> | Booleans (variables and functions) | `is` / `has` / `can` prefix | `isActive`, `hasPermission`, `canRetry` |
> | Files and directories | `kebab-case` | `payment-service.ts`, `user-profile/` |
>
> Names state what a thing is or does in domain terms; abbreviations are
> avoided unless they are industry-standard (`id`, `url`, `http`).

## Rationale (the WHY — always citable alongside the statement)

Names are the primary interface between code and reader. A single,
mechanical convention removes naming debates from review, makes code
searchable (`grep isActive` finds booleans, not noise), and lets engineers
move between projects without relearning style (LAW-1.3). The `I` prefix
is banned because it leaks implementation choice (interface vs class) into
every consumer; boolean prefixes are mandated because `active` reads as a
noun and `isActive` reads as a predicate. Kebab-case files avoid
case-sensitivity breakage between macOS/Windows and Linux CI.

## Compliance Examples

VIOLATION:
```typescript
interface IUserRepo {}            // I-prefix
const Max_retries = 3;            // mixed case constant
function Active(u: User) {}       // PascalCase function, unclear boolean
// file: UserProfile.TS
```

COMPLIANT:
```typescript
interface UserRepository {}
const MAX_RETRIES = 3;
function isActive(user: User): boolean { return user.status === 'active'; }
// file: user-profile.ts
```

## Related Laws
- LAW-1.1 (Code is Written for Humans First)
- LAW-2.2 (Formatting via Prettier)
- LAW-2.5 (Import Ordering)

## Citation Format
[LAW-2.1 v1.0] "Identifiers follow the constitution's naming table: camelCase variables/functions, PascalCase types without I-prefix, UPPER_SNAKE_CASE constants, is/has/can booleans, kebab-case files."
