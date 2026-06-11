# The Engineering Constitution

**Eliassen Group** · Version 1.2.0 · Ratified 2026-06-01 via [AMD-2026-001](amendments/records/AMD-2026-001-initial-ratification.md) · Amended 2026-06-11 via [AMD-2026-002…010](amendments/records/)

---

## Preamble

This constitution codifies the software engineering quality standards of Eliassen
Group for JavaScript/TypeScript (Node.js + React) delivery teams: 20–50 distributed
engineers working with AI assistance across client engagements.

**Purpose.** To make quality systematic instead of heroic. Standards here are not
aspirations; they are numbered, versioned **Laws** — citable by ID, enforced by
tooling, personas, and review, and changeable only through a recorded amendment
process.

**Scope.** All JavaScript/TypeScript projects delivered by or for Eliassen Group.
The constitution binds human engineers and AI agents identically (LAW-7.4).

**The six founding pain points.** This constitution exists because we repeatedly
paid for the same failures:

1. **Review bottlenecks** — slow, inconsistent, frequently superficial reviews
2. **Inconsistent standards** — every project its own dialect
3. **Low test coverage** — incidents living in untested paths
4. **Security vulnerabilities** — injection, leaked secrets, vulnerable dependencies
   reaching production
5. **Poor documentation** — intent living in heads and chat threads
6. **Unaddressed tech debt** — "later" never arriving

Every law's Rationale section traces back to one or more of these.

---

## How to Read and Cite Laws

Each law is one file in `laws/` with a quotable **Statement**, a **Rationale** (the
WHY), compliance examples, and an amendment history. The full index is
[laws/REGISTRY.md](laws/REGISTRY.md) (human) and [laws/registry.json](laws/registry.json)
(machine); `./scripts/law-lookup.sh LAW-2.3` prints any law from the command line.

Decisions made under this constitution are **articulated as citations**:

```text
DECISION: Rejecting use of `any` type in payment-service.ts line 47.
CITATION: [LAW-2.3 v1.0] "The `any` type is prohibited. Use `unknown`
with type narrowing."
RATIONALE (from law record): `any` silently disables type checking,
defeating the purpose of TypeScript and allowing type errors to reach
production.
PERSONA: Software Engineer (owner: Quality)
```

Short corrections may use the inline form: `(per [LAW-2.1 v1.0])`. The complete
specification lives in
[citation-format.md](.claude/skills/constitution-enforcer/reference/citation-format.md).

---

## The Ten Articles

| Article | Domain | Laws | Summary |
|---|---|---|---|
| [1 — Foundational Principles](laws/article-1-foundational-principles/) | Principles | 1.1–1.5 | Readable code, built-in quality, zero-exception consistency, intentional architecture, universal security responsibility |
| [2 — Code Standards](laws/article-2-code-standards/) | Code | 2.1–2.6 | Naming table, Prettier formatting, no `any`, explicit return types, import order, single-purpose functions (CC≤5/~40-LOC advisory) |
| [3 — Testing & Quality](laws/article-3-testing-quality/) | Tests | 3.1–3.6 | Canon TDD with agent guardrail, coverage floors (80/100/70), AAA structure, isolated <1s unit tests, no hollow tests, mutation testing |
| [4 — Architecture](laws/article-4-architecture/) | Design | 4.1–4.6 | Domain-first modular monolith with layers within, SOLID, no cycles, sanctioned patterns, ADRs before merge, resilience patterns |
| [5 — Security](laws/article-5-security/) | Security | 5.1–5.6 | Allowlist input validation, parameterized queries, no secrets in code, established auth only, dependency hygiene, TLS 1.2+/at-rest encryption |
| [6 — Review & Documentation](laws/article-6-review-documentation/) | Review | 6.1–6.5 | Two approvals incl. domain expert, inviolable quality gates, JSDoc on public APIs, abstraction + WHY comments, docs in the same PR |
| [7 — AI Governance](laws/article-7-ai-governance/) | AI | 7.1–7.6 | Human accountability, IP/data protection, `[Claude-assisted]` audit trail, identical standards, escalation on uncertainty, code-health metrics |
| [8 — Requirements & Domain](laws/article-8-requirements-domain/) | Domain | 8.1–8.4 | Acceptance criteria before code, cited business rules, regulatory mapping, scope discipline |
| [9 — Operations & Cost](laws/article-9-operations-cost/) | Ops | 9.1–9.7 | IaC, reversible deployments, cost review + tagging, license compliance, SLOs, error budgets, failure-injection testing |
| [10 — Agentic Development](laws/article-10-agentic-development/) | Agents | 10.1–10.6 | Spec-driven agent work, verifiable completion, sandboxing + permissions, governed steering files, fresh-context review, defined workflows |

