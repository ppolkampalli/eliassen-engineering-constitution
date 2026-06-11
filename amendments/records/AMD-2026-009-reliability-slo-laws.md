---
id: AMD-2026-009
status: ENACTED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted research initiative — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-9.5, LAW-9.6, LAW-9.7]
reviewers_required: [devops, finops, product-owner, quality]
decision_by: "P. Polkampalli (PPolkampalli@eliassen.com)"
decision_date: "2026-06-11"
---

# AMD-2026-009: Ratify the Reliability Law Family — SLOs, Error Budgets, Failure Testing (LAW-9.5–9.7)

## Motivation

Article 9 covers IaC, rollback, cost, and licensing but contains no observability
or reliability-governance law (repo grep verified: zero matches for SLO /
error budget / postmortem / chaos / fault injection across all 45 laws). Google's
SRE Workbook provides a complete, citable pattern verified verbatim: error-budget
policies with enforceable release-freeze consequences, quantitative postmortem
triggers, three-constituency SLO sign-off, and SLO documents with the same
author/reviewer/approver discipline our ADRs and amendments already use. AWS's
Well-Architected reliability pillar adds failure-injection testing ("test recovery
procedures" via game days) and recovery triggered by business-value KPIs. These
frameworks are advisory at their source; this amendment adapts them as our
mandates. (Research report, section b.)

## Changes

### LAW-9.5 (new, v1.0) — Service-Level Objectives
**Owner personas:** devops, product-owner · **Enforcement:** review

> **Statement:** Every production service defines SLOs for its critical user
> journeys — at minimum availability and latency — each with a measured SLI. An
> SLO is a formal document with named author, reviewers, approvers, approval
> date, and next-review date, signed off by all three constituencies: product,
> development, and operations. An SLO without unanimous sign-off is a dashboard
> number, not a decision-making tool; a service without SLOs has no defined
> reliability and cannot claim to meet it.
>
> **Rationale (sourced):** Google SRE Workbook — without stakeholder agreement,
> SLO compliance "will simply be another KPI… rather than a decision-making
> tool." The document discipline mirrors our ADR/amendment machinery (LAW-4.5).

### LAW-9.6 (new, v1.0) — Error-Budget Policy
**Owner personas:** devops, product-owner · **Enforcement:** review

> **Statement:** Each SLO carries an error budget over a rolling four-week
> window, governed by a written policy with predefined consequences: when the
> budget is exhausted, feature releases halt — only P0 fixes and security fixes
> (LAW-1.5) ship — until the service is back within SLO. Any single incident
> consuming more than 20% of the four-week budget triggers a mandatory postmortem
> containing at least one root-cause action item ticketed at P0. Consequences
> execute as written; renegotiating the policy mid-incident is a violation
> (LAW-6.2's no-override principle applied to reliability).
>
> **Rationale (sourced):** Google's example error-budget policy, including the
> freeze consequence and the >20%-budget postmortem trigger. The budget converts
> the reliability-vs-velocity argument from a per-incident negotiation into a
> pre-agreed contract — exactly what this constitution does for quality.

### LAW-9.7 (new, v1.0) — Failure-Injection and Recovery Testing
**Owner personas:** devops · **Enforcement:** review

> **Statement:** Recovery procedures are tested before incidents need them:
> rollback paths (LAW-9.2), failover, restore-from-backup, and dependency-loss
> behavior (LAW-4.6's degraded modes) are exercised through scheduled
> failure-injection exercises or game days at least quarterly for production
> systems. Automated recovery responds to indicators of business value (SLIs per
> LAW-9.5), not only machine-level signals. An untested recovery procedure is
> assumed broken.
>
> **Rationale (sourced):** AWS reliability pillar — "test recovery procedures"
> with automation-simulated failures; recovery KPIs "should be a measure of
> business value, not of the technical aspects." A rollback document that has
> never run is documentation of hope (extends LAW-9.2's
> designed-before-the-incident principle to verified-before-the-incident).

## Impact Analysis

- **Projects:** SLO documents authored per production service at enactment
  (template to be added to `templates/`); error-budget policies agreed with
  product; quarterly game-day calendar established.
- **Configs/tooling:** monitoring/SLI instrumentation expected (OpenTelemetry or
  platform equivalent) — evaluated per project at enactment; not prescribed here.
- **Registry:** +3 laws; Article 9 grows to 7 laws.
- **Personas:** devops review lens extends; finops reviews error-budget freeze
  cost trade-offs; product-owner co-owns SLO/budget sign-off (mandate addition).
- **Watch-list link:** observability tooling standardization (OpenTelemetry law)
  deliberately deferred — evidence gathered did not verify a specific tooling
  mandate; revisit at quarterly review.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| DevOps | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | All three laws |
| Product Owner | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | SLO/budget sign-off duty |
| FinOps | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | Freeze economics |
| Quality | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | Postmortem action-item discipline |

## Decision
Approved/Rejected by: **P. Polkampalli (PPolkampalli@eliassen.com)** Date: **2026-06-11**
Rationale: Approved en bloc with the v1.1 amendment wave. LAW-9.5, 9.6, and 9.7
enter force at v1.0; Article 9 grows to 7 laws.
