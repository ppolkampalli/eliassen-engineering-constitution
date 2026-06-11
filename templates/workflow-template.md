---
id: WF-<NAME>
title: <Workflow Title>
version: 1.0
status: ACTIVE            # ACTIVE | DEPRECATED
trigger: "<When this workflow applies — the problem type, stated so an orchestrator can match it>"
applies_to: [agent, human, mixed]
governed_by: [LAW-10.6]
stages:
  - id: <stage-id>
    persona: <persona-name>          # from .claude/skills/personas/
    action: "<What this stage produces>"
    entry: "<What must exist before this stage starts>"
    exit: "<What must be true to advance — the stage's definition of done>"
    gates: [LAW-X.Y]                 # laws checked at this stage
    hard: false                      # true = not overridable (conversationally or by project)
    human_checkpoint: none           # none | recommended | required
escalation: "<Where stage conflicts go — persona-council, then humans per LAW-7.5>"
---

# WF-<NAME>: <Workflow Title>

## When to Use

<The trigger, elaborated: what kinds of work items, with examples. What this
workflow is NOT for, pointing to the right one.>

## Stages

### 1. <stage-id> — <Persona>
<What happens, what the persona produces (in its citation format), what the
exit criteria mean in practice. Note hard gates and why they are hard.>

### 2. …

## Deviation Notes

<Which stages are commonly skipped/reordered and when that is reasonable;
what may never be skipped, with law citations.>

## Escalation

<Conflict path: which disagreements go to persona-council, what goes straight
to humans per LAW-7.5.>
