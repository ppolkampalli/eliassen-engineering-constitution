---
id: AMD-2026-011
status: PROPOSED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted — Claude, per LAW-7.3)"
proposed_date: "2026-10-05"
laws_affected: [LAW-1.6]
reviewers_required: [product-owner, quality, architect, security, devops]
decision_by: ""
decision_date: ""
---

# AMD-2026-011: Ratify LAW-1.6 — Tiered Enforcement (Golden Paths)

## Motivation

The constitution scaled to one team cleanly: one catalog, one set of personas,
one workflow-orchestrator, zero project-level exceptions (LAW-1.3). Multiple
scrum teams working on different subsystems surface a question LAW-1.3 was
never written to answer: is *every* convention zero-exception, or only the
ones this constitution actually calls inviolable (Security vetoes, LAW-6.1/6.2
gates, LAW-8.1 acceptance criteria, LAW-3.1's TDD guardrail, tooling/config
uniformity)? Today that line is implicit — workflow-orchestrator already
distinguishes `hard: true` stages (never overridable) from `hard: false` ones
(conversationally deviable with a recorded reason) at the level of a single
workflow, but nothing names this as a general principle a team can rely on
across its whole practice.

This repository's own research (`docs/research/2026-06-11-agentic-constitution-research.md`,
Watch-List item 1) already identified the gap: Spotify's Golden Paths model
("the opinionated and supported path... you can leave it, but then you will
not have the same support") pairs hard vetoes for security/compliance with
paved-path incentives elsewhere, and a 460-developer survey cited in the same
report names one-size-fits-all enforcement as the dominant complaint driving
bypass pressure. The watch-list item was deliberately deferred pending human
deliberation ("needs human deliberation" — it would touch LAW-6.2's territory
if handled carelessly). Enterprise multi-team adoption is the concrete trigger
to resolve it now, scoped narrowly enough not to touch LAW-6.2 at all.

## Changes

### LAW-1.6 (new, v1.0) — Article 1, Foundational Principles
**Owner personas:** product-owner, quality, architect · **Enforcement:** persona
**Enforcement mechanism:** workflow-orchestrator's existing deviation-recording
mechanism (LAW-10.6), generalized from workflow stages to practice choices
generally; constitution-enforcer skill checks that a recorded deviation does
not touch the inviolable set.

**Before:** (new law — no prior text; LAW-1.3 remains unchanged and in force,
scoped as it already is to tooling/configuration/conventions.)

**After:**
> This constitution's inviolable set — every Security CRITICAL/HIGH veto
> (Article 5), the quality gates of LAW-6.2, the two human approvals of
> LAW-6.1, acceptance-criteria-before-implementation of LAW-8.1, the TDD
> guardrail of LAW-3.1, the tooling/configuration uniformity of LAW-1.3, and
> any workflow stage catalogued as `hard: true` — applies identically to
> every team, project, and agent, with no project-level exception, exactly as
> today. Outside that inviolable set, a team's choice of architectural
> pattern beyond LAW-4.4's sanctioned list, its sequencing or emphasis of
> non-hard workflow stages, and its selection of tools not already fixed by
> LAW-1.3 are a **paved path**: a recommended default a team may deviate from,
> provided the deviation is recorded with its rationale — the same mechanism
> LAW-10.6 already requires for workflow-stage deviations, generalized here to
> practice choices generally. A deviation repeated by more than one team
> within a quarter is referred to the Product Owner persona for a WF-RESEARCH
> pass: recurring friction becomes a proposed amendment, not a silently
> tolerated fork.

**Rationale:** LAW-1.3 was written for one team and reads, taken literally, as
zero-exception for everything — but its own statement and enforcement
mechanism are scoped to "tooling, configuration, and conventions: linter
rules, formatter settings, TypeScript strictness, test framework
configuration, naming standards," which this law does not touch or loosen.
What LAW-1.3 does not speak to — pattern choice beyond LAW-4.4's sanctioned
list, workflow emphasis beyond a stage's own hard/soft marking, tool choice
where LAW-1.3 is silent — currently has no named status: teams either guess
it is zero-exception (and quietly diverge anyway under deadline pressure,
unrecorded) or guess it is fully discretionary (and lose consistency). Naming
it explicitly, with a recorded-deviation requirement, converts invisible
drift into the auditable kind LAW-7.3's provenance principle already demands
elsewhere. The inviolable set is enumerated, not redefined — this amendment
adds zero softening to LAW-6.2, LAW-6.1, LAW-8.1, LAW-3.1, Article 5, or
LAW-1.3; it only names the boundary of a space those laws already left open.

## Impact Analysis

- **Projects:** single-team adoption is unaffected in practice — one team has
  no cross-team drift to manage, so the paved-path/deviation distinction is
  trivial for it. Multi-team adoption gains a named mechanism for legitimate
  divergence instead of ad hoc, unrecorded conversational deviation.
- **Configs/tooling:** reuses workflow-orchestrator's existing deviation-record
  format (no new tooling); `constitution-enforcer` skill gains one new check —
  a recorded deviation must not claim to skip or soften an inviolable-set item.
- **Personas:** Product Owner gains the repeated-deviation-referral duty
  (routing recurring friction into WF-RESEARCH); Quality and Architect co-own
  alongside Product Owner, consistent with their existing ownership of
  LAW-10.6 and LAW-4.4 respectively. No persona's authority ladder position
  changes (persona-guide.md's ladder is unaffected — this law does not touch
  conflict resolution, only what counts as a conflict).
- **Registry:** +1 law; Article 1 grows from 5 to 6 laws; constitution version
  bump to be set at enactment.
- **Docs:** `docs/standards.md`, `CONSTITUTION.md`, and the Golden-Paths
  watch-list entry in the 2026-06-11 research report get a resolution note at
  enactment, per the amendment process's propagation step.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Product Owner | _pending_ | _pending_ | | Gains repeated-deviation referral duty |
| Quality | _pending_ | _pending_ | | Confirm no softening of LAW-6.2/LAW-3.1 |
| Architect | _pending_ | _pending_ | | Confirm no softening of LAW-4.1/4.5; pattern-choice scope |
| Security | _pending_ | _pending_ | | Confirm Article 5 vetoes remain fully in the inviolable set |
| DevOps | _pending_ | _pending_ | | Confirm LAW-6.2 CI gates remain fully in the inviolable set |

## Decision
Approved/Rejected by: ____ Date: ____
Rationale: _Awaiting review — drafted per the 2026-10-05 WF-RESEARCH prioritize
decision (docs/proposals/agentic-visibility/requirements.md) to resolve the
2026-06-11 research report's Watch-List item 1._
