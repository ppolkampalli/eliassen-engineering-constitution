---
id: LAW-9.6
title: Error-Budget Policy
article: 9
article_name: Operations & Cost
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [devops, product-owner]
enforcement: review
enforcement_mechanism: "Written error-budget policy per SLO; freeze consequence checked at release readiness; postmortem trigger verified in incident review"
amendment_history:
  - amendment: AMD-2026-009
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-9.6: Error-Budget Policy

## Statement (quotable)

> Each SLO carries an error budget over a rolling four-week window, governed by
> a written policy with predefined consequences: when the budget is exhausted,
> feature releases halt — only P0 fixes and security fixes (LAW-1.5) ship —
> until the service is back within SLO. Any single incident consuming more than
> 20% of the four-week budget triggers a mandatory postmortem containing at
> least one root-cause action item ticketed at P0. Consequences execute as
> written; renegotiating the policy mid-incident is a violation (LAW-6.2's
> no-override principle applied to reliability).

## Rationale (the WHY — always citable alongside the statement)

The error budget converts the reliability-versus-velocity argument from a
per-incident negotiation into a pre-agreed contract — exactly the move this
constitution makes for quality gates (LAW-6.2). Google's published error-budget
policy supplies the verified pattern: the release-freeze consequence and the
>20%-of-budget postmortem trigger, with escalation paths defined in advance.
The no-renegotiation clause is the load-bearing part: a consequence that can be
argued away under deadline pressure is a suggestion, and the first exception
becomes the precedent for the next ten (LAW-6.2's rationale, verbatim logic).
Ratified per AMD-2026-009; evidence in
docs/research/2026-06-11-agentic-constitution-research.md.

## Compliance Examples

VIOLATION:
```text
Budget exhausted in week 2; the team ships three features anyway
because "the demo is Thursday." A 30%-of-budget incident closes with
"monitoring will catch it next time" and no postmortem.
```

COMPLIANT:
```text
Budget exhausted → release train carries only the P0 fix for the
regression and a dependency security patch (LAW-1.5). The triggering
incident (34% of budget) gets a postmortem with a P0 action item
("add connection-pool backpressure — JIRA-3201") before the freeze lifts.
```

## Related Laws
- LAW-9.5 (Service-Level Objectives)
- LAW-6.2 (Quality Gates Are Inviolable)
- LAW-1.5 (Security is Everybody's Responsibility)

## Citation Format
[LAW-9.6 v1.0] "Exhausting the four-week error budget halts feature releases — only P0 and security fixes ship — and any incident consuming over 20% of the budget mandates a postmortem with a P0 root-cause action item."
