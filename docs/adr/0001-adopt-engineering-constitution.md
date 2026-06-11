# ADR-0001: Adopt the Engineering Constitution as Governing Standard

- **Status:** ACCEPTED
- **Date:** 2026-06-01
- **Deciders:** VP Engineering, Tech Leads, Security Lead (Eliassen Group)
- **Work item:** [AMD-2026-001](../../amendments/records/AMD-2026-001-initial-ratification.md)

## Context

Eliassen Group's JavaScript/TypeScript delivery teams — 20–50 distributed,
AI-assisted engineers — repeatedly paid for six failure modes: review bottlenecks,
inconsistent standards across projects, low test coverage, security
vulnerabilities reaching production, poor documentation, and silently compounding
tech debt. Standards existed as scattered wiki pages and tribal knowledge:
unenforceable, uncitable, and invisible to AI agents. The rise of agentic coding
sharpened the need — agents amplify whatever standards regime exists, including
the absence of one.

## Options Considered

### Option A — Status quo plus better wiki documentation
- Consequences: Low effort; but documentation without enforcement or citability
  had already failed — the six pain points arose *with* documentation in place.
  Nothing binds agents or gates.

### Option B — Tooling-only enforcement (shared configs + CI, no law system)
- Consequences: Mechanically enforces what tools can see (formatting, lint,
  coverage) but cannot express review judgment, architecture, security practice,
  or AI governance; standards remain undebatable-by-reference — every dispute
  re-argues first principles.

### Option C — Constitution as law: citable laws + personas + amendment audit trail (chosen)
- Consequences: Standards become numbered, versioned, quotable artifacts with
  recorded rationale; tooling enforces the automatable subset; personas carry the
  judgment-based subset with bounded authority; every change is audited. Cost:
  real governance overhead (amendment process) and an adoption curve.

## Decision

Adopt the Engineering Constitution (this repository) as the governing standard
for all JavaScript/TypeScript projects, ratified via
[AMD-2026-001](../../amendments/records/AMD-2026-001-initial-ratification.md):
45 laws across 9 articles, 8 personas with an authority ladder, citation-aware
enforcement skills, law-mapped tooling, and the amendment/audit system. Rollout
follows the 12-week phased plan ([rollout-guide.md](../rollout-guide.md)).

## Consequences

- Decisions in any governed project become citable and auditable; "why" survives
  personnel changes.
- AI agents operate under the same explicit regime as humans (Article 7).
- Standards changes slow down by design: the amendment process trades agility for
  auditability at the standards layer (not the code layer).
- The constitution repo becomes operational infrastructure — registry integrity,
  install/update tooling, and the law-integrity gate must be maintained.

## Laws Considered

- [LAW-1.3 v1.0] — the zero-exception consistency this structure makes possible
- [LAW-1.4 v1.0] — this ADR itself practices the law it adopts
- [LAW-6.2 v1.0] — gates require the shared tooling this repo distributes
- [LAW-7.1–7.5 v1.0] — AI governance requires an explicit, citable regime
