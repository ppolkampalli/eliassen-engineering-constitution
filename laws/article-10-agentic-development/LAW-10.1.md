---
id: LAW-10.1
title: Spec-Driven Agent Work
article: 10
article_name: Agentic Development
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [software-engineer, product-owner]
enforcement: persona
enforcement_mechanism: "Plan/spec reviewed before substantial agent implementation; constitution-enforcer verifies the plan names bearing laws"
amendment_history:
  - amendment: AMD-2026-002
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-10.1: Spec-Driven Agent Work

## Statement (quotable)

> Substantial agent-executed work — multi-file changes, new features, refactors —
> proceeds from a written specification or plan reviewed before implementation
> begins. The plan re-checks the constitution: it names the laws bearing on the
> work and how the approach satisfies them. Trivial, single-step changes are
> exempt. An agent that begins substantial implementation without an approved
> spec/plan exceeds its mandate (LAW-7.5, LAW-8.1).

## Rationale (the WHY — always citable alongside the statement)

Agents that jump straight to code solve the wrong problem confidently — at
generation speed. Two verified practice lines converge on the same control:
GitHub Spec Kit embeds the project constitution into agent planning artifacts
(plan/spec/tasks templates each carry constitution checks), and Anthropic's
agentic guidance prescribes explore→plan→implement precisely because "letting
Claude jump straight to coding can produce code that solves the wrong problem."
The spec is also the anchor LAW-10.2's verification closes against: without a
written definition of done, "looks done" is the only signal an agent has.
(Sources: docs/research/2026-06-11-agentic-constitution-research.md.)

## Compliance Examples

VIOLATION:
```text
"Add export functionality to the reports module" → agent immediately
generates 14 files across 3 layers. No plan reviewed; format, auth
model, and async behavior all guessed (LAW-7.5's failure mode at scale).
```

COMPLIANT:
```text
Agent produces a plan first: files to change, approach, laws bearing on
the work ("LAW-5.1 for the new input path, LAW-4.1 for layer placement,
LAW-8.1 ACs attached"). Human approves the plan; implementation follows
it; deviations return to plan review.
```

## Related Laws
- LAW-8.1 (Acceptance Criteria Before Implementation)
- LAW-7.5 (Mandatory Escalation on Uncertainty)
- LAW-10.2 (Verifiable Completion)

## Citation Format
[LAW-10.1 v1.0] "Substantial agent work proceeds from a reviewed written spec or plan that names the laws bearing on the work; agents do not begin substantial implementation without one."
