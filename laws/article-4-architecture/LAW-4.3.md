---
id: LAW-4.3
title: No Circular Dependencies
article: 4
article_name: Architecture
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [architect]
enforcement: automated
enforcement_mechanism: "ESLint rule import/no-cycle: error"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-4.3: No Circular Dependencies

## Statement (quotable)

> Circular dependencies between modules are prohibited at any distance —
> direct (A↔B) or transitive (A→B→C→A). The ESLint rule
> `import/no-cycle` enforces this as a build error. When two modules
> need each other, the shared concept they both depend on must be
> extracted into a third module beneath them.

## Rationale (the WHY — always citable alongside the statement)

A cycle means neither module can be understood, tested, loaded, or
replaced without the other — they are one module wearing two names, and
every module in the cycle inherits the union of all their reasons to
change. Cycles also produce concrete runtime failures in JavaScript:
partially-initialized module objects during import resolution cause
`undefined is not a function` errors that appear only under specific
import orders. The cycle is always evidence of a missing abstraction;
extracting it improves the design every time.

## Compliance Examples

VIOLATION:
```typescript
// user-service.ts
import { auditOrder } from './order-service';
// order-service.ts
import { getUser } from './user-service';   // A→B→A
```

COMPLIANT:
```typescript
// user-service.ts
import { User } from './domain/user';
// order-service.ts
import { User } from './domain/user';        // shared concept extracted below
```

## Related Laws
- LAW-4.1 (Layered Architecture)
- LAW-2.5 (Import Ordering)
- LAW-4.2 (SOLID Compliance)

## Citation Format
[LAW-4.3 v1.0] "Circular dependencies are prohibited at any distance; import/no-cycle is a build error, and shared concepts are extracted into a module beneath both."
