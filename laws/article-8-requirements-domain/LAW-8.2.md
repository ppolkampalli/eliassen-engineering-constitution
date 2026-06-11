---
id: LAW-8.2
title: Business Rules Are Documented and Cited
article: 8
article_name: Requirements & Domain
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [industry-sme]
enforcement: review
enforcement_mechanism: "Industry SME persona review; rule citations checked in code review per LAW-6.4"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-8.2: Business Rules Are Documented and Cited

## Statement (quotable)

> Every business rule implemented in code links to its documented source:
> a rules catalog entry, a requirements document section, a regulation
> clause, or a client specification. The link lives in a comment at the
> implementation site (LAW-6.4) and in the covering test's description.
> Domain logic whose source is "someone said so on a call" is
> undocumented and must be captured in the rules catalog before merge.

## Rationale (the WHY — always citable alongside the statement)

Uncited domain logic becomes archaeology: five years later, nobody knows
whether `if (days > 90) writeOff()` is a regulation, a client preference,
or a bug that shipped — so nobody dares change it, and nobody can verify
it's still correct. The citation makes domain code auditable exactly as
law citations make decisions auditable: when the regulation changes, a
search for its ID finds every affected line; when the SME persona
reviews, it verifies code against source instead of intuition. This is
the same discipline this constitution applies to itself, extended to
the client's domain.

## Compliance Examples

VIOLATION:
```typescript
if (account.dormantDays > 90) {
  account.flag(AccountFlag.Dormant);   // why 90? whose rule?
}
```

COMPLIANT:
```typescript
// BR-ACCT-014 (client rules catalog v2.3): accounts with no customer-
// initiated transaction for 90 days are flagged dormant per state
// escheatment pre-screening.
if (account.dormantDays > DORMANCY_THRESHOLD_DAYS) {
  account.flag(AccountFlag.Dormant);
}
// test: "should flag account dormant when inactive 90 days (BR-ACCT-014)"
```

## Related Laws
- LAW-6.4 (Comments Explain WHY)
- LAW-8.3 (Regulatory Mapping)
- LAW-1.1 (Code is Written for Humans First)

## Citation Format
[LAW-8.2 v1.0] "Every implemented business rule cites its documented source at the implementation site and in its covering test."
