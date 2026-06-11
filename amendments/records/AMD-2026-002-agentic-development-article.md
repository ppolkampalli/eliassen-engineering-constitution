---
id: AMD-2026-002
status: ENACTED
proposed_by: "PPolkampalli@eliassen.com (AI-assisted research initiative — Claude, per LAW-7.3)"
proposed_date: "2026-06-11"
laws_affected: [LAW-10.1, LAW-10.2, LAW-10.3, LAW-10.4, LAW-10.5]
reviewers_required: [security, quality, devops, software-engineer, product-owner, architect]
decision_by: "P. Polkampalli (PPolkampalli@eliassen.com)"
decision_date: "2026-06-11"
---

# AMD-2026-002: Ratify Article 10 — Agentic Development

## Motivation

The constitution governs *what* AI-assisted code must satisfy (Article 7) but not
*how agentic work itself is conducted*. Verified primary sources show a coherent
practice layer that mature tooling vendors and 60k+ open-source projects have
already standardized, and that our constitution lacks entirely
(docs/research/2026-06-11-agentic-constitution-research.md, section b):

- GitHub Spec Kit embeds project constitutions into agent planning artifacts with
  semantic versioning and sync-impact propagation.
- Anthropic's agentic best practices center on verifiable completion ("give the
  agent a check it can run… show evidence rather than asserting success"),
  explore→plan→implement workflow, and fresh-context adversarial review.
- Anthropic's sandboxing doctrine: "effective sandboxing requires *both*
  filesystem and network isolation" against a prompt-injection threat model.
- AGENTS.md is an open standard (Agentic AI Foundation / Linux Foundation) used by
  60k+ projects and supported by every major agent tool.
- Kent Beck (2025) documents unconstrained agents deleting failing tests —
  motivating structural guardrails on agent autonomy.

## Changes

Creates **Article 10 — Agentic Development** with five laws at v1.0 (full draft
texts below; files enter `laws/article-10-agentic-development/` only at enactment).

### LAW-10.1 Spec-Driven Agent Work (new, v1.0)
**Owner personas:** software-engineer, product-owner · **Enforcement:** persona

> **Statement:** Substantial agent-executed work — multi-file changes, new
> features, refactors — proceeds from a written specification or plan reviewed
> before implementation begins. The plan re-checks the constitution: it names the
> laws bearing on the work and how the approach satisfies them. Trivial,
> single-step changes are exempt. An agent that begins substantial implementation
> without an approved spec/plan exceeds its mandate (LAW-7.5, LAW-8.1).
>
> **Rationale (sourced):** Spec Kit's constitution-checked plan templates and
> Anthropic's explore→plan→implement guidance both converge on the same finding:
> agents that jump straight to code solve the wrong problem confidently. The spec
> is also the verification anchor for LAW-10.2.

### LAW-10.2 Verifiable Completion (new, v1.0)
**Owner personas:** quality, software-engineer · **Enforcement:** persona

> **Statement:** Every agent task defines, before implementation, a check the
> agent can run — a test suite, a build, a lint pass, a diff against a fixture, a
> screenshot comparison. The agent iterates until the check passes and presents
> the evidence (test output, command results) with its work. "Looks done" is not
> done; completion claims without runnable evidence are presumed unverified.
>
> **Rationale (sourced):** Anthropic: "Give Claude a check it can run… Have Claude
> show evidence rather than asserting success." Without a closing check, the human
> becomes the verification loop and every defect waits to be noticed — the
> trust-then-verify gap is the documented top failure pattern of agentic work.

### LAW-10.3 Agent Sandboxing and Permissions (new, v1.0)
**Owner personas:** security, devops · **Enforcement:** review

