---
id: LAW-9.2
title: Deployment Safety
article: 9
article_name: Operations & Cost
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [devops]
enforcement: review
enforcement_mechanism: "DevOps persona blocks deploys without rollback plan; release checklist; pipeline encodes rollback step"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-9.2: Deployment Safety

## Statement (quotable)

> Every deployment is reversible, and the rollback procedure is
> documented and verified before release — not designed during the
> incident. Irreversible operations (destructive migrations, data
> backfills) ship behind the expand-migrate-contract pattern so the
> previous version keeps running mid-transition. A deploy without a
> rollback plan does not proceed; the DevOps persona blocks it.

## Rationale (the WHY — always citable alongside the statement)

Every deploy is a hypothesis; rollback is the safety net that makes
shipping frequently rational. Without a rehearsed reverse path, each
incident becomes an improvisation under the worst possible conditions —
production down, stakeholders watching, the one engineer who knows the
migration asleep. Documented-before-release matters because rollback
designed mid-incident is guesswork with a deadline; expand-migrate-
contract matters because schema changes are where "just roll it back"
quietly becomes impossible. This law is what lets LAW-6.2's gates stay
inviolable even during emergencies: the answer to "we must ship NOW" is
a safe path, already built.

## Compliance Examples

VIOLATION:
```text
Release drops the legacy `address` column and deploys the new reader
in one step. Deploy fails halfway; old version can't start (column
gone), new version can't either. No rollback doc exists.
```

COMPLIANT:
```text
Release 1 (expand): add address_v2, dual-write, backfill.
Release 2 (migrate): readers switch to address_v2. Rollback: flip flag.
Release 3 (contract): drop address after a full retention cycle.
Each step's rollback documented in the release notes before deploy.
```

## Related Laws
- LAW-9.1 (Infrastructure as Code)
- LAW-6.2 (Quality Gates Are Inviolable)
- LAW-1.2 (Quality is Built-In, Never Added Later)

## Citation Format
[LAW-9.2 v1.0] "Every deployment is reversible with the rollback documented before release; a deploy without a rollback plan does not proceed."
