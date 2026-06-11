---
id: LAW-7.1
title: Human Accountability
article: 7
article_name: AI Governance
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, security]
enforcement: review
enforcement_mechanism: "Code review; ai-transparency skill; PR AI-disclosure section per LAW-7.3"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-7.1: Human Accountability

## Statement (quotable)

> A human engineer owns every line of code that merges, regardless of
> how it was produced. AI assists; humans decide and approve. "The AI
> wrote it" is never an explanation, a defense, or a substitute for
> understanding — an engineer who cannot explain a change must not
> submit it. Accountability for defects, vulnerabilities, and design
> consequences rests with the humans who authored and approved the
> change, exactly as if they had typed it.

## Rationale (the WHY — always citable alongside the statement)

Accountability is what keeps quality real when generation becomes cheap.
The failure mode of AI-assisted development is not bad output — it is
unowned output: code nobody fully understands, merged because it looked
plausible and the tests were green. Anchoring ownership to humans keeps
the incentive to understand intact (you cannot own what you cannot
explain, see LAW-1.1), keeps review honest (LAW-6.1's co-signing applies
with full force), and gives clients and auditors an unbroken chain of
responsibility. This law is the foundation the rest of Article 7 builds
on.

## Compliance Examples

VIOLATION:
```text
Post-incident review: "That retry logic came from the assistant — I
didn't really look at the backoff math." Author cannot explain why the
service hammered the vendor API at 0ms intervals.
```

COMPLIANT:
```text
PR description: "Claude drafted the backoff implementation; I verified
the exponential window against vendor contract §4.2, added the jitter
the draft lacked, and wrote the failure-mode tests." Author answers
every review question about the change without reference to the tool.
```

## Related Laws
- LAW-7.4 (Identical Standards for AI Code)
- LAW-7.3 (AI Audit Trail)
- LAW-6.1 (Two-Approval Review)

## Citation Format
[LAW-7.1 v1.0] "A human engineer owns every merged line regardless of how it was produced; AI assists, humans approve, and 'the AI wrote it' is never a defense."