> **Statement:** Autonomous agent runs (unattended, CI, batch) operate inside a
> sandbox providing BOTH filesystem isolation (access limited to the project
> workspace) and network isolation (connections limited to approved endpoints) —
> one without the other is not sandboxing. Interactive sessions use scoped
> permission allowlists; unattended invocations declare an explicit tool/command
> allowlist. Agents never run with credentials or scopes beyond the task's needs;
> prompt injection is treated as the default threat model for any agent that
> reads untrusted content (LAW-5.1 applied to agents).
>
> **Rationale (sourced):** Anthropic's sandboxing doctrine verbatim: "effective
> sandboxing requires both filesystem and network isolation" — filesystem-only
> permits exfiltration, network-only permits tampering. OS-level enforcement
> reduced permission friction 84% while containing prompt-injected agents.

### LAW-10.4 Steering Files Are Governed Artifacts (new, v1.0)
**Owner personas:** software-engineer, quality · **Enforcement:** review

> **Statement:** Agent steering files (CLAUDE.md, AGENTS.md, and equivalents) are
> code: version-controlled, reviewed in PRs, kept concise, and pruned regularly.
> Every line must earn its context cost — "would removing this cause the agent to
> make mistakes?" Rules that must ALWAYS hold are implemented as hooks or CI
> gates, not steering-file prose (deterministic > advisory). Projects ship both
> CLAUDE.md and the open-standard AGENTS.md; in monorepos, nested steering files
> follow closest-takes-precedence.
>
> **Rationale (sourced):** Anthropic: "Treat CLAUDE.md like code… Bloated CLAUDE.md
> files cause Claude to ignore your actual instructions." AGENTS.md is stewarded by
> the Linux Foundation's Agentic AI Foundation with 60k+ adopting projects and
> support across Codex, Jules, Cursor, Aider, VS Code, Devin, and Copilot —
> single-vendor steering files strand the standards investment.

### LAW-10.5 Fresh-Context Review (new, v1.0)
**Owner personas:** quality · **Enforcement:** persona

> **Statement:** Agent-produced work is reviewed by a context that did not produce
> it — a fresh agent session, a subagent seeing only the diff and the criteria, or
> a human (LAW-6.1's two human approvals always stand). The implementing context
> never grades its own work. Reviewers are directed to gaps affecting correctness
> and stated requirements, not style preferences; agents must not delete, skip, or
> weaken a failing test or check to reach green (extends LAW-3.5 and the LAW-3.1
> guardrail to all verification artifacts).
>
> **Rationale (sourced):** Anthropic: "A fresh context improves code review since
> Claude won't be biased toward code it just wrote." Beck (2025) reports
> unconstrained agents deleting failing tests — the implementing context has both
> the means and the motive to weaken its own checks.

## Impact Analysis

- **Projects:** new Article applies to all agent-assisted work; rollout via the
  standard 12-week phasing (docs/rollout-guide.md gains a Phase 4 line item).
- **Configs/tooling:** `scripts/install.sh` gains AGENTS.md generation (LAW-10.4);
  recommended sandbox/allowlist settings documented in docs/standards.md;
  CLAUDE.md gains an Article 10 digest line at enactment.
- **Registry/REGISTRY.md:** +5 laws; law count 45 → 50.
- **Personas:** security gains LAW-10.3 ownership; quality gains 10.2/10.5;
  software-engineer 10.1/10.4; product-owner co-owns 10.1; persona-guide.md table
  updates at enactment.
- **Skills:** constitution-enforcer hard-rules digest and ai-transparency extend to
  Article 10.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Security | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | LAW-10.3 primary |
| Quality | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | LAW-10.2, 10.5 |
| DevOps | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | Sandboxing mechanics, CI agents |
| Software Engineer | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | LAW-10.1, 10.4 |
| Product Owner | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | LAW-10.1 spec gate |
| Architect | P. Polkampalli (en bloc) | APPROVE | 2026-06-11 | Article structure |

## Decision
Approved/Rejected by: **P. Polkampalli (PPolkampalli@eliassen.com)** Date: **2026-06-11**
Rationale: Approved en bloc with the full v1.1 amendment wave, on the evidence of
docs/research/2026-06-11-agentic-constitution-research.md. Article 10 enters force
at v1.0, effective 2026-06-11.
