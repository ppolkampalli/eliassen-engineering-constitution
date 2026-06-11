---
id: LAW-8.1
title: Acceptance Criteria Before Implementation
article: 8
article_name: Requirements & Domain
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [product-owner]
enforcement: persona
enforcement_mechanism: "Product Owner persona blocks implementation lacking acceptance criteria; ticket hygiene checked at sprint planning"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-8.1: Acceptance Criteria Before Implementation

## Statement (quotable)

> No implementation begins until the work item carries written acceptance
> criteria defining "done": observable behaviors, edge cases in scope,
> and how success is verified. A ticket whose body is its own title is
> not implementable. When criteria are missing, the work routes back to
> the Product Owner — coding against a guess violates this law and
> LAW-7.5 alike.

## Rationale (the WHY — always citable alongside the statement)

Undefined "done" is how the same feature gets built three times: once as
the engineer imagined it, once as the PM meant it, once as the client
needed it. Acceptance criteria are the contract that makes test-first
possible (LAW-3.1 needs an expectation to test), makes review meaningful
(LAW-6.1 reviewers need a definition of correct), and makes scope
disputes resolvable by reference instead of memory (LAW-8.4). For AI-
assisted teams this law is load-bearing: an agent given a one-line
ticket will confidently manufacture the missing requirements (LAW-7.5's
exact failure mode).

## Compliance Examples

VIOLATION:
```text
JIRA-1888: "Add export feature"
(no description — engineer starts coding CSV export; client needed
filtered PDF statements for auditors)
```

COMPLIANT:
```text
JIRA-1888: "Export account statements"
AC1: User with 'auditor' role can export statements for a date range ≤ 12 months.
AC2: Format: PDF matching template FIN-201; one file per account.
AC3: Export of >50 accounts runs async and notifies by email.
AC4: Non-auditor roles receive 403; attempt is audit-logged.
Verification: E2E test per AC; auditor-role demo on staging.
```

## Related Laws
- LAW-3.1 (Test-First Development)
- LAW-8.4 (Scope Discipline)
- LAW-7.5 (Mandatory Escalation on Uncertainty)

## Citation Format
[LAW-8.1 v1.0] "No implementation begins without written acceptance criteria defining observable behaviors, in-scope edge cases, and verification."
