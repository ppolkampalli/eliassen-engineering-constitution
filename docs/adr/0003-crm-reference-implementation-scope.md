# ADR-0003: CRM Reference Implementation — Scope Boundaries

- **Status:** ACCEPTED
- **Date:** 2026-10-05
- **Deciders:** Architect persona (drafted), Product Owner persona (scope sign-off per LAW-8.4)
- **Work item:** `crm-demo/` — WF-FEATURE on the CRM reference implementation (`crm-demo/docs/requirements.md`)

## Context

The CRM demo exists to demonstrate the constitution's Requirement → Architect →
Design → Develop → Review flow on a real, working, small codebase — the
artifact is training material, not a product. Three scope questions each have
an obvious-looking "more realistic" answer and a smaller one; this ADR records
why the smaller one was chosen each time, so a future maintainer extending this
demo doesn't mistake the omission for an oversight.

## Options Considered

### Decision 1 — Authentication: real session/JWT stack vs. role-check only
- **Option A — Real auth (JWT or session cookies via a vetted library, LAW-5.4):**
  More realistic; but pulls in an auth framework, token storage, and
  expiry/refresh logic that have nothing to do with the workflow this demo is
  meant to showcase. Consequences: more code to review and maintain, longer
  path to a working demo, same lesson either way.
- **Option B (chosen) — Caller role is passed in, already resolved:** Mirrors
  how a real system's auth middleware hands off to application code — the
  `customers` domain receives a `Caller { id, role }` and checks it, exactly as
  it would with real middleware in front of it. Consequences: AC2
  (role-gating) is fully demonstrated; AC1 (registration) still issues a real
  role; the actual login/session mechanism is explicitly deferred, not silently
  skipped.

### Decision 2 — Presentation layer: HTTP API vs. none
- **Option A — A thin Express/Fastify layer:** Exercises all four LAW-4.1
  layers literally. Consequences: a web framework dependency, route/middleware
  code, and HTTP-level tests — none of which the constitution's domain-logic
  and testing laws (Article 3) are primarily about.
- **Option B (chosen) — Use-cases are the public interface:** `application/*.ts`
  functions are what a future HTTP or CLI adapter would call directly; this
  demo calls them from tests the same way an adapter would. Consequences:
  Presentation is represented, not implemented — reversible, additive later.

### Decision 3 — Persistence: real database vs. in-memory
- **Option A — A real database (e.g., Postgres via an ORM):** Realistic
  persistence; but introduces IaC (LAW-9.1), a deployment target, and
  connection-lifecycle concerns a reference demo doesn't need.
- **Option B (chosen) — In-memory `Repository` implementation behind an
  interface (LAW-4.4):** Swappable for a real store later with zero change to
  `domain/` or `application/`. Consequences: the demo has no deployed
  infrastructure at all, which is correct for its purpose.

## Decision

Adopt Option B in all three: role passed to application code (no auth stack),
use-cases as the public interface (no presentation framework), in-memory
repositories behind the Repository pattern (no real database). Each is
reversible and additive — nothing here blocks a later WF-FEATURE from adding
the "realistic" option if the demo graduates past reference status.

## Consequences

- Smaller, faster, fully real demo — every line that exists is exercised by
  real tests, nothing is a stub pretending to be a feature.
- A reader must not mistake "no auth stack" for "the constitution doesn't care
  about auth" — `requirements.md`'s scope section and this ADR both say
  explicitly that LAW-5.4 is deferred, not ignored.
- Follow-up work, if this graduates past reference status (ticketed per
  LAW-1.2, not done here): real auth (LAW-5.4), an HTTP presentation layer, a
  real persistence implementation of the existing repository interfaces.

## Laws Considered

- [LAW-4.1 v1.1] — domain-first placement (`users`, `customers`); Presentation
  deliberately unimplemented this pass.
- [LAW-4.4 v1.0] — Repository and DI are the only patterns used; sanctioned,
  no exception needed.
- [LAW-4.5 v1.0] — this ADR itself, for the three scope decisions above.
- [LAW-5.4 v1.0] — explicitly deferred, not violated: no hand-rolled auth
  protocol is introduced; no auth protocol is introduced at all this pass.
- [LAW-9.1 v1.0] — no infrastructure is provisioned; in-memory persistence
  needs none.
- [LAW-8.4 v1.0] — scope boundaries have explicit PO sign-off in
  `requirements.md`, not a unilateral engineering cut.
