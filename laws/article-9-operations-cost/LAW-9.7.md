---
id: LAW-9.7
title: Failure-Injection and Recovery Testing
article: 9
article_name: Operations & Cost
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [devops]
enforcement: review
enforcement_mechanism: "Quarterly game-day calendar per production system; recovery exercises recorded; devops persona verifies before release sign-off"
amendment_history:
  - amendment: AMD-2026-009
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-9.7: Failure-Injection and Recovery Testing

## Statement (quotable)

> Recovery procedures are tested before incidents need them: rollback paths
> (LAW-9.2), failover, restore-from-backup, and dependency-loss behavior
> (LAW-4.6's degraded modes) are exercised through scheduled failure-injection
> exercises or game days at least quarterly for production systems. Automated
> recovery responds to indicators of business value (SLIs per LAW-9.5), not
> only machine-level signals. An untested recovery procedure is assumed broken.

## Rationale (the WHY — always citable alongside the statement)

A rollback document that has never run is documentation of hope: backups that
were never restored, failovers that were never failed, degraded modes that were
never degraded — each is discovered broken at the only moment it matters. AWS's
Well-Architected reliability pillar codifies the cure: "test recovery
procedures" using automation to simulate failures before real ones, and trigger
recovery on KPIs that are "a measure of business value, not of the technical
aspects" — CPU at 40% means nothing if checkouts are failing. This law extends
LAW-9.2's designed-before-the-incident principle to verified-before-the-
incident, and gives LAW-4.6's degraded modes their proving ground. Ratified per
AMD-2026-009; evidence in
docs/research/2026-06-11-agentic-constitution-research.md.

## Compliance Examples

VIOLATION:
```text
The DR runbook says "restore from the nightly snapshot (≈15 min)."
First real restore attempt — during the incident — reveals the
snapshot job has been silently failing for five months and the restore
role lacks KMS permissions. Actual recovery: 11 hours.
```

COMPLIANT:
```text
Quarterly game day: kill the primary database in staging with
production-shaped traffic. Findings recorded: failover 4m (target 5m),
but the orders SLI kept paging after recovery — alert routing fixed
via JIRA-3310. Runbook timings updated the same day (LAW-6.5).
```

## Related Laws
- LAW-9.2 (Deployment Safety)
- LAW-4.6 (Resilience Patterns)
- LAW-9.5 (Service-Level Objectives)

## Citation Format
[LAW-9.7 v1.0] "Rollback, failover, restore, and degraded modes are exercised through quarterly failure-injection or game days; an untested recovery procedure is assumed broken."
