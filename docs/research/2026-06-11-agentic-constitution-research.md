# Research Report: Evolving the Engineering Constitution for Agentic Coding

**Date:** 2026-06-11 · **Method:** multi-agent deep-research harness (106 agents; 24
sources fetched; 114 claims extracted; 25 adversarially verified by 3-vote panels —
24 confirmed, 1 refuted) plus direct primary-source verification of agentic-coding
sources. **Purpose:** evidence base for the v1.1 amendment wave
(AMD-2026-002 … AMD-2026-009, all status PROPOSED).

Every recommendation below cites its sources; per the constitution's own philosophy,
this report is the auditable WHY behind each proposed amendment.

---

## (a) Validated Strengths — laws confirmed by mature-org practice (no change)

| Law | Validation | Source |
|---|---|---|
| LAW-3.1 (TDD-first) | Kent Beck (2025) frames tests as guardrails agents "cannot argue with, or delete"; reports unconstrained agents deleting failing tests — TDD is the agent-era control, not a legacy ritual | Beck, Canon TDD + "Augmented Coding: Beyond the Vibes"; Pragmatic Engineer interview |
| LAW-7.x (HITL, trust-but-verify) | Atlassian deliberately chose "Dev-in-the-loop over full autonomy" even for low-risk test generation: "The assistant proposes; you approve, adjust, or stop" | Atlassian engineering blog (Mar 2026), verified verbatim |
| LAW-3.5 (no hollow tests) | Real failure mode at scale: LLM-generated suites reaching 100% line/branch coverage with ~4% mutation score; Atlassian auto-re-validates AI tests against mutation reports | arXiv 2506.02954; Atlassian |
| LAW-9.1 (IaC) | AWS Well-Architected codifies "manage change through automation," including reviewing changes to the automation itself | AWS reliability pillar design principles |
| The constitution-as-system approach itself | DORA 2025: "AI's primary role is as an amplifier, magnifying an organization's existing strengths and weaknesses"; "the greatest returns on AI investment come not from the tools themselves, but from a strategic focus on the underlying organizational system" | dora.dev/dora-report-2025 |

## (b) Gaps — proposed new laws

### Agentic development process (the largest gap) → AMD-2026-002 (new Article 10)
Verified primary sources show a coherent practice layer the constitution lacks:

- **Spec-driven agent work** — GitHub Spec Kit's `constitution.md` template embeds
  project principles into agent planning artifacts: plan/spec/tasks templates each
  carry "Constitution checks," amendments are semantically versioned
  (MAJOR/MINOR/PATCH), and updates emit a "Sync Impact Report" across dependent
  templates. (github/spec-kit constitution template, verified)
- **Verifiable completion** — Anthropic's agentic best practices center on "give
  Claude a check it can run: tests, a build, a screenshot to compare… Have Claude
  show evidence rather than asserting success," with explore→plan→implement→commit
  as the canonical workflow and adversarial fresh-context review before counting
  work done. (code.claude.com/docs/en/best-practices, verified)
- **Sandboxing doctrine** — Anthropic: "effective sandboxing requires *both*
  filesystem and network isolation," enforced at OS level (bubblewrap/seatbelt),
  against a prompt-injection threat model; sandboxing reduced permission prompts
  84% internally. Unattended batch runs use scoped tool allowlists
  (`--allowedTools`). (anthropic.com/engineering/claude-code-sandboxing, verified)
- **Steering files as standard** — AGENTS.md is "a README for agents," used by 60k+
  open-source projects, supported by OpenAI Codex, Google Jules, Cursor, Aider,
  VS Code, Devin, GitHub Copilot; stewarded by the Agentic AI Foundation under the
  Linux Foundation; nested files with closest-takes-precedence. Anthropic's
  guidance treats steering files as engineered artifacts: "Treat CLAUDE.md like
  code: review it when things go wrong, prune it regularly, and test changes by
  observing whether Claude's behavior actually shifts"; bloat causes instruction
  loss. (agents.md; code.claude.com, both verified)
- **Fresh-context review** — "A fresh context improves code review since Claude
  won't be biased toward code it just wrote" — writer/reviewer separation as a
  structural rule, not a preference. (code.claude.com, verified)

