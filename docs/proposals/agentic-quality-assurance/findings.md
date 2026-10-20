# Findings: How This Repo's Quality Model Actually Works, and What External Research Says

**Persona:** Software Engineer / Quality — critical, cited investigation
**Workflow:** WF-RESEARCH v1.0 (investigate stage)
**Entry:** `requirements.md`'s four questions
**Gates:** LAW-7.2 (nothing project-sensitive was sent externally — Part B is
public web research only), LAW-8.2 (every claim below is cited)

Two passes: an internal, read-only audit of this repo's actual enforcement
mechanisms (Part A), and external research on deterministic QA techniques for
LLM-driven development (Part B). File:line citations are from the live repo
at the time of this spike; re-verify before citing elsewhere if the repo has
since changed.

## Part A — Internal Audit: Deterministic vs. LLM-Judged, By Article

Every law's `enforcement_mechanism` was cross-checked against real CI files
(`ci/github/quality.yml`, `ci/github/security.yml`) and the actual `skills/`
directory — not just trusted at face value. **Correction to the registry's
own labels**: any mechanism naming a "skill" (`tdd-assistant`,
`security-checker`, `constitution-enforcer`, `code-review-assistant`,
`documentation-generator`) is an LLM-interpreted `SKILL.md` prose file, not a
script — confirmed by directory listing — so several laws the registry
implies are "automated" are actually PERSONA-enforced.

| Article | Deterministic | Hybrid | Persona/LLM only |
|---|---|---|---|
| 1 Foundational | 1.3 | 1.5 | 1.1, 1.2, 1.4 |
| 2 Code Standards | 2.1\*, 2.2, 2.3, 2.5 | 2.4, 2.6 | — |
| 3 Testing & Quality | 3.2 | 3.4 | 3.1, 3.3, **3.5, 3.6†** |
| 4 Architecture | 4.3 | — | 4.1, 4.2, 4.4, 4.5, 4.6 |
| 5 Security | 5.5 | 5.1, 5.2, 5.3 | 5.4, 5.6 |
| 6 Review & Docs | 6.2 | **6.1‡** | 6.3, 6.4, 6.5 |
| 7 AI Governance | — | 7.6 | **7.1, 7.2, 7.3§, 7.4, 7.5** |
| 8 Requirements & Domain | — | — | **8.1, 8.2, 8.3, 8.4 (all)** |
| 9 Operations & Cost | — | 9.1, 9.2, 9.5 | 9.3, 9.4, 9.6, 9.7 |
| 10 Agentic Development | — | 10.3 | **10.1, 10.2¶, 10.4, 10.5#, 10.6** |

**Tally: ~9 of 57 laws are genuinely deterministic end-to-end; ~9 are
hybrid; ~39 have no deterministic backstop at all.** Article 8
(Requirements & Domain — the acceptance-criteria article directly relevant
to the traceability question) has **zero** tooling anywhere.

\* 2.1 is mostly deterministic (ESLint naming rule) with a hybrid sliver
(kebab-case filenames checked in review, not linted).
† See below — designed to be deterministic, not yet built.
‡ See below — the gate is deterministic, the substance it's meant to
guarantee is not.
§ The `[Claude-assisted]` commit tag: **no CI check verifies its presence**
— `ci/github/*.yml` has no such job; entirely trust-based today.
¶ "Evidence (test output, command results) presented with the work" has no
verifier confirming the agent didn't fabricate the output — pure trust.
# See below — this is the law most directly relevant to question 2.

### The two laws at the crux of question 2

**LAW-10.5 (Fresh-Context Review)** — `laws/article-10-agentic-development/
LAW-10.5.md:22-28` is explicit and literal: *"a fresh agent session, a
subagent seeing only the diff and the criteria, or a human... The
implementing context never grades its own work."* Its rationale (`:32-40`)
cites Anthropic's own guidance and Kent Beck's documented cases of agents
deleting failing tests to reach green — **this law exists specifically
because single-session self-grading is a known failure mode**, confirming
the premise of the user's question directly.

**But it is not operationalized.** `skills/workflow-orchestrator/SKILL.md`
— the file that actually drives execution — contains **zero** occurrences
of "subagent," "fresh session," or "new session" (grepped, confirmed). Its
actual instruction at stage transitions (`:40-42`) is *"Assume the stage's
persona — fully... One persona at a time"* — a role-reframe inside the same
continuous session as every other stage in the `## 2. Execute` loop
(`:34-55`). `workflows/WF-FEATURE.md:102-103` asserts *"Fresh context
reviews the diff (LAW-10.5)"* in its narrative, but the orchestrator that
actually runs the workflow has no mechanism to make that true — it's
prose intent, not enforced execution. **Direct answer: yes, single-session
development plausibly does skew toward self-declared success, and no, there
is currently no mechanism in this repo that prevents it** — compliance
depends entirely on whether whoever runs the workflow chooses to manually
start a new session for `code-review`.

**LAW-3.6 (Mutation Testing)** — the law explicitly designed to catch
exactly this: hollow, self-confirming tests that pass without verifying
anything. Its rationale (`laws/article-3-testing-quality/LAW-3.6.md:33-37`)
cites real research by name: *"LLM-generated suites have reached 100%
line/branch coverage with ~4% mutation score — perfectly green, detecting
nothing"* (Inozemtseva & Holmes, ICSE 2014; Meta ACH, FSE 2025; Atlassian
Pitest). **This is unimplemented in the actual repo** — no Stryker config
anywhere outside `node_modules`, no mutation job in either real CI file. The
law's own text admits it: *"JS/TS calibration is pending pilot"* (`:40-41`).
The single deterministic backstop this constitution already designed for
the self-grading problem is aspirational text only, today.

