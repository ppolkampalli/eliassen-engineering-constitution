---
id: LAW-3.3
title: Test Structure
article: 3
article_name: Testing & Quality
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, software-engineer]
enforcement: review
enforcement_mechanism: "Code review per code-review-checklist.md; tdd-assistant skill"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-3.3: Test Structure

## Statement (quotable)

> Every test follows Arrange-Act-Assert: set up state, perform exactly
> one action, assert on the outcome. Test names state the expectation
> and the scenario in the form "should <expectation> when <scenario>".
> A failing test's name alone must tell the reader what broke without
> opening the test file.

## Rationale (the WHY — always citable alongside the statement)

Tests are the executable specification of the system — they are read
most often at the worst time: when they fail, in CI, by someone who
didn't write them. AAA structure makes every test skimmable in seconds
(LAW-1.1 applied to tests); the should/when naming convention turns the
CI failure list into a readable description of broken behavior. Tests
that interleave multiple acts and asserts can't tell the reader *which*
behavior broke, halving their diagnostic value.

## Compliance Examples

VIOLATION:
```typescript
it('works', () => {
  const c = new Cart();
  c.add(item);
  expect(c.size).toBe(1);
  c.checkout();
  expect(api.charge).toHaveBeenCalled();  // second act+assert
});
```

COMPLIANT:
```typescript
it('should charge the saved payment method when the cart is checked out', () => {
  // Arrange
  const cart = cartWith([item]);
  // Act
  cart.checkout();
  // Assert
  expect(paymentGateway.charge).toHaveBeenCalledWith(item.price);
});
```

## Related Laws
- LAW-3.4 (Test Isolation)
- LAW-1.1 (Code is Written for Humans First)

## Citation Format
[LAW-3.3 v1.0] "Tests follow Arrange-Act-Assert with one action per test, named 'should <expectation> when <scenario>'."
