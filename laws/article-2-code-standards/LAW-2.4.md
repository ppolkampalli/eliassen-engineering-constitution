---
id: LAW-2.4
title: Explicit Return Types on Exported Functions
article: 2
article_name: Code Standards
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [software-engineer, quality]
enforcement: automated
enforcement_mechanism: "ESLint rule @typescript-eslint/explicit-function-return-type: warn (exported surfaces enforced in review)"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-2.4: Explicit Return Types on Exported Functions

## Statement (quotable)

> Every exported function, method, and public class member declares its
> return type explicitly. Inference is acceptable for module-private
> helpers; it is not acceptable on any surface another module consumes.
> An exported function's signature is a contract, and contracts are
> written down, not inferred.

## Rationale (the WHY — always citable alongside the statement)

Inferred return types on public surfaces make the contract whatever the
implementation happens to return: an internal refactor silently changes
the API and the breakage surfaces in distant consumers, attributed to the
wrong commit. Explicit annotations turn such drift into a compile error
at the source, document intent at the signature where readers look first
(LAW-1.1, LAW-6.3), and dramatically improve compiler error locality and
editor feedback.

## Compliance Examples

VIOLATION:
```typescript
export function getDiscount(order: Order) {
  return order.total > 100 ? { pct: 10 } : null; // inferred, drifts silently
}
```

COMPLIANT:
```typescript
export function getDiscount(order: Order): Discount | null {
  return order.total > 100 ? { pct: 10 } : null;
}
```

## Related Laws
- LAW-2.3 (Prohibition of the `any` Type)
- LAW-6.3 (Public API Documentation)

## Citation Format
[LAW-2.4 v1.0] "Every exported function declares its return type explicitly; a public signature is a written contract, not an inference."
