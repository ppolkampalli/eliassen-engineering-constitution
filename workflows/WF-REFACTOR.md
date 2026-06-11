---
id: WF-REFACTOR
title: Structural Refactor
version: 1.0
status: ACTIVE
trigger: "Structural change with no intended behavior change: module reorganization, pattern migration, debt paydown, domain extraction"
applies_to: [agent, human, mixed]
governed_by: [LAW-10.6]
stages:
  - id: adr
    persona: architect
    action: "ADR: why this structure, options considered, target shape, migration path"
    entry: "A structural problem: layering violation, duplication cluster (LAW-7.6 signal), pattern drift, domain boundary need"
    exit: "ADR in docs/adr/ with laws considered; explicit behavior-preservation contract"
    gates: [LAW-4.5, LAW-1.4, LAW-4.1]
    hard: true
    human_checkpoint: recommended
  - id: baseline
    persona: quality
    action: "Capture the before-state: test coverage of affected paths, mutation score, duplication/churn metrics, characterization tests where coverage is thin"
    entry: "Approved ADR"
    exit: "Baseline recorded; affected paths have detection-strength tests (add characterization tests if not)"
    gates: [LAW-3.2, LAW-3.6, LAW-7.6]
    hard: true
    human_checkpoint: none
  - id: implement
    persona: software-engineer
    action: "Behavior-preserving restructuring in reviewable increments; tests stay green throughout"
    entry: "Baseline"
    exit: "Target structure reached; every increment's gates green; zero intended behavior diffs"
    gates: [LAW-4.1, LAW-4.3, LAW-2.5, LAW-10.2]
    hard: true
    human_checkpoint: none
  - id: verify
    persona: quality
    action: "Verify behavior preservation and structural improvement: metrics delta vs. baseline"
    entry: "Implementation complete"
    exit: "Behavior identical (suite + characterization tests); LAW-7.6 metrics improved or explained; fresh-context review (LAW-10.5)"
    gates: [LAW-7.6, LAW-10.5, LAW-6.1]
    hard: true
    human_checkpoint: required
escalation: "Scope growth beyond the ADR → back to adr stage; emergent behavior changes → stop, route to WF-BUG or WF-FEATURE for the behavioral part"
---

# WF-REFACTOR: Structural Refactor

## When to Use

Structure changes, behavior doesn't: domain reorganization (LAW-4.1 v1.1
migrations), pattern adoption, cycle breaking, duplication paydown triggered
by LAW-7.6 metrics. If any behavior is *meant* to change, that part is
WF-FEATURE or WF-BUG — split the work.

## Stages

### 1. adr — Architect *(hard)*
Refactors die from undefined "done" exactly like features do: the ADR's target
shape is this workflow's acceptance criteria. Hard because unrecorded
structural change is LAW-1.4's definition of accident.

### 2. baseline — Quality *(hard)*
You cannot demonstrate behavior preservation without a before-state. Where the
affected paths lack detection-strength tests (mutation score, LAW-3.6),
characterization tests are written FIRST — refactoring under a weak net is
how "behavior-preserving" becomes a hope (LAW-3.1's logic applied to
restructuring). The LAW-7.6 baseline is what stage 4's delta is measured
against.

### 3. implement — Software Engineer *(hard)*
Reviewable increments, suite green after each — a thousand-line big-bang
restructure is unreviewable (LAW-6.1) and unbisectable. The agent guardrail
matters doubly here: a failing test during refactor means behavior changed;
the answer is revert-and-rethink, never test adjustment.

### 4. verify — Quality *(hard, human checkpoint)*
Two questions, both answered with evidence: did behavior survive (suite +
characterization tests), and did structure actually improve (LAW-7.6 delta:
duplication down, cycles gone, complexity reduced)? A refactor that can't
demonstrate improvement gets its rationale re-examined.

## Deviation Notes

- No skippable stages — each guards against this workflow's specific failure
  mode (undefined target, weak net, big-bang, unverified claim).
- `baseline` and `adr` may iterate together when discovering the affected
  surface informs the design.
- Pausing mid-refactor is a recorded decision with the system left in a
  consistent intermediate state (expand-migrate-contract logic, LAW-9.2).

## Escalation

Scope creep ("while we're in here…") → back to the ADR or a ticket
(LAW-8.4); discovered behavioral defects → WF-BUG with the refactor paused.
