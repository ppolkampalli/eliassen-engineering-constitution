---
id: LAW-8.3
title: Regulatory Mapping
article: 8
article_name: Requirements & Domain
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [industry-sme]
enforcement: review
enforcement_mechanism: "Industry SME persona maintains the compliance map; reviewed when regulated code paths change"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-8.3: Regulatory Mapping

## Statement (quotable)

> Projects subject to regulatory regimes (PCI DSS, GDPR, HIPAA, SOC 2,
> and client-specific regulation) maintain a compliance map: a living
> document linking each applicable requirement to the code, configuration,
> and controls that satisfy it. Changes to mapped code paths require the
> map to be updated in the same PR (LAW-6.5) and reviewed by the Industry
> SME persona; regulatory interpretation questions escalate to human
> compliance counsel — personas advise, they do not rule.

## Rationale (the WHY — always citable alongside the statement)

Compliance that lives in engineers' heads fails exactly when tested — at
audit time and at incident time, both of which demand evidence, not
assurance. The map converts "we believe we're compliant" into "control
4.2 is satisfied by this middleware, verified by this test" — making
audits cheap, making regressions visible in diff review (a change to a
mapped path is flagged as compliance-relevant before merge, not after a
finding), and telling every engineer and agent which code is
load-bearing for legal obligations. The escalation clause exists because
regulatory interpretation is legal judgment with liability attached.

## Compliance Examples

VIOLATION:
```text
PR refactors the payment-capture path, relocating card-data handling
into a new module. No compliance map exists; nobody realizes the new
module now falls inside PCI scope and logs PANs at debug level.
```

COMPLIANT:
```text
PR touches a path mapped to PCI DSS 3.4 (PAN rendering). The diff
updates docs/compliance-map.md, the SME persona review confirms
masking is preserved, and the new module is added to the PCI scope
inventory — same PR, cited [LAW-8.3 v1.0].
```

## Related Laws
- LAW-8.2 (Business Rules Are Documented and Cited)
- LAW-5.6 (Encryption Standards)
- LAW-6.5 (Docs Travel With Code)

## Citation Format
[LAW-8.3 v1.0] "Regulated projects maintain a compliance map from each requirement to the code and controls satisfying it, updated in the same PR as changes to mapped paths."
