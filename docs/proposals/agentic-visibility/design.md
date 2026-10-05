# Design: Enterprise Multi-Team Scaling & Agentic Workflow Visibility

**Persona:** Architect · **Workflow:** WF-RESEARCH v1.0 (ideate stage) → feeds WF-FEATURE
**Entry:** `requirements.md` (accepted 2026-10-05) · **ADR:** `docs/adr/0002-centralized-memory-service-and-visibility-adapter.md`
**Gates:** LAW-4.1, LAW-4.4, LAW-4.5, LAW-10.1

## Domain Placement

This is constitution-infrastructure, not a business domain of any consuming
project. Per LAW-4.1 applied to this repo itself: it lives as a sibling to
`memory-service/` (which already exists and already does part of this), not
inside any team's application code. Two new units, each a package with its own
tests:

```
memory-service/           # existing — gains new capability, not a new package
  src/
    decisions.ts          # existing — append-only decision log
    events.ts             # NEW — append-only stage/blocker event log
    server.ts             # existing MCP server — exposes the new tools below

visibility-adapter/       # NEW top-level package — intentionally separate
  src/
    event-source.ts       # subscribes to memory-service's event stream
    multica-adapter.ts    # translates events -> Multica's task/agent model
    adapter.ts            # the stable interface other adapters implement
```

Keeping `visibility-adapter/` as its own package (own `package.json`, own test
suite, own coverage floor per LAW-3.2) is deliberate: it is the only place any
vendor-specific code lives. Retiring or swapping Multica means deleting or
replacing this one package; `memory-service/` — the governed core — never
changes.

## The Three Layers

### Layer 1 — Constitution core (unchanged)
`laws/`, `workflows/`, `skills/persona-*`, installed identically into every
team's project via the existing `scripts/install.sh` / plugin mechanism. LAW-1.3
keeps this zero-exception. **This initiative does not touch Layer 1.**

### Layer 2 — Central Memory & Events Service (extends `memory-service/`)
Today `memory-service` runs one-per-project, local stdio, writing to a local
gitignored file. For multi-team visibility it is **hosted once**, and every
team's workflow-orchestrator/agent session points its MCP client at the shared
instance — the same `.mcp.json` wiring the README already documents, just
targeting a shared host instead of `./dist/server.js` on localhost.

New tools/events, additive to the existing six (`look_up_law`, `list_laws`,
`get_workflow`, `get_amendment_history`, `query_decisions`, `record_decision`):

| Tool | Purpose | Access |
|---|---|---|
| `record_stage_event` | Append a stage transition: `work_item`, `workflow_id`, `stage_id`, `persona`, `status` (`entered`\|`blocked`\|`complete`), `human_checkpoint` state | append |
| `query_active_work` | List work items with their current stage/status, filterable by team/project | read |

Same two invariants as today, extended: **laws stay read-only**; **events and
decisions stay append-only** — `record_stage_event` and `record_decision` never
overwrite a prior entry, matching `memory-service`'s existing enforcement (zod
validation, 100%-covered domain logic, LAW-3.2).

### Layer 3 — Visibility adapter + UI (Multica, for this reference implementation)
A small adapter subscribes to Layer 2's event stream and translates it into
whatever the UI expects. For this demo it targets Multica because its task
lifecycle (enqueue → claim → start → complete/fail) and blocker-reporting model
already map closely onto workflow-orchestrator's stage/gate/human-checkpoint
vocabulary:

| workflow-orchestrator concept | Multica concept |
|---|---|
| Stage entered, `hard: false` | Task claimed/started |
| Stage at `human_checkpoint: required` | Blocker reported |
| Stage complete, exit criteria met | Task complete |
| `WORKFLOW DEVIATION` record | Activity-feed entry, annotated |

