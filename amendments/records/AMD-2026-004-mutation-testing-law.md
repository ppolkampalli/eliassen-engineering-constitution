---
id: AMD-2026-004
status: PROPOSED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted research initiative — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-3.6]
reviewers_required: [quality, software-engineer]
decision_by: ""
decision_date: ""
---

# AMD-2026-004: Ratify LAW-3.6 — Mutation Testing Verifies Test Effectiveness

## Motivation

Line coverage measures execution, not detection: peer-reviewed evidence (ICSE 2014,
Inozemtseva & Holmes) shows coverage "is not strongly correlated with test suite
effectiveness," and LLM-generated suites have reached 100% line/branch coverage
with ~4% mutation score (arXiv 2506.02954) — the precise hollow-test failure
LAW-3.5 prohibits but cannot mechanically detect. Mutation testing is now
operationalized at scale: Meta's ACH deployed across Facebook/Instagram/WhatsApp
(73% of generated tests accepted; Meta asserts mutation testing's empirical
superiority over structural coverage alone — FSE 2025, arXiv:2501.12862), and
Atlassian's Pitest workflow hit 80% mutation-coverage targets while finding that
AI-generated tests must be re-validated against the mutation report. As AI
generates an increasing share of our tests, LAW-3.2's floors need a
detection-strength companion. (Research report, section b.)

## Changes

### LAW-3.6 (new, v1.0) — Article 3, Testing & Quality
**Owner personas:** quality, software-engineer · **Enforcement:** automated
**Enforcement mechanism:** StrykerJS mutation runs in CI on changed modules; AI-generated test suites re-validated against the mutation report

> **Statement:** Test effectiveness is verified by mutation testing, complementing
> — never replacing — LAW-3.2's coverage floors. Mutation runs (StrykerJS) execute
> in CI on changed business-logic and utility modules. AI-generated test suites
> are accepted only after mutation re-validation shows they kill mutants beyond
> the pre-existing suite; a generated test that kills no additional mutants is
> hollow (LAW-3.5) and is rejected. Each project records a mutation-score baseline
> and ratchets it: the score may rise; a sustained drop on changed modules blocks
> merge pending added assertions.
>
> **Rationale (sourced):** Coverage proves code ran; mutation score proves tests
> notice when code breaks. The ratchet (rather than a universal numeric floor)
> reflects the watch-list finding that verified thresholds come from Kotlin/Java
> at Meta/Atlassian scale — JS/TS calibration is pending pilot (watch-list item 5).

## Impact Analysis

- **Projects:** StrykerJS added to devDependencies and CI at enactment; initial
  baseline run per project; changed-module scoping keeps CI time bounded.
- **Configs/tooling:** `configs/` gains stryker.config.json; `ci/github/quality.yml`
  gains a mutation job; CONFIG-LAW-MAP updated.
- **Personas:** quality persona review lens gains a mutation-report item.
- **Pilot first:** enactment recommendation — pilot on 2–3 services before
  org-wide CI enforcement (per watch-list item 5).

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Quality | | | | |
| Software Engineer | | | | |

## Decision
Approved/Rejected by: ____ Date: ____
Rationale: ____
