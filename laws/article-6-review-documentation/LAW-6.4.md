---
id: LAW-6.4
title: Comments Explain WHY
article: 6
article_name: Review & Documentation
status: ACTIVE
version: 1.1
effective_date: 2026-06-11
owner_personas: [quality, architect]
enforcement: review
enforcement_mechanism: "Code review per code-review-checklist.md"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
  - amendment: AMD-2026-007
    date: 2026-06-11
    change: "Adopted the Ousterhout position: interface comments as part of the abstraction; missing comments costlier than imperfect ones"
---

# LAW-6.4: Comments Explain WHY

## Statement (quotable)

> Comments serve two purposes, both required. (1) Interface comments are part
> of the abstraction: they state what a unit guarantees, expects, and hides —
> what a caller (human or AI agent) needs without reading the implementation
> (LAW-6.3). (2) WHY comments capture what code cannot express: business rules
> and their sources, trade-offs taken and alternatives rejected, external
> constraints, and workarounds with their tracking tickets. A missing comment
> costs far more than an imperfect one — absence is the default defect.
> Comments that merely restate the implementation remain prohibited: if code
> needs a WHAT comment to be understood, rewrite the code (LAW-1.1).

## Rationale (the WHY — always citable alongside the statement)

Code states WHAT perfectly and WHY not at all — intent, constraint, and
context exist only in the author's head unless written down, and they
are precisely what the next maintainer (or AI agent) needs before safely
changing anything. Interface comments go further: "without comments there
is no way to have abstraction or modularity" (Ousterhout) — the comment IS
the part of the interface the signature cannot carry (units, invariants,
side effects), and for AI agents it is literally consumed context. The
cost asymmetry drives the default: a missing comment costs 10–100× an
imperfect one, so absence — not presence — is the defect reviewers hunt.
WHAT-comments remain worse than noise: they duplicate the code, drift out
of sync with it, and train readers to skip all comments — destroying the
channel everything above depends on. A comment citing a business rule's
source (LAW-8.2) or a workaround's ticket turns mysterious code into
auditable code. Amended per AMD-2026-007; evidence in
docs/research/2026-06-11-agentic-constitution-research.md.

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
[LAW-6.4 v1.1] "Interface comments are part of the abstraction and WHY comments capture what code cannot express; a missing comment costs more than an imperfect one, while comments restating the implementation remain prohibited."
