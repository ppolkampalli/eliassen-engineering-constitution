---
id: LAW-9.3
title: Cost Impact Assessment
article: 9
article_name: Operations & Cost
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [finops]
enforcement: persona
enforcement_mechanism: "FinOps persona review on infra/dependency changes with material cost impact; tagging validated in IaC review"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-9.3: Cost Impact Assessment

## Statement (quotable)

> Infrastructure and dependency changes with material cost impact — new
> services, instance-class changes, storage/egress-heavy designs, paid
> APIs and licenses, AI/compute consumption — include a cost estimate in
> the PR and receive FinOps persona review before merge. All cloud
> resources carry the organization's attribution tags (project, team,
> environment, cost-center); untagged resources are blocked at review.
> Cost never overrides security: FinOps is explicitly subordinate to
> Security on CRITICAL and HIGH findings (LAW-1.5).

## Rationale (the WHY — always citable alongside the statement)

Cloud spend is the rare cost that engineers commit in code and finance
discovers on an invoice — a single misjudged instance class or unbounded
log retention compounds silently at 730 hours a month. Estimating at PR
time costs minutes and turns surprises into decisions; tagging is what
makes the bill attributable at all (an untagged resource is a cost
nobody owns and nobody turns off). The explicit subordination clause
settles the recurring conflict in advance: a cheaper-but-exposed design
is not an optimization, and the persona hierarchy should never have to
re-derive that under deadline.

## Compliance Examples

VIOLATION:
```text
PR adds a per-request call to a paid enrichment API (no estimate;
$0.004 × 40M req/mo ≈ $160k/yr discovered on the invoice) and an
untagged S3 bucket with versioning and no lifecycle policy.
```

COMPLIANT:
```text
PR — Cost note: "Enrichment API $0.004/call; with 24h cache, est.
1.2M calls/mo ≈ $4.8k/mo. Alternative considered: nightly batch
($600/mo, 24h staleness) — PO chose freshness." Bucket tagged
{project, team, env, cost-center} with 90-day lifecycle. FinOps
persona review cited [LAW-9.3 v1.0].
```

## Related Laws
- LAW-9.1 (Infrastructure as Code)
- LAW-9.4 (License Compliance)
- LAW-1.5 (Security is Everybody's Responsibility)

## Citation Format
[LAW-9.3 v1.0] "Changes with material cost impact include a PR cost estimate and FinOps review; all cloud resources carry attribution tags; cost never overrides security."