**The event schema (Layer 2's `record_stage_event` payload shape) is the stable
interface.** General/org documentation describes this schema and the adapter
contract, not Multica specifics — swapping dashboards means writing a new
`src/<vendor>-adapter.ts` implementing `adapter.ts`'s interface; Layers 1 and 2
are untouched. This satisfies requirements.md AC4.

## What Crosses the Boundary (and What Never Does)

Per LAW-7.2 (data protection) and Article 5: event payloads carry workflow
**metadata** only — work-item id, workflow/stage id, persona, timestamp, law
citations, human-readable deviation rationale. They never carry source diffs,
file contents, customer data, or secrets. This is an explicit payload allowlist
(LAW-5.1's principle applied to an internal event, not just external input) and
is the single most important boundary in this design — the visibility layer
should be able to run on a laptop outside the org's deployment perimeter without
becoming a data-exfiltration path.

## Resilience (LAW-4.6)

Layer 2 is a new network dependency, but it must never become a dependency of
**correctness**. If the central service is unreachable:
- A team's local workflow execution, gate enforcement, and merges proceed
  exactly as if Layer 2 did not exist (requirements.md AC5).
- `record_stage_event`/`record_decision` calls get a bounded timeout + a local
  spool-and-retry (same durability the append-only log already implies); they
  never block the stage they're reporting on.
- The dashboard shows a visible "stale" indicator past a freshness threshold
  rather than silently rendering outdated state as current.

## Patterns (LAW-4.4)

`visibility-adapter`'s per-vendor adapter is the **Strategy** pattern (variant
behavior behind one interface) from the sanctioned list — no new pattern
category is introduced. The shared-service topology change itself (not a
pattern choice, a structural/infrastructure one) is what triggers the LAW-4.5
ADR — see `docs/adr/0002-...`.

## Persona Council Review (condensed — new shared infra + cost + security surface, per persona-council's convening criteria)

```
PERSONA COUNCIL REVIEW: Centralized memory/events service + visibility adapter
Articles affected: 4 (Architecture), 5 (Security), 9 (Operations/Cost) | Personas convened: architect, security, finops, devops

== Architect ==
FINDING [ADVISORY]: New shared infrastructure component (Layer 2, hosted
centrally) — ADR required per [LAW-4.5 v1.0]. Pattern choice (Strategy, for
the adapter) is within the sanctioned list (LAW-4.4); no exception needed.

== Security ==
FINDING [BLOCKING until satisfied]: Central service becomes a cross-team
aggregation point — a single compromise exposes every team's decision log and
work-item metadata, not just one project's.
CITATION: [LAW-1.5 v1.0] "Security is everyone's responsibility" / [LAW-7.2]
data protection for AI-involved tooling.
REQUIRED FIX: payload allowlist enforced in code (metadata only, see above),
transport encrypted (LAW-5.6 — TLS in transit even internally), and the
service's own access control reviewed before any team other than the pilot
team is onboarded.
VERDICT: PROCEED WITH REQUIRED FIXES (the fixes are already reflected in this
design's "What Crosses the Boundary" section; access-control implementation is
tracked as a task in the CRM-demo WF-FEATURE's security-review stage).

== FinOps ==
FINDING [ADVISORY]: Multica introduces a new vendor dependency. License terms
("source-available") are not yet verified against LAW-9.4 (copyleft → legal).
Hosting cost for the central service itself is low (append-only log + thin
query API); Multica's own hosting cost depends on self-hosted vs. managed
choice — self-hosted (as the user runs it) avoids a recurring external cost.
Subordinate to Security per LAW-9.3 — not a blocker.

== DevOps ==
FINDING [ADVISORY]: Resilience requirements (timeout, spool-and-retry, no
hard dependency on Layer 2 for gating) are captured above per LAW-4.6. No
SLO is being defined for Layer 2 itself in this pass (requirements.md
explicitly treats it as best-effort observability, not a service with its own
error budget) — revisit if the reference implementation graduates to
production use.

== CONFLICTS ==
None — Security's required fixes are already incorporated into the design, not
disputed by another persona.

== COUNCIL VERDICT ==
PROCEED WITH REQUIRED FIXES (incorporated above). Two follow-ups before wider
rollout beyond the pilot: (1) verify Multica's license under LAW-9.4, (2)
implement and review access control on the central service.
```

## Consequences

- **New:** `memory-service/src/events.ts` (+tests), `visibility-adapter/`
  package (+tests), one centrally-hosted instance of `memory-service` (ops
  responsibility: devops persona, per LAW-9.1/9.2).
- **Unchanged:** `laws/`, `workflows/`, `skills/`, `scripts/install.sh` — every
  team keeps installing the identical catalog.
- **Follow-up work (ticketed per LAW-1.2):** Multica license verification
  (LAW-9.4); central-service access control design; a real SLO for Layer 2 if
  it graduates past reference-implementation status (LAW-9.5).
- **Enables:** the CRM reference implementation (next WF-FEATURE) to be
  executed *and observed* end-to-end, which is the actual deliverable leadership
  asked for — proof the workflow runs, not just a description of it.

## Next Step

Open a WF-FEATURE for the CRM reference implementation. Its own `requirements`
stage (Product Owner persona, LAW-8.1) has not been written yet — intentionally
out of scope for this document, since AC-before-code applies to the demo
exactly as it applies to everything else this constitution governs.
