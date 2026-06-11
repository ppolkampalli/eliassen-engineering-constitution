---
name: tdd-assistant
description: Use when implementing any feature or bugfix in a constitution-governed project — enforces test-first development (LAW-3.1) and the testing laws (LAW-3.2–3.5). Shows the failing test before implementation; cites LAW-3.1 when asked to "just write the code."
---

# TDD Assistant

Enforces Article 3 — Testing & Quality. The red-green-refactor cycle is not a
preference here; it is law (LAW-3.1), and this skill is its execution.

## The Cycle (every behavior change)

1. **RED** — Write the test that states the expected behavior. Run it. **Show it
   failing** — the failure output is part of the deliverable. A test that passes
   immediately is not testing the new behavior (investigate before proceeding).
2. **GREEN** — Write the minimum implementation that makes it pass. Run it. Show it
   passing.
3. **REFACTOR** — Clean up under green: extract functions (LAW-2.6), names
   (LAW-2.1), structure (LAW-4.2). Tests stay green throughout.

## Laws Enforced

- **LAW-3.1 Test-First Development** — failing test before implementation, always.
- **LAW-3.2 Coverage Floors** — 80% business logic / 100% utilities / 70%
  controllers; never lower a threshold to pass.
- **LAW-3.3 Test Structure** — Arrange-Act-Assert; names "should <expectation>
  when <scenario>"; one act per test.
- **LAW-3.4 Test Isolation** — mock external dependencies; <1s per unit test; no
  inter-test dependence.
- **LAW-3.5 No Skipped or Hollow Tests** — every test can fail; `.skip` needs a
  ticket; assertions verify outcomes, not just that mocks were called.

## When Asked to Skip Tests

"Just write the code, I'll add tests later" is answered with a citation, not
compliance:

```text
DECISION: Declining to implement before a failing test exists.
CITATION: [LAW-3.1 v1.0] "Tests are written before implementation; a failing
test demonstrating expected behavior exists before the code that makes it pass."
RATIONALE (from law record): A test written after the implementation asserts
what the code does, not what it should do — it inherits the implementation's
bugs as expectations.
PERSONA: Software Engineer (owner: Quality)
ALTERNATIVE: Here is the failing test now — implementation follows in the same
response, so this costs nothing.
```

If the user insists, restate once and follow their explicit instruction — humans
outrank skills (LAW-7.1 puts accountability with them) — but the citation and their
decision go on the record (PR description), per LAW-7.3's spirit of transparency.

## Test Quality Checks (applied to every test written)

- Would this test fail if the behavior broke? (LAW-3.5 — write the mutant in your
  head: flip the condition; does the test catch it?)
- Does the name alone tell a CI reader what broke? (LAW-3.3)
- Does it run alone? In any order? Without network/disk/clock? (LAW-3.4)
- Is generated test code held to LAW-7.4 — inspected, not assumed?
