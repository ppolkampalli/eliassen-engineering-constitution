---
id: LAW-6.4
title: Comments Explain WHY
article: 6
article_name: Review & Documentation
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, architect]
enforcement: review
enforcement_mechanism: "Code review per code-review-checklist.md"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-6.4: Comments Explain WHY

## Statement (quotable)

> Comments explain WHY: business rules and their sources, trade-offs
> taken and alternatives rejected, external constraints, and workarounds
> with their tracking tickets. Comments that restate what the code
> already says are prohibited — if the code needs a WHAT comment, the
> code is unclear and must be rewritten instead (LAW-1.1).

## Rationale (the WHY — always citable alongside the statement)

Code states WHAT perfectly and WHY not at all — intent, constraint, and
context exist only in the author's head unless written down, and they
are precisely what the next maintainer (or AI agent) needs before safely
changing anything. WHAT-comments are worse than noise: they duplicate
the code, drift out of sync with it, and train readers to skip all
comments — destroying the channel WHY-comments depend on. A comment
citing a business rule's source (LAW-8.2) or a workaround's ticket turns
mysterious code into auditable code.

## Compliance Examples

VIOLATION:
```typescript
// increment retry count
retryCount++;
// loop over the items
for (const item of items) { ... }
```

COMPLIANT:
```typescript
// Gateway rejects bursts >5 req/s (vendor contract §4.2), so retries
// back off exponentially from 2s. Revisit if we move to dedicated tier:
// JIRA-2105.
retryCount++;
await sleep(BASE_BACKOFF_MS * 2 ** retryCount);
```

## Related Laws
- LAW-1.1 (Code is Written for Humans First)
- LAW-6.3 (Public API Documentation)
- LAW-8.2 (Business Rules Are Documented and Cited)

## Citation Format
[LAW-6.4 v1.0] "Comments explain WHY — business rules, trade-offs, constraints — never WHAT; code needing a WHAT comment must be rewritten instead."
