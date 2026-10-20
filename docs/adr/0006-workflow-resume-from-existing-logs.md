# ADR-0006: Workflow Resume From Existing Logs (agent-board + memory-service)

- **Status:** ACCEPTED
- **Date:** 2026-10-20
- **Deciders:** P. Polkampalli (prioritize decision); Architect + Software
  Engineer personas (design/investigate)
- **Work item:** `docs/proposals/agentic-context-management/` (WF-RESEARCH
  spike) → this ADR, Option 1A selected

## Context

The research spike at `docs/proposals/agentic-context-management/`
investigated how this constitution's governed workflows should manage LLM
context, prompted by a direct question about compaction, summarization, and
markdown externalization. The internal audit found a concrete, confirmed
gap: every workflow in the catalog (`workflows/WF-*.md`) has at least one
`human_checkpoint: required` stage — a run can pause for hours or days
waiting on a human — and `skills/workflow-orchestrator/SKILL.md` had **no
documented protocol** for how a session (the same one, later, or a
different one entirely) resumes a paused work item. Whatever reconstruction
happened relied on `agent-board`'s event log or `memory-service`'s decision
log only by inference, never because any text instructed it.

External research (`findings.md` Part B) corroborates the general shape of
the fix: Anthropic's own "structured note-taking" pattern — a persistent
file outside the context window, read back in later — is exactly what
`agent-board`'s JSONL event log and `memory-service`'s decision log already
are, for projects that have them installed. The gap was never "we lack a
place to write things down" — it was "nothing reads them back."

## Options Considered

### Option A — Status quo
- Consequences: zero cost, but the confirmed gap (no resume protocol
  despite every workflow having a hard stop) remains exactly as found.

### Option B — Reuse existing logs: instruct the orchestrator to reconstruct state from `agent-board`/`memory-service` on resume
- Consequences: a scoped prose change to `workflow-orchestrator/SKILL.md`
  §1, reusing two mechanisms that already capture the needed facts
  (acceptance criteria, stage outcomes, decisions) — no new file format, no
  new convention for a project to learn. Degrades gracefully: a project
  with neither tool installed falls through to the same status quo as
  Option A, with that fact said out loud rather than silently assumed.

### Option C — A dedicated handoff file (NOTES.md-style), independent of either optional tool
- Consequences: more portable (works with neither tool installed), but
  duplicates what `agent-board`/`memory-service` already do for projects
  that have them — a second place the same facts could live, and a real
  drift risk between the handoff file and the event/decision logs in a
  project that has both. Rejected in favor of Option B's reuse-first
  posture (LAW-1.3); not ruled out permanently if Option B's degrade-to-
  status-quo case proves unacceptable in practice.

## Decision

**Option B.** `skills/workflow-orchestrator/SKILL.md` §1 ("Select") now has
a resume-detection step, checked before a work item is treated as a fresh
start: read `agent-board`'s event log for the work item's id; call
`memory-service`'s `query_decisions({ workItem })`; reconstruct ACs,
completed stages, and recorded decisions from whatever is found.
Reconstruction that is incomplete or impossible says so explicitly — *"No
prior stage history found"* or *"Partial history found... confirm before
proceeding"* — rather than silently assuming a clean slate or a complete
picture. A new resume-announcement format parallels the existing
fresh-start chain announcement, so a resume is visibly distinct from a
fresh start in the record.

## Consequences

- **New:** the resume-detection step in `workflow-orchestrator/SKILL.md`
  §1; a resume-announcement text format alongside the existing
  fresh-start one.
- **Unchanged:** `agent-board`'s event schema, `memory-service`'s tool
  schemas, every workflow file, every other skill — this reuses existing
  mechanisms verbatim, adding no new fields or tools.
- **Risk accepted, stated plainly**: like `ADR-0004`, this remains
  enforcement-by-prose — an LLM orchestrator must actually perform the
  check and actually notice incomplete reconstruction rather than
  proceeding confidently on a partial picture. The explicit incomplete-
  reconstruction announcement is the mitigation, not a guarantee; it makes
  the failure mode visible to a human rather than eliminating it.
- **Follow-up, not started**: Option C (a dedicated handoff file) remains
  available if Option B's degrade-to-status-quo case (neither tool
  installed) proves unacceptable for a given project in practice — not
  pursued now absent evidence it's needed.
- **Explicitly declined in the same spike, recorded here for completeness**:
  Sub-Design 2's Option 2B (a diff-size-based trigger for LAW-10.5's
  fresh-context dispatch, independent of law citation) was **not** adopted
  — flagged in `design.md` as needing its own calibration pilot first,
  mirroring LAW-3.6's "pending pilot" precedent, not a threshold to guess
  at in this pass. Sub-Design 3 (steering-file hygiene) required no
  action: this repo already has exactly one root-scoped `CLAUDE.md` and no
  nested/path-scoped rule files, verified directly, not assumed.

## Laws Considered

- [LAW-4.5 v1.0] — this ADR itself, triggered by a change to the shared
  orchestrator's behavior.
- [LAW-1.3 v1.0] — consistency: Option C (a new file format) was declined
  in favor of reusing `agent-board`/`memory-service`, already the single
  source of truth for events and decisions respectively.
- [LAW-4.6 v1.0] — resilience: the resume check is best-effort, identical
  posture to `agent-board`'s existing board-event emission — a failed or
  absent check never blocks or fails the workflow, it just means treating
  the work item as a fresh start, exactly as before this ADR.
- [LAW-7.5 v1.0] — escalate on uncertainty: incomplete reconstruction is
  announced explicitly, never silently assumed complete.
- [LAW-10.5 v1.0] — this ADR's Sub-Design 2 discussion (declined for now)
  concerns the same law's fresh-context dispatch mechanism from
  `ADR-0004`; no change made to it here.
