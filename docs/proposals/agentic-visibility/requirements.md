# Requirements: Enterprise Multi-Team Scaling & Agentic Workflow Visibility

**Persona:** Product Owner · **Workflow:** WF-RESEARCH v1.0 (framing/prioritize stages) · **Status:** ACCEPTED (prioritize stage, human decision recorded 2026-10-05)
**Feeds:** WF-FEATURE for the CRM reference implementation; WF-AMENDMENT for AMD-2026-011

## Problem Statement

Leadership wants the Engineering Constitution to scale from single-team adoption to
multiple scrum teams working on different subsystems of the same application,
without each team's practice of it drifting into something unrecognizable — and
wants managers to be able to *see* that agentic work is happening correctly across
teams, not just trust that it is.

## Decision Criteria (from framing)

An acceptable solution:
1. Does not fork the core reasoning — laws, personas, and workflows stay one
   source of truth, not per-team copies (LAW-1.3).
2. Gives managers real visibility into in-flight agentic work (stage, blockers,
   deviations) without reading every PR by hand.
3. Keeps protected data internal (LAW-7.2) — no workflow payload (code, customer
   data, secrets) leaves the organization's control.
4. Builds on what this repository already has (`memory-service/`) rather than
   standing up a parallel system.
5. Treats any new tool/vendor as a swappable consumer, not as the system of
   record — subjected to ordinary LAW-9.3/9.4 cost and license review.

## Acceptance Criteria

### AC1 — Cross-team stage visibility
A manager can see, in one place, which workflow stage every active work item
across participating teams is currently in (stage id, persona, elapsed time),
without opening individual PRs or tickets.
- **Verification:** demo dashboard shows ≥2 concurrent work items from ≥2
  distinct projects/teams with correct current-stage state within 5s of a stage
  transition event being emitted.

### AC2 — Blocked/awaiting-approval visibility
A manager can distinguish a work item sitting at a `human_checkpoint: required`
stage (awaiting a human decision) from one actively in progress.
- **Verification:** a work item at a required-checkpoint stage renders with a
  distinct "awaiting approval" state in the dashboard, matching the stage's
  `human_checkpoint` field in the workflow definition.

### AC3 — Centrally queryable, cited decisions
Every decision and deviation recorded by any team is queryable centrally with its
law citation(s) intact; no decision exists in the central log without ≥1
`LAW-X.Y` citation (extends the existing memory-service invariant across teams).
- **Verification:** `query_decisions`-equivalent against the central service
  returns decisions from more than one team/project, each with `lawCitations`
  present and non-empty.

### AC4 — Vendor-neutral event model
The underlying event/data model is independent of any specific dashboard.
Swapping the UI (e.g., Multica for another tool) requires writing a new adapter
only — no change to how teams' workflow-orchestrator instances emit events.
- **Verification:** design names a stable event schema (Layer 2) and a separable
  adapter interface (Layer 3); the demo's Multica adapter is the only
  Multica-specific code in the system.

### AC5 — Visibility cannot weaken a gate
The visibility layer is read/observe-only. It cannot approve, skip, or soften
any gate — Security veto, LAW-6.1/6.2 review gates, LAW-8.1 acceptance criteria,
LAW-3.1's TDD guardrail, LAW-9.2/9.6 release gates remain enforced exactly as
today, entirely independent of whether the visibility layer is installed,
reachable, or even exists.
- **Verification:** design documents the event flow as one-directional
  (team → central service → UI); no code path exists from the UI or adapter back
  into gate enforcement or workflow-orchestrator decision logic.

### AC6 — No forked constitution
Each team continues to install and run the identical constitution (laws,
personas, workflows) via the existing `scripts/install.sh` / plugin mechanism.
This initiative adds an observability layer; it does not change the
single-catalog distribution model.
- **Verification:** no changes proposed to `scripts/install.sh`, `laws/registry.json`,
  or `workflows/registry.json` as part of this initiative (AMD-2026-011 is a
  separate, explicit, reviewed exception to "no new laws without amendment").

### AC7 — Recorded practice deviation (conditional on AMD-2026-011)
Teams may deviate from non-hard practice choices (architectural pattern
selection beyond LAW-4.4's sanctioned list, workflow sequencing beyond
LAW-10.6's existing stage-level hard/soft split, tool choices not already fixed
by LAW-1.3) with recorded rationale; recurring deviations across teams surface
as candidate amendments rather than silently repeating.
- **Verification:** contingent on AMD-2026-011 reaching `APPROVED`/`ENACTED`.
  If rejected, this AC is dropped and the status quo (LAW-1.3 as written, zero
  exceptions) stands without a tooling gap — AC1–AC6 do not depend on AC7.

## In-Scope Edge Cases

- A team has zero active work items — dashboard renders empty, not an error.
- A work item spans two teams (cross-team persona-council invoked) — appears
  attributed to both teams' views.
- The central service is unreachable — each team's own local workflow execution
  and gate enforcement are **unaffected** (AC5); the dashboard shows a visible
  "stale/disconnected" state rather than silently showing wrong data.

## Out of Scope

- Replacing memory-service's existing law/decision tool set (`look_up_law`,
  `list_laws`, `get_workflow`, `get_amendment_history`) — unchanged.
- Production-grade multi-tenant auth for the dashboard — the reference
  implementation runs as a single shared instance behind existing network
  controls; a hardened auth model is a follow-on WF-FEATURE if this proceeds
  past reference-implementation stage.
- The CRM sample application's own business requirements — those are written
  separately, by the Product Owner persona, as the `requirements` stage of its
  own WF-FEATURE run (this document only sets up the workflow/visibility
  scaffolding the CRM demo will be executed and observed through).

## Bearing Laws

LAW-1.3 (Consistency Enables Collaboration — AC6), LAW-4.1 (Layered Architecture —
domain placement of the new components), LAW-4.5 (ADR Requirement — new shared
infrastructure, see `docs/adr/0002-...`), LAW-7.2 (Data Protection), LAW-7.3 (AI
Audit Trail — this is what the event stream makes aggregatable), LAW-7.6
(AI-Era Code-Health Metrics — the per-release-per-project metric this initiative
makes roll-up-able), LAW-9.5/9.6 (SLO/Error Budget — same rollup need), LAW-10.1
(Spec-Driven Agent Work — this document is that spec), LAW-10.6 (Defined
Workflows — the stage/deviation model this is built on), proposed LAW-1.6
(AMD-2026-011, conditional — AC7 only).

## Decision Record

Prioritized 2026-10-05 per WF-RESEARCH's `prioritize` stage (hard, human
checkpoint). Selected: visibility architecture Option A3 (memory-service as
system of record, Multica as the demo's concrete UI consumer via adapter;
general documentation stays tool-agnostic), governance Option B2+B3 (Golden
Paths drafted as a real amendment, AMD-2026-011), CRM demo Option C1 (full
WF-FEATURE execution with real working code). Approved by: P. Polkampalli,
2026-10-05.
