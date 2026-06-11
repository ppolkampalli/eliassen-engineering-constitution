---
id: LAW-7.6
title: AI-Era Code-Health Metrics
article: 7
article_name: AI Governance
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [quality, architect]
enforcement: review
enforcement_mechanism: "Duplication/churn metrics tracked per release (jscpd or equivalent in CI); regression review at retrospectives"
amendment_history:
  - amendment: AMD-2026-005
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-7.6: AI-Era Code-Health Metrics

## Statement (quotable)

> Projects track code-health metrics sensitive to AI-assisted drift —
> duplication percentage of changed lines, churn (code rewritten within weeks
> of landing), and the moved-vs-copied ratio — per release. A sustained
> duplication or churn regression is treated as actionable technical debt: it
> is ticketed (LAW-1.2), and refactoring work is scheduled, not deferred.
> Metrics inform retrospectives and the constitution's quarterly review; they
> are never used as individual performance measures.

## Rationale (the WHY — always citable alongside the statement)

AI generation makes duplicating code cheaper than abstracting it, and the
industry-scale result is measured: across 211M changed lines (2020–2024),
copy-pasted code rose from 8.3% to 12.3% of changes while moved/refactored code
collapsed from 25% to under 10% — copy/paste exceeded refactoring for the first
time on record (GitClear 2025). DORA 2025 names the mechanism: AI amplifies the
existing system, including its debt accumulation. Measurement is the difference
between drift we manage and drift we discover at refactoring-impossible scale.
The no-individual-KPI clause prevents the metric gaming that destroys
measurement value. Per AMD-2026-005; evidence in
docs/research/2026-06-11-agentic-constitution-research.md.

## Compliance Examples

VIOLATION:
```text
Six months of agent-accelerated delivery; nobody measures. A platform
audit finds the validation logic copy-pasted (with divergent bug fixes)
into 14 services — discovered only when a security patch must be
applied 14 times (LAW-5.1 fix amplified by unmanaged duplication).
```

COMPLIANT:
```text
Release dashboard shows duplication of changed lines rising 9% → 13%
over three releases. Retrospective ticket JIRA-3120 schedules
extraction of the shared validation module; next release's metric
confirms the trend reversed.
```

## Related Laws
- LAW-1.2 (Quality is Built-In, Never Added Later)
- LAW-7.4 (Identical Standards for AI Code)
- LAW-2.6 (Function Size and Responsibility)

## Citation Format
[LAW-7.6 v1.0] "Projects track duplication, churn, and moved-vs-copied ratios per release; sustained regression is ticketed, actionable technical debt — and metrics are never individual performance measures."
