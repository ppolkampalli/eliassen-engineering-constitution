# Design: Deterministic Gates, Session-Boundary Architecture, and a Traceability Dashboard

**Persona:** Architect, with Quality/QA as the driving critical lens
throughout (per the user's explicit framing of quality as this session's
core pillar — every option below gets a QA critique, not just a sign-off)
**Workflow:** WF-RESEARCH v1.0 (ideate stage)
**Entry:** `findings.md` · **Gates:** LAW-1.3, LAW-1.4, LAW-3.6, LAW-4.6,
LAW-10.5
**Status:** Options only. `prioritize` has not run — nothing here is
selected, sequenced, or declined yet.

This answers the user's four questions as three concrete sub-designs, plus a
direct testing-approach recommendation, each closed with a QA-persona
critique of its own proposal — because a design that only argues for itself
is exactly the self-grading problem this spike investigates.

---

## Sub-Design 1 — Closing the Deterministic Gaps That Actually Matter

**Not proposing to make all 57 laws deterministic.** Article 8 (Requirements
& Domain) is irreducibly judgment-based — "is this acceptance criterion
complete" is a business question, not a thing a linter can check, and
pretending otherwise would violate this spike's own decision criterion 1 (no
relabeling judgment as automation). The target is narrower and sharper:
**the two mechanisms this constitution already designed for the self-grading
problem, but never built.**

### Option 1A — Pilot StrykerJS mutation testing on `agent-board/src/lib/` — **SELECTED AND PILOTED, 2026-10-20**

LAW-3.6 already specifies Stryker and already says "JS/TS calibration is
pending pilot" (`findings.md` Part A). `agent-board/src/lib/` is the natural
pilot target: it's the one directory already held to 100% coverage, so a
mutation score baseline there is meaningful rather than noise.
- **Cost:** low — `stryker.conf.json` + `@stryker-mutator/core`/
  `jest-runner` (Apache-2.0, LAW-9.4 clean), no new CI job (deliberately —
  see below).
- **What it catches:** the exact failure mode LAW-3.6 cites (coverage %
  high, mutation score near-zero, tests that run code without asserting
  anything real) — the deterministic complement to LAW-3.5's judgment-only
  "no hollow tests" review today.
- **Real result**: 92.22% mutation score, not near-zero — this repo's
  existing `src/lib/` tests are substantively real, not hollow, though not
  perfect (68 survived mutants across 5 files; `markdown-model.ts` lowest at
  85.79%). This is itself evidence *against* the worst-case self-grading
  failure mode for this specific codebase, while still surfacing concrete,
  individually-named gaps 100% coverage alone didn't show. Full breakdown:
  `agent-board/README.md`'s "Mutation testing pilot" section.
- **No CI gate added.** Per the QA critique below, `thresholds.break` is
  `null` — informational only, until a deliberate follow-up decision sets a
  real floor against this now-real baseline.

### Option 1B — CI check for the `[Claude-assisted]` commit tag

A one-line gap: LAW-7.3 requires the tag, nothing in CI verifies it. A grep
against commit messages in the PR-check workflow closes it cheaply.
- **Cost:** trivial. **Risk:** none — purely additive, catches an honesty
  lapse that's currently unenforced by anything but trust.

### Option 1C — Status quo

Leave both as designed-but-unimplemented. Lowest cost, but leaves the
single deterministic backstop this constitution already wrote for itself
sitting unused.

**QA critique of this sub-design:** a mutation-testing pilot can become
theater if a score threshold is set by guess rather than measurement — LAW-
3.6's own text says "pending pilot" for a reason; Option 1A must report a
*baseline* score first and set no blocking floor until that baseline exists,
or this sub-design repeats the exact mistake it's trying to fix (a number
that looks rigorous but was never calibrated against reality).

---

## Sub-Design 2 — Session-Boundary Architecture for Persona Handoffs

**Direct answer to "does single-session development skew toward assumed
success": yes**, per `findings.md`'s evidence (LAW-10.5's own rationale,
plus the 84%-false-positive and 55%→88% correctness findings). **Direct
answer to "do we need a new session for every handoff, and does that risk
losing the requirement": the evidence says fresh-context handoff helps but
is incomplete by itself** — same-model-family bias persists even with zero
shared context (`findings.md` finding 5) — and a naive "go re-read
everything" handoff risks exactly the false positive the user worried
about: a reviewer with no access to *why* a decision was made flags a
deliberate, correct choice as a defect, burning human time re-litigating
context that was deliberately withheld.

