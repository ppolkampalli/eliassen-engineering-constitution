---
id: LAW-3.1
title: Test-First Development
article: 3
article_name: Testing & Quality
status: ACTIVE
version: 1.1
effective_date: 2026-06-11
owner_personas: [quality, software-engineer]
enforcement: persona
enforcement_mechanism: "tdd-assistant skill; quality persona review; failing test demonstrated in PR description"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
  - amendment: AMD-2026-003
    date: 2026-06-11
    change: "Aligned with Canon TDD (test list, one test at a time); added the agent guardrail clause"
---

# LAW-3.1: Test-First Development

## Statement (quotable)

> Tests are written before implementation, following Canon TDD: (1) write a
> test list enumerating the expected behaviors and edge cases; (2) convert
> exactly one item into a runnable test and show it fail; (3) make it and all
> previous tests pass, adding newly discovered cases to the list — never
> converting the whole list to tests at once; (4) optionally refactor;
> (5) repeat until the list is empty. Code presented without its preceding
> failing test is presumed untested regardless of coverage numbers. Failing
> tests are guardrails: no agent or engineer may delete, skip, or weaken a
> failing test or check to achieve green — a red test is fixed or its
> requirement is formally changed, never silenced (LAW-3.5, LAW-10.5).

## Rationale (the WHY — always citable alongside the statement)

A test written after the implementation tends to assert what the code
does, not what it should do — it inherits the implementation's bugs as
expectations. Writing the test first forces the requirement to be stated
precisely before solution bias sets in, guarantees the test can actually
fail (hollow tests, LAW-3.5, usually originate as after-the-fact tests),
and produces interfaces designed from the caller's perspective. Low
coverage was a founding pain point; test-first is the mechanism that
fixes it at the source rather than chasing a number.

The Canon TDD cadence (Beck, 2023) is cited as the definition of compliant
practice: the test list states scope before solution bias sets in, and
one-test-at-a-time keeps each red phase diagnostic — Beck explicitly names
"convert all items into tests, then make them pass" as a common mistake.
The guardrail clause is the agent-era core of this law: tests are the
constraints agents "cannot argue with, or delete" (Beck, 2025) — and
unconstrained agents have been documented deleting failing tests to reach
green. Per AMD-2026-003; evidence in
docs/research/2026-06-11-agentic-constitution-research.md.

## Compliance Examples

VIOLATION:
```text
Commit 1: "feat: add proration logic"
Commit 2: "test: add proration tests"   // written to match commit 1
```

COMPLIANT:
```text
Commit 1: "test: proration charges partial month at daily rate (red)"
Commit 2: "feat: implement proration (green)"
Commit 3: "refactor: extract DailyRateCalculator"
```

## Related Laws
- LAW-3.2 (Coverage Floors)
- LAW-3.5 (No Skipped or Hollow Tests)
- LAW-1.2 (Quality is Built-In, Never Added Later)

## Citation Format
[LAW-3.1 v1.1] "Tests are written before implementation per Canon TDD — test list, one failing test at a time, red-green-refactor — and no agent or engineer may delete, skip, or weaken a failing test to achieve green."
