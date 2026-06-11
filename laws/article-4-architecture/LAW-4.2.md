---
id: LAW-4.2
title: SOLID Compliance
article: 4
article_name: Architecture
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [architect]
enforcement: review
enforcement_mechanism: "Architect persona review; one-line tests applied during code review"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-4.2: SOLID Compliance

## Statement (quotable)

> All modules and classes comply with SOLID, verified with these
> one-line tests:
>
> - **S**ingle Responsibility — "Name the one reason this unit changes." Two reasons = two units.
> - **O**pen/Closed — "Can the next variant be added without editing this file?" If every new case edits the same switch, extract a strategy.
> - **L**iskov Substitution — "Can every subtype replace its base type without callers knowing?" A subtype that throws on an inherited method fails.
> - **I**nterface Segregation — "Does every implementer use every member?" Fat interfaces force fake implementations.
> - **D**ependency Inversion — "Does this unit depend on an abstraction it owns, or a concrete it doesn't?" High-level policy never imports low-level detail.

## Rationale (the WHY — always citable alongside the statement)

SOLID is the difference between a system that absorbs change and one that
shatters under it. Each violation has a signature failure: SRP violations
make every change risky (unrelated behaviors travel together); OCP
violations turn each new requirement into edits across stable code; LSP
violations make polymorphism a lie that surfaces as runtime surprises;
ISP violations couple consumers to members they never use; DIP violations
weld business policy to infrastructure, blocking both testing (LAW-3.4)
and migration. The one-line tests exist so review applies SOLID as
checks, not as philosophy debates.

## Compliance Examples

VIOLATION:
```typescript
class ReportService {
  generate(): Report { ... }      // business logic
  saveToS3(r: Report) { ... }     // infrastructure
  emailToAdmins(r: Report) { ... } // notification — three reasons to change
}
```

COMPLIANT:
```typescript
class ReportGenerator { generate(): Report { ... } }
interface ReportStore { save(r: Report): Promise<void>; }
interface ReportNotifier { send(r: Report): Promise<void>; }
// Composition wired by DI (LAW-4.4); each unit has one reason to change.
```

## Related Laws
- LAW-2.6 (Function Size and Responsibility)
- LAW-4.4 (Sanctioned Patterns)
- LAW-4.1 (Layered Architecture)

## Citation Format
[LAW-4.2 v1.0] "All modules comply with SOLID, verified by the one-line tests — one reason to change, open to extension, substitutable subtypes, lean interfaces, depend on abstractions."