### Mutation testing → AMD-2026-004 (new LAW-3.6)
Operationalized at scale: Meta's ACH tool (LLM-generated fault-relevant mutants +
tests guaranteed-by-construction to kill them) ran a production trial Oct–Dec 2024
across Facebook/Instagram/WhatsApp/Quest/Ray-Ban Meta; engineers accepted 73% of
generated tests; Meta asserts empirically that mutation testing is superior to
structural coverage alone (corroborated: FSE 2025 paper arXiv:2501.12862; ICSE 2014
Inozemtseva & Holmes, "Coverage Is Not Strongly Correlated with Test Suite
Effectiveness"). Atlassian's Pitest + AI workflow hit 80% mutation-coverage targets
with ~70% time savings and found AI-generated tests must be re-validated against
the mutation report. **Directly challenges LAW-3.2's line-coverage floors as a
sufficiency measure** — floors stay, but a mutation-score requirement closes the
hollow-coverage loophole, especially for AI-generated suites. JS/TS tooling:
StrykerJS. (engineering.fb.com Sept 2025; atlassian.com Mar 2026 — all 3-0 verified)

### AI code-health metrics → AMD-2026-005 (new LAW-7.6)
GitClear (211M changed lines, Jan 2020–Dec 2024, Google/Microsoft/Meta/enterprise
repos): code duplication rose 8.3% → 12.3% of changed lines (2021–2024); moved
(refactored) code collapsed from 25% → under 10%; copy/paste exceeded moved code
for the first time in the dataset's history. AI assistance measurably shifts
codebases toward duplication debt — a constitution governing AI-assisted teams
should monitor duplication/churn per release and treat regression as actionable.
(gitclear.com 2025 research, verified)

### Reliability & observability law family → AMD-2026-009 (new LAW-9.5–9.7)
Google's SRE Workbook provides a complete citable pattern: (1) error-budget policy
with an enforceable consequence — exceed the four-week budget and all releases halt
except P0/security fixes until back within SLO; (2) quantitative postmortem trigger
— any single incident consuming >20% of the four-week budget mandates a postmortem
with at least one P0 root-cause action item; (3) SLOs require documented sign-off
from product, development, and operations; (4) SLO/error-budget policies are formal
documents with authors/reviewers/approvers and review dates — directly analogous to
our ADR and amendment machinery. AWS Well-Architected adds: "test recovery
procedures" (failure injection / game days), and automated recovery triggered by
KPIs that are "a measure of business value, not of the technical aspects."
(sre.google/workbook, AWS reliability pillar — all verified; one 2-1 vote on the
business-KPI wording)

### Resilience patterns → AMD-2026-008 (new LAW-4.6)
Circuit breakers, retries with backoff and jitter, idempotency keys — absent from
Article 4 (repo grep verified zero matches for circuit-breaker/retry/idempotency
laws). AWS reliability pillar codifies the category. (AWS, verified)

## (c) Conflicts — existing laws vs. modern consensus (proposed amendments)

### LAW-2.6 function size → AMD-2026-006
No expert consensus supports a hard small-function cap. The Martin–Ousterhout
written debate (Sept 2024–Feb 2025, jointly published): Martin — "Functions should
hardly ever be 20 lines long"; Ousterhout — over-decomposition yields "teeny-tiny
methods that suffer from both shallow interfaces and entanglement" (understanding
one method requires reading others). Martin partially softened the 2–4-line figure
as pedagogical. Empirical analysis of top-starred Apache/Google/Microsoft projects
(arXiv 2507.19721, Jul 2025): most functions in healthy codebases fall within
cyclomatic complexity ≤5 and ≤40 LOC — far looser than our 30-line cap and framed
as observation, not mandate. **Proposal:** CC≤5 + ~40-LOC advisory thresholds;
depth of abstraction (deep modules, simple interfaces) as the stated design goal;
extraction justified by responsibility, not line count.
(github.com/johnousterhout/aposd-vs-clean-code; arXiv 2507.19721 — 3-0 ×3)

