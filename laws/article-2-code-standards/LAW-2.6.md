---
id: LAW-2.6
title: Function Size and Responsibility
article: 2
article_name: Code Standards
status: ACTIVE
version: 1.1
effective_date: 2026-06-11
owner_personas: [software-engineer, quality]
enforcement: review
enforcement_mechanism: "ESLint complexity/max-lines-per-function advisories; code review per code-review-checklist.md; constitution-enforcer self-check"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
  - amendment: AMD-2026-006
    date: 2026-06-11
    change: "Replaced the 30-line cap with CC≤5 / ~40-LOC advisory thresholds; depth of abstraction stated as the design goal"
---

# LAW-2.6: Function Size and Responsibility

## Statement (quotable)

> A function does one thing, stated by its name. The design goal is depth of
> abstraction — a simple interface hiding meaningful work — not brevity for its
> own sake. Advisory thresholds, beyond which review scrutiny is required:
> cyclomatic complexity ≤ 5 and ~40 lines; exceeding them demands a
> justification in review, not automatic rejection — and fragmenting one
> coherent responsibility into entangled fragments to satisfy a number is
> itself a violation. Magic numbers and magic strings are prohibited — every
> literal with meaning is a named constant whose name states that meaning.

## Rationale (the WHY — always citable alongside the statement)

Complexity, not length, is what defeats readers: a linear 35-line function
can pass the 30-second test (LAW-1.1) while a "compliant" web of six
8-line fragments fails it — over-decomposition produces shallow interfaces
and entanglement, where understanding one method requires reading several
(Ousterhout, Martin–Ousterhout debate 2024–25). The thresholds are
empirically grounded: the top-starred Apache/Google/Microsoft codebases
converge on cyclomatic complexity ≤5 and ≤40 LOC (arXiv 2507.19721) —
observed in healthy code, not decreed. They are advisory rather than hard
caps because rigid one-size-fits-all enforcement is the dominant
practitioner complaint about clean-code regimes. Magic numbers fail
silently when requirements change: `86400000` appearing twice is a bug
waiting for the day only one of them is updated. Amended per AMD-2026-006;
evidence in docs/research/2026-06-11-agentic-constitution-research.md.

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
[LAW-2.6 v1.1] "Functions do one thing with depth of abstraction as the goal; complexity ≤5 and ~40 lines are advisory review thresholds, fragmenting a coherent responsibility to satisfy a number is itself a violation, and meaningful literals are named constants."
