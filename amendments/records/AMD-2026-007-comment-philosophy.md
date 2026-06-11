---
id: AMD-2026-007
status: ENACTED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted research initiative — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-6.4]
reviewers_required: [quality, architect]
decision_by: "P. Polkampalli (PPolkampalli@eliassen.com)"
decision_date: "2026-06-11"
---

# AMD-2026-007: Adopt the Ousterhout Comment Position in LAW-6.4

## Motivation

LAW-6.4's "comments explain WHY, never WHAT" implicitly inherits Clean Code's
comment-minimalism (Martin: "Comments are always failures"). Ousterhout's
documented counter-position — "Without comments there is no way to have
abstraction or modularity"; "the cost of missing comments is easily 10-100x the
cost of incorrect comments" — treats interface comments as part of the abstraction
itself, not compensation for bad code. For AI-assisted teams the stakes rise:
agents consume comments as context, so an interface comment is literally part of
what the agent reasons over (and what LAW-6.3's JSDoc already partially mandates).
The amendment keeps the ban on WHAT-restatement while removing the implicit
"fewer comments is better" bias. (Research report, section c; Martin's nuance —
hostile only to "gratuitous" comments — noted.)

## Changes

### LAW-6.4 (v1.0 → v1.1) — meaning change, minor bump

**Before:**
> Comments explain WHY: business rules and their sources, trade-offs taken and
> alternatives rejected, external constraints, and workarounds with their
> tracking tickets. Comments that restate what the code already says are
> prohibited — if the code needs a WHAT comment, the code is unclear and must be
> rewritten instead (LAW-1.1).

**After:**
> Comments serve two purposes, both required. (1) Interface comments are part of
> the abstraction: they state what a unit guarantees, expects, and hides — what a
> caller (human or AI agent) needs without reading the implementation (LAW-6.3).
> (2) WHY comments capture what code cannot express: business rules and their
> sources, trade-offs taken and alternatives rejected, external constraints, and
> workarounds with their tracking tickets. A missing comment costs far more than
> an imperfect one — absence is the default defect. Comments that merely restate
> the implementation remain prohibited: if code needs a WHAT comment to be
> understood, rewrite the code (LAW-1.1).

Rationale section gains the Ousterhout citations and the agents-as-readers clause;
LAW-6.3's rationale gains a cross-reference at enactment (no statement change to
6.3, so no version bump there).

## Impact Analysis

- **Projects:** review posture flips from "justify this comment" to "justify this
  missing comment" on public surfaces; documentation-generator skill wording
  updates at enactment.
- **Configs/tooling:** none.
- **Personas:** code-review checklist item reworded at enactment.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Quality | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | |
| Architect | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | |

## Decision
Approved/Rejected by: **P. Polkampalli (PPolkampalli@eliassen.com)** Date: **2026-06-11**
Rationale: Approved en bloc with the v1.1 amendment wave. LAW-6.4 → v1.1.
