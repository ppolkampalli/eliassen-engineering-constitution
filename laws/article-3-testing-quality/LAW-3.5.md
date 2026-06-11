---
id: LAW-3.5
title: No Skipped or Hollow Tests
article: 3
article_name: Testing & Quality
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, software-engineer]
enforcement: review
enforcement_mechanism: "Code review; .skip without ticket flagged; assertion quality checked per code-review-checklist.md"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-3.5: No Skipped or Hollow Tests

## Statement (quotable)

> A skipped test (`.skip`, `xit`, commented-out) is permitted only with a
> tracked ticket reference and an explanation in the skip annotation.
> Hollow tests are prohibited: every test must assert on behavior — a
> test that cannot fail when the behavior breaks (no assertions,
> tautological assertions, asserting only that mocks were called with no
> outcome verified) is a defect masquerading as coverage.

## Rationale (the WHY — always citable alongside the statement)

A skipped test is a known blind spot; without a ticket it is a permanent
one that silently exempts a behavior from the safety net while still
appearing in the suite. Hollow tests are more dangerous than no tests:
they inflate coverage numbers (gaming LAW-3.2), give reviewers false
confidence, and turn green builds into noise. The test suite's entire
value is that green means safe — every hollow or silently-skipped test
debases that currency.

## Compliance Examples

VIOLATION:
```typescript
it.skip('should reject expired tokens', () => { /* flaky, skip for now */ });

it('should process the order', () => {
  service.process(order);
  expect(true).toBe(true);          // cannot fail
});
```

COMPLIANT:
```typescript
// JIRA-1733: re-enable after token-clock fake lands; expiry behavior
// currently covered by integration test auth.int.spec.ts
it.skip('should reject expired tokens', () => { ... });

it('should mark the order processed when payment succeeds', () => {
  service.process(order);
  expect(order.status).toBe(OrderStatus.Processed);
});
```

## Related Laws
- LAW-3.2 (Coverage Floors)
- LAW-1.2 (Quality is Built-In, Never Added Later)

## Citation Format
[LAW-3.5 v1.0] "No .skip without a tracked ticket; every test must assert on behavior and be able to fail when that behavior breaks."
