---
id: LAW-4.5
title: ADR Requirement
article: 4
article_name: Architecture
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [architect]
enforcement: review
enforcement_mechanism: "PR review blocks significant structural merges lacking an ADR in docs/adr/; architect persona verifies"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-4.5: ADR Requirement

## Statement (quotable)

> Every significant structural decision is recorded as an Architecture
> Decision Record in `docs/adr/` — using `templates/adr-template.md` —
> before the implementing change merges. Significant means: new service
> or module boundary, new external dependency or infrastructure
> component, new layer or cross-cutting concern, departure from
> sanctioned patterns, or any decision a future maintainer would ask
> "why is it like this?" about. The ADR records context, options
> considered, the decision, its consequences, and the laws considered.

## Rationale (the WHY — always citable alongside the statement)

The most expensive question in a legacy system is "can we change this?"
— and it's expensive precisely because nobody recorded why it is the way
it is. ADRs are the architecture's audit trail, exactly as amendment
records are the constitution's: they make decisions reversible (the
original constraints are known), onboarding fast (the system explains
itself), and agent assistance safe (an AI extending the system can read
the intent, not just the artifact). Requiring the ADR *before* merge is
deliberate — decisions documented after the fact are justifications, not
records (LAW-1.4).

## Compliance Examples

VIOLATION:
```text
PR #312 replaces REST calls between order and inventory services with
a RabbitMQ queue. No ADR; rationale lives in a Slack thread that will
be unsearchable in six months.
```

COMPLIANT:
```text
PR #312 includes docs/adr/0009-async-inventory-updates.md: context
(timeout cascade during peak), options (retry budget, queue, batch
sync), decision (queue), consequences (eventual consistency window,
new infra dependency), laws considered (LAW-4.1, LAW-9.2, LAW-9.3).
```

## Related Laws
- LAW-1.4 (Architecture Decisions Are Intentional)
- LAW-4.4 (Sanctioned Patterns)
- LAW-6.5 (Docs Travel With Code)

## Citation Format
[LAW-4.5 v1.0] "Significant structural decisions are recorded as an ADR in docs/adr/ before the implementing change merges."