---

## The Persona System

Eight personas — defined as skills in [.claude/skills/personas/](.claude/skills/personas/)
— let AI agents assume a role with a mandate, owned laws, and bounded authority.
**Every persona decision cites laws.** Full guide: [docs/persona-guide.md](docs/persona-guide.md).

| Persona | Domain | Owned Laws |
|---|---|---|
| Industry SME | Domain rules, regulation | 8.2, 8.3 |
| Product Owner | Requirements, scope, process | 8.1, 8.4, 10.6, co-owns 9.5, 9.6, 10.1 |
| Quality | Testing, review standards, process | 3.1–3.6, 6.1, 6.2, 10.2, 10.5, 10.6, co-owns 2.3, 7.6 |
| Architect | Design, patterns, ADRs | 4.1–4.6, 1.4, co-owns 7.6 |
| Software Engineer | Implementation (default) | 2.1–2.6, 10.1, 10.4 |
| DevOps | CI/CD, infra, deploys, reliability | 9.1, 9.2, 9.5–9.7, co-owns 4.6, 10.3; enforces 6.2 |
| Security | Article 5 + AI data + agents | 5.1–5.6, 10.3, co-enforces 7.2, 1.5 |
| FinOps | Cost, licensing | 9.3, 9.4 |

**Authority ladder** (applies wherever personas conflict):

```
Security VETO (CRITICAL findings; overridable only by a named human security lead)
  > Architect VETO (layer violations, circular dependencies)
    > Quality BLOCK (coverage floors, gate integrity)
      > DevOps / Product Owner BLOCK (no-rollback deploys / missing acceptance criteria)
        > Advisory personas (Industry SME, FinOps advise; FinOps subordinate to Security)
```

Cross-cutting work and unresolved conflicts go to the
[persona-council](.claude/skills/persona-council/SKILL.md), which surfaces
disagreements verbatim and escalates to humans per LAW-7.5.

**How work flows between personas** is defined by the
[workflow catalog](workflows/README.md) (LAW-10.6): staged persona chains —
WF-FEATURE, WF-RESEARCH, WF-BUG, WF-SECBUG, WF-REFACTOR, WF-AMENDMENT — driven
by the workflow-orchestrator skill, with conversational-but-recorded deviations
and inviolable hard stages.

---

## Amending the Constitution

Laws change **only** through the five-stage amendment process —
proposal → review → decision → enactment → propagation — documented in
[amendments/AMENDMENT-PROCESS.md](amendments/AMENDMENT-PROCESS.md).

- Every change is recorded with rationale, approver, and date.
- Rejected amendments are retained with their rejection rationale.
- Repealed laws are never deleted; they remain citable for historical decisions.
- The `law-integrity` CI workflow fails any PR changing a law without an amendment
  record — auditability is enforced by machine, not memory.

---

## Ratification

By approval of AMD-2026-001, this constitution and all 45 laws of Articles 1–9
enter force at v1.0.0, effective **2026-06-01**.

| Role | Name | Signature | Date |
|---|---|---|---|
| VP Engineering | ____________________ | ____________________ | 2026-06-01 |
| Tech Lead, Platform | ____________________ | ____________________ | 2026-06-01 |
| Security Lead | ____________________ | ____________________ | 2026-06-01 |

## Review Schedule

The constitution is reviewed quarterly: laws with recurring exception requests,
amendment proposals from retrospectives, and pain-point metrics are evaluated, and
outcomes are recorded as amendments.

**First quarterly review: 2026-09-01.**
