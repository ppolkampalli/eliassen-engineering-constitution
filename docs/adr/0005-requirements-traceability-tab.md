# ADR-0005: Requirements Traceability Tab for agent-board

- **Status:** ACCEPTED
- **Date:** 2026-10-20
- **Deciders:** P. Polkampalli (prioritize decision); Architect + Quality
  personas (design)
- **Work item:** `docs/proposals/agentic-quality-assurance/` (WF-RESEARCH
  spike) → this ADR, Option 3A selected

## Context

The research spike at `docs/proposals/agentic-quality-assurance/` found
`agent-board`'s event schema has a free-text `detail` field that *can* hold
Acceptance Criteria text or a test list as an unstructured blob, but has no
structured way to answer "does this specific AC have a specific passing
test" — tracing that today requires a human reading free-text blobs across
separate stage events and matching them by eye. The user asked for the
traditional SDLC pipeline (Product Requirement → Requirements Mapping →
Acceptance Criteria → Testing) to be visible in the dashboard. This is a
structurally significant, additive change to the shared event schema every
`agent-board` tab reads — warranting its own ADR per LAW-4.5, as flagged in
`design.md`'s own Consequences section when the option was still
hypothetical.

The spike's own QA-persona critique of this exact option is the sharpest in
that document: a structured traceability matrix is only as honest as what
populates it. If the field showing "AC-1: pass" is populated by an LLM's own
narrative belief rather than a real test-runner exit code, the dashboard is
"a more elaborate way to display the exact problem this spike started from"
— visibility dressed as correctness.

## Options Considered

### Option A — Status quo (`detail` free-text blob only)
- Consequences: zero cost, but doesn't meet the user's explicit ask for "a
  mapping" — a human still reads prose and matches it by eye.

### Option B — Structured schema on the existing event envelope, additive only
- Consequences: two new optional `stageEvent` fields
  (`acceptanceCriteria`, `testResults`) ride on the existing
  `GET /api/events` response — no new server route, no new endpoint, no
  breaking change to any existing consumer. Requires a corresponding
  `workflow-orchestrator/SKILL.md` emission contract (a prose instruction,
  not a code-level guarantee) and a new `agent-board` tab to render it.
  `shtracer`'s markdown-tag precedent (cited in `findings.md`) confirms this
  lightweight, log-based approach over a heavyweight ALM tool (Jama,
  Polarion) is proven elsewhere.

### Option C — Heavyweight dedicated traceability service/database
- Consequences: likely more queryable at scale, but violates this project's
  established "no parallel system" posture (LAW-1.3) and its scope (a local,
  single-project, zero-new-dependency tool) — rejected without a concrete
  driving need for scale this project doesn't have.

## Decision

**Option B.** Two new optional fields on `StageEvent`
(`agent-board/src/lib/types.ts`):

```ts
acceptanceCriteria?: { id: string; text: string }[];
testResults?: { acId: string; testId: string; testType: 'unit' | 'integration' | 'e2e'; status: 'pass' | 'fail' | 'pending' }[];
```

A new pure join (`src/lib/traceability-model.ts`): the latest declared AC
set for a work item, merged test results (a later event overriding an
earlier one for the same `acId`+`testId`), and the AC-to-results join
itself. A new tab (`src/components/traceability-board.tsx`): work-item
selector → AC left-nav → per-type test-result matrix, mirroring the
existing nav+pane pattern from the ADR Records tab.

**The honesty requirement is the load-bearing part of this decision, not an
afterthought**: `skills/workflow-orchestrator/SKILL.md` now states
explicitly that `testResults[].status` must be populated only by parsing a
real test-runner's machine-readable output (e.g. `jest --json`), never from
a self-reported narrative claim — and documents a concrete mapping
convention (`[AC-n]`-tagged test descriptions) so a real test result can be
traced back to the AC it verifies without guessing.

## Consequences

- **New:** two optional `StageEvent` fields (additive, no breaking change —
  existing event logs without them parse exactly as before), `src/lib/
  traceability-model.ts` (100% coverage), `src/components/
  traceability-board.tsx` (95.34%/86.36% coverage, above the 70% floor), a
  5th `agent-board` tab, a new "Traceability fields" subsection in
  `workflow-orchestrator/SKILL.md` §6.
- **Unchanged:** every existing event field, every other tab, the server
  (`GET /api/events` returns the same response shape — new fields are just
  present on some events now).
- **Risk accepted, stated plainly**: this tab cannot itself verify that the
  fields it renders are honest — that depends entirely on
  `workflow-orchestrator` (an LLM following prose) actually parsing real
  test output rather than narrating. This is the same category of
  limitation the spike's internal audit found across most of Article 10: a
  stronger *design* (the convention is now precise and auditable), not a
  deterministic *guarantee*. A future amendment could add a mechanical
  check (e.g., a script that flags a `testResults` entry with no
  corresponding CI artifact) — not attempted here.
- **Follow-up, not started:** no fixture or fixture-table entry was added
  for this feature (both the pure-function tests and the component/
  integration tests use inline literal event objects, matching
  `markdown-model.spec.ts`'s established precedent for pure-logic testing);
  a hand-written demo log can still be pointed at via `AGENT_BOARD_LOG` per
  `agent-board/README.md`'s "Traceability tab" section.

## Laws Considered

- [LAW-4.5 v1.0] — this ADR itself, triggered by a structural change to the
  shared event schema every tab reads.
- [LAW-1.3 v1.0] — consistency: Option C (a parallel traceability system)
  was rejected in favor of extending the existing single event log.
- [LAW-3.5 v1.0] / [LAW-10.2 v1.0] — the honesty requirement directly
  answers the "no hollow tests" / "verifiable completion" concern the whole
  spike investigates: a `testResults` field is only as good as the real
  exit code behind it.
- [LAW-7.4 v1.0] — "verify, never assume," operationalized here as a
  concrete parsing/tagging convention rather than a general exhortation.
- [LAW-3.2 v1.0] — new code held to the existing coverage floors:
  `traceability-model.ts` at 100% (src/lib), `traceability-board.tsx` above
  the 70% components floor.

## Addendum (2026-10-20): `testFile` and one-to-many rendering

User feedback on the first working version: the one-AC-to-many-tests
relationship was already correct in the data model (`TestResult.acId` plus
grouping), but the original chip-row rendering crowded multiple tests
together, and there was no way to tell *which file* a given test lived in
for a reviewer to go check it. Added `TestResult.testFile?: string`
(additive, optional — omitted for a `status: 'pending'` test that doesn't
exist yet to point at) and redesigned the matrix pane to list every test as
its own row (status chip + test name + file path caption), not inline
chips. No change to the Decision above — this is a refinement within the
same schema and tab, not a new structural choice.
