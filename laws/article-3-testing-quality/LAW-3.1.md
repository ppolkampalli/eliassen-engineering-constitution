---
id: LAW-3.1
title: Test-First Development
article: 3
article_name: Testing & Quality
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, software-engineer]
enforcement: persona
enforcement_mechanism: "tdd-assistant skill; quality persona review; failing test demonstrated in PR description"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-3.1: Test-First Development

## Statement (quotable)

> Tests are written before implementation. For every behavior change, a
> failing test demonstrating the expected behavior is shown to exist —
> and to fail — before the code that makes it pass is written. The cycle
> is red → green → refactor. Code presented without its preceding
> failing test is presumed untested regardless of coverage numbers.

## Rationale (the WHY — always citable alongside the statement)

A test written after the implementation tends to assert what the code
does, not what it should do — it inherits the implementation's bugs as
expectations. Writing the test first forces the requirement to be stated
precisely before solution bias sets in, guarantees the test can actually
fail (hollow tests, LAW-3.5, usually originate as after-the-fact tests),
and produces interfaces designed from the caller's perspective. Low
coverage was a founding pain point; test-first is the mechanism that
fixes it at the source rather than chasing a number.

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
[LAW-3.1 v1.0] "Tests are written before implementation; a failing test demonstrating expected behavior exists before the code that makes it pass."
