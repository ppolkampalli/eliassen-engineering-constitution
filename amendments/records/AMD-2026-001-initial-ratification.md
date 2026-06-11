---
id: AMD-2026-001
status: ENACTED
proposed_by: "Engineering Leadership, Eliassen Group"
proposed_date: "2026-05-01"
laws_affected: [LAW-1.1, LAW-1.2, LAW-1.3, LAW-1.4, LAW-1.5, LAW-2.1, LAW-2.2, LAW-2.3, LAW-2.4, LAW-2.5, LAW-2.6, LAW-3.1, LAW-3.2, LAW-3.3, LAW-3.4, LAW-3.5, LAW-4.1, LAW-4.2, LAW-4.3, LAW-4.4, LAW-4.5, LAW-5.1, LAW-5.2, LAW-5.3, LAW-5.4, LAW-5.5, LAW-5.6, LAW-6.1, LAW-6.2, LAW-6.3, LAW-6.4, LAW-6.5, LAW-7.1, LAW-7.2, LAW-7.3, LAW-7.4, LAW-7.5, LAW-8.1, LAW-8.2, LAW-8.3, LAW-8.4, LAW-9.1, LAW-9.2, LAW-9.3, LAW-9.4]
reviewers_required: [industry-sme, product-owner, quality, architect, software-engineer, devops, security, finops]
decision_by: "VP Engineering, Eliassen Group"
decision_date: "2026-06-01"
---

# AMD-2026-001: Initial Ratification of the Engineering Constitution

## Motivation

This amendment ratifies all forty-five laws of Articles 1–9 at version 1.0,
establishing the Engineering Constitution as the governing standard for all
JavaScript/TypeScript (Node.js + React) projects at Eliassen Group.

The constitution exists because of **six founding pain points** observed across
engagements and teams:

1. **Review bottlenecks** — reviews were slow, inconsistent, and frequently
   superficial; standards were re-debated in every PR thread.
2. **Inconsistent standards** — each project carried its own conventions and
   tooling, taxing every engineer who moved between projects.
3. **Low test coverage** — untested paths were the source of recurring
   production incidents; coverage was aspirational, not enforced.
4. **Security vulnerabilities** — injection, leaked secrets, and vulnerable
   dependencies were reaching production for lack of systematic gates.
5. **Poor documentation** — APIs, runbooks, and architectural intent lived in
   heads and chat threads, not in the repository.
6. **Unaddressed tech debt** — "later" never came; deferred quality compounded
   silently until it dominated delivery cost.

Each article addresses one or more of these pain points directly; each law's
Rationale section records which failure mode it prevents. With the rise of
AI-assisted development across our 20–50-engineer distributed teams, Article 7
extends the same discipline to AI involvement: human accountability, data
protection, audit trail, identical standards, and mandatory escalation.

## Changes

All 45 laws are **created** at v1.0 (no prior text exists):

### Article 1 — Foundational Principles (v0 → v1.0)
LAW-1.1 Code is Written for Humans First · LAW-1.2 Quality is Built-In, Never
Added Later · LAW-1.3 Consistency Enables Collaboration · LAW-1.4 Architecture
Decisions Are Intentional · LAW-1.5 Security is Everybody's Responsibility

### Article 2 — Code Standards (v0 → v1.0)
LAW-2.1 Naming Conventions · LAW-2.2 Formatting via Prettier · LAW-2.3
Prohibition of the `any` Type · LAW-2.4 Explicit Return Types on Exported
Functions · LAW-2.5 Import Ordering · LAW-2.6 Function Size and Responsibility

### Article 3 — Testing & Quality (v0 → v1.0)
LAW-3.1 Test-First Development · LAW-3.2 Coverage Floors · LAW-3.3 Test
Structure · LAW-3.4 Test Isolation · LAW-3.5 No Skipped or Hollow Tests

### Article 4 — Architecture (v0 → v1.0)
LAW-4.1 Layered Architecture · LAW-4.2 SOLID Compliance · LAW-4.3 No Circular
Dependencies · LAW-4.4 Sanctioned Patterns · LAW-4.5 ADR Requirement

### Article 5 — Security (v0 → v1.0)
LAW-5.1 Universal Input Validation · LAW-5.2 Parameterized Queries Only ·
LAW-5.3 Secrets Never in Code · LAW-5.4 Established Auth Frameworks Only ·
LAW-5.5 Dependency Hygiene · LAW-5.6 Encryption Standards

### Article 6 — Review & Documentation (v0 → v1.0)
LAW-6.1 Two-Approval Review · LAW-6.2 Quality Gates Are Inviolable · LAW-6.3
Public API Documentation · LAW-6.4 Comments Explain WHY · LAW-6.5 Docs Travel
With Code

### Article 7 — AI Governance (v0 → v1.0)
LAW-7.1 Human Accountability · LAW-7.2 IP and Data Protection · LAW-7.3 AI
Audit Trail · LAW-7.4 Identical Standards for AI Code · LAW-7.5 Mandatory
Escalation on Uncertainty

### Article 8 — Requirements & Domain (v0 → v1.0)
LAW-8.1 Acceptance Criteria Before Implementation · LAW-8.2 Business Rules Are
Documented and Cited · LAW-8.3 Regulatory Mapping · LAW-8.4 Scope Discipline

### Article 9 — Operations & Cost (v0 → v1.0)
LAW-9.1 Infrastructure as Code · LAW-9.2 Deployment Safety · LAW-9.3 Cost
Impact Assessment · LAW-9.4 License Compliance

Full text of every law: see `laws/` and [REGISTRY.md](../../laws/REGISTRY.md).

## Impact Analysis

- **Projects affected:** All new JavaScript/TypeScript projects immediately;
  existing projects onboard per the 12-week phased rollout
  (docs/rollout-guide.md).
- **Configs/tooling established:** ESLint, Prettier, tsconfig, Jest, lint-staged
  configs (configs/); pre-commit hook (hooks/); quality, security, and
  law-integrity CI workflows (ci/github/).
- **Personas established:** All 8 persona mandates defined against these laws
  (.claude/skills/personas/), plus persona-council and law-clerk.

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|
| Industry SME | Engineering Leadership | APPROVE | 2026-05-28 | Domain/regulatory laws (8.2, 8.3) reviewed |
| Product Owner | Engineering Leadership | APPROVE | 2026-05-28 | AC and scope laws (8.1, 8.4) reviewed |
| Quality | Engineering Leadership | APPROVE | 2026-05-28 | Articles 3, 6 reviewed |
| Architect | Engineering Leadership | APPROVE | 2026-05-28 | Article 4, LAW-1.4 reviewed |
| Software Engineer | Engineering Leadership | APPROVE | 2026-05-28 | Article 2 reviewed |
| DevOps | Engineering Leadership | APPROVE | 2026-05-28 | LAW-9.1, 9.2, gate mechanics reviewed |
| Security | Engineering Leadership | APPROVE | 2026-05-28 | Article 5, LAW-7.2 reviewed; veto authority confirmed |
| FinOps | Engineering Leadership | APPROVE | 2026-05-28 | LAW-9.3, 9.4 reviewed; subordination to Security confirmed |

## Decision
Approved/Rejected by: **VP Engineering, Eliassen Group** Date: **2026-06-01**
Rationale: Ratified as the founding act of the Engineering Constitution. All 45
laws enter force at v1.0 on 2026-06-01. First quarterly review scheduled
2026-09-01.
