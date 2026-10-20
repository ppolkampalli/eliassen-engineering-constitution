# Requirements: Lang-Family Tooling for Agentic Workflow Orchestration

**Persona:** Product Owner · **Workflow:** WF-RESEARCH v1.0 (framing stage)
**Status:** FRAMED — investigate (`findings.md`) and ideate (`design.md`) complete.
**`prioritize` (hard, human checkpoint) has NOT run.** This document and its
companions are a research spike only — no adoption decision has been made,
and nothing about today's workflow-orchestrator execution model changes as a
result of this spike existing.

## Problem Statement

The constitution's workflows (`workflows/WF-*.md`) are executed today entirely
by an LLM agent reading prose instructions (`skills/workflow-orchestrator/
SKILL.md`) and interpreting them turn by turn in one continuous session: stage
sequencing, hard-gate enforcement, human-checkpoint stops, and deviation
validation are all LLM judgment calls, not code. This works, and has shipped
real output (the CRM reference implementation, `agent-board`'s event log).
The user wants to know whether the "Lang" ecosystem (LangGraph, LangChain,
LangFlow, LangSmith) offers something this model is genuinely missing —
specifically durable, code-enforced execution for multi-stage, multi-persona,
human-gated workflows — and if so, how it could be introduced *without*
losing or disrupting what already works.

## Decision Criteria (from framing)

An option is judged against these, in order:

1. **Additive, not disruptive.** The existing prose-governed
   `workflow-orchestrator`, `agent-board`, and the CRM reference
   implementation keep working unmodified unless a *separate, explicit*
   decision later replaces them. This spike produces options, not a cutover.
2. **Justified by a real capability gap**, not novelty. "Durable resume
   across a process/session restart" is a genuine gap in today's model
   (see `findings.md`) — any option must trace back to a gap like that, not
   to "this is a popular framework."
3. **No new single point of vendor lock-in for the audit trail.** LAW-7.3 is
   already satisfied by the existing append-only event log
   (`agent-board`/`memory-service`). Any option that makes a closed-source
   commercial SaaS (LangSmith) the *only* copy of that record is a
   regression, not an enhancement.
4. **Bounded blast radius if adopted.** A pilot scoped to one workflow (the
   smallest — WF-BUG) beats a wholesale rewrite of every `workflows/WF-*.md`
   file, per LAW-1.4's "name trade-offs" and ordinary risk management.
5. **Passes ordinary cost/license review** (LAW-9.3, LAW-9.4) before any
   dependency — including a SaaS dependency — is adopted.

## Out of Scope

- Any code change in this spike. `design.md`'s options are proposals for a
  *future*, separately-approved WF-FEATURE — none are implemented here.
- Replacing `agent-board` or the `docs/proposals/agentic-visibility/`
  Multica-based design. That initiative is prioritized and already in its
  own CRM-demo execution; this spike evaluates a different, overlapping
  concern (execution durability, not visibility) and `design.md` flags the
  overlap risk explicitly rather than silently duplicating it.
- A security review of LangSmith's data-handling practices — deferred to if
  and when an option involving it is actually prioritized (LAW-7.2 would
  govern that review).

## Bearing Laws

LAW-1.3 (Consistency — no forked, per-workflow execution dialects), LAW-1.4
(Intentional Architecture — trade-offs named explicitly, this document),
LAW-4.4 (Sanctioned Patterns — Strategy applies if a pluggable execution
backend is ever built), LAW-6.1/6.2 (hard gates — whether code-enforced
gating is a real strengthening or just a different trust boundary), LAW-7.1
(Human Accountability — `interrupt()`/`Command(resume=...)` is a strong
technical match for "agents never self-approve"), LAW-7.3 (AI Audit Trail —
overlap/redundancy risk against the existing event log), LAW-7.5 (Escalate on
Uncertainty — why this stops before `prioritize`), LAW-9.3 (Cost Review),
LAW-9.4 (License Compliance — LangGraph/LangChain/LangFlow are MIT,
pre-approved; LangSmith is closed-source commercial SaaS, a cost/vendor
question under LAW-9.3 rather than a LAW-9.4 copyleft flag), LAW-10.1
(Spec-Driven Agent Work — this document is that spec), LAW-10.6 (Defined
Workflows — the process-vs.-code distinction this spike is actually about).

## Decision Record

**Not yet made.** Per WF-RESEARCH's `prioritize` stage (hard, human
checkpoint required), only the user may select, sequence, or decline the
options in `design.md`. This document and `findings.md`/`design.md` are the
complete record of framing/investigate/ideate, held here for exactly this
purpose: so the research isn't lost, and a future decision has real material
to start from instead of re-deriving it.
