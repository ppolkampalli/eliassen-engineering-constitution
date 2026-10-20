# ADR-0004: Fresh-Context Subagent Dispatch for LAW-10.5-Gated Stages

- **Status:** ACCEPTED
- **Date:** 2026-10-20
- **Deciders:** P. Polkampalli (prioritize decision); Architect + Quality
  personas (design)
- **Work item:** `docs/proposals/agentic-quality-assurance/` (WF-RESEARCH
  spike) → this ADR, Option 2A selected

## Context

The research spike at `docs/proposals/agentic-quality-assurance/` audited
this repo's own enforcement mechanisms and found a gap between law text and
actual execution: **LAW-10.5 (Fresh-Context Review) already states that
"the implementing context never grades its own work"** and names a fresh
session/subagent as the mechanism — but `skills/workflow-orchestrator/
SKILL.md`, the file that actually drives stage-by-stage execution, had zero
instruction to ever spawn one. Every persona handoff, including
`code-review` (WF-FEATURE) and `verify` (WF-BUG) — the two stages that
explicitly cite LAW-10.5 as a gate — happened as an in-context persona
role-switch inside one continuous session. Compliance depended entirely on
whoever ran the workflow choosing, unprompted, to start a new session.

External research (`findings.md` in the same spike) corroborates the
underlying concern (self-confirmation bias, an 84% false-positive rate in
one self-critique study) but also found the fix is incomplete by itself:
same-model-family bias persists even across genuinely separate sessions
with zero shared context. The mitigation the evidence actually supports is
a **structured, limited handoff payload** (Anthropic's own Claude Code team
publishes exactly this: a fresh subagent sees only the diff and criteria,
never the writer's reasoning) — not merely "a new session," and not (for
this decision) a second model family, which is reserved as a narrower,
costlier option for the highest-risk stages only (Option 2B, not decided
here).

## Options Considered

### Option A — Status quo (persona role-switch, same session)
- Consequences: zero cost, but LAW-10.5 remains enforced-in-prose-only,
  exactly as the audit found it.

### Option B — Structured fresh-subagent dispatch, scoped to LAW-10.5-gated stages
- Consequences: closes the gap between law text and execution with a small,
  targeted change to one skill file. Requires the orchestrator (an LLM
  following `SKILL.md`) to correctly recognize when a stage's `gates`
  includes `LAW-10.5` and to actually dispatch — this is still LLM-followed
  prose, not a deterministic code gate (same category of limitation the
  audit found across most of Article 10); it is a real improvement in
  design, not a guarantee of code-level enforcement.

### Option C — Structured fresh-subagent dispatch for every stage, regardless of gates
- Consequences: maximal consistency, but violates the spike's own
  proportionality criterion (LAW-1.4) — most stages (e.g. WF-BUG's
  `reproduce-and-fix`) have no LAW-10.5 gate and no self-grading risk
  distinct from ordinary implementation; dispatching a subagent for every
  stage adds cost and latency with no corresponding evidence-based benefit.
  Rejected.

## Decision

**Option B.** `skills/workflow-orchestrator/SKILL.md` §2 now has a new step
3 ("Fresh-context dispatch"): any stage whose `gates` list includes
`LAW-10.5` is executed by a fresh subagent, handed only the Acceptance
Criteria, the diff, and the test list — never the implementing context's
reasoning or prior conversation.

**A correction made during implementation, worth recording**: the original
design doc (`design.md` Option 2A) proposed triggering this on stages that
are both `hard: true` and `human_checkpoint: required` — which, read
literally, matches only WF-FEATURE's `code-review`. Re-reading the actual
workflow files during implementation found that **WF-BUG's `verify` stage
already explicitly gates on LAW-10.5** (`gates: [LAW-3.5, LAW-10.5]`) despite
having `human_checkpoint: none` — its own narrative text already said "Fresh
context (LAW-10.5)" before this ADR, asserted exactly as unimplemented prose.
The precise, correct trigger is **"this stage's `gates` cites LAW-10.5,"
not "hard + human_checkpoint: required."** The latter was an
under-generalization discovered only by checking the actual catalog rather
than trusting the design doc's own example — exactly the "verify, don't
assume" discipline LAW-7.4 requires of AI-produced work, applied to this
work.

## Consequences

- **New:** `workflow-orchestrator/SKILL.md` §2 step 3 (fresh-context
  dispatch); narrative updates in `workflows/WF-FEATURE.md` (`code-review`)
  and `workflows/WF-BUG.md` (`verify`) naming the real mechanism instead of
  asserting it vaguely.
- **Unchanged:** the law text itself (LAW-10.5's statement and mechanism
  description were already accurate — they described intent correctly; only
  the orchestrator's execution was missing), every other workflow stage, and
  every other skill.
- **Risk accepted:** this remains enforcement-by-prose, not enforcement-by-
  code — an LLM orchestrator must correctly notice the `LAW-10.5` gate and
  choose to dispatch. It is a stronger design than before (the mechanism is
  now specified precisely enough to follow and to audit against), but it is
  not the deterministic backstop Article 10's laws mostly lack (see the same
  spike's Part A audit). A future amendment could make this check
  mechanical (e.g., a script that fails a PR if a LAW-10.5-gated stage's
  evidence trail shows no subagent dispatch record) — not attempted here.
- **Follow-up, not started:** Option 2B (second-model-family review for
  Article-5-touching diffs) remains a separate, undecided, costlier option.
  Extending this mechanism beyond WF-FEATURE/WF-BUG happens automatically
  only when a workflow author adds a `LAW-10.5` gate to a new stage — no
  further code/prose change is needed for that extension to take effect.

## Laws Considered

- [LAW-10.5 v1.0] — the law this ADR operationalizes; its statement and
  mechanism description are unchanged, only the orchestrator's compliance
  with them.
- [LAW-1.4 v1.0] — proportionality: Option C (dispatch for every stage) was
  rejected as disproportionate to the risk it addresses.
- [LAW-1.3 v1.0] — consistency: the trigger is a law citation already
  present in the org catalog's stage definitions, not a new parallel
  mechanism teams would need to adopt separately.
- [LAW-7.4 v1.0] — "verify, never assume": the correction from
  "hard + human_checkpoint: required" to "gates cites LAW-10.5" was found by
  checking the actual workflow files rather than trusting the design
  document's own worked example.
- [LAW-7.5 v1.0] — this remains prose-followed-by-an-LLM, not a deterministic
  gate; flagged honestly above as accepted risk, not claimed as solved.
- [LAW-10.6 v1.0] — workflow definitions change by ordinary PR review; this
  is exactly that kind of process change, not a law amendment (no
  `laws/registry.json` entry changes).
