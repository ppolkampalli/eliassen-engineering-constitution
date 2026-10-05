# ADR-0002: Host One Central Memory/Events Service Across Teams, With a Separate Vendor-Specific Visibility Adapter

- **Status:** PROPOSED
- **Date:** 2026-10-05
- **Deciders:** Architect persona (drafted), pending human review alongside `amendments/records/AMD-2026-011`
- **Work item:** `docs/proposals/agentic-visibility/` (requirements.md, design.md)

## Context

Multiple scrum teams now work on different subsystems of the same application,
each running the constitution independently. `memory-service/` already gives one
team a governed, cited, append-only decision log over MCP — but it is designed
to run one instance per project, local file, no cross-team visibility. Leadership
wants managers to see in-flight agentic work (stage, blockers, deviations) across
all teams without reading every PR. There is no existing aggregation point: today
that information only exists scattered across each team's PR descriptions and
tickets (LAW-7.3's provenance principle is honored per-work-item, but not
reachable in aggregate).

## Options Considered

### Option A — Point a commercial dashboard (Multica) directly at each team's events; it becomes the aggregation point
- Consequences: Fastest to a working UI. But the governed invariant this
  constitution cares about most — laws read-only, decisions append-only, cited —
  would live inside a vendor's database instead of this repo's tested code. Losing
  or switching the vendor would mean losing or migrating the actual record, not
  just the view of it.

### Option B — Build the full dashboard ourselves on `memory-service`, no third-party tool
- Consequences: Zero new vendor dependency; the governed core and the view stay
  in one codebase. Materially more build effort — task queues, blocker UX,
  real-time activity feed are all work `memory-service` doesn't do today and
  Multica already does.

### Option C (chosen) — `memory-service` hosted centrally becomes the system of record (new append-only event types, in addition to decisions); any dashboard (Multica for this reference implementation) is a separate, swappable adapter package that only reads the event stream
- Consequences: Preserves the one invariant that matters constitutionally
  (append-only, cited, laws read-only) independent of which UI is fashionable
  this year. Adds one new package (`visibility-adapter/`) and operational
  responsibility for hosting one shared service instead of N local ones. Slightly
  more moving parts than Option A, meaningfully less build effort than Option B.

## Decision

Adopt Option C. `memory-service` is extended with append-only stage/blocker
events (`record_stage_event`, `query_active_work`) alongside its existing
decision tools, and hosted as one shared instance teams point their MCP clients
at. A new, intentionally separate `visibility-adapter/` package translates that
event stream into a specific dashboard's model — Multica for this reference
implementation — so that retiring or swapping the dashboard never touches the
governed core.

## Consequences

- **Accepted cost:** operating one shared service (devops responsibility,
  LAW-9.1/9.2) instead of N local, zero-ops instances; a payload allowlist must
  be enforced so only workflow metadata crosses the boundary (see
  `design.md`'s "What Crosses the Boundary" section) — this is new code, not just
  policy.
- **Risk created:** a central service is a single point whose compromise exposes
  more than one team's data; the persona-council review in `design.md` flags this
  as PROCEED WITH REQUIRED FIXES, not a blocker, conditioned on the access-control
  and transport-encryption follow-ups being done before onboarding teams beyond
  the pilot.
- **Becomes easier:** org-wide rollups of code-health metrics (LAW-7.6) and
  SLO/error-budget state (LAW-9.5/9.6), currently only per-project per-release.
- **Becomes harder:** nothing new for an individual team's own workflow
  execution — Layer 1 (laws/workflows/personas) and gate enforcement are
  unchanged and do not depend on Layer 2 being reachable (design.md's resilience
  section).
- **Follow-up work (ticketed per LAW-1.2):** Multica license verification under
  LAW-9.4; central-service access-control implementation and review.

## Laws Considered

- [LAW-4.1 v1.1] — new shared infrastructure sits outside any business domain;
  placed as a sibling to `memory-service`, not inside a team's application.
- [LAW-4.4 v1.0] — the adapter uses the sanctioned Strategy pattern; no new
  pattern category introduced.
- [LAW-4.5 v1.0] — this ADR itself: new external infrastructure component,
  required before the implementing change merges.
- [LAW-4.6 v1.0] — resilience: Layer 2 unreachability must never affect Layer 1
  gating or merges.
- [LAW-7.2 v1.0] — data protection: payload allowlist (metadata only, never
  source/secrets/customer data) crossing into Layer 2/3.
- [LAW-9.3 v1.0] / [LAW-9.4 v1.0] — FinOps cost and license review of the
  Multica dependency, tracked as follow-up work, subordinate to Security per
  LAW-9.3.
