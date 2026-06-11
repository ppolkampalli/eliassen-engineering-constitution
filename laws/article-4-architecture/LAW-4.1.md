---
id: LAW-4.1
title: Layered Architecture
article: 4
article_name: Architecture
status: ACTIVE
version: 1.1
effective_date: 2026-06-11
owner_personas: [architect]
enforcement: review
enforcement_mechanism: "Architect persona review; import direction and cross-domain access checked in review; extraction ADRs verified per LAW-4.5"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
  - amendment: AMD-2026-008
    date: 2026-06-11
    change: "Domain-first organization (layers within domains); modular-monolith default with extraction criteria"
---

# LAW-4.1: Layered Architecture

## Statement (quotable)

> Applications are organized by business domain first: top-level modules mirror
> real-world domains (e.g., orders, billing, inventory), and each domain
> contains the four layers — Presentation → Application → Domain logic →
> Persistence — with dependencies pointing downward only and the domain-logic
> layer importing no framework. Cross-domain access goes through a domain's
> public interface, never its internals. The default deployment shape is a
> modular monolith; extracting a domain into a separate service requires an ADR
> (LAW-4.5) demonstrating at least one extraction criterion: independent
> scaling need, sensitive-data isolation, or divergent technology requirements.
> Cross-layer and cross-domain shortcuts are architectural defects even when
> they "work".

## Rationale (the WHY — always citable alongside the statement)

Layering is what keeps change local. When a controller queries the
database directly, the schema becomes coupled to the HTTP surface and
neither can change without the other — multiply that by 50 endpoints and
the system calcifies. A framework-free domain layer keeps business rules
testable in isolation (LAW-3.4), survivable across framework migrations,
and readable as the domain itself (LAW-8.2). Downward-only dependencies
make the system explainable layer by layer — an agent or engineer can
reason about pricing logic without holding Express middleware in mind.

Domains outrank layers as the top-level structure because people and
changes arrive by domain, not by tier: Shopify reorganized its core
platform by real-world business domains precisely to make code and code
owners locatable, choosing a modular monolith for "increased modularity
without increasing the number of deployment units." The extraction-ADR
gate exists because service splits are easy to make and brutal to undo;
boundaries are held by review and public interfaces (Shopify's own
retrospective found strict automated boundary enforcement harder than
expected). Amended per AMD-2026-008; evidence in
docs/research/2026-06-11-agentic-constitution-research.md.

## Compliance Examples

VIOLATION:
```typescript
// src/controllers/… src/models/… src/services/…   // organized by tier
// billing/invoice-service.ts
import { Order } from '../orders/persistence/order-model'; // another
// domain's internals; and a new "recommendations" microservice spun up
// with no extraction ADR
```

COMPLIANT:
```typescript
// src/orders/…  src/billing/…  src/inventory/…    // organized by domain
// each domain: presentation/ application/ domain/ persistence/
// billing/application/create-invoice.ts
import { getOrderSummary } from '../../orders';     // orders' public interface
// service extraction proposed via docs/adr/0012 citing independent
// scaling of recommendations (LAW-4.5)
```

## Related Laws
- LAW-4.3 (No Circular Dependencies)
- LAW-4.2 (SOLID Compliance)
- LAW-1.4 (Architecture Decisions Are Intentional)

## Citation Format
[LAW-4.1 v1.1] "Applications are organized by business domain first with the four layers inside each domain, dependencies pointing downward, cross-domain access through public interfaces only, and a modular-monolith default — service extraction requires an ADR meeting a documented criterion."
