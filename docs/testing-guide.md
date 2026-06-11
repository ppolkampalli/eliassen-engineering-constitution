# Testing Guide

How Article 3 is practiced. The laws are the authority; this guide is the technique.

## The TDD Cycle (LAW-3.1)

1. **RED** — write the test that states the expected behavior; run it; watch it
   fail. The failure message is part of the work: it proves the test can detect
   the absence of the behavior.
2. **GREEN** — write the minimum code to pass; run it; watch it pass.
3. **REFACTOR** — improve structure under green (extract per LAW-2.6, rename per
   LAW-2.1); tests stay green throughout.

Commit rhythm makes the evidence reviewable (LAW-3.1's "failing test shown"):

```text
test(pricing): proration charges partial month at daily rate (red)
feat(pricing): implement proration (green)
refactor(pricing): extract DailyRateCalculator
```

Why test-first instead of test-after: a test written after the code asserts what
the code *does* — it inherits the implementation's bugs as expectations. Written
first, it asserts what the code *should do* (see LAW-3.1's rationale).

## Coverage Floors (LAW-3.2)

| Code class | Floor | Why this number |
|---|---|---|
| Business logic (services, domain) | 80% | Carries the domain's correctness |
| Shared utilities | 100% | A utility bug propagates to every caller |
| Controllers / route handlers | 70% | Thin translation layers — complexity belongs below them (LAW-4.1) |

Enforced by `jest.config.js` `coverageThreshold` + CI (`quality.yml`). A floor is a
floor: meeting it with hollow assertions violates LAW-3.5. **Never** edit a
threshold to make a build pass — that diff is a LAW-6.2 violation.

## Test Structure (LAW-3.3)

```typescript
it('should charge the saved payment method when the cart is checked out', () => {
  // Arrange
  const cart = cartWith([item]);
  // Act — exactly one action
  cart.checkout();
  // Assert — on the outcome
  expect(paymentGateway.charge).toHaveBeenCalledWith(item.price);
});
```

- One act per test. Two acts = two tests.
- The name alone must tell a CI reader what broke: `should <expectation> when <scenario>`.
- `describe` blocks group by unit or behavior area, not by test type.

## Isolation (LAW-3.4)

Unit tests mock **all** external dependencies — network, DB, filesystem, clock,
environment. Techniques:

- **Inject, then fake** — LAW-4.4's DI is what makes this possible; constructor-
  injected `UserRepository` is replaced by an in-memory fake.
- **Fake the clock** — `jest.useFakeTimers()`; never `sleep` in tests.
- **No shared state** — `clearMocks`/`restoreMocks` are on in the shared config;
  builders/fixtures create fresh data per test.
- **Budget: <1s per unit test.** A slow unit test is an integration test in the
  wrong folder — move it, don't tolerate it.

Integration tests (real DB/services) live separately (`*.int.spec.ts`), run in
their own CI lane, and don't count against the unit-test speed budget.

## Test Honesty (LAW-3.5)

- Every test must be able to fail. Mental mutant test: flip the condition in your
  head — does the test notice?
- Asserting only `toHaveBeenCalled()` with no outcome is hollow; assert the result.
- `.skip` requires a ticket reference and explanation in the annotation.
- AI-generated tests get the same inspection as AI-generated code (LAW-7.4): they
  characteristically assert the implementation's own behavior back at it.

## What to Test (informed by LAW-8.1)

Acceptance criteria are the test list: each criterion maps to at least one test
whose name references the behavior (and the business rule ID where applicable,
LAW-8.2). Edge cases enumerated in the AC are in scope; edge cases discovered
during implementation get added to the AC, not silently tested or skipped.
