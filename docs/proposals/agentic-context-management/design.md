# Design: Options for Context Management Across Governed Workflows

**Persona:** Architect · **Workflow:** WF-RESEARCH v1.0 (ideate stage)
**Entry:** `findings.md` · **Gates:** LAW-1.3, LAW-1.4, LAW-4.6, LAW-10.5
**Status:** Options only. `prioritize` has not run — nothing here is
selected, sequenced, or declined yet.

Three sub-designs, each targeting a specific gap `findings.md` confirmed —
not "pick a context-management technique," since Anthropic's own framework
(`findings.md` Part B, finding 3) already settles that compaction/
note-taking/sub-agents solve different problems and this repo already has
instances of two of the three. The actual gap is narrower: **nothing
instructs the orchestrator to use what already exists when resuming a
paused work item.**

---

## Sub-Design 1 — A Resume Instruction, Not a New File

The user's third named option (markdown externalization) is already
half-built: `agent-board`'s event log and `memory-service`'s decision log
both already hold exactly the kind of durable, structured facts Anthropic's
"structured note-taking" pattern describes. The gap is that nothing tells
the orchestrator to *read them back*.

### Option 1A — Instruct `workflow-orchestrator` to reconstruct state from existing logs on resume — **SELECTED AND IMPLEMENTED, 2026-10-20**

Add a step to `skills/workflow-orchestrator/SKILL.md` §2 (or a new §, since
this is a cross-stage concern, not one stage's step): before continuing a
work item in a session that didn't run its earlier stages, re-read
`.claude/board/events.local.jsonl`'s entries for that `workItem` (if
`agent-board/` is installed) and `query_decisions` for that `workItem` (if
`memory-service` is installed) — reconstruct ACs, prior stage outcomes, and
recorded decisions from there, rather than asking the human to re-explain
or guessing from the PR/ticket description alone.
- **Cost**: low — a prose instruction change, reusing two mechanisms that
  already exist and already capture the needed facts (per `findings.md`
  Part A, the event log's `detail`/`acceptanceCriteria`/`testResults`
  fields already carry this). No new file format, no new convention to
  teach every project.
