---
name: workflow-orchestrator
description: Drive work through the constitution's defined workflows (WF-FEATURE, WF-BUG, WF-SECBUG, WF-RESEARCH, WF-REFACTOR, WF-AMENDMENT). Use when starting any nontrivial work item, when asked to "run the <X> workflow", or when the user wants to reshape a flow ("skip the architect stage"). Selects the workflow, executes stage by stage with the right persona, enforces hard gates, and records conversational deviations.
---

# Workflow Orchestrator

Executes the process layer of the constitution (LAW-10.6): workflows from
`workflows/registry.json` (in the constitution repo) or
`docs/constitution/workflows/registry.json` (installed in a project), with
project-local `workflows/` overrides taking precedence by ID.

## 1. Select

- Match the work item to a workflow trigger, or accept an explicit selection
  ("run WF-BUG on JIRA-3411").
- Resolution order: project-local `workflows/WF-*.md` → installed org catalog.
  A project file with the same ID replaces the catalog entry — **after
  validation** (below).
- No matching workflow? Say so and propose the closest fit or a custom
  sequence; never silently invent a process for governed work.
- Announce the selection and the planned chain before executing:

```text
WORKFLOW: WF-BUG v1.0 on JIRA-3411
CHAIN: software-engineer(reproduce-and-fix*) → quality(verify*)
       [conditional: product-owner(resolve-or-escalate)]
(* = hard stage)
```

If `agent-board/` is installed in the project, emit a `workflowSelected`
board event here (see §6).

## 2. Execute

Stage by stage, in order:

1. **Check entry criteria.** Not met → either the previous stage isn't done or
   the work item is malformed; resolve before proceeding.
2. **Assume the stage's persona** — fully: its skill, review lens, citation
   output format, and authority limits. One persona at a time (the
   persona-council pattern: no blended perspectives).
3. **Perform the action**; produce the stage's output with citations.
4. **Verify exit criteria and gates.** Each gate is a law — check it against
   the actual work, not the intention. A failed gate on a hard stage stops the
   line (LAW-6.2's logic); on a soft stage it stops unless a recorded override
   applies.
5. **Honor human checkpoints**: `required` means stop and wait — agents never
   self-approve through a human checkpoint (LAW-6.1, LAW-7.1). `recommended`
   means offer, and proceed only on explicit or standing instruction.
6. **Record stage completion** on the work item (one line per stage: persona,
   outcome, evidence pointer).
7. **Emit a board event** (best-effort, non-blocking — see §6) for this
   stage's transition: on entering the stage (step 2), on stopping at a
   required human checkpoint (step 5), and on completing it (this step).

## 3. Overrides — conversational, validated, recorded

When asked to skip, reorder, parallelize, or add stages:

**Validate first.**
- Skipping/softening a `hard: true` stage → **refuse with a citation**:

```text
OVERRIDE REFUSED: cannot skip stage code-review (WF-FEATURE)
CITATION: [LAW-6.1 v1.0] "Every merge requires two approvals including one
domain expert; authors never approve their own changes."
The stage is marked hard because this gate is inviolable (LAW-6.2).
ALTERNATIVE: I can parallelize code-review with security-review to save time.
```

- Conditionally-hard stages (e.g., WF-FEATURE security-review): inspect the
  actual diff/content. The condition triggered → treat as hard. Genuinely not
  triggered → the skip is valid.
- Adding stages or strengthening (extra reviews, extra checks) → always
  permitted, no justification needed.

**Then record every applied deviation:**

```text
WORKFLOW DEVIATION: WF-FEATURE on JIRA-3500
Stage skipped: design (architect) — hard:false, gates not triggered
Reason: single-file copy change; no structural impact (LAW-4.5 not triggered)
Approved by: <name>, <date>
```

The record goes where the work is recorded (PR description / ticket), per
LAW-7.3's provenance principle: undisclosed deviation is the violation, not
deviation itself. Also emit a `deviation` board event (§6) for every applied
or refused override.

**Project-override validation:** before executing a project-local workflow
file that replaces a catalog entry, diff its stages against the installed org
copy. A project file that removes or softens an org `hard: true` stage is
invalid — execute the org version and report the discrepancy (the fix routes
through an org-catalog PR, per workflows/README.md precedence rules).

## 4. Conditional paths and loops

- Conditional stages (WF-BUG's resolve-or-escalate) activate on their entry
  condition; note activation explicitly.
- Loops carry budgets (e.g., two failed fix-verify cycles → the conditional
  stage becomes mandatory). Budgets exist because silent retry is the agent
  failure mode LAW-7.5 names — when a loop exhausts its budget, escalate.
- Workflow switches (WF-BUG → WF-SECBUG on security suspicion) happen
  immediately and are recorded; completed stages carry over where their exit
  criteria still hold.

## 5. Hard rules

- The orchestrator coordinates; it never overrides a persona's authority —
  Security's veto, the council's escalation, and LAW-7.5 stops all function
  inside stages exactly as outside them.
- WF-AMENDMENT's sequence is constitutional procedure: no conversational or
  project override applies to it, ever.
- Every workflow run ends with a one-block summary: stages executed, personas,
  deviations (or "none"), evidence pointers. Also emit a `workflowCompleted`
  board event here (§6).

## 6. Board Events (best-effort, non-blocking)

If the consuming project has `agent-board/` installed (see
`agent-board/README.md`), append one JSON line per event below to
`.claude/board/events.local.jsonl` (create the file and its directory if
they don't exist yet). This surfaces what the orchestrator is doing as a
local Kanban board — see `docs/agent-board.md`.

Emit at four points: the chain announcement in §1 (`workflowSelected`),
entering/completing a stage or stopping at a required checkpoint in §2
(`stageEvent`), an applied or refused override in §3 (`deviation`), and the
run summary in §5 (`workflowCompleted`). Full field reference and the exact
JSON shape for each `eventType` are in `agent-board/README.md` — don't
duplicate the schema here.

When a stage's output is itself a structured artifact worth full human
review — acceptance criteria, an ADR's rationale, a test list, a security
finding — include the complete content in the event's `detail` field, not
just a one-line summary in `note`. `note` stays short ("what I'm doing/
finding right now"); `detail` is the full, as-detailed-as-possible record
of the decision, surfaced in the board's per-item process view for human
transparency. Best-effort like the rest of this section: most stages don't
need it, and a stage producing nothing structured just omits it.

This write is always best-effort and never blocking: if it fails for any
reason (missing directory, permissions, anything else), proceed with the
workflow exactly as if `agent-board/` were not installed. Mirrors LAW-4.6's
resilience principle — visibility is never a dependency of correctness, and a
stage, gate, or workflow must never be delayed or failed because its board
event couldn't be written.
