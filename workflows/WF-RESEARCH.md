---
id: WF-RESEARCH
title: Product Research & Prioritization
version: 1.0
status: ACTIVE
trigger: "A product requirement or problem needs investigation, idea generation, and prioritization before committing to build"
applies_to: [agent, human, mixed]
governed_by: [LAW-10.6]
stages:
  - id: framing
    persona: product-owner
    action: "Frame the problem: who has it, what outcome matters, constraints, decision criteria"
    entry: "A requirement, hypothesis, or opportunity exists"
    exit: "Written problem statement with decision criteria (what would make an option win)"
    gates: [LAW-8.1]
    hard: true
    human_checkpoint: recommended
  - id: investigate
    persona: software-engineer
    action: "Research: codebase feasibility, prior art, external sources — cited findings only"
    entry: "Framed problem"
    exit: "Findings document with sources; claims distinguished from speculation"
    gates: [LAW-7.2, LAW-8.2]
    hard: false
    human_checkpoint: none
  - id: ideate
    persona: architect
    action: "Generate 2–4 options with honest trade-offs, rough cost (FinOps consult per LAW-9.3 if material), and risks"
    entry: "Findings"
    exit: "Options matrix scored against the stage-1 decision criteria"
    gates: [LAW-1.4, LAW-9.3]
    hard: false
    human_checkpoint: none
  - id: prioritize
    persona: product-owner
    action: "Decide: select, sequence, or decline options; record the decision and rationale"
    entry: "Options matrix"
    exit: "Recorded decision; selected work feeds WF-FEATURE's requirements stage"
    gates: [LAW-8.4]
    hard: true
    human_checkpoint: required
escalation: "Cross-cutting options (cost+security+architecture) → persona-council before prioritize; regulatory questions → human compliance per LAW-8.3/7.5"
---

# WF-RESEARCH: Product Research & Prioritization

## When to Use

When the question is *whether/what* to build, not *how*: a raw product
requirement needing investigation, competing ideas needing structured
comparison, or a discovery spike. Output feeds WF-FEATURE — research never
flows straight into implementation (that jump is how unvalidated assumptions
ship, LAW-7.5).

## Stages

### 1. framing — Product Owner *(hard)*
The decision criteria written here are what makes stage 4 a decision instead
of a vibe: "we pick the option that ships inside the quarter under $2k/mo and
needs no new PII storage."

### 2. investigate — Research agent (Software Engineer persona)
Any capable agent or human; the discipline is **cited findings** — sources
named, claims separated from speculation (the research-report standard this
repo itself uses). LAW-7.2 governs what may be sent to external tools during
research.

### 3. ideate — Architect
Options with honest consequences, the same posture as ADR options sections
(LAW-1.4). Rejected options are part of the value — they save the next
person re-deriving them.

### 4. prioritize — Product Owner *(hard, human checkpoint)*
A recorded human decision: selected, sequenced, or declined-with-reason. Hard
because prioritization is exactly the accountability the PO role exists to
hold (LAW-8.4); an agent may draft the recommendation, never make the call.

## Deviation Notes

- `investigate` and `ideate` may merge for small questions, or fan out in
  parallel for multi-angle research.
- `framing` and `prioritize` are never skippable — without them this is
  unaccountable exploration, not a workflow.

## Escalation

Options with combined cost + security + architecture implications convene the
persona-council before stage 4; regulatory interpretation goes to human
compliance (LAW-8.3, LAW-7.5).
