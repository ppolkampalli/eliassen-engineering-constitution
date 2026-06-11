---
id: AMD-2026-006
status: ENACTED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted research initiative — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-2.6]
reviewers_required: [software-engineer, quality]
decision_by: "P. Polkampalli (PPolkampalli@eliassen.com)"
decision_date: "2026-06-11"
---

# AMD-2026-006: Modernize LAW-2.6 — Complexity and Abstraction Depth over Line Count

## Motivation

LAW-2.6's hard 30-line cap (target 10–15) inherits Clean Code's small-function
doctrine, which no longer commands expert consensus. In the jointly published
Martin–Ousterhout debate (Sept 2024–Feb 2025), Ousterhout argues over-decomposition
produces "teeny-tiny methods that suffer from both shallow interfaces and
entanglement" — understanding one method requires reading several — and Martin
softened his 2–4-line examples as pedagogical. Empirically, the top-starred
Apache/Google/Microsoft codebases converge on cyclomatic complexity ≤5 and ≤40 LOC
(arXiv 2507.19721) — looser than our cap and observed, not mandated. The same
survey found rigid one-size-fits-all enforcement is experienced developers'
dominant complaint (53.91%, medium confidence). A complexity-and-abstraction
framing serves readability (LAW-1.1) better than a line ceiling that forces
fragmentation. (Research report, section c.)

## Changes

### LAW-2.6 (v1.0 → v1.1) — meaning change, minor bump

**Before:**
> A function does one thing. Functions are at most 30 lines, with a target of
> 10–15; a function approaching the limit is a signal to extract, not to
> compress. Magic numbers and magic strings are prohibited — every literal with
> meaning is a named constant whose name states that meaning.

**After:**
> A function does one thing, stated by its name. The design goal is depth of
> abstraction — a simple interface hiding meaningful work — not brevity for its
> own sake. Advisory thresholds, beyond which review scrutiny is required:
> cyclomatic complexity ≤ 5 and ~40 lines; exceeding them demands a justification
> in review, not automatic rejection — and fragmenting one coherent responsibility
> into entangled fragments to satisfy a number is itself a violation. Magic
> numbers and magic strings are prohibited — every literal with meaning is a named
> constant whose name states that meaning.

Rationale section replaces the size-as-proxy argument with the
Ousterhout/empirical citations; Related Laws unchanged.

## Impact Analysis

- **Projects:** review practice shifts from line-counting to complexity +
  interface-depth judgment; existing compliant code unaffected (new thresholds are
  looser).
- **Configs/tooling:** at enactment, ESLint gains `complexity: ["warn", 5]` and
  `max-lines-per-function: ["warn", 40]` advisories; CONFIG-LAW-MAP updated.
- **Personas:** software-engineer self-check and code-review checklist wording
  update at enactment.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Software Engineer | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | |
| Quality | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | |

## Decision
Approved/Rejected by: **P. Polkampalli (PPolkampalli@eliassen.com)** Date: **2026-06-11**
Rationale: Approved en bloc with the v1.1 amendment wave. LAW-2.6 → v1.1.
