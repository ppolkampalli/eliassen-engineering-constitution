---
id: LAW-4.4
title: Sanctioned Patterns
article: 4
article_name: Architecture
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [architect]
enforcement: review
enforcement_mechanism: "Architect persona review; pattern usage checked during design and code review"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-4.4: Sanctioned Patterns

## Statement (quotable)

> The following patterns are sanctioned and required in their situations:
>
> - **Dependency Injection** — required wherever a unit uses an external
>   dependency (database, API client, clock, logger). Units receive
>   dependencies; they do not construct or import concrete ones.
> - **Repository** — required for all persistence access. Domain and
>   application code speak to repositories, never to drivers, ORMs, or SQL.
> - **Factory** — required when object construction involves conditional
>   logic, configuration, or non-trivial assembly. Construction complexity
>   lives in one place.
> - **Strategy** — required when behavior varies by type, tenant, or
>   configuration and would otherwise produce a growing switch/if-else
>   chain in stable code.
>
> Patterns beyond these may be used with an ADR recording why the
> sanctioned set was insufficient (LAW-4.5).

## Rationale (the WHY — always citable alongside the statement)

A small sanctioned vocabulary means every engineer and agent reads every
codebase fluently: a `*Repository` always means the same thing, in every
project (LAW-1.3 applied to design). Each pattern earns its place by
enabling another law — DI and Repository make test isolation possible
(LAW-3.4) and keep layers separate (LAW-4.1); Factory and Strategy are
the standard cures for OCP violations (LAW-4.2). Gating novel patterns
behind an ADR doesn't forbid invention; it makes invention deliberate
(LAW-1.4) instead of one engineer's habit becoming the next engineer's
puzzle.

## Compliance Examples

VIOLATION:
```typescript
class InvoiceService {
  private db = new PostgresClient(process.env.DB_URL); // self-constructed
  async total(type: string) {
    if (type === 'retail') {...} else if (type === 'wholesale') {...}
    else if (type === 'partner') {...} // growing chain in stable code
  }
}
```

COMPLIANT:
```typescript
class InvoiceService {
  constructor(
    private readonly invoices: InvoiceRepository,        // Repository, injected
    private readonly pricing: PricingStrategyFactory,    // Factory + Strategy
  ) {}
  async total(order: Order): Promise<Money> {
    return this.pricing.forCustomer(order.customerType).total(order);
  }
}
```

## Related Laws
- LAW-4.2 (SOLID Compliance)
- LAW-4.5 (ADR Requirement)
- LAW-3.4 (Test Isolation)

## Citation Format
[LAW-4.4 v1.0] "DI, Repository, Factory, and Strategy are required in their defined situations; novel patterns require an ADR explaining why the sanctioned set was insufficient."
