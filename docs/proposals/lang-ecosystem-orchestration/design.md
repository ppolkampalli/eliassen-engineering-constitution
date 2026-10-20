# Design: Options for Introducing Lang-Family Tooling

**Persona:** Architect · **Workflow:** WF-RESEARCH v1.0 (ideate stage)
**Entry:** `findings.md` · **Gates:** LAW-1.4, LAW-4.4, LAW-9.3, LAW-9.4
**Status:** Options only. `prioritize` (Product Owner, hard, human checkpoint
required) has not run — nothing here is selected, sequenced, or declined yet.

## What Today's Model Actually Does (baseline, for comparison)

`skills/workflow-orchestrator/SKILL.md` is executed by a single LLM agent, in
one continuous session, reading `workflows/WF-*.md` as prose:

- Stage sequencing, hard-gate checks, and human-checkpoint stops are **LLM
  judgment calls**, re-derived from the prose every time, not state held in a
  typed object.
- There is no checkpointed, resumable execution state: if a session ends
  mid-workflow (e.g., stopped at a `human_checkpoint: required` stage for
  days), resuming means a human or agent re-reads the conversation/board
  event log and re-establishes context — there is no `thread_id` to resume
  against directly.
- `agent-board`'s JSONL event log (and `memory-service`'s decision log) is
  the audit trail — append-only, self-hosted, free, already satisfying
  LAW-7.3.

This baseline is the thing every option below is compared against, not an
abstract ideal.

## Concrete Mapping: WF-BUG Through a LangGraph Lens

WF-BUG is the smallest workflow (`workflows/WF-BUG.md`: `software-engineer
(reproduce-and-fix*) -> quality(verify*) -> [unresolved: product-owner
(resolve-or-escalate+human)]`) — useful as the concrete example since any
pilot (Option B below) would start here.

| WF-BUG concept | LangGraph equivalent | Fit |
|---|---|---|
| Stage (`reproduce-and-fix`) | A node (a function/LLM call with typed input/output) | Direct |
| `hard: true` | No conditional edge bypasses this node; graph structurally cannot skip it | **Stronger** than today — today "hard" is enforced by the agent choosing to refuse, per SKILL.md §3; in a graph it's structurally absent as a path |
| `human_checkpoint: required` | `interrupt()` + a human later calling `Command(resume=...)` | Direct, and durable — the checkpointer persists the wait indefinitely |
| Conversational deviation (skip a soft stage, with recorded rationale) | A conditional edge whose condition is evaluated in code | **Weaker** fit — today's deviation logic is itself prose judgment ("inspect the diff for Article-5 surface"); encoding that as a precise boolean edge condition is real engineering work, not a lift-and-shift |
| `agent-board` event emission | A node that calls `record_stage_event` (or writes the JSONL line) | Direct — same event, different trigger point |
| Persona-council escalation | Not a LangGraph concept — would be a human-reviewed edge or an external call | No native equivalent; stays a human/agent judgment call either way |

The honest read: the *state machine and human-gate* parts of this model map
unusually well onto LangGraph. The *judgment-call* parts (deviation
validation, persona-council escalation, "is this diff touching an Article-5
surface") do not — those depend on an LLM reasoning over unstructured content
in ways a typed graph edge does not replace, only wrap.

## Options

### Option A — Status quo; revisit on a concrete trigger

Do nothing now. Keep `workflow-orchestrator` exactly as is. Revisit only if a
real incident occurs — e.g., a multi-day human-checkpoint wait loses context
because no one preserved it.

- **Cost:** $0. **Risk:** $0 engineering risk.
- **Against criterion 2** (real capability gap): the gap is real (no durable
  resume) but currently theoretical — no incident has actually occurred.
- **Verdict:** safest; defers the capability gap until it costs something
  concrete.

### Option B — Narrow pilot: LangGraph as a durable wrapper for WF-BUG only

Wrap WF-BUG's three stages as LangGraph nodes with a checkpointer (SQLite is
sufficient for one project). The LLM persona reasoning inside each node is
**unchanged** — still an LLM call doing the stage's actual work — only the
sequencing/pause/resume mechanics move into the graph. `human_checkpoint:
required` at `resolve-or-escalate` becomes a real `interrupt()`.
`agent-board` keeps receiving the same events, now emitted from graph nodes
instead of SKILL.md prose steps.

- **Cost:** low — WF-BUG has 2-3 stages; per `findings.md`'s 2-4-week figure
  (for a full nontrivial workflow with many conditional edges), a 3-stage
  pilot is meaningfully smaller. Self-hosted, MIT, $0 licensing (LAW-9.4
  clean). No LangSmith dependency — the existing event log remains the audit
  trail (criterion 3 satisfied).
- **Risk:** new runtime to operate (a long-running process or scheduled
  resumer, not just "an agent in a terminal") — a real LAW-9.1/9.2 ops
  question: who restarts it, where does the checkpoint DB live, who's on call.
- **Verdict:** best match against the decision criteria as stated — bounded,
  justified by the one real gap, no new vendor lock-in, cheap enough to
  actually try.

