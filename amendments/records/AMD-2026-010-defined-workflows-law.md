---
id: AMD-2026-010
status: PROPOSED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-10.6]
reviewers_required: [product-owner, quality, security, architect, software-engineer, devops]
decision_by: ""
decision_date: ""
---

# AMD-2026-010: Ratify LAW-10.6 — Defined Workflows

## Motivation

The constitution defines WHAT must hold (laws) and WHO decides (personas), but
not HOW work flows between them. Without a declared process layer, every work
item improvises its own sequence — agents jump straight to implementation,
security review happens when someone remembers, and "did QA see this?" is
answered by memory. The workflow catalog (`workflows/`, shipped separately as
ordinary tooling) provides executable process definitions; this law makes
following a declared workflow — and recording deviations from it — a
constitutional obligation, while deliberately keeping the definitions
themselves agile (PR-reviewed process, not amendment-governed law).

## Changes

### LAW-10.6 (new, v1.0) — Article 10, Agentic Development
**Owner personas:** product-owner, quality · **Enforcement:** persona
**Enforcement mechanism:** workflow-orchestrator skill; deviation records checked in review; project overrides validated against the org catalog

> **Statement:** Nontrivial work proceeds under a declared workflow: the work
> item names which workflow from the catalog (`workflows/`, installed at
> `docs/constitution/workflows/`) it follows, and that workflow's stages,
> personas, gates, and human checkpoints govern execution by agents and humans
> alike. Workflows are process, not law: definitions change by ordinary PR
> review. Conversational deviations are permitted for stages not marked hard —
> and every applied deviation is recorded on the work item with its rationale
> and approver. Stages marked hard, stages whose gating laws are inviolable,
> and the WF-AMENDMENT sequence itself may not be overridden conversationally
> or by project-level files; project overrides may replace or add workflows
> but never remove or soften an org-catalog hard stage (LAW-1.3 applied to
> process). When no workflow fits, the orchestrator says so and a sequence is
> agreed explicitly — governed work is never processed by silent improvisation.
>
> **Rationale:** Process that lives in memory fails exactly like undocumented
> architecture (LAW-1.4) and unrecorded amendments: invisibly, then expensively.
> A declared workflow makes the sequence auditable (which stages ran, who
> checked what), makes agent execution safe (agents follow the same staged
> gates humans do — LAW-7.4's principle applied to process), and makes
> deviation a recorded decision instead of an accident (LAW-7.3's provenance
> principle). Keeping definitions PR-governed rather than amendment-governed
> is deliberate: process must evolve at the speed of practice, while the
> obligation to follow *some* declared process — and the inviolability of hard
> gates — stays constitutional.

## Impact Analysis

- **Projects:** work items gain a one-line workflow declaration; the
  orchestrator skill (already shipped) drives execution; existing in-flight
  work grandfathered until next sprint boundary.
- **Configs/tooling:** none beyond the already-shipped catalog + skill +
  installer integration.
- **Registry:** +1 law; Article 10 grows to 6 laws; constitution → v1.2.0.
- **Personas:** product-owner + quality gain LAW-10.6 ownership; all personas
  appear as workflow stage executors (no mandate changes — workflows compose
  existing authority, never extend it).
- **Docs:** CLAUDE.md/AGENTS.md gain the workflow instruction; CONSTITUTION.md
  and standards.md updated at enactment.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Product Owner | | | | Process ownership |
| Quality | | | | Deviation-record review duty |
| Security | | | | Hard-gate inviolability, WF-SECBUG |
| Architect | | | | Catalog structure |
| Software Engineer | | | | Default-persona stage execution |
| DevOps | | | | Installer/propagation mechanics |

## Decision
Approved/Rejected by: ____ Date: ____
Rationale: ____
