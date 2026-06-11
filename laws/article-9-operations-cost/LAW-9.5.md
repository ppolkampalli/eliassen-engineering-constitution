---
id: LAW-9.5
title: Service-Level Objectives
article: 9
article_name: Operations & Cost
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [devops, product-owner]
enforcement: review
enforcement_mechanism: "SLO documents reviewed for three-constituency sign-off; release readiness checks SLO existence for production services"
amendment_history:
  - amendment: AMD-2026-009
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-9.5: Service-Level Objectives

## Statement (quotable)

> Every production service defines SLOs for its critical user journeys — at
> minimum availability and latency — each with a measured SLI. An SLO is a
> formal document with named author, reviewers, approvers, approval date, and
> next-review date, signed off by all three constituencies: product,
> development, and operations. An SLO without unanimous sign-off is a dashboard
> number, not a decision-making tool; a service without SLOs has no defined
> reliability and cannot claim to meet it.

## Rationale (the WHY — always citable alongside the statement)

Reliability undefined is reliability unfalsifiable: without a target, every
incident debate is opinion versus opinion. Google's SRE Workbook is explicit
about why the sign-off matters — without stakeholder agreement, SLO compliance
"will simply be another KPI… rather than a decision-making tool." The three
constituencies each hold a piece nobody else has: product knows what users
tolerate, development knows what the code can promise, operations knows what
the platform delivers. The document discipline (authors, approvers, review
dates) mirrors our ADR and amendment machinery (LAW-4.5) — reliability targets
get the same audit trail as architecture and law. Ratified per AMD-2026-009;
evidence in docs/research/2026-06-11-agentic-constitution-research.md.

## Compliance Examples

VIOLATION:
```text
"The orders API should be fast and basically always up." A Grafana
dashboard exists; no target, no sign-off, no SLI definition. Incident
review becomes an argument about whether 97.9% "is fine."
```

COMPLIANT:
```text
docs/slo/orders-api.md: availability 99.9% / latency p99 < 400ms over
28 days, SLI = successful requests at the load balancer. Author,
reviewers, approvers (product + dev + ops) and next-review date
recorded. Error budget governed per LAW-9.6.
```

## Related Laws
- LAW-9.6 (Error-Budget Policy)
- LAW-9.7 (Failure-Injection and Recovery Testing)
- LAW-4.5 (ADR Requirement)

## Citation Format
[LAW-9.5 v1.0] "Every production service has documented SLOs with measured SLIs, signed off by product, development, and operations, with named authors, approvers, and review dates."