**LAW-6.1 (Two Approvals)** is deterministic at the gate level (GitHub
branch protection: 2 approvals, no self-approval — a real, platform-enforced
check) but its own violation example (`:43-47`) shows the gate passing while
its intent is violated: *"approved by... a teammate who replied 'LGTM' 40
seconds after the PR opened (2,400 lines changed)."* The count is
deterministic; whether the review was real is not — and the law's own
example is of the gate being gamed, not hypothetically.

## Part B — External Research: What Actually Works

**1. Self-grading bias is well-established, not speculative.** LLMs show
*self-confirmation bias* — they amplify rather than correct their own
outputs in self-refinement. One study found an 84% false-positive rate on
self-verified plan checks; LLM-on-LLM self-critique reached only 55%
correctness vs. 88% with an external checker. Correlated error between
generator and evaluator means even "a different pass" provides weak evidence
of correctness if it's correlated error, not independent judgment. —
[arXiv:2603.25681](https://arxiv.org/pdf/2603.25681),
[arXiv:2608.16003](https://arxiv.org/pdf/2608.16003),
[ReVeal (arXiv:2506.11442)](https://arxiv.org/pdf/2506.11442)

**2. Mutation testing for AI-generated code is now industry-adopted, not
fringe.** ThoughtWorks Technology Radar (Apr 2026) rates it **"Adopt"**
specifically because AI makes it urgent. Standard tools: Stryker (JS/TS —
what LAW-3.6 already names), PIT (Java), cargo-mutants (Rust). One contested
counter-study found Claude-authored Python tests weren't measurably weaker
than human-authored ones — single source, treat as early/unsettled, not a
reason to skip piloting. — [ThoughtWorks Radar](https://www.thoughtworks.com/en-us/radar/techniques/mutation-testing),
[counter-study](https://arxiv.org/pdf/2608.15188)

**3. Property-based testing has a direct, same-org precedent.** AI-generated
code tends toward plausible-but-wrong logic on edge cases; property-based
testing (Hypothesis/Python, fast-check/JS-TS) generates many randomized
inputs to catch this deterministically. **Anthropic's own red-team blog
documents using Claude plus property-based testing to find real bugs** —
this is the single most directly applicable citation in this research, from
the same organization building the tool this constitution runs on. —
[Anthropic: Finding bugs with Claude and property-based testing](https://red.anthropic.com/2026/property-based-testing/)

**4. Contract and golden-master/differential testing are standard, general
regression safety nets** — less AI-specific, but directly applicable:
consumer-driven contract tests (Pact-style) catch interface/schema drift
deterministically; golden-master comparison against a known-good baseline
catches silent behavior drift, with modern "smart diff" tooling filtering
benign noise (timestamps/ids) from real breaks. —
[Pact](https://smartbear.com/blog/practice-what-you-pact-catch-breaking-api-changes-before-production-in-the-smartbear-mcp/),
[Golden test](https://inferensys.com/glossary/recursive-error-correction/output-validation-frameworks/golden-test)

**5. LLM-as-judge bias directly undermines "a fresh session is independent
enough."** Known biases: position bias, verbosity bias, and — most
important for this question — **self-preference/family bias**: a
quantified **3.4–8.4 percentage-point leniency lift when judge and candidate
share a model family**, even across entirely separate sessions/instances
with no shared context. The corroborated mitigation is a judge from a
**different provider/family**, not merely a fresh context of the same
model. — [arXiv:2609.17857](https://arxiv.org/html/2609.17857v1),
[arXiv:2410.21819](https://arxiv.org/pdf/2410.21819)

**6. Lightweight requirements-traceability tooling exists and is proven —
heavyweight ALM tools (Jama, Polarion) are not the only path.** `shtracer`
traces requirement → architecture → implementation → test via plain
markdown tags, zero dependencies, outputs structured JSON for CI — a close
precedent for extending `agent-board`'s existing JSONL-event model rather
than adopting new infrastructure. Also notable: LOBSTER, OpenFastTrace,
Reqflow. — [shtracer](https://github.com/qq3g7bad/shtracer),
[Traceability matrix overview](https://en.wikipedia.org/wiki/Traceability_matrix)

**7. Anthropic's own Claude Code team publishes a directly-applicable
separate-session practice.** The writer session never reviews its own
work; a fresh subagent — separate context, seeing only the diff and
criteria, not the writer's reasoning — does first-pass review; findings are
independently reproduced in a separate sandbox agent before being reported;
production PRs run multiple parallel review agents voting with confidence
scores. This is the most directly applicable source for question 2's
"how do we hand off without losing the requirement." —
[How the Claude Code team does code review at Anthropic](https://claude.dev/blog/solving-code-review-at-anthropic/),
[Claude Code best practices](https://code.claude.com/docs/en/best-practices)

## Synthesis: What the Evidence Actually Supports

Fresh-context review **genuinely helps** (well-established across multiple
sources) but is **not sufficient alone** — same-model-family bias persists
even across sessions with zero shared context (finding 5). A "new Claude
session reviews the old Claude session's work" pattern is weaker
independence than it looks. The corroborated path to *real*, not
performative, independence pairs fresh-context review with deterministic
checks that involve no LLM judgment at all (mutation testing, property-based
testing, contract/golden-master testing) — exactly the two legs `design.md`
builds on.

## Observed vs. Inferred

- **Observed** (Part A): every file:line citation above, read directly from
  this repo.
- **Observed, sourced** (Part B): all seven numbered findings, each with a
  URL.
- **Inferred/contested, flagged above**: the counter-study on Claude-authored
  test quality (finding 2) is a single source against a broader consensus —
  treated as a caveat, not a reason to drop mutation testing.
- **Not researched**: actual vendor pricing/integration cost for a
  second-model-family reviewer (out of scope per `requirements.md`).
