---
id: LAW-4.1
title: Layered Architecture
article: 4
article_name: Architecture
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [architect]
enforcement: review
enforcement_mechanism: "Architect persona review; import direction checked in review; ESLint import boundaries where configured"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-4.1: Layered Architecture

## Statement (quotable)

> Applications are structured in four layers — Presentation → Application
> → Domain → Persistence — and dependencies point downward only. The
> Presentation layer never reaches past Application into Domain or
> Persistence; the Domain layer imports nothing from the layers above it
> and no framework. Cross-layer shortcuts are architectural defects even
> when they "work".

## Rationale (the WHY — always citable alongside the statement)

Layering is what keeps change local. When a controller queries the
database directly, the schema becomes coupled to the HTTP surface and
neither can change without the other — multiply that by 50 endpoints and
the system calcifies. A framework-free domain layer keeps business rules
testable in isolation (LAW-3.4), survivable across framework migrations,
and readable as the domain itself (LAW-8.2). Downward-only dependencies
make the system explainable layer by layer — an agent or engineer can
reason about pricing logic without holding Express middleware in mind.

## Compliance Examples

VIOLATION:
```typescript
// presentation/order-controller.ts
import { db } from '../persistence/db';          // skips two layers
router.post('/orders', async (req, res) => {
  await db.query('INSERT INTO orders ...');      // schema coupled to HTTP
});
```

COMPLIANT:
```typescript
// presentation/order-controller.ts
import { createOrder } from '../application/create-order';
router.post('/orders', async (req, res) => {
  const order = await createOrder(parseOrderRequest(req));
  res.status(201).json(toOrderResponse(order));
});
```

## Related Laws
- LAW-4.3 (No Circular Dependencies)
- LAW-4.2 (SOLID Compliance)
- LAW-1.4 (Architecture Decisions Are Intentional)

## Citation Format
[LAW-4.1 v1.0] "Applications use Presentation → Application → Domain → Persistence layering with dependencies pointing downward only; the domain layer imports no framework."
