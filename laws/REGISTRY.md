# Law Registry

**Constitution v1.0.0** · Ratified 2026-06-01 · 50 laws

Human-readable index of every law. Machine-readable mirror: [registry.json](registry.json).
Look up any law from the command line: `./scripts/law-lookup.sh LAW-2.3`.

Laws change only through the [Amendment Process](../amendments/AMENDMENT-PROCESS.md);
this registry and the law files are kept in lockstep by the `law-integrity` CI workflow.

| ID | Title | Article | Status | Version | Owner Personas | Enforcement |
|---|---|---|---|---|---|---|
| [LAW-1.1](article-1-foundational-principles/LAW-1.1.md) | Code is Written for Humans First | 1 — Foundational Principles | ACTIVE | 1.0 | software-engineer, quality | review |
| [LAW-1.2](article-1-foundational-principles/LAW-1.2.md) | Quality is Built-In, Never Added Later | 1 — Foundational Principles | ACTIVE | 1.0 | quality | review |
| [LAW-1.3](article-1-foundational-principles/LAW-1.3.md) | Consistency Enables Collaboration | 1 — Foundational Principles | ACTIVE | 1.0 | quality, devops | automated |
| [LAW-1.4](article-1-foundational-principles/LAW-1.4.md) | Architecture Decisions Are Intentional | 1 — Foundational Principles | ACTIVE | 1.0 | architect | review |
| [LAW-1.5](article-1-foundational-principles/LAW-1.5.md) | Security is Everybody's Responsibility | 1 — Foundational Principles | ACTIVE | 1.0 | security | review |
| [LAW-2.1](article-2-code-standards/LAW-2.1.md) | Naming Conventions | 2 — Code Standards | ACTIVE | 1.0 | software-engineer, quality | automated |
| [LAW-2.2](article-2-code-standards/LAW-2.2.md) | Formatting via Prettier | 2 — Code Standards | ACTIVE | 1.0 | software-engineer, quality | automated |
| [LAW-2.3](article-2-code-standards/LAW-2.3.md) | Prohibition of the any Type | 2 — Code Standards | ACTIVE | 1.0 | software-engineer, quality | automated |
| [LAW-2.4](article-2-code-standards/LAW-2.4.md) | Explicit Return Types on Exported Functions | 2 — Code Standards | ACTIVE | 1.0 | software-engineer, quality | automated |
| [LAW-2.5](article-2-code-standards/LAW-2.5.md) | Import Ordering | 2 — Code Standards | ACTIVE | 1.0 | software-engineer, quality | automated |
| [LAW-2.6](article-2-code-standards/LAW-2.6.md) | Function Size and Responsibility | 2 — Code Standards | ACTIVE | 1.0 | software-engineer, quality | review |
| [LAW-3.1](article-3-testing-quality/LAW-3.1.md) | Test-First Development | 3 — Testing & Quality | ACTIVE | 1.0 | quality, software-engineer | persona |
| [LAW-3.2](article-3-testing-quality/LAW-3.2.md) | Coverage Floors | 3 — Testing & Quality | ACTIVE | 1.0 | quality, software-engineer | automated |
| [LAW-3.3](article-3-testing-quality/LAW-3.3.md) | Test Structure | 3 — Testing & Quality | ACTIVE | 1.0 | quality, software-engineer | review |
| [LAW-3.4](article-3-testing-quality/LAW-3.4.md) | Test Isolation | 3 — Testing & Quality | ACTIVE | 1.0 | quality, software-engineer | review |
| [LAW-3.5](article-3-testing-quality/LAW-3.5.md) | No Skipped or Hollow Tests | 3 — Testing & Quality | ACTIVE | 1.0 | quality, software-engineer | review |
| [LAW-4.1](article-4-architecture/LAW-4.1.md) | Layered Architecture | 4 — Architecture | ACTIVE | 1.0 | architect | review |
| [LAW-4.2](article-4-architecture/LAW-4.2.md) | SOLID Compliance | 4 — Architecture | ACTIVE | 1.0 | architect | review |
| [LAW-4.3](article-4-architecture/LAW-4.3.md) | No Circular Dependencies | 4 — Architecture | ACTIVE | 1.0 | architect | automated |
| [LAW-4.4](article-4-architecture/LAW-4.4.md) | Sanctioned Patterns | 4 — Architecture | ACTIVE | 1.0 | architect | review |
| [LAW-4.5](article-4-architecture/LAW-4.5.md) | ADR Requirement | 4 — Architecture | ACTIVE | 1.0 | architect | review |
| [LAW-5.1](article-5-security/LAW-5.1.md) | Universal Input Validation | 5 — Security | ACTIVE | 1.0 | security | review |
| [LAW-5.2](article-5-security/LAW-5.2.md) | Parameterized Queries Only | 5 — Security | ACTIVE | 1.0 | security | review |
| [LAW-5.3](article-5-security/LAW-5.3.md) | Secrets Never in Code | 5 — Security | ACTIVE | 1.0 | security | automated |
| [LAW-5.4](article-5-security/LAW-5.4.md) | Established Auth Frameworks Only | 5 — Security | ACTIVE | 1.0 | security | review |
| [LAW-5.5](article-5-security/LAW-5.5.md) | Dependency Hygiene | 5 — Security | ACTIVE | 1.0 | security | automated |
| [LAW-5.6](article-5-security/LAW-5.6.md) | Encryption Standards | 5 — Security | ACTIVE | 1.0 | security | review |
| [LAW-6.1](article-6-review-documentation/LAW-6.1.md) | Two-Approval Review | 6 — Review & Documentation | ACTIVE | 1.0 | quality | automated |
| [LAW-6.2](article-6-review-documentation/LAW-6.2.md) | Quality Gates Are Inviolable | 6 — Review & Documentation | ACTIVE | 1.0 | quality | automated |
| [LAW-6.3](article-6-review-documentation/LAW-6.3.md) | Public API Documentation | 6 — Review & Documentation | ACTIVE | 1.0 | quality, architect | review |
| [LAW-6.4](article-6-review-documentation/LAW-6.4.md) | Comments Explain WHY | 6 — Review & Documentation | ACTIVE | 1.0 | quality, architect | review |
| [LAW-6.5](article-6-review-documentation/LAW-6.5.md) | Docs Travel With Code | 6 — Review & Documentation | ACTIVE | 1.0 | quality, architect | review |
| [LAW-7.1](article-7-ai-governance/LAW-7.1.md) | Human Accountability | 7 — AI Governance | ACTIVE | 1.0 | quality, security | review |
| [LAW-7.2](article-7-ai-governance/LAW-7.2.md) | IP and Data Protection | 7 — AI Governance | ACTIVE | 1.0 | security, quality | persona |
| [LAW-7.3](article-7-ai-governance/LAW-7.3.md) | AI Audit Trail | 7 — AI Governance | ACTIVE | 1.0 | quality, devops | review |
| [LAW-7.4](article-7-ai-governance/LAW-7.4.md) | Identical Standards for AI Code | 7 — AI Governance | ACTIVE | 1.0 | quality, security | review |
| [LAW-7.5](article-7-ai-governance/LAW-7.5.md) | Mandatory Escalation on Uncertainty | 7 — AI Governance | ACTIVE | 1.0 | quality, security | persona |
| [LAW-8.1](article-8-requirements-domain/LAW-8.1.md) | Acceptance Criteria Before Implementation | 8 — Requirements & Domain | ACTIVE | 1.0 | product-owner | persona |
| [LAW-8.2](article-8-requirements-domain/LAW-8.2.md) | Business Rules Are Documented and Cited | 8 — Requirements & Domain | ACTIVE | 1.0 | industry-sme | review |
| [LAW-8.3](article-8-requirements-domain/LAW-8.3.md) | Regulatory Mapping | 8 — Requirements & Domain | ACTIVE | 1.0 | industry-sme | review |
| [LAW-8.4](article-8-requirements-domain/LAW-8.4.md) | Scope Discipline | 8 — Requirements & Domain | ACTIVE | 1.0 | product-owner | persona |
| [LAW-9.1](article-9-operations-cost/LAW-9.1.md) | Infrastructure as Code | 9 — Operations & Cost | ACTIVE | 1.0 | devops | review |
| [LAW-9.2](article-9-operations-cost/LAW-9.2.md) | Deployment Safety | 9 — Operations & Cost | ACTIVE | 1.0 | devops | review |
| [LAW-9.3](article-9-operations-cost/LAW-9.3.md) | Cost Impact Assessment | 9 — Operations & Cost | ACTIVE | 1.0 | finops | persona |
| [LAW-9.4](article-9-operations-cost/LAW-9.4.md) | License Compliance | 9 — Operations & Cost | ACTIVE | 1.0 | finops | persona |
| [LAW-10.1](article-10-agentic-development/LAW-10.1.md) | Spec-Driven Agent Work | 10 — Agentic Development | ACTIVE | 1.0 | software-engineer, product-owner | persona |
| [LAW-10.2](article-10-agentic-development/LAW-10.2.md) | Verifiable Completion | 10 — Agentic Development | ACTIVE | 1.0 | quality, software-engineer | persona |
| [LAW-10.3](article-10-agentic-development/LAW-10.3.md) | Agent Sandboxing and Permissions | 10 — Agentic Development | ACTIVE | 1.0 | security, devops | review |
| [LAW-10.4](article-10-agentic-development/LAW-10.4.md) | Steering Files Are Governed Artifacts | 10 — Agentic Development | ACTIVE | 1.0 | software-engineer, quality | review |
| [LAW-10.5](article-10-agentic-development/LAW-10.5.md) | Fresh-Context Review | 10 — Agentic Development | ACTIVE | 1.0 | quality | persona |

## Counts by Article

| Article | Domain | Laws |
|---|---|---|
| 1 | Foundational Principles | 5 |
| 2 | Code Standards | 6 |
| 3 | Testing & Quality | 5 |
| 4 | Architecture | 5 |
| 5 | Security | 6 |
| 6 | Review & Documentation | 5 |
| 7 | AI Governance | 5 |
| 8 | Requirements & Domain | 4 |
| 9 | Operations & Cost | 4 |
| 10 | Agentic Development | 5 |
| | **Total** | **50** |
