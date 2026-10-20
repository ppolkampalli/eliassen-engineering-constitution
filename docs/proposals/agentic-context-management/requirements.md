# Requirements: Managing Context Across Governed, Multi-Stage Workflows

**Persona:** Product Owner · **Workflow:** WF-RESEARCH v1.0 (framing stage)
**Status:** FRAMED — investigate (`findings.md`) and ideate (`design.md`) complete.
**`prioritize` (hard, human checkpoint) has NOT run.** No code, SKILL.md, or
law text is changed by this spike.

## Problem Statement

The user asked how to manage LLM context when building features under this
constitution's governed workflows — naming three candidate techniques
(automatic compaction/summarization, structured summarization, and
markdown-file externalization) and asking for informed ideas on how (and
whether) they apply. This question is concrete, not abstract: every
workflow in this catalog (`workflows/WF-*.md`) has at least one
`human_checkpoint: required` stage, meaning a run can pause for hours or
days — and `workflow-orchestrator/SKILL.md` currently has **no documented
mechanism** for how a session resumes a paused work item, nor any
awareness that a large diff, long review, or many stages could threaten
context budget within a single session.

## Decision Criteria (from framing)

1. **Build on settled research, don't duplicate or contradict it.** This
   repo already has a refuted claim on record — "Context Window Creep is
   the largest hidden cost" (`docs/research/
   2026-06-13-token-economics-enterprise-roi-research.md`, refuted 1-2 by
   adversarial verification) — but that is a **cost-economics** claim
   (is growing context the single biggest line item in spend), not the
   **reliability/quality** concern this spike investigates (does context
   growth degrade an agent's correctness). The two are not the same claim;
   this spike must not conflate them. Separately, `docs/research/
   2026-06-11-agentic-constitution-research.md` already researched
   steering-file (CLAUDE.md) hygiene — this spike builds on that, not
   re-derives it.
2. **Match technique to failure mode, not one-size-fits-all.** Per
   Anthropic's own published framework (`findings.md` Part B), compaction,
   structured note-taking, and sub-agent isolation solve different
   problems; an option that applies one technique everywhere is suspect by
   default.
3. **Anything that must survive with zero information loss belongs in a
   file that gets explicitly re-read — never in conversation history
   relying on compaction to preserve it.** Compaction is lossy by design
   (stated directly in Anthropic's own engineering guidance); an AC, a law
   citation, a rejected-option's rationale, or a recorded human decision is
   exactly this kind of fact.
4. **Extend what already exists — LAW-1.3.** This repo already has three
   candidate externalization mechanisms (`agent-board`'s event log,
   `memory-service`'s decision log, ADRs/`docs/proposals/`) and one
   subagent-isolation mechanism (LAW-10.5's fresh-context dispatch, built
   this session). Any option should extend one of these, not invent a
   parallel system.
5. **New instructions go in project-root-scoped files, not nested/
   path-scoped ones** — confirmed via external research that only
   root-scoped CLAUDE.md content reliably survives compaction; nested/
   path-scoped rules load into message history and get summarized away
   with everything else.

## Out of Scope

- Implementing anything — this is framing/investigate/ideate only;
  `prioritize` is the user's call, same posture as the two prior spikes
  this session.
- Re-litigating the refuted cost-economics claim — out of scope by
  definition (criterion 1).
- A full formal "resume protocol" workflow file — named as a candidate
  option in `design.md`, not built here.

## Bearing Laws

LAW-1.3 (Consistency — extend existing mechanisms, no parallel system),
LAW-1.4 (Intentional Architecture — match technique to failure mode,
proportional to actual risk), LAW-4.5 (ADR Requirement — its rationale
already names "an AI extending the system can read the intent, not just the
artifact," the closest existing hook to a context-management framing, found
in `findings.md` Part A to be framed as architectural safety rather than
token economics today), LAW-4.6 (Resilience — a resume mechanism must stay
best-effort, never a dependency of correctness, mirroring `agent-board`'s
existing posture), LAW-7.3 (AI Audit Trail — overlapping but distinct
motivation from context-management, see `findings.md`), LAW-10.1
(Spec-Driven Agent Work), LAW-10.5 (Fresh-Context Review — the existing
mechanism this spike's Sub-Design 2 builds directly on), LAW-10.6 (Defined
Workflows).

## Decision Record

**Decided, 2026-10-20.** The user selected:

- **Sub-Design 1, Option 1A** (reuse `agent-board`/`memory-service` for
  resume detection) — implemented in `skills/workflow-orchestrator/
  SKILL.md` §1, recorded in
  `docs/adr/0006-workflow-resume-from-existing-logs.md`.
- **Sub-Design 2, Option 2A** (no change to LAW-10.5's existing trigger) —
  explicitly declined Option 2B (a diff-size-based trigger) for this pass,
  pending a calibration pilot per the same discipline applied to LAW-3.6.
  No code change; recorded as a deliberate non-action in
  `docs/adr/0006-...`'s Consequences section.
- **Sub-Design 3, Option 3A** (steering-file hygiene durability note) —
  already fully satisfied; the note itself (now in `design.md`) was the
  entire deliverable, and this repo was verified clean on the one checkable
  risk (no nested/path-scoped `CLAUDE.md` files).

Nothing further is pending from this spike.