### LAW-6.4 / LAW-6.3 comment philosophy → AMD-2026-007
The constitution's "comments explain WHY, never WHAT" implicitly inherits Clean
Code's comment-minimalism ("Comments are always failures" — Martin). Ousterhout's
documented counter-position: "Without comments there is no way to have abstraction
or modularity"; "the cost of missing comments is easily 10-100x the cost of
incorrect comments." For AI-assisted teams this is sharpened: agents consume
comments as context — interface comments are part of the abstraction an agent
reasons over. **Proposal:** keep the no-WHAT-restatement rule, explicitly adopt the
Ousterhout asymmetry (missing > wrong), and add interface/abstraction comments as a
first-class category alongside WHY. (aposd-vs-clean-code, 3-0; nuance: Martin says
he is "not hostile to comments in general," only "gratuitous" ones)

### LAW-4.1 technical layering → AMD-2026-008
Shopify deliberately chose a modular monolith ("increased modularity without
increasing the number of deployment units… advantages of both monoliths and
microservices") and reorganized by real-world business domains (orders, shipping,
inventory, billing) rather than technical layers, to make code and owners easier to
locate. **Caveat honored in the proposal:** Shopify's 2023 retrospective found
strict dependency-boundary enforcement harder than expected — domain-first
organization aided discoverability/ownership; hard boundary enforcement proved
difficult. **Proposal:** domains as the top-level organizing unit with the four
layers *within* each domain; modular-monolith-first default with documented
extraction criteria (independent scaling, sensitive-data isolation, divergent tech
stacks) before any service split. (shopify.engineering 2019 + 2020 follow-up +
Packwerk retrospective — 3-0 ×2)

### LAW-3.1 precision → AMD-2026-003
Beck's Canon TDD (Dec 2023, primary source) is a five-step loop: (1) write a test
list; (2) convert exactly one item into a runnable test; (3) make it and all
previous tests pass, adding discovered items to the list; (4) optionally refactor;
(5) repeat until the list is empty. Beck explicitly lists "convert all items into
tests then make them pass" as a common mistake, and defines TDD's purpose as a
post-change system state (regression safety, correct new behavior, readiness for
next change, confidence). **Proposal:** amend LAW-3.1 to mandate the test-list +
one-test-at-a-time cadence, and add the agent-guardrail clause: agents never
delete, skip, or weaken a failing test to achieve green. Beck frames Canon TDD
descriptively ("no gold star for following these steps exactly") — the law cites it
as the definition of compliant practice, not a moral mandate.
(tidyfirst.substack.com/p/canon-tdd — 3-0 ×2)

## (d) Governance & Process Innovations Observed

- **Spec Kit constitutions** version themselves semantically and propagate changes
  via Sync Impact Reports into the agent's planning templates — our
  amendment-process analog, extended into agent workflow artifacts (adopted in
  AMD-2026-002's LAW-10.1).
- **Spotify Golden Paths** — "the opinionated and supported" path per discipline,
  enforced by incentive: "If you are an adventurer you can of course leave the
  Golden Path and do your own thing, but then you will not have the same support."
  Spotify itself runs a layered model (Golden *Technologies* are harder — expected
  for production with TAG-approved exceptions). Suggests a two-tier enforcement
  design: hard vetoes for security/compliance, paved-path incentives for
  architecture/tooling. **Watch-listed**, not proposed — it would soften LAW-6.2,
  which warrants human deliberation. (engineering.atspotify.com 2020, 3-0 ×2)
- **Enforcement-culture caution** — survey of 460 experienced developers: management
  issues were the dominant complaint about clean-code practice (53.91%), with
  specific objection to one-size-fits-all, strictly enforced policies; authors urge
  "adaptive, context-aware clean-code policies and tools that guide rather than
  mandate." Medium confidence (single non-peer-reviewed preprint, likely
  China-skewed sample). Watch-listed alongside Golden Paths. (arXiv 2507.19721)
- **AGENTS.md standardization** under the Linux Foundation (Agentic AI Foundation)
  signals steering files are becoming infrastructure with an open standard — the
  basis for AMD-2026-002's LAW-10.4 and the install.sh tooling recommendation below.

## Refuted During Verification (must not be cited)