### Option 2A — Structured subagent handoff at LAW-10.5-gated stages — **SELECTED AND IMPLEMENTED, 2026-10-20**

`workflow-orchestrator/SKILL.md` already has the right primitive available
(the same Agent/subagent mechanism used to run this very research) — it's
just never instructed to use it. Proposal: at stages that are both
`hard: true` and `human_checkpoint: required` (today, that's exactly
WF-FEATURE's `code-review`), the orchestrator launches a **fresh subagent**
instead of an in-context persona role-switch, and passes it a **structured
payload, not the conversation**:
- The Acceptance Criteria (from the `requirements` stage's output)
- The diff
- The test list (from `test-definition`)
- **Not** the implementer's reasoning, chat history, or rationale

This mirrors Anthropic's own documented practice exactly (`findings.md`
finding 7: fresh subagent sees diff + criteria, not the writer's reasoning).
The structured payload is what prevents "losing the requirement" — the
reviewer still has the ACs and test list, just not the writer's self-
justification — while still achieving real independence from the writer's
confirmation bias.
- **Proportionality, corrected during implementation:** this sub-design
  originally scoped the trigger to stages that are `hard: true` AND
  `human_checkpoint: required`, which reads as WF-FEATURE's `code-review`
  only. Implementation found **WF-BUG's `verify` stage already explicitly
  gates on LAW-10.5** (`gates: [LAW-3.5, LAW-10.5]`) despite
  `human_checkpoint: none` — the correct, implemented trigger is "this
  stage's `gates` cites LAW-10.5," not the hard+required combination. See
  `docs/adr/0004-fresh-context-subagent-dispatch.md` for the full record of
  this correction.

**Implemented 2026-10-20** in `skills/workflow-orchestrator/SKILL.md` §2
step 3, applying today to WF-FEATURE's `code-review` and WF-BUG's `verify`
— both workflow files' narratives updated to name the real mechanism. Any
future stage whose `gates` cites LAW-10.5 triggers this automatically, with
no further orchestrator change needed.

### Option 2B — Second-model-family review for the highest-risk gates only

For stages where the diff touches Article-5 (security) surface — already
the point where WF-FEATURE's `security-review` auto-escalates to hard — add
a reviewer from a genuinely different model family, not just a fresh
session of the same one. This is the only option in this document that
responds to finding 5's family-bias result rather than finding 7's
fresh-context result; it is also the most expensive (a second vendor
relationship, cost review under LAW-9.3) and is proposed as a narrow
addition on top of 2A, not a replacement for it.

### Option 2C — Status quo (persona role-switch, same session)

No change. Cheapest, but leaves LAW-10.5 as unenforced prose exactly as
`findings.md` documents it today.

**QA critique of this sub-design:** structured-payload handoff (2A) is
itself unverified until it's actually tried — the claim that "ACs + diff +
test list is enough context to avoid false positives, but little enough to
avoid inheriting bias" is a hypothesis from this research, not yet a
measured result for *this* constitution's specific workflows. Recommend
piloting 2A on exactly one workflow (WF-BUG, the smallest, same candidate as
the earlier Lang-ecosystem spike's Option B) before extending it, and
explicitly tracking whether the fresh-subagent reviewer's findings are
real defects or context-loss false alarms — which is precisely what Sub-
Design 3's traceability data could measure, if built.

---

## Sub-Design 3 — Requirements Traceability Dashboard

Directly answers "can we map Product Requirement → AC → Testing for humans
in the middle": yes, as a new `agent-board` tab, following the exact same
read-only, best-effort, JSONL-event pattern every existing tab already uses
— not a new system (decision criterion 3).

### What's missing today (confirmed in `findings.md` Part A)

`agent-board`'s event schema has a free-text `detail` field that *can* hold
AC text or a test list as an unstructured blob, but has **no AC-id, no
test-id, no test-type, no pass/fail-per-AC field**, and no `eventType` for a
discrete test result at all. Today, tracing an AC to its test requires a
human reading free-text blobs across separate stage events and matching
them by eye.

### Option 3A — Structured schema + new "Traceability" tab

Extend the event schema, additive only (no breaking change to existing
fields):
- `requirements`/`test-definition` stage events gain an optional
  `acceptanceCriteria: { id: string, text: string }[]` field.
- `implement`/`code-review` stage events gain an optional
  `testResults: { acId: string, testId: string, testType: 'unit' |
  'integration' | 'e2e', status: 'pass' | 'fail' | 'pending' }[]` field.

New tab renders exactly the pipeline the user described: left nav = the
active work item's ACs; right pane = a matrix of unit/integration/e2e rows
per AC with pass/fail status. `shtracer`'s markdown-tag precedent
(`findings.md` finding 6) confirms this lightweight, log-based approach over
a heavyweight ALM tool is proven elsewhere, not a novel risk.

**Requires** a follow-on change to `workflow-orchestrator/SKILL.md` to
actually emit the new fields — not built in this spike, named here as the
scoped WF-FEATURE this would become if prioritized.

### Option 3B — Minimal version: structured sub-fields inside the existing `detail` blob

Cheaper: ask the orchestrator to format `detail` as parseable
`AC-1: <text>` / `TEST unit AC-1: pass` lines, parsed client-side with no
new event schema fields. Less clean, no `jest.config.js`-style schema
validation, but zero changes to the event envelope itself.

### Option 3C — Status quo

Keep `detail` as free text; humans keep reading it manually. Doesn't meet
the user's explicit ask for "a mapping," named only as the zero-cost
baseline.

**QA critique of this sub-design — the sharpest one in this document:** a
structured traceability matrix is only as honest as what populates it. If
`workflow-orchestrator` (an LLM) is still the one deciding a test "satisfies"
an AC and writing that belief into the event, the dashboard shows a
confident-looking matrix built on the same unverified self-report problem as
LAW-10.2 today — a visibility improvement dressed as a correctness
improvement. **The `testResults[].status` field must be populated from an
actual CI test-runner exit code** (unit/integration suites' real pass/fail,
e2e run results), **never from the agent's own narrative claim that a test
passed** — mirroring how `agent-board`'s Token & Cost tab already pulls real
numbers from transcripts rather than trusting a self-written summary. Without
this, Option 3A is a more elaborate way to display the exact problem this
whole spike started from.

---

## Testing Approaches — Direct Recommendation

Answering the user's fourth question concretely, mapped to what this repo
already has vs. what the research supports adding:

| Approach | Status in this repo | Recommendation |
|---|---|---|
| Unit (example-based) | Have it (Jest, 100%/90%/70%/80% floors) | Keep — the floor, not the ceiling |
| Property-based | Don't have it | **Add** for `src/lib/` pure functions specifically (e.g. `markdown-model.ts`, `board-model.ts`) — Hypothesis-style/`fast-check`; directly validated by Anthropic's own red-team precedent (`findings.md` finding 3) |
| Mutation testing | Designed (LAW-3.6), unimplemented | **Pilot** — Sub-Design 1, Option 1A |
| Contract testing | Not applicable yet | Defer — no external API boundary exists in this repo today; revisit if one is built |
| Golden-master/differential | Partially present (fixture-based parser tests already compare against known-good output, e.g. `markdown-model.spec.ts`) | Formalize the pattern explicitly for any future parser/transform logic |
| Integration/E2E | Thin — Jest + Testing Library component tests only; manual browser verification for UI work (as done for the ADR Records tab) | **Gap** — no automated E2E tooling (e.g. Playwright) exists; flagged as a real hole, not evaluated further here (out of scope depth-wise for this spike) |
| LLM-as-judge (e.g. for grading subjective AC completeness) | Used informally today (persona review) | Use cautiously — `findings.md` finding 5's bias results apply directly; never the sole gate for anything currently marked `hard` |

---

## Consequences (if, and only if, options are later prioritized)

- **New (1A implemented):** a Stryker config + mutation-score baseline, no
  CI job yet (informational only). **If 1B chosen:** a commit-tag CI check,
  additive, no existing CI job removed or weakened.
- **New (2A implemented):** a scoped change to `workflow-orchestrator/
  SKILL.md` §2 and the `code-review`/`verify` stage narratives in
  `WF-FEATURE.md`/`WF-BUG.md` — a real, separately-reviewable change to the
  skill that drives every workflow, recorded in
  `docs/adr/0004-fresh-context-subagent-dispatch.md`.
- **New, if 3A chosen:** an event-schema extension (additive) + a new
  `agent-board` tab + a `workflow-orchestrator` emission change — the
  largest of the three sub-designs, warranting its own ADR per LAW-4.5 if
  prioritized (a structural change to the shared event schema).
- **Unchanged regardless:** every existing law, workflow file, and `agent-
  board` tab — this spike proposes additions, not replacements.

## Next Step

None, pending the user. `prioritize` is a separate, future, explicit
decision — select any subset of 1A/1B/2A/2B/3A/3B (or none), with rationale
recorded back into `requirements.md`'s Decision Record when that happens.
