---
id: AMD-2026-008
status: PROPOSED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted research initiative — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-4.1, LAW-4.6]
reviewers_required: [architect, devops]
decision_by: ""
decision_date: ""
---

# AMD-2026-008: Domain-First Architecture (LAW-4.1 v1.1) and Resilience Patterns (LAW-4.6)

## Motivation

LAW-4.1 mandates four technical layers as the organizing structure. Verified
mature-org evidence favors organizing by business domain first: Shopify chose a
modular monolith ("increased modularity without increasing the number of
deployment units… advantages of both monoliths and microservices") and reorganized
by real-world domains — orders, shipping, inventory, billing — rather than
technical layers, to make code and code owners locatable. Honored caveat: Shopify's
2023 retrospective found strict automated boundary enforcement harder than
expected, so the amendment mandates domain-first *organization*, with boundaries
held by review, not by claimed tooling. Separately, Article 4 contains no
resilience-pattern law (repo grep: zero matches for circuit breaker / retry /
idempotency), while AWS's Well-Architected reliability pillar codifies the
category. (Research report, sections b/c; refuted "Wedge" claim excluded.)

## Changes

### LAW-4.1 (v1.0 → v1.1) — meaning change, minor bump

**Before:**
> Applications are structured in four layers — Presentation → Application →
> Domain → Persistence — and dependencies point downward only. The Presentation
> layer never reaches past Application into Domain or Persistence; the Domain
> layer imports nothing from the layers above it and no framework. Cross-layer
> shortcuts are architectural defects even when they "work".

**After:**
> Applications are organized by business domain first: top-level modules mirror
> real-world domains (e.g., orders, billing, inventory), and each domain contains
> the four layers — Presentation → Application → Domain logic → Persistence —
> with dependencies pointing downward only and the domain-logic layer importing
> no framework. Cross-domain access goes through a domain's public interface,
> never its internals. The default deployment shape is a modular monolith;
> extracting a domain into a separate service requires an ADR (LAW-4.5)
> demonstrating at least one extraction criterion: independent scaling need,
> sensitive-data isolation, or divergent technology requirements. Cross-layer and
> cross-domain shortcuts are architectural defects even when they "work".

### LAW-4.6 (new, v1.0) — Article 4, Architecture
**Owner personas:** architect, devops · **Enforcement:** review

> **Statement:** Every call across a network boundary is built to fail safely:
> (1) retries use exponential backoff with jitter and a bounded budget — never
> unbounded or immediate retry; (2) any operation that may be retried is
> idempotent, enforced by idempotency keys on mutating endpoints; (3) calls to
> degrading dependencies are shed by circuit breakers or equivalent
> backpressure, with a defined degraded mode; (4) timeouts are explicit on every
> remote call — no infinite defaults. These behaviors are review items on every
> new integration (code-review-checklist) and their absence on a production
> network path is a defect.
>
> **Rationale (sourced):** Distributed failure is a certainty, not an edge case;
> AWS's reliability pillar codifies recovery design as a first-class practice.
> Unbounded retries turn one failure into a self-inflicted outage; non-idempotent
> retries corrupt data; missing breakers cascade. These patterns are also what
> make LAW-9.2's reversibility meaningful under partial failure.

## Impact Analysis

- **Projects:** new projects adopt domain-first layout immediately; existing
  projects migrate opportunistically (module moves are refactors, not rewrites);
  extraction-criteria ADR requirement applies to all new services at enactment.
- **Configs/tooling:** import-boundary linting between domains evaluated at
  enactment (held by review until tooling is proven — per the Shopify caveat).
- **Registry:** +1 law (LAW-4.6); LAW-4.1 → v1.1.
- **Personas:** architect review lens items 1–2 reworded; devops co-owns LAW-4.6;
  checklists gain a resilience section.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Architect | | | | Both laws |
| DevOps | | | | LAW-4.6 operational fit |

## Decision
Approved/Rejected by: ____ Date: ____
Rationale: ____
