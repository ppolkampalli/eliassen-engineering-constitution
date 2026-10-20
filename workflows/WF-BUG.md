---
id: WF-BUG
title: Bug Fix
version: 1.0
status: ACTIVE
trigger: "A defect: existing behavior deviates from documented or expected behavior"
applies_to: [agent, human, mixed]
governed_by: [LAW-10.6]
stages:
  - id: reproduce-and-fix
    persona: software-engineer
    action: "Write a failing test reproducing the defect (red), then fix it (green)"
    entry: "A defect report with symptom and, ideally, reproduction steps"
    exit: "Reproducing test exists and passes post-fix; full suite green with evidence"
    gates: [LAW-3.1, LAW-10.2]
    hard: true
    human_checkpoint: none
  - id: verify
    persona: quality
    action: "Verify the fix against the original symptom; check the test actually detects the defect"
    entry: "Fix with reproducing test"
    exit: "Symptom confirmed resolved; reproducing test confirmed non-hollow (mutate the fix mentally — does the test catch it?)"
    gates: [LAW-3.5, LAW-10.5]
    hard: true
    human_checkpoint: none
  - id: resolve-or-escalate
    persona: product-owner
    action: "If unresolved after verify: rescope, reprioritize, or accept-with-mitigation — recorded"
    entry: "Verification failed, root cause exceeds scope, or fix conflicts with requirements"
    exit: "Recorded PO decision: loop back to reproduce-and-fix with new scope, schedule deeper work, or accept"
    gates: [LAW-8.4, LAW-8.1]
    hard: false
    human_checkpoint: required
escalation: "Suspected security implication → switch to WF-SECBUG immediately; structural root cause → WF-REFACTOR via architect"
---

# WF-BUG: Bug Fix

## When to Use

Defects in existing behavior. Not for: vulnerabilities (WF-SECBUG — and the
switch happens the moment a security implication is *suspected*, not
confirmed), or "bugs" that are really unbuilt features (WF-FEATURE via the PO).

## Stages

### 1. reproduce-and-fix — Software Engineer *(hard)*
The reproducing test comes first — it is the proof the defect is understood
and the guarantee it stays fixed (LAW-3.1: red before green). A fix without a
reproducing test is a guess that compiled. Conditional path: if reproduction
reveals the defect is in requirements (the code does what was asked; what was
asked is wrong), route directly to stage 3.

### 2. verify — Quality *(hard)*
A fresh subagent (LAW-10.5 — `workflow-orchestrator/SKILL.md` §2's
fresh-context dispatch, piloted 2026-10-20) confirms the original symptom is
gone — not merely that the new test passes — and that the reproducing test
is honest (LAW-3.5). The distinction matters: agents under pressure fix the
test, not the bug.

### 3. resolve-or-escalate — Product Owner *(conditional)*
The loop-breaker. When verification fails repeatedly, the root cause exceeds
the ticket's scope, or the "fix" changes documented behavior, the PO decides:
rescope and loop, schedule deeper work, or accept-with-mitigation — recorded
on the work item (LAW-8.4). This stage only activates on the unresolved path;
clean fixes end at verify.

## Deviation Notes

- No skippable stages on the happy path — this workflow is already minimal.
- For trivial defects (typo-class), stages 1–2 may execute in a single session,
  but both exit criteria still hold and are evidenced.
- The stage-3 loop has a budget: after two failed fix-verify cycles, stage 3 is
  mandatory — endless silent retry is how agents burn days (LAW-7.5).

## Escalation

Security suspicion → WF-SECBUG (immediately, LAW-1.5); architectural root
cause (the defect is load-bearing structure) → architect persona, usually
spawning WF-REFACTOR; requirement conflicts → PO at stage 3.
