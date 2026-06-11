# Engineering Constitution — Project Rules

This project is governed by the **Eliassen Group Engineering Constitution v1.2.0**.
Laws are citable by ID. Full registry: `docs/constitution/REGISTRY.md` (installed copy)
or the `engineering-constitution` repository. Look up any law: `./scripts/law-lookup.sh LAW-X.Y`
(in the constitution repo) or read `docs/constitution/registry.json`.

## The Ten Articles (most-invoked laws)

1. **Foundational Principles** — readable code (LAW-1.1), quality built-in (LAW-1.2), consistency (LAW-1.3), intentional architecture (LAW-1.4), security is everyone's (LAW-1.5)
2. **Code Standards** — naming (LAW-2.1), Prettier (LAW-2.2), no `any` (LAW-2.3), explicit return types (LAW-2.4), import order (LAW-2.5), single-purpose functions w/ CC≤5/~40-LOC advisory (LAW-2.6)
3. **Testing & Quality** — Canon TDD + never weaken failing tests (LAW-3.1), coverage floors (LAW-3.2), AAA structure (LAW-3.3), isolation (LAW-3.4), no hollow tests (LAW-3.5), mutation testing (LAW-3.6)
4. **Architecture** — domain-first layering, modular-monolith default (LAW-4.1), SOLID (LAW-4.2), no cycles (LAW-4.3), sanctioned patterns (LAW-4.4), ADRs (LAW-4.5), resilience patterns (LAW-4.6)
5. **Security** — input validation (LAW-5.1), parameterized queries (LAW-5.2), no secrets in code (LAW-5.3), established auth (LAW-5.4), dependency hygiene (LAW-5.5), encryption (LAW-5.6)
6. **Review & Documentation** — two approvals (LAW-6.1), inviolable gates (LAW-6.2), JSDoc (LAW-6.3), abstraction + WHY comments (LAW-6.4), docs with code (LAW-6.5)
7. **AI Governance** — human accountability (LAW-7.1), data protection (LAW-7.2), audit trail (LAW-7.3), identical standards (LAW-7.4), escalate on uncertainty (LAW-7.5), code-health metrics (LAW-7.6)
8. **Requirements & Domain** — acceptance criteria first (LAW-8.1), cited business rules (LAW-8.2), regulatory mapping (LAW-8.3), scope discipline (LAW-8.4)
9. **Operations & Cost** — infrastructure as code (LAW-9.1), reversible deploys (LAW-9.2), cost review (LAW-9.3), license compliance (LAW-9.4), SLOs (LAW-9.5), error budgets (LAW-9.6), failure testing (LAW-9.7)
10. **Agentic Development** — spec-driven agent work (LAW-10.1), verifiable completion (LAW-10.2), sandboxing + permissions (LAW-10.3), governed steering files (LAW-10.4), fresh-context review (LAW-10.5), defined workflows (LAW-10.6)

## Hard Rules (non-negotiable)

- **Naming** per the LAW-2.1 table: camelCase variables/functions, PascalCase types (no `I` prefix), UPPER_SNAKE_CASE constants, is/has/can booleans, kebab-case files.
- **No `any`** — use `unknown` + type narrowing (LAW-2.3).
- **TDD-first** — test list, one failing test at a time (LAW-3.1). **Never delete, skip, or weaken a failing test to achieve green.**
- **80% coverage floor** (100% utilities, 70% controllers) — never lower a threshold to pass a build (LAW-3.2).
- **Security basics** (Article 5): allowlist-validate all external input, parameterized queries only, no secrets in code or logs, established auth frameworks only.
- **Tag AI commits** with `[Claude-assisted]` and fill the PR's AI Assistance section (LAW-7.3).
- **Agentic work** (Article 10): substantial work proceeds from a reviewed plan naming the bearing laws (LAW-10.1); define a runnable check first and present evidence, not assertions (LAW-10.2); your output is reviewed by a context that didn't produce it (LAW-10.5).

## Personas

Assume the matching persona for the work at hand (see `.claude/skills/personas/`):
security work → Security persona; design/refactors → Architect; tests/review → Quality;
requirements/scope → Product Owner; infra/deploys → DevOps; cost/licenses → FinOps;
domain rules → Industry SME; implementation (default) → Software Engineer.

- **Cite laws in all decisions** — full DECISION/CITATION/RATIONALE/PERSONA block for
  significant decisions, inline `(per [LAW-X.Y vN])` for minor corrections.
- **On uncertainty, stop and ask** per LAW-7.5 — ambiguous requirements, lasting
  architectural choices, and security questions are escalated, never guessed.
- Cross-cutting changes or persona conflicts → persona-council skill.

## Workflows (LAW-10.6)

Nontrivial work follows a declared workflow from `docs/constitution/workflows/`
(WF-FEATURE, WF-RESEARCH, WF-BUG, WF-SECBUG, WF-REFACTOR, WF-AMENDMENT) — use the
workflow-orchestrator skill. Deviations on non-hard stages are allowed when asked,
but every deviation is recorded on the work item; hard stages (marked `*`) and
WF-AMENDMENT's sequence are never overridable. Project-local `workflows/` files
override the catalog by ID but cannot soften org hard stages.

## Before Declaring Any Work Done

```bash
npm run lint && npm run type-check && npm test
```

All three must pass (LAW-6.2). Quality gates have no override path.