- ~~"Shopify enforces architectural boundaries via an internal CI tool called
  Wedge"~~ — **REFUTED 0-3.** Domain-first organization is verified; automated
  boundary enforcement via "Wedge" is not supported by the cited source.

## Watch-List (feeds the 2026-09-01 quarterly review)

1. **Two-tier enforcement / Golden Paths** — possible LAW-6.2 softening for
   non-security domains; needs human deliberation; supporting survey evidence is
   medium-confidence.
2. **BDD / Gherkin executable specifications** — no claims survived verification;
   revisit with better sources before proposing.
3. **EU AI Act / NIST AI RMF / ISO 42001 mapping** — open question whether Article
   7's audit trail satisfies emerging regulatory requirements for AI-assisted SDLC;
   needs compliance-focused research (route to industry-sme persona + human counsel
   per LAW-8.3).
4. **DORA AI Capabilities Model deep-dive** — landing page verified the amplifier
   thesis; the capability specifics need the full report.
5. **Mutation-score threshold calibration** — verified evidence is Kotlin/Java at
   Meta/Atlassian scale; pilot StrykerJS on 2–3 JS/TS services before fixing a
   numeric floor in LAW-3.6 (the draft law therefore mandates the practice and a
   ratchet, not a universal number).

## Tooling Recommendation (no amendment required — not a law change)

`scripts/install.sh` should additionally generate an **AGENTS.md** in target
projects (mirroring CLAUDE.md's distilled rules in the open-standard format), given
60k-repo adoption and multi-tool support (Codex, Jules, Cursor, Aider, VS Code,
Devin, Copilot). Ordinary PR to this repo.

## Source Register

| Source | Quality | Used for |
|---|---|---|
| github.com/johnousterhout/aposd-vs-clean-code | Primary (joint debate transcript) | AMD-2026-006, -007 |
| arXiv 2507.19721 (clean-code empirical study) | Primary preprint (caveats noted) | AMD-2026-006; watch-list 1 |
| tidyfirst.substack.com/p/canon-tdd (Beck) | Primary | AMD-2026-003 |
| newsletter.pragmaticengineer.com (Beck interview) | Secondary | AMD-2026-003 |
| engineering.fb.com LLM mutation testing (2025) + arXiv:2501.12862 (FSE 2025) | Primary + peer-reviewed | AMD-2026-004 |
| atlassian.com Rovo/Pitest mutation workflow (2026) | Primary (vendor case study, caveats noted) | AMD-2026-004; HITL validation |
| sre.google/workbook (error-budget policy; implementing SLOs) | Primary (advisory examples, not mandates) | AMD-2026-009 |
| docs.aws.amazon.com Well-Architected reliability pillar | Primary (advisory) | AMD-2026-008, -009 |
| shopify.engineering modular monolith (2019; 2020; 2023 retrospective) | Primary | AMD-2026-008 |
| engineering.atspotify.com Golden Paths (2020) | Primary | Watch-list 1 |
| github/spec-kit constitution template | Primary | AMD-2026-002 |
| agents.md (Agentic AI Foundation / Linux Foundation) | Primary | AMD-2026-002; tooling rec |
| anthropic.com/engineering/claude-code-sandboxing | Primary | AMD-2026-002 |
| code.claude.com/docs/en/best-practices | Primary | AMD-2026-002 |
| gitclear.com AI code quality 2025 | Primary (vendor research) | AMD-2026-005 |
| dora.dev/dora-report-2025 | Primary (landing page only) | Validation; watch-list 4 |
| arXiv 2506.02954 (LLM test hollowness) | Primary preprint | AMD-2026-004 corroboration |
| ICSE 2014 Inozemtseva & Holmes | Peer-reviewed | AMD-2026-004 |

**Methodological caveats:** verification budget exhausted before all 114 claims
were panel-verified; agentic-coding sources (Spec Kit, agents.md, Anthropic,
GitClear, DORA) were verified by direct primary-source reading rather than 3-vote
panels. Google SRE and AWS materials are example/advisory frameworks — proposed
laws adapt them as our mandates rather than claiming they are mandates elsewhere.
The Atlassian post is a self-reported vendor case study; GitClear sells code-health
tooling (motive noted; the dataset is nonetheless the largest public one on
AI-era code change).
