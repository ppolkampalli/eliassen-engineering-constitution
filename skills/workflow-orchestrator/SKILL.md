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
3. **Fresh-context dispatch (LAW-10.5).** If this stage's `gates` list
   includes `LAW-10.5`, this stage's action does not happen in the current
   session: launch a fresh subagent (a new, context-isolated agent instance)
   and hand it a structured payload only — the Acceptance Criteria (from the
   `requirements` stage's recorded exit output), the diff, and the test list
   (from `test-definition`, where the workflow has one). Never pass the
   implementing context's reasoning, chat history, or rationale — carrying
   that forward is the exact bias this law exists to remove. The subagent's
   findings become this stage's output in step 4; the implementing context
   incorporates them, it does not re-derive or override them. Piloted
   2026-10-20 on the two stages in the org catalog that currently gate on
   LAW-10.5 — WF-FEATURE's `code-review` and WF-BUG's `verify` — and extends
   automatically to any future stage whose `gates` cites LAW-10.5, since the
   trigger is the law citation, not a hardcoded stage list (see
   `docs/proposals/agentic-quality-assurance/design.md` Option 2A and
   `docs/adr/0004-fresh-context-subagent-dispatch.md`).
4. **Perform the action**; produce the stage's output with citations. (Per
   step 3, this runs inside the dispatched subagent when LAW-10.5 gates this
   stage.)
5. **Verify exit criteria and gates.** Each gate is a law — check it against
   the actual work, not the intention. A failed gate on a hard stage stops the
   line (LAW-6.2's logic); on a soft stage it stops unless a recorded override
   applies.
6. **Honor human checkpoints**: `required` means stop and wait — agents never
   self-approve through a human checkpoint (LAW-6.1, LAW-7.1). `recommended`
   means offer, and proceed only on explicit or standing instruction.
7. **Record stage completion** on the work item (one line per stage: persona,
   outcome, evidence pointer).
8. **Emit a board event** (best-effort, non-blocking — see §6) for this
   stage's transition: on entering the stage (step 2), on stopping at a
   required human checkpoint (step 6), and on completing it (this step).

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

### Traceability fields (`acceptanceCriteria`, `testResults`)

If the project has the Traceability tab installed (`agent-board/README.md`'s
"Traceability tab" section), two additional optional fields ride on the same
`stageEvent` — no new event type, no new API route:

- At the stage that writes Acceptance Criteria (typically `requirements`),
  include `acceptanceCriteria: { id, text }[]` — stable ids assigned once
  (`AC-1`, `AC-2`, …) and referenced by that id for the rest of the work
  item's life. A later stage re-declaring `acceptanceCriteria` replaces the
  set wholesale — don't re-emit it unless the ACs actually changed.
- At a stage that actually runs the test suite (typically `implement` or
  `code-review`), include `testResults: { acId, testId, testType, status,
  testFile? }[]` — **populated only by parsing the test runner's own
  machine-readable output** (e.g. `jest --json`, a JUnit XML report),
  **never from a self-reported narrative belief that tests passed.** This is
  not optional caution: `docs/proposals/agentic-quality-assurance/
  design.md`'s QA critique of this exact field is that a self-reported
  status field is "a more elaborate way to display the exact problem this
  spike started from." Map each real test result to the AC it verifies via
  a naming convention — prefix the test's description with the AC it
  verifies, e.g. `it('[AC-1] renders the empty state', ...)` — and parse
  that tag out of the real result's test name/`fullName`. A test with no
  `[AC-n]` tag has no traceability entry; don't guess an AC for it. Include
  `testFile` (the spec file's path relative to the project root) whenever
  the test-runner output names it — this is what lets a human reviewing the
  Traceability tab go open and read the actual test, not just trust a
  status label. A test genuinely not yet written (`status: 'pending'`) has
  no file to point at yet; omit `testFile` rather than guessing one.

Both fields are additive and optional — a project without this convention
simply never emits them, and the board's other tabs are unaffected.
