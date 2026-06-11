---
id: AMD-2026-003
status: ENACTED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted research initiative — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-3.1]
reviewers_required: [quality, software-engineer]
decision_by: "P. Polkampalli (PPolkampalli@eliassen.com)"
decision_date: "2026-06-11"
---

# AMD-2026-003: Align LAW-3.1 with Canon TDD and Add the Agent Guardrail Clause

## Motivation

Kent Beck's Canon TDD (Dec 2023, primary source) clarifies the practice our
LAW-3.1 mandates: a five-step loop driven by a **test list**, converting **exactly
one** item at a time into a runnable test. Beck explicitly names "convert all items
into tests, then make them pass" as a common mistake — a mistake LAW-3.1's current
text permits. Separately, Beck's 2025 agent-era writing frames tests as guardrails
agents "cannot argue with, or delete," and documents unconstrained agents deleting
failing tests to reach green — a failure mode our testing laws do not yet name.
(Sources: docs/research/2026-06-11-agentic-constitution-research.md, sections a/c.)

## Changes

### LAW-3.1 (v1.0 → v1.1) — meaning change, minor bump

**Before:**
> Tests are written before implementation. For every behavior change, a failing
> test demonstrating the expected behavior is shown to exist — and to fail —
> before the code that makes it pass is written. The cycle is red → green →
> refactor. Code presented without its preceding failing test is presumed
> untested regardless of coverage numbers.

**After:**
> Tests are written before implementation, following Canon TDD: (1) write a test
> list enumerating the expected behaviors and edge cases; (2) convert exactly one
> item into a runnable test and show it fail; (3) make it and all previous tests
> pass, adding newly discovered cases to the list — never converting the whole
> list to tests at once; (4) optionally refactor; (5) repeat until the list is
> empty. Code presented without its preceding failing test is presumed untested
> regardless of coverage numbers. Failing tests are guardrails: no agent or
> engineer may delete, skip, or weaken a failing test or check to achieve green —
> a red test is fixed or its requirement is formally changed, never silenced
> (LAW-3.5, LAW-10.5).

Rationale section gains the Beck citations (Canon TDD; "Augmented Coding: Beyond
the Vibes" 2025) and the note that Canon TDD is cited as the definition of
compliant practice, not a moral mandate.

## Impact Analysis

- **Projects:** test-list step becomes reviewable evidence (PR description or test
  file comment); tdd-assistant skill updated to drive the list/one-at-a-time
  cadence at enactment.
- **Configs/tooling:** none.
- **Personas:** quality persona review lens item 1 references the test list.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Quality | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | |
| Software Engineer | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | |

## Decision
Approved/Rejected by: **P. Polkampalli (PPolkampalli@eliassen.com)** Date: **2026-06-11**
Rationale: Approved en bloc with the v1.1 amendment wave. LAW-3.1 → v1.1.
