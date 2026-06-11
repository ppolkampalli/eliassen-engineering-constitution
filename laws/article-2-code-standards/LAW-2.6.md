---
id: LAW-2.6
title: Function Size and Responsibility
article: 2
article_name: Code Standards
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [software-engineer, quality]
enforcement: review
enforcement_mechanism: "Code review per code-review-checklist.md; constitution-enforcer self-check"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-2.6: Function Size and Responsibility

## Statement (quotable)

> A function does one thing. Functions are at most 30 lines, with a
> target of 10–15; a function approaching the limit is a signal to
> extract, not to compress. Magic numbers and magic strings are
> prohibited — every literal with meaning is a named constant whose name
> states that meaning.

## Rationale (the WHY — always citable alongside the statement)

Function size is the most reliable cheap proxy for responsibility creep:
a 60-line function almost always interleaves concerns that must be
understood — and tested (LAW-3.4) — together. Small, single-purpose
functions pass the 30-second readability test (LAW-1.1), produce focused
unit tests, and give stack traces that read like explanations. Magic
numbers fail silently when requirements change: `86400000` appearing
twice is a bug waiting for the day only one of them is updated.

## Compliance Examples

VIOLATION:
```typescript
export function checkout(cart: Cart): Receipt {
  // 55 lines: validates, prices, applies discounts, charges card,
  // writes inventory, sends email — all inline...
  if (cart.items.length > 50) throw new Error('too many'); // why 50?
}
```

COMPLIANT:
```typescript
const MAX_CART_ITEMS = 50; // checkout SLA breaks beyond this (PERF-219)

export function checkout(cart: Cart): Receipt {
  validateCart(cart, MAX_CART_ITEMS);
  const pricedOrder = priceOrder(cart);
  const payment = chargePayment(pricedOrder);
  return issueReceipt(pricedOrder, payment);
}
```

## Related Laws
- LAW-1.1 (Code is Written for Humans First)
- LAW-3.4 (Test Isolation)
- LAW-4.2 (SOLID Compliance)

## Citation Format
[LAW-2.6 v1.0] "Functions do one thing, are at most 30 lines (target 10–15), and contain no magic numbers — meaningful literals are named constants."