- **Matches decision criterion 4** (extend, don't duplicate) directly.
- **Limit, stated plainly**: both mechanisms are optional installs
  (`agent-board`, `memory-service`). A project with neither has no resume
  mechanism at all under this option — falls through to Option 1C's status
  quo for that case.

### Option 1B — A dedicated handoff file (NOTES.md-style), independent of agent-board/memory-service

Per the cross-tool convergence pattern (`findings.md` Part B, finding 4):
write a structured resume file (goal, ACs, done, blocked, next step, files
touched) at the point a workflow stops on a required human checkpoint,
regardless of what else is installed.
- **Cost**: higher than 1A — a new file format and convention to document
  and maintain, parallel to (not reusing) what `agent-board`/
  `memory-service` already do for projects that have them installed.
- **Benefit over 1A**: works even with neither optional tool installed —
  genuinely more portable.
- **Risk**: a second place the same facts (ACs, decisions) could live,
  risking drift between the handoff file and the event log/decision log in
  a project that has both — a consistency cost 1A doesn't have.

### Option 1C — Status quo

No change. The human (or a fresh session) reads the PR/ticket description
and git log to reconstruct state, as happens today. Lowest cost, but
leaves the confirmed gap (no documented resume protocol, despite every
workflow having a hard stop) exactly as found.

**Decided**: 1A, implemented in `skills/workflow-orchestrator/SKILL.md` §1,
recorded in `docs/adr/0006-workflow-resume-from-existing-logs.md`. It
extends existing mechanisms rather than adding a new format, and degrades
gracefully (falls back to 1C) for projects without the optional tools,
rather than requiring a new convention everywhere.

---

## Sub-Design 2 — Should LAW-10.5's Fresh-Context Dispatch Trigger on Size, Not Just Law Citation?

`ADR-0004` built subagent dispatch for a self-grading-bias reason; external
research (`findings.md` Part B, finding 3) independently confirms the same
mechanism is the recommended pattern for context isolation specifically —
a nice convergence, not a coincidence worth re-architecting around blindly.

### Option 2A — No change; context-budget benefit stays incidental — **SELECTED (status quo), 2026-10-20**

Keep the existing trigger ("this stage's `gates` cites LAW-10.5") exactly
as implemented. The context-isolation benefit for those two stages is real
but was not the reason they were chosen — leave it that way.
- **Consequence**: every other stage (most of the catalog) still has zero
  context-isolation, by design — acceptable per decision criterion 2
  (match technique to failure mode): most stages don't do the kind of
  "extensive back-and-forth" or large-diff review that needs it.

### Option 2B — Add a size-based trigger: dispatch a fresh subagent when a stage's accumulated diff exceeds a threshold, independent of LAW-10.5

- **Consequence**: addresses the one real remaining gap (a large `implement`
  or `design` stage with no LAW-10.5 gate could still exhaust context
  within one session) — but **no evidence-backed threshold exists to set**.
  This is the same posture LAW-3.6 was in before its pilot
  (`agent-board/README.md`'s "Mutation testing pilot (LAW-3.6)" section):
  a plausible mechanism with no calibrated number yet. Flagging this as the
  most speculative option in this entire spike — it would need its own
  pilot (measuring actual context usage per stage across real workflow
  runs) before a number could be trusted, not a guessed threshold.

**Decided**: 2A (no change). 2B remains a real candidate but needs the
same "pilot before mandate" discipline this constitution already applies
to mutation testing — not something to guess a number for in this pass.

---

## Sub-Design 3 — Steering-File Hygiene: Verified Clean, Not a Gap

Unlike Sub-Designs 1 and 2, this one closes with nothing to build.
`findings.md` Part A confirmed this repo has exactly one `CLAUDE.md`
(root-scoped, 58 lines) and no nested or path-scoped rule files anywhere —
the one compaction-survival risk external research identified (nested/
path-scoped rules get summarized away, only root-scoped content reliably
survives) simply doesn't apply here today.

### Option 3A — No action; add a one-line durability note — **SELECTED, already satisfied**

The only action worth taking: note in this proposal (here) that root-
scoping is load-bearing for compaction survival, so a future contributor
adding a nested CLAUDE.md or `.claude/rules/*.md` file should know that
content there is **not guaranteed to survive a long session's compaction**
— it's a real, external-research-backed constraint, not house style. No
code or law change; this sentence is the entire deliverable.

### Option 3B — Status quo, no note

Say nothing further; rely on whoever adds a nested rule file later to
independently know this constraint. Cheaper, but a known, cheap-to-record
fact that would otherwise need re-discovering.

**Decided**: 3A — already fully satisfied by this sentence existing and
the verified-clean check in `findings.md` Part A.

---

## Critical Review (self-applied, same discipline as the prior two spikes)

- **Sub-Design 1's risk, named plainly**: Option 1A makes resume quality
  *conditional* on optional tooling being installed and actually used
  correctly by the orchestrator in the first place — if `agent-board`'s
  event emission itself has gaps (it's best-effort, per LAW-4.6), the
  "reconstructed state" could be incomplete without any visible warning.
  This isn't a reason to reject 1A, but a reason any implementation should
  make incomplete reconstruction *visible* (e.g., "no prior stage data
  found for this work item — confirm before proceeding") rather than
  silently proceeding on a partial picture.
- **Sub-Design 2's risk, named plainly**: a size-based trigger (2B) risks
  the same "number that looks rigorous but was never calibrated" mistake
  this constitution corrected itself on with mutation testing — explicitly
  why 2B is flagged speculative rather than recommended.
- **This spike's own risk**: it is itself a markdown document arguing for
  the value of markdown documents as context-management infrastructure —
  worth naming the circularity directly rather than pretending it isn't
  there. The mitigation is the same evidence standard applied throughout:
  every claim above traces to Anthropic's own published guidance or a
  direct read of this repo's actual files, not to this spike's own
  convenience.

## Consequences (if, and only if, options are later prioritized)

- **New, if 1A chosen**: a scoped addition to `workflow-orchestrator/
  SKILL.md` (a resume-reconstruction step) — recommend an ADR per LAW-4.5
  if prioritized, same posture as `ADR-0004`/`ADR-0005`, since this changes
  the shared orchestrator's behavior.
- **New, if 2B chosen**: a pilot (not a mandate) measuring real context
  usage per stage before any threshold is set — mirrors LAW-3.6's own
  precedent.
- **New, if 3A chosen**: nothing beyond this document — the sentence
  already exists above.
- **Unchanged regardless**: Claude Code's own compaction behavior (not this
  repo's to control), every existing law, workflow, and skill file.

## Next Step

None, pending the user. `prioritize` is a separate, future, explicit
decision — select any subset of 1A/1B/2A/2B/3A (or none), with rationale
recorded back into `requirements.md`'s Decision Record when that happens.
