# Requirements: Deterministic Quality, Session-Boundary Integrity & Requirements Traceability

**Persona:** Product Owner, framed through a Quality/QA critical lens throughout (explicit user request — quality is this spike's core pillar, not one stage's concern)
**Workflow:** WF-RESEARCH v1.0 (framing stage)
**Status:** FRAMED — investigate (`findings.md`) and ideate (`design.md`) complete.
**`prioritize` (hard, human checkpoint) has NOT run.** No code, CI job, law text,
or SKILL.md is changed by this spike. It is a research record, held so the
investigation isn't lost before a future, explicit decision.

## Problem Statement

The user raised four linked questions about the constitution's own
quality model, and asked that this be investigated as a QA persona would —
critically, not deferentially:

1. **Are the laws enforced deterministically or by LLM (probabilistic)
   judgment?** And where it's the latter, how do we introduce a quantifiable,
   deterministic backstop?
2. **Does developing a feature in one continuous session bias the model
   toward declaring its own code successful** — the same context writing code
   and then "testing" it? If so, should every persona handoff (e.g.
   implement → code-review) start a genuinely new session, and if it does,
   how do we avoid losing the requirement/intent across that boundary and
   producing new false positives in exchange for removing old ones?
3. **Can a requirement-to-test traceability mapping** — Product Requirement →
   Requirements Mapping → Acceptance Criteria → Testing (unit/integration/
   e2e) — be surfaced visually for humans-in-the-middle, in `agent-board` or
   a new board, the way traditional SDLC tooling does?
4. **What testing approaches does current research actually recommend** for
   this kind of agentic, AI-assisted development — beyond what's already
   written into Article 3?

## Decision Criteria (from framing, QA-critical)

An option is judged against these, in this order:

1. **No relabeling judgment as automation.** A mechanism only counts as
   "deterministic" if a tool/script/CI job enforces it with zero LLM
   involvement. The investigation found the law registry itself sometimes
   mislabels an LLM-interpreted `SKILL.md` as "automated" — any design
   proposed here must not repeat that mistake (LAW-1.4).
2. **Evidence-based, not security-theater.** A fresh-session or mutation-
   testing proposal must be justified by what the research in `findings.md`
   actually shows works — including its limits (same-model-family bias
   persisting across sessions; mutation-score calibration needing a real
   pilot, not a guessed threshold) — not by "this sounds more rigorous."
3. **Reuses `agent-board`'s existing architecture.** Any traceability
   dashboard is a new tab on the existing read-only, best-effort, JSONL-
   event-log pattern (LAW-1.3, LAW-4.6) — not a parallel system.
4. **Proportional, not universal.** Not every workflow stage needs the
   heaviest mechanism. WF-BUG's one-line fix and WF-FEATURE's `code-review`
   gate are not the same risk level (LAW-1.4).
5. **Traces back to a real exit code, not a self-report.** Any pass/fail
   status shown to a human must originate from an actual deterministic test
   run, mirroring how `agent-board`'s Token & Cost tab already pulls from
   real transcripts rather than an agent's own summary — otherwise the
   dashboard is a confidence-inspiring UI around the same unverified
   self-report problem it's meant to fix.

## Out of Scope

- Rewriting `laws/registry.json`'s enforcement-mechanism schema — a
  cross-cutting change of that size is its own WF-AMENDMENT, not a side
  effect of this spike.
- Actually implementing a StrykerJS CI job, a workflow-orchestrator subagent
  handoff, or new `agent-board` event fields — all are named as concrete,
  scoped follow-on WF-FEATURE candidates in `design.md`, not built here.
- Choosing a second-model-family reviewer vendor (if that option is ever
  prioritized) — flagged as the most rigorous and most expensive option for
  the highest-risk gates only; vendor selection is a future decision.

## Bearing Laws

LAW-1.3 (Consistency — one `agent-board`, not a parallel traceability
system), LAW-1.4 (Intentional Architecture — proportional, evidence-based
choices, and the "don't mislabel judgment as automation" principle this
spike holds itself to), LAW-3.1/3.2 (TDD, coverage floors — the existing
deterministic baseline), LAW-3.5 (No Hollow Tests — the problem LAW-3.6 was
designed, but not yet built, to catch), LAW-3.6 (Mutation Testing — found
unimplemented, see `findings.md`), LAW-4.6 (Resilience — traceability stays
best-effort, never a dependency of correctness), LAW-6.1 (Two Approvals —
found to be a real gate whose own violation example shows it passing while
violating its intent), LAW-7.3 (AI Audit Trail — the `[Claude-assisted]` tag
found to be trust-only, not CI-checked), LAW-7.4 (Identical Standards — the
exact circularity this spike investigates), LAW-7.5 (Escalate on Uncertainty
— found to have no deterministic backstop), LAW-10.1 (Spec-Driven Agent Work
— this document), LAW-10.2 (Verifiable Completion — found to rely on
unverified self-reported evidence), LAW-10.5 (Fresh-Context Review — found
to be asserted in law text but unimplemented in the orchestrator), LAW-10.6
(Defined Workflows).

## Decision Record

**Not yet made.** `prioritize` (Product Owner, hard, human checkpoint) is the
user's call: select, sequence, or decline any option in `design.md`. This
document plus `findings.md` and `design.md` are the complete
framing/investigate/ideate record.
