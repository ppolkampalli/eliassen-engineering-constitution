---
id: LAW-4.6
title: Resilience Patterns
article: 4
article_name: Architecture
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [architect, devops]
enforcement: review
enforcement_mechanism: "Resilience review items on every new integration per code-review-checklist.md; architect/devops persona review of network-boundary code"
amendment_history:
  - amendment: AMD-2026-008
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-4.6: Resilience Patterns

## Statement (quotable)

> Every call across a network boundary is built to fail safely: (1) retries use
> exponential backoff with jitter and a bounded budget — never unbounded or
> immediate retry; (2) any operation that may be retried is idempotent,
> enforced by idempotency keys on mutating endpoints; (3) calls to degrading
> dependencies are shed by circuit breakers or equivalent backpressure, with a
> defined degraded mode; (4) timeouts are explicit on every remote call — no
> infinite defaults. These behaviors are review items on every new integration
> and their absence on a production network path is a defect.

## Rationale (the WHY — always citable alongside the statement)

Distributed failure is a certainty, not an edge case — AWS's Well-Architected
reliability pillar codifies designing for recovery as first-class practice.
Each clause prevents a specific self-inflicted outage: unbounded or immediate
retries turn one slow dependency into a retry storm that finishes it off;
non-idempotent retries convert transient failures into duplicate charges and
corrupted state; missing breakers let one degraded dependency cascade through
every caller; infinite timeouts turn a hung socket into a hung service. These
patterns are also what make LAW-9.2's reversibility meaningful under partial
failure — a system that cannot degrade cannot roll back gracefully either.
Ratified per AMD-2026-008; evidence in
docs/research/2026-06-11-agentic-constitution-research.md.

## Compliance Examples

VIOLATION:
```typescript
// payment call: no timeout, immediate unbounded retry, non-idempotent
while (true) {
  try { return await paymentApi.charge(order); }
  catch { /* retry immediately, forever; double-charges on timeout */ }
}
```

COMPLIANT:
```typescript
const charge = await withCircuitBreaker('payments', () =>
  retry(
    () => paymentApi.charge(order, { idempotencyKey: order.chargeKey,
                                     timeoutMs: 3_000 }),
    { retries: 3, backoff: 'exponential', jitter: true }
  ),
  { degradedMode: () => queueForLaterCapture(order) } // defined fallback
);
```

## Related Laws
- LAW-4.1 (Layered Architecture)
- LAW-9.2 (Deployment Safety)
- LAW-9.7 (Failure-Injection and Recovery Testing)

## Citation Format
[LAW-4.6 v1.0] "Every network-boundary call has explicit timeouts, bounded exponential-backoff-with-jitter retries, idempotency keys on retryable mutations, and circuit breakers with a defined degraded mode."
