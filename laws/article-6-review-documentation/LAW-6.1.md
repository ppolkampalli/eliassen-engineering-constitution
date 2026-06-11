---
id: LAW-6.1
title: Two-Approval Review
article: 6
article_name: Review & Documentation
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality]
enforcement: automated
enforcement_mechanism: "GitHub branch protection: 2 required approvals, code-owner review, no self-approval"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-6.1: Two-Approval Review

## Statement (quotable)

> Every change to a protected branch requires two approvals, at least one
> from a domain expert in the affected area (enforced via code owners).
> Authors never approve their own changes, directly or through an alias
> or bot. Review is substantive: an approval asserts the reviewer read
> the change, ran the reasoning, and accepts shared ownership of the
> result.

## Rationale (the WHY — always citable alongside the statement)

A single reviewer under deadline pressure converges on rubber-stamping;
two reviewers with one required domain expert keep the review honest and
catch the class of defects only context can see — a correct-looking
change that violates a domain invariant. The shared-ownership clause is
the cultural core: review is not gatekeeping but co-signing, which is
also what makes AI-assisted changes safe to merge — a human pair has
genuinely owned the output (LAW-7.1, LAW-7.4). Review bottlenecks were a
founding pain point; the cure is making reviews meaningful, not making
them optional.

## Compliance Examples

VIOLATION:
```text
PR approved by its author's second account and a teammate who replied
"LGTM" 40 seconds after the PR opened (2,400 lines changed).
```

COMPLIANT:
```text
PR approved by a payments code-owner (domain expert) with two substantive
comments resolved, plus one peer reviewer; branch protection verified
both before merge enabled.
```

## Related Laws
- LAW-6.2 (Quality Gates Are Inviolable)
- LAW-7.4 (Identical Standards for AI Code)
- LAW-1.1 (Code is Written for Humans First)

## Citation Format
[LAW-6.1 v1.0] "Every merge requires two approvals including one domain expert; authors never approve their own changes."
