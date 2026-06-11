---
id: LAW-6.5
title: Docs Travel With Code
article: 6
article_name: Review & Documentation
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, architect]
enforcement: review
enforcement_mechanism: "PR template 'docs updated' checklist item; reviewer verifies affected docs changed in the same PR"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-6.5: Docs Travel With Code

## Statement (quotable)

> Documentation is updated in the same pull request as the change it
> describes — README, API documentation, configuration references,
> runbooks, and ADRs affected by the change. A PR that changes behavior
> while leaving its documentation describing the old behavior is
> incomplete and must not merge. "Will document in a follow-up" receives
> the same treatment as any deferred quality (LAW-1.2): a tracked
> ticket, or a no.

## Rationale (the WHY — always citable alongside the statement)

Documentation updated "later" is documentation updated never — the
context evaporates the moment the PR merges and the author moves on.
Stale docs are strictly worse than missing docs: a missing runbook sends
the on-call engineer to read the code; a wrong runbook sends them
confidently down a path that no longer exists, mid-incident. Coupling
docs to the PR puts them inside the review and the audit trail: the diff
shows behavior and description changing together, and reviewers can
verify they agree (LAW-6.1).

## Compliance Examples

VIOLATION:
```text
PR #441 renames the `RETRY_LIMIT` env var to `MAX_RETRIES` and changes
its default from 3 to 5. README and deployment runbook still document
RETRY_LIMIT=3. "Docs PR to follow."
```

COMPLIANT:
```text
PR #441 includes the rename, the new default, the README table row,
the runbook update, and a CHANGELOG entry — one diff, one review,
one merge.
```

## Related Laws
- LAW-6.3 (Public API Documentation)
- LAW-1.2 (Quality is Built-In, Never Added Later)
- LAW-4.5 (ADR Requirement)

## Citation Format
[LAW-6.5 v1.0] "Documentation is updated in the same PR as the change it describes; a behavior change leaving stale docs is incomplete and must not merge."
