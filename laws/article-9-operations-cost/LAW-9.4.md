---
id: LAW-9.4
title: License Compliance
article: 9
article_name: Operations & Cost
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [finops]
enforcement: persona
enforcement_mechanism: "FinOps persona review of new dependencies; license check in dependency evaluation per LAW-5.5"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-9.4: License Compliance

## Statement (quotable)

> Every dependency's license is evaluated before adoption — including
> transitive licenses. Permissive licenses (MIT, Apache-2.0, BSD, ISC)
> are pre-approved. Copyleft licenses (GPL, AGPL, SSPL) and "source-
> available" commercial licenses are flagged to the FinOps persona and
> require human legal sign-off before use — AGPL in network services
> especially. License evaluation is recorded with the dependency
> decision; a license change on upgrade re-triggers review.

## Rationale (the WHY — always citable alongside the statement)

A license is a contract accepted by `npm install`, and in client-
delivery work the exposure is double: copyleft obligations can attach to
the *client's* proprietary codebase, converting a free library into a
legal incident and a contractual breach. AGPL is singled out because its
network clause triggers on serving users — no distribution needed —
which describes essentially everything we build. Upgrade re-review
exists because relicensing mid-stream is now routine practice; the
license you audited is not necessarily the license in this week's
lockfile. Catching this at adoption costs a lookup; catching it at
client audit costs a remediation project.

## Compliance Examples

VIOLATION:
```text
"Found a great PDF library" — AGPL-3.0, npm-installed into the
client's proprietary billing service. Discovered eight months later
during the client's acquisition due diligence.
```

COMPLIANT:
```text
PR dependency note: "pdf-render@4.1: MIT ✓ (transitives: MIT/Apache-2
✓ via license-checker). Alternative rejected: doc-forge (AGPL-3.0,
flagged per [LAW-9.4 v1.0] — legal sign-off not pursued; MIT option
sufficient)."
```

## Related Laws
- LAW-5.5 (Dependency Hygiene)
- LAW-9.3 (Cost Impact Assessment)
- LAW-7.2 (IP and Data Protection)

## Citation Format
[LAW-9.4 v1.0] "Every dependency license (including transitives) is evaluated before adoption; copyleft and source-available licenses require human legal sign-off."