### Option C — Full migration: every `workflows/WF-*.md` becomes a LangGraph graph

Re-implement WF-FEATURE, WF-BUG, WF-SECBUG, WF-RESEARCH, WF-REFACTOR as typed
graphs; hard gates become structural; add LangSmith for tracing/audit.

- **Cost:** high — per `findings.md`, multiple weeks per workflow, plus
  standing up and operating a production service (LAW-9.1/9.2/9.5: this now
  needs an SLO, an error budget, a deploy plan, rollback). LangSmith adds a
  recurring paid dependency for the observability layer that the existing
  free event log already covers for free (criterion 3 violated unless
  LangSmith is explicitly scoped as *additive* tracing, not a *replacement*
  audit trail).
- **Risk:** the deviation/escalation judgment calls (see mapping table above)
  don't disappear — they move into code that now has to *approximate* LLM
  judgment with boolean conditions, which risks becoming less faithful to
  LAW-7.5's "escalate on uncertainty" than today's actual LLM re-reading the
  prose fresh each time.
- **Verdict:** fails criterion 4 (bounded blast radius) outright; not
  recommended as a first move regardless of its other merits.

### Option D — LangFlow as a visualization/demo canvas only, no execution change

Use LangFlow purely to render workflow graphs visually (e.g., for the
manager-visibility conversation from the earlier Multica.ai discussion) —
production execution stays exactly as it is today, prose-governed.

- **Cost:** low — MIT, self-hostable even post-IBM-acquisition, no execution
  risk since nothing about how workflows actually run changes.
- **Risk:** doesn't address the orchestration-durability question at all —
  it's a demo/prototyping tool, not a runtime. Also **overlaps** with the
  already-prioritized `docs/proposals/agentic-visibility/` (Multica) work —
  two visualization tools solving adjacent problems is a real redundancy risk
  worth naming, not quietly accepting.
- **Verdict:** only worth pursuing if Multica's adapter approach stalls or a
  stakeholder specifically wants a LangFlow-style canvas; otherwise this adds
  a second visibility tool next to one already prioritized and in progress.

## Persona-Council-Style Review (condensed)

```
Articles affected: 1 (Foundational), 4 (Architecture), 7 (AI Governance),
9 (Operations/Cost) | Personas: architect, security, finops, devops

== Architect ==
FINDING [ADVISORY]: Option B's node/edge mapping is sound for the
state-machine portion of a workflow; the judgment-call portion (deviations,
persona-council escalation) has no clean LangGraph equivalent and must stay
LLM-reasoned regardless of which option is chosen.

== Security ==
FINDING [ADVISORY, not blocking — no option proposes handling secrets/PII
differently]: if LangSmith is ever adopted (Option C), trace payloads would
need the same metadata-only allowlist already designed for the Multica
visibility layer (LAW-7.2) before any real workflow content reaches a
third-party SaaS. Not evaluated in depth here per requirements.md's
explicit out-of-scope.

== FinOps ==
FINDING [ADVISORY]: LangGraph/LangChain/LangFlow are MIT — pre-approved,
LAW-9.4 clean. LangSmith is closed-source commercial SaaS — not a license
flag, but a LAW-9.3 cost-review item if and when it's actually proposed;
not proposed by Option A, B, or D.

== DevOps ==
FINDING [ADVISORY]: Options B and C both introduce a new long-running
process (checkpointed graph runtime) where today there is none — an agent
session starting and ending is the entire "runtime" today. Any option
beyond A needs an explicit LAW-9.1/9.2 answer for where that process lives
and who operates it, even for a single-workflow pilot.

== CONFLICTS ==
None — no persona found a blocking issue with any option; Security and
FinOps's notes are deferred-scope flags, not objections to this document.

== COUNCIL VERDICT (advisory only — prioritize is the user's call)==
If this proceeds, Option B is the only option that passes all five
decision criteria from requirements.md without a flagged violation.
```

## Consequences (if, and only if, Option B is later prioritized)

- **New:** a small pilot package, its own checkpointer DB file, a
  `thread_id`-per-work-item convention, an LAW-4.5 ADR (this *would* be a
  structurally significant addition — a new runtime, not a config change).
- **Unchanged:** `workflows/WF-FEATURE.md`, `WF-SECBUG.md`, `WF-RESEARCH.md`,
  `WF-REFACTOR.md`, `agent-board`, `memory-service` — none of them are
  touched by a WF-BUG-only pilot.
- **Follow-up work, not started:** a real LAW-9.1/9.2 ops answer (where the
  checkpointer DB lives, backup/restore), and — only if the pilot succeeds
  and a *further* decision is made to expand — the harder judgment-call
  mapping problem (deviations, persona-council) for any workflow beyond
  WF-BUG.

## Next Step

None, pending the user. This document, `findings.md`, and `requirements.md`
are the complete framing/investigate/ideate record. `prioritize` is a
separate, explicit, future decision — select one option (or none), decline,
or defer further, with rationale recorded back into `requirements.md`'s
Decision Record when that happens.
