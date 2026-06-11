---
id: AMD-2026-005
status: ENACTED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted research initiative — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-7.6]
reviewers_required: [quality, security, architect]
decision_by: "P. Polkampalli (PPolkampalli@eliassen.com)"
decision_date: "2026-06-11"
---

# AMD-2026-005: Ratify LAW-7.6 — AI-Era Code-Health Metrics

## Motivation

The largest public dataset on AI-era code change (GitClear: 211M changed lines,
2020–2024, Google/Microsoft/Meta/enterprise repos) shows AI assistance measurably
shifting codebases toward duplication debt: copy-pasted code rose from 8.3% to
12.3% of changed lines (2021–2024) while moved/refactored code collapsed from 25%
to under 10% — copy/paste exceeded refactoring for the first time in the dataset's
history. DORA 2025 frames the mechanism: AI amplifies the existing system,
including its debt accumulation. A constitution governing AI-assisted teams should
measure the drift it is exposed to. (Research report, section b; GitClear is a
code-health vendor — motive noted, dataset unmatched.)

## Changes

### LAW-7.6 (new, v1.0) — Article 7, AI Governance
**Owner personas:** quality, architect · **Enforcement:** review
**Enforcement mechanism:** duplication/churn metrics tracked per release (e.g., jscpd or equivalent in CI); regression review at retrospectives

> **Statement:** Projects track code-health metrics sensitive to AI-assisted
> drift — duplication percentage of changed lines, churn (code rewritten within
> weeks of landing), and the moved-vs-copied ratio — per release. A sustained
> duplication or churn regression is treated as actionable technical debt: it is
> ticketed (LAW-1.2), and refactoring work is scheduled, not deferred. Metrics
> inform retrospectives and the constitution's quarterly review; they are never
> used as individual performance measures.
>
> **Rationale (sourced):** AI generation makes duplicating code cheaper than
> abstracting it; GitClear's longitudinal data shows the industry-wide result.
> Measurement is the difference between drift we manage and drift we discover at
> refactoring-impossible scale. The no-individual-KPI clause prevents the metric
> gaming that destroys measurement value (and echoes the enforcement-culture
> caution in the research watch-list).

## Impact Analysis

- **Projects:** duplication scanner (jscpd) added to CI as advisory metric at
  enactment; baseline captured; threshold ratchet decided per project at first
  quarterly review.
- **Configs/tooling:** `ci/github/quality.yml` gains an advisory metrics job;
  CONFIG-LAW-MAP updated.
- **Personas:** quality + architect retrospective review duty; ai-transparency
  skill's release summary gains the metrics section.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Quality | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | |
| Security | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | Article 7 co-enforcement |
| Architect | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | Refactoring scheduling |

## Decision
Approved/Rejected by: **P. Polkampalli (PPolkampalli@eliassen.com)** Date: **2026-06-11**
Rationale: Approved en bloc with the v1.1 amendment wave. LAW-7.6 enters force at v1.0.
