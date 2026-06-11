# CLAUDE CODE REQUIREMENTS PROMPT
## Build the Engineering Constitution Repository — Laws, Personas, and Amendment Audit Trail

> **How to use this document:** Paste this entire prompt into Claude Code from an empty directory. Claude Code will scaffold a complete, rollout-ready git repository containing our Engineering Constitution structured as citable Laws, 8 assumable Personas for agentic coding, a full amendment/audit system, Claude skills, configuration building blocks, and install tooling.

---

## MISSION

You are building a git repository named **`engineering-constitution`**. This repo is the single source of truth for our organization's SDLC quality standards for **JavaScript/TypeScript (Node.js + React)** teams of 20–50 distributed, AI-assisted engineers.

The repo serves five purposes:

1. **Constitution as Law** — Quality standards are codified as numbered, versioned, **citable Laws**. Any skill, persona, or developer in any project can quote a law by ID (e.g., `LAW-2.3`) and retrieve its full text and rationale.
2. **Personas for Agentic Coding** — 8 persona skills that AI coding agents can assume. Each persona has a mandate, owns specific laws, has defined decision authority, and **must cite laws when making or justifying decisions**.
3. **Amendment Audit Trail** — Laws can only be created, edited, or repealed through a formal amendment process. Every change is recorded with rationale, approver, and date, so consuming projects can always answer: *"Why does this law exist, and why did it change?"*
4. **Claude Skills** — Enforcement skills that apply the laws whenever Claude assists with development in any project.
5. **Rollout Tooling** — Install scripts that copy the building blocks (laws, personas, configs, hooks, CI workflows, CLAUDE.md, skills) into any target project repo in one command.

Work through the deliverables in order. Initialize git, commit logically per section, and finish by running the acceptance checklist at the bottom.

---

## CORE DESIGN REQUIREMENT: CITABILITY

This is the most important requirement in this prompt. **Everything must be quotable.**

When this constitution is referenced from another project — by a human, by Claude, or by an agentic persona — decisions must be articulated as citations:

```
DECISION: Rejecting use of `any` type in payment-service.ts line 47.
CITATION: [LAW-2.3 v1.0] "The `any` type is prohibited. Use `unknown`
with type narrowing."
RATIONALE (from law record): `any` silently disables type checking,
defeating the purpose of TypeScript and allowing type errors to reach
production.
PERSONA: Software Engineer (owner: Quality)
```

Every skill and persona you build must produce decisions in this citation format. The law registry must make lookup trivial for both humans (markdown) and agents (JSON).

---

## DELIVERABLE 1: REPOSITORY STRUCTURE

Create exactly this structure:

```
engineering-constitution/
├── README.md
├── CONSTITUTION.md                    # Preamble, articles overview, governance, ratification
├── CLAUDE.md                          # Distilled rules for Claude Code (installed into every project)
├── CHANGELOG.md
├── LICENSE
│
├── laws/
│   ├── REGISTRY.md                    # Human-readable index of all laws (table: ID, title, status, version, owner)
│   ├── registry.json                  # Machine-readable law registry for agents
│   ├── article-1-foundational-principles/
│   │   ├── LAW-1.1.md ... LAW-1.5.md
│   ├── article-2-code-standards/
│   │   ├── LAW-2.1.md ... LAW-2.6.md
│   ├── article-3-testing-quality/
│   │   ├── LAW-3.1.md ... LAW-3.5.md
│   ├── article-4-architecture/
│   │   ├── LAW-4.1.md ... LAW-4.5.md
│   ├── article-5-security/
│   │   ├── LAW-5.1.md ... LAW-5.6.md
│   ├── article-6-review-documentation/
│   │   ├── LAW-6.1.md ... LAW-6.5.md
│   ├── article-7-ai-governance/
│   │   ├── LAW-7.1.md ... LAW-7.5.md
│   ├── article-8-requirements-domain/
│   │   ├── LAW-8.1.md ... LAW-8.4.md
│   └── article-9-operations-cost/
│       ├── LAW-9.1.md ... LAW-9.4.md
│
├── amendments/
│   ├── AMENDMENT-PROCESS.md           # The formal process for changing laws
│   ├── AMENDMENT-TEMPLATE.md
│   └── records/
│       └── AMD-2026-001-initial-ratification.md
│
├── .claude/
│   └── skills/
│       ├── personas/
│       │   ├── industry-sme/SKILL.md
│       │   ├── product-owner/SKILL.md
│       │   ├── quality/SKILL.md
│       │   ├── architect/SKILL.md
│       │   ├── software-engineer/SKILL.md
│       │   ├── devops/SKILL.md
│       │   ├── security/SKILL.md
│       │   └── finops/SKILL.md
│       ├── constitution-enforcer/
│       │   ├── SKILL.md
│       │   └── reference/
│       │       ├── citation-format.md
│       │       └── violation-severity.md
│       ├── law-clerk/
│       │   └── SKILL.md               # Manages amendments and audit trail
│       ├── persona-council/
│       │   └── SKILL.md               # Orchestrates multi-persona review
│       ├── tdd-assistant/SKILL.md
│       ├── code-review-assistant/SKILL.md
│       ├── security-checker/SKILL.md
│       ├── documentation-generator/SKILL.md
│       └── ai-transparency/SKILL.md
│
├── configs/
│   ├── .eslintrc.json
│   ├── .prettierrc.json
│   ├── tsconfig.base.json
│   ├── jest.config.js
│   └── lint-staged.config.js
│
├── hooks/
│   └── pre-commit
│
├── ci/
│   └── github/
│       ├── quality.yml
│       ├── security.yml
│       └── law-integrity.yml          # Validates registry consistency on every PR to this repo
│
├── templates/
│   ├── pull_request_template.md
│   ├── adr-template.md
│   ├── law-template.md
│   ├── commit-message-guide.md
│   └── new-project-readme.md
│
├── checklists/
│   ├── code-review-checklist.md
│   └── pre-commit-checklist.md
│
├── docs/
│   ├── standards.md
│   ├── testing-guide.md
│   ├── rollout-guide.md
│   ├── persona-guide.md               # How and when agents assume personas
│   └── adr/
│       └── 0001-adopt-engineering-constitution.md
│
└── scripts/
    ├── install.sh
    ├── validate.sh
    ├── update.sh
    └── law-lookup.sh                  # CLI: ./law-lookup.sh LAW-2.3 → prints law text + rationale
```

---

## DELIVERABLE 2: THE LAW SYSTEM

### 2.1 Law Record Format

Every law is one markdown file with YAML frontmatter. Create `templates/law-template.md` and use this exact format for all laws:

```markdown
---
id: LAW-2.3
title: Prohibition of the `any` Type
article: 2
article_name: Code Standards
status: ACTIVE            # ACTIVE | AMENDED | REPEALED | PROPOSED
version: 1.0
effective_date: 2026-06-01
owner_personas: [software-engineer, quality]
enforcement: automated    # automated | review | persona | manual
enforcement_mechanism: "ESLint rule @typescript-eslint/no-explicit-any: error"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-2.3: Prohibition of the `any` Type

## Statement (quotable)

> The `any` type is prohibited in all TypeScript code. When a type is
> genuinely unknown, use `unknown` and narrow it with type guards before
> use. Exceptions require an inline justification comment and approval
> from the Quality persona owner during code review.

## Rationale (the WHY — always citable alongside the statement)

`any` silently disables TypeScript's type checking for that value and
everything it touches, defeating the purpose of strict mode and allowing
type errors to reach production. `unknown` provides the same flexibility
while forcing explicit, safe narrowing. This law exists because type-related
production bugs were one of the six founding pain points of this constitution.

## Compliance Examples

VIOLATION:
\`\`\`typescript
function process(data: any) { return data.value; }
\`\`\`

COMPLIANT:
\`\`\`typescript
function process(data: unknown): string {
  if (isPayload(data)) return data.value;
  throw new ValidationError('Unexpected payload shape');
}
\`\`\`

## Related Laws
- LAW-2.4 (Explicit return types)
- LAW-1.2 (Quality is built-in)

## Citation Format
[LAW-2.3 v1.0] "The `any` type is prohibited. Use `unknown` with type narrowing."
```

### 2.2 The Law Catalog (write every law in full using the template)

**Article 1 — Foundational Principles** *(the 5 core principles, codified)*
- LAW-1.1 Code is Written for Humans First (30-second readability; comments explain WHY not WHAT)
- LAW-1.2 Quality is Built-In, Never Added Later (no deferred quality; no TODO without ticket+context)
- LAW-1.3 Consistency Enables Collaboration (identical tooling/conventions; zero project exceptions)
- LAW-1.4 Architecture Decisions Are Intentional (deliberate design; ADR required for significant decisions)
- LAW-1.5 Security is Everybody's Responsibility (security defects block merge regardless of author or deadline)

**Article 2 — Code Standards** *(owners: software-engineer, quality)*
- LAW-2.1 Naming Conventions (full table: camelCase variables/functions, PascalCase types/classes — no `I` prefix, UPPER_SNAKE_CASE constants, is/has/can booleans, kebab-case files/dirs)
- LAW-2.2 Formatting via Prettier (2-space, 100-char, single quotes, semicolons, ES5 trailing commas; never manual)
- LAW-2.3 Prohibition of the `any` Type (as above)
- LAW-2.4 Explicit Return Types on exported functions
- LAW-2.5 Import Ordering (stdlib → third-party → local, alphabetical, enforced by ESLint)
- LAW-2.6 Function Size and Responsibility (≤30 lines, target 10–15, one responsibility; no magic numbers — named constants)

**Article 3 — Testing & Quality** *(owners: quality, software-engineer)*
- LAW-3.1 Test-First Development (failing test shown before implementation; red-green-refactor)
- LAW-3.2 Coverage Floors (80% business logic, 100% utilities, 70% controllers; CI-enforced)
- LAW-3.3 Test Structure (Arrange-Act-Assert; names state "should <expectation> when <scenario>")
- LAW-3.4 Test Isolation (mock external dependencies; unit tests <1s; no inter-test dependence)
- LAW-3.5 No Skipped or Hollow Tests (no .skip without ticket; assertions must verify behavior)

**Article 4 — Architecture** *(owners: architect)*
- LAW-4.1 Layered Architecture (Presentation → Application → Domain → Persistence; dependencies point downward only)
- LAW-4.2 SOLID Compliance (each principle with its one-line test)
- LAW-4.3 No Circular Dependencies (ESLint import/no-cycle: error)
- LAW-4.4 Sanctioned Patterns (DI, Repository, Factory, Strategy — when each is required)
- LAW-4.5 ADR Requirement (any significant structural decision recorded in docs/adr/ before merge)

**Article 5 — Security** *(owners: security; security persona holds VETO on CRITICAL findings)*
- LAW-5.1 Universal Input Validation (allowlist over blocklist; all external data)
- LAW-5.2 Parameterized Queries Only (no string concatenation into queries)
- LAW-5.3 Secrets Never in Code (env/secret manager only; never in logs)
- LAW-5.4 Established Auth Frameworks Only (OAuth2/JWT/SAML; never roll your own crypto)
- LAW-5.5 Dependency Hygiene (weekly scans; criticals patched ≤24h; lockfiles pinned)
- LAW-5.6 Encryption Standards (TLS 1.2+ in transit; at-rest for sensitive data)

**Article 6 — Review & Documentation** *(owners: quality, architect)*
- LAW-6.1 Two-Approval Review (2 approvals, 1 domain expert; no self-approval)
- LAW-6.2 Quality Gates Are Inviolable (lint, type-check, tests, coverage, security scan — all green before merge; no override path)
- LAW-6.3 Public API Documentation (JSDoc with params/returns/throws/example on all public functions)
- LAW-6.4 Comments Explain WHY (business rules, trade-offs, constraints — never restating code)
- LAW-6.5 Docs Travel With Code (README/API docs updated in the same PR as the change)

**Article 7 — AI Governance** *(owners: all personas; security + quality co-enforce)*
- LAW-7.1 Human Accountability (developers own all AI-generated code; AI assists, humans approve)
- LAW-7.2 IP and Data Protection (no PII, secrets, payment data, or proprietary algorithms to unapproved AI tools)
- LAW-7.3 AI Audit Trail (`[Claude-assisted]` commit tag; AI role documented in PR)
- LAW-7.4 Identical Standards for AI Code (no relaxed review for AI output; verify, never assume)
- LAW-7.5 Mandatory Escalation on Uncertainty (agents must stop and ask on ambiguous requirements, architecture, or security — never guess)

**Article 8 — Requirements & Domain** *(owners: product-owner, industry-sme)*
- LAW-8.1 Acceptance Criteria Before Implementation (no coding against undefined "done")
- LAW-8.2 Business Rules Are Documented and Cited (domain logic in code links to its documented rule)
- LAW-8.3 Regulatory Mapping (industry compliance requirements — e.g., PCI, GDPR — mapped to the code that satisfies them)
- LAW-8.4 Scope Discipline (changes outside agreed scope require Product Owner persona sign-off)

**Article 9 — Operations & Cost** *(owners: devops, finops)*
- LAW-9.1 Infrastructure as Code (all infrastructure versioned; no console-clicked resources)
- LAW-9.2 Deployment Safety (every deploy reversible; rollback documented before release)
- LAW-9.3 Cost Impact Assessment (infra/dependency changes with material cost impact require FinOps persona review; cloud resources tagged for attribution)
- LAW-9.4 License Compliance (dependency licenses evaluated before adoption; copyleft flagged)

### 2.3 The Registry

**`laws/REGISTRY.md`** — a single table of every law: ID | Title | Article | Status | Version | Owner Personas | Enforcement. This is the human lookup page.

**`laws/registry.json`** — machine-readable mirror. Schema:

```json
{
  "constitution_version": "1.0.0",
  "ratified": "2026-06-01",
  "laws": [
    {
      "id": "LAW-2.3",
      "title": "Prohibition of the any Type",
      "article": 2,
      "status": "ACTIVE",
      "version": "1.0",
      "owner_personas": ["software-engineer", "quality"],
      "enforcement": "automated",
      "statement": "The any type is prohibited in all TypeScript code...",
      "rationale_summary": "any silently disables type checking...",
      "file": "laws/article-2-code-standards/LAW-2.3.md",
      "amendments": ["AMD-2026-001"]
    }
  ]
}
```

Agents and the `law-lookup.sh` script consume this file. **The registry and the law files must never diverge** — the `law-integrity.yml` CI workflow enforces this.

---

## DELIVERABLE 3: THE AMENDMENT & AUDIT SYSTEM

### 3.1 `amendments/AMENDMENT-PROCESS.md`

Document this exact process — it is the ONLY way laws change:

1. **PROPOSAL** — Anyone (human or persona) drafts an amendment record from `AMENDMENT-TEMPLATE.md` in `amendments/records/` with status PROPOSED. Must include: laws affected, exact text changes (before/after), motivation, impact analysis (which projects/personas/configs are affected), and proposer.
2. **REVIEW** — The owner persona(s) of each affected law must review. Security-article amendments additionally require Security persona review. Cross-cutting amendments go to the persona-council skill.
3. **DECISION** — Approved by VP Engineering / Tech Lead with recorded date and name. Rejected amendments stay in records/ with status REJECTED and the rejection rationale (rejections are part of the audit trail too).
4. **ENACTMENT** — On approval, in one commit: (a) law file updated with version bump and amendment_history entry, (b) registry.json + REGISTRY.md updated, (c) amendment record set to ENACTED, (d) CHANGELOG.md entry, (e) commit message format `law: amend LAW-X.Y via AMD-YYYY-NNN — <summary>`.
5. **PROPAGATION** — Consuming projects pull updates via `scripts/update.sh`, which prints a diff of changed laws with their amendment rationales.

Versioning rules: text clarification = patch (1.0 → 1.0.1); meaning change = minor (1.0 → 1.1); repeal-and-replace = new law ID, old law marked REPEALED (never deleted — repealed laws remain in the repo for citation of historical decisions).

### 3.2 `amendments/AMENDMENT-TEMPLATE.md`

```markdown
---
id: AMD-YYYY-NNN
status: PROPOSED          # PROPOSED | APPROVED | REJECTED | ENACTED
proposed_by: ""
proposed_date: ""
laws_affected: []
reviewers_required: []     # owner personas of affected laws
decision_by: ""
decision_date: ""
---

# AMD-YYYY-NNN: <Title>

## Motivation
Why is this change needed? What problem, incident, or learning prompted it?

## Changes
For each affected law:
### LAW-X.Y (vCURRENT → vNEW)
**Before:** <exact current statement>
**After:** <exact new statement>

## Impact Analysis
- Projects affected and migration effort
- Configs/tooling that must change (eslint, CI, etc.)
- Personas whose mandates change

## Review Record
| Persona/Role | Reviewer | Verdict | Date | Notes |
|---|---|---|---|---|

## Decision
Approved/Rejected by: ____ Date: ____
Rationale: ____
```

### 3.3 First Amendment Record

Create `AMD-2026-001-initial-ratification.md` (status ENACTED) ratifying all Article 1–9 laws at v1.0, motivated by the six founding pain points (review bottlenecks, inconsistent standards, low coverage, security vulnerabilities, poor docs, tech debt).

### 3.4 `law-integrity.yml` CI Workflow

On every PR to this repo: validate registry.json is valid JSON; every law file has matching registry entry and vice versa; every ACTIVE law's version matches registry; any diff to a `laws/` file is accompanied by an amendment record referencing that law ID — **fail the build if a law changed without an amendment**. This is the technical guarantee of auditability.

---

## DELIVERABLE 4: THE 8 PERSONA SKILLS

Personas are skills under `.claude/skills/personas/`. An agentic coding agent assumes a persona when working in that persona's domain, and MUST cite laws in every decision.

### 4.1 Canonical Persona — write `security/SKILL.md` exactly as follows (it is the template for the rest):

```markdown
---
name: persona-security
description: Assume the Security persona when code touches authentication, authorization, user input, data persistence, secrets, dependencies, or external APIs — or when any security question or review is requested. This persona owns Article 5 and holds veto authority on CRITICAL findings.
---

# Persona: Security

## Identity & Mandate
You are the organization's Security engineer. Your mandate is to ensure no
exploitable code reaches production. You are constructive but uncompromising:
security findings are defects, not negotiable trade-offs.

## Laws You Own (cite by ID in every decision)
- LAW-5.1 Universal Input Validation
- LAW-5.2 Parameterized Queries Only
- LAW-5.3 Secrets Never in Code
- LAW-5.4 Established Auth Frameworks Only
- LAW-5.5 Dependency Hygiene
- LAW-5.6 Encryption Standards
- Co-enforce: LAW-7.2 (IP/Data Protection), LAW-1.5 (Security Responsibility)

## Decision Authority
- VETO: You may block any change with a CRITICAL security finding.
  This veto cannot be overridden by any other persona — only by a named
  human security lead, recorded in the PR.
- ADVISE: HIGH/MEDIUM findings require a documented fix-or-accept decision.
- ESCALATE: Novel threat models, compliance interpretation → human security lead.

## Review Lens (what you check, in order)
1. Input validation on every external data path (LAW-5.1)
2. Query construction (LAW-5.2)
3. Secrets, tokens, credentials in code or logs (LAW-5.3)
4. Auth/crypto implementation choices (LAW-5.4)
5. New or changed dependencies (LAW-5.5)
6. Data in transit/at rest (LAW-5.6)
7. AI-tool data exposure (LAW-7.2)

## Output Format — every finding and decision uses citations:
FINDING [CRITICAL|HIGH|MEDIUM|LOW]: <issue> at <location>
CITATION: [LAW-5.2 v1.0] "<quoted statement>"
RATIONALE: <law's rationale, applied to this case>
REQUIRED FIX: <concrete code-level remedy>

## Conflict Rules
- vs FinOps: security fixes proceed regardless of cost; cost optimization
  never justifies a CRITICAL or HIGH exposure ([LAW-1.5]).
- vs Product Owner: deadline pressure does not waive Article 5 ([LAW-6.2]).
- Unresolvable conflicts → persona-council, then human escalation ([LAW-7.5]).
```

### 4.2 Remaining 7 Personas — build each with the same structure (Identity & Mandate, Laws Owned, Decision Authority, Review Lens, Citation Output Format, Conflict Rules):

| Persona | Trigger (description field) | Laws Owned | Authority & Conflict Notes |
|---|---|---|---|
| **industry-sme** | Domain logic, business rules, industry regulation questions | LAW-8.2, LAW-8.3 | ADVISE on domain correctness; ESCALATE regulatory interpretation to human compliance; verifies code matches documented business rules and regulatory mappings |
| **product-owner** | Requirements, scope, acceptance criteria, prioritization | LAW-8.1, LAW-8.4 | BLOCKS implementation lacking acceptance criteria (LAW-8.1); cannot waive Articles 3, 5, 6 (deadlines never override gates per LAW-6.2) |
| **quality** | Test strategy, coverage, defect analysis, review standards | LAW-3.1–3.5, LAW-6.1, LAW-6.2, co-owns LAW-2.3 | BLOCKS merges below coverage floors; defines test plans; arbitrates "is this tested enough?" |
| **architect** | System design, module boundaries, patterns, ADRs, refactors | LAW-4.1–4.5, LAW-1.4 | VETO on layer violations and circular dependencies; requires ADR before significant structural merges; proposes amendments when patterns evolve |
| **software-engineer** | Default persona for implementation work | LAW-2.1–2.6, executes LAW-3.1 | Implements within all other personas' constraints; must self-check against constitution-enforcer before presenting code; escalates per LAW-7.5 |
| **devops** | CI/CD, pipelines, hooks, infra, deployment, environments | LAW-9.1, LAW-9.2, enforces LAW-6.2 mechanically | Owns quality-gate pipeline integrity; BLOCKS deploys without rollback plan; no manual infrastructure (LAW-9.1) |
| **security** | (written in full above) | Article 5, co-enforce 7.2, 1.5 | VETO on CRITICAL |
| **finops** | Cloud cost, licensing, resource sizing, AI/compute budget | LAW-9.3, LAW-9.4 | ADVISE with cost impact estimates on infra/dependency changes; BLOCKS untagged resources and unevaluated licenses; explicitly subordinate to Security on CRITICAL/HIGH findings |

### 4.3 `persona-council/SKILL.md`

Orchestration skill. Trigger: cross-cutting changes (new service, major refactor, new dependency with cost+security+architecture implications) or persona conflicts. Procedure: identify the affected articles → sequentially assume each relevant persona → produce one consolidated report with each persona's cited findings → apply conflict rules (Security veto > Architect veto > Quality block > others advise) → if conflict remains, output an escalation summary for human decision per LAW-7.5. The council never silently averages positions — disagreements are surfaced verbatim with their citations.

### 4.4 `law-clerk/SKILL.md`

The auditability skill. Trigger: any request to create, modify, interpret, or look up a law. Capabilities:
- **Lookup:** given a law ID or topic, return statement + rationale + version + amendment history from registry.json.
- **Drafting:** produce new laws using `templates/law-template.md` and amendments using `AMENDMENT-TEMPLATE.md` — never edits a law file directly; always goes through the amendment process.
- **Audit answers:** for "why does LAW-X.Y say this?" reconstruct the answer from the law's rationale plus its amendment chain.
- **Integrity:** before any commit touching `laws/`, verify registry sync and amendment linkage (mirrors what `law-integrity.yml` enforces in CI).
- **Hard rule stated in the skill:** "A law without an enacted amendment record does not exist. A change without an amendment record is a constitutional violation — refuse and route through the process."

### 4.5 `docs/persona-guide.md`

How agents and humans use personas: when each persona triggers, how to explicitly invoke one ("act as the Architect persona and review this module"), how the council works, the authority/precedence ladder, and three worked examples of cited persona decisions.

---

## DELIVERABLE 5: ENFORCEMENT SKILLS (UPDATED FOR CITATIONS)

### `constitution-enforcer/SKILL.md`
The always-on skill for any code work. Same hard rules as the laws in Articles 1–7, but now: every correction or refusal **must cite the law ID and quote its statement** using `reference/citation-format.md`. Self-check before presenting code: lint-clean (LAW-2.x), strict types (LAW-2.3/2.4), tests written first (LAW-3.1), coverage floors (LAW-3.2), security rules (Article 5), docs (LAW-6.3–6.5). Includes the violation severity matrix in `reference/violation-severity.md` mapping severities to laws (CRITICAL examples: hardcoded secrets → LAW-5.3, SQL concatenation → LAW-5.2, disabled strict mode → LAW-2.3).

`reference/citation-format.md` — defines the exact DECISION/CITATION/RATIONALE/PERSONA block shown in the Core Design Requirement section above, plus a short inline form for minor corrections: `(per [LAW-2.1 v1.0])`.

### Supporting skills — each updated to cite laws:
- **`tdd-assistant`** — enforces LAW-3.1–3.5; shows the failing test first; cites LAW-3.1 when a developer asks to "just write the code."
- **`code-review-assistant`** — checklist organized by article; verdict lines cite specific laws; AI-generated code reviewed under LAW-7.4 (verify, never assume).
- **`security-checker`** — delegates to / aligns with the security persona; outputs cited findings.
- **`documentation-generator`** — enforces LAW-6.3–6.5; ADR generation per LAW-4.5.
- **`ai-transparency`** — enforces LAW-7.1–7.3; produces the AI-assistance summary, `[Claude-assisted]` commit tag, and PR disclosure block.

---

## DELIVERABLE 6: CLAUDE.md (PROJECT-LEVEL INSTRUCTIONS)

~1 page, copied into every consuming project:
- "This project is governed by the Engineering Constitution v1.0.0. Laws are citable by ID; full registry in `docs/constitution/REGISTRY.md` (installed) or the engineering-constitution repo."
- The 9 articles, one line each, with the most-invoked law IDs
- Hard-rules digest: naming (LAW-2.1), no `any` (LAW-2.3), TDD-first (LAW-3.1), 80% coverage (LAW-3.2), security basics (Article 5), `[Claude-assisted]` tag (LAW-7.3)
- Persona instruction: "Assume the matching persona for the work at hand (see `.claude/skills/personas/`); cite laws in all decisions; on uncertainty, stop and ask per LAW-7.5."
- Required commands before declaring done: `npm run lint`, `npm run type-check`, `npm test`

---

## DELIVERABLE 7: CONFIGURATION BUILDING BLOCKS

Each config file must include a header comment mapping it to the laws it enforces (e.g., `// Enforces: LAW-2.1, LAW-2.3, LAW-2.5, LAW-4.3` in eslint config — use JSON-adjacent placement such as a sibling `configs/CONFIG-LAW-MAP.md` for pure-JSON files).

**`.eslintrc.json`** — TypeScript parser; extends recommended + type-checked + prettier; rules: `@typescript-eslint/naming-convention` per LAW-2.1, `no-explicit-any: error` (LAW-2.3), `explicit-function-return-type: warn` (LAW-2.4), `import/order` (LAW-2.5), `import/no-cycle: error` (LAW-4.3), `no-eval: error` (Article 5), `no-console: warn` allow warn/error.

**`.prettierrc.json`** (LAW-2.2) — semi true, singleQuote, printWidth 100, tabWidth 2, trailingComma es5, arrowParens always.

**`tsconfig.base.json`** (LAW-2.3/2.4) — all strict flags: strict, noImplicitAny, strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, alwaysStrict, noUnusedLocals, noUnusedParameters, noImplicitReturns, noFallthroughCasesInSwitch, noUncheckedIndexedAccess, forceConsistentCasingInFileNames, esModuleInterop, skipLibCheck.

**`jest.config.js`** (LAW-3.2) — ts-jest; coverageThreshold 80% global; sensible collectCoverageFrom.

**`lint-staged.config.js` + `hooks/pre-commit`** (LAW-6.2) — eslint --fix, prettier --write, then `npm run type-check`; helpful failure messages citing the relevant law.

**CI:** `quality.yml` (lint, type-check, test+coverage, format-check — LAW-6.2), `security.yml` (npm audit / Snyk + CodeQL — LAW-5.5), `law-integrity.yml` (per Deliverable 3.4).

---

## DELIVERABLE 8: TEMPLATES, CHECKLISTS, DOCS

- **`templates/pull_request_template.md`** — sections: What/Why/Testing/Gates checklist (each item cites its law), AI Assistance disclosure (LAW-7.3), Laws Touched (list any law IDs relevant to review focus).
- **`templates/adr-template.md`** — standard ADR + a "Laws Considered" section requiring relevant citations.
- **`templates/commit-message-guide.md`** — conventional commits; `[Claude-assisted]` tag (LAW-7.3); `law:` prefix reserved for amendment enactments.
- **`checklists/`** — code-review and pre-commit checklists, every item annotated with its law ID.
- **`CONSTITUTION.md`** — Preamble (purpose, scope, the six founding pain points), how to read/cite laws, article summaries with links, persona system overview with the authority ladder, amendment process summary, ratification block (sign-offs), quarterly review schedule (first: Sept 1, 2026).
- **`docs/standards.md`**, **`docs/testing-guide.md`**, **`docs/rollout-guide.md`** — as before, now citing law IDs throughout; rollout guide maps building blocks to the 12-week phases.
- **`docs/adr/0001-...`** — ADR adopting the constitution, citing AMD-2026-001.
- **`README.md`** — overview, the five purposes, quickstart, `law-lookup.sh` usage example, link map.

---

## DELIVERABLE 9: ROLLOUT SCRIPTS

**`install.sh <target>`** — copies: CLAUDE.md → root; configs → root; hook → .husky/; CI yml → .github/workflows/; PR template → .github/; ALL skills (including personas) → .claude/skills/; checklists + standards → docs/; **laws/REGISTRY.md + registry.json → docs/constitution/** (so every project can cite laws offline). Prints devDependencies to install and package.json scripts block. Idempotent; `--force` to overwrite.

**`validate.sh <target>`** — verifies presence of all installed files, strict tsconfig, jest thresholds, executable hook, AND that docs/constitution/registry.json parses and matches the source repo's constitution_version. PASS/FAIL report; non-zero exit on failure.

**`update.sh <target>`** — syncs configs, skills, and the law registry; before applying, prints a human-readable diff of any changed laws **including the amendment ID and motivation for each change** (read from amendment records) — this is how auditability propagates to consuming projects.

**`law-lookup.sh <LAW-ID>`** — parses registry.json (jq if available, fallback grep/sed) and prints: ID, title, version, status, statement, rationale summary, owner personas, amendment history, file path. This is the quick citation tool for humans and scripts.

---

## EXECUTION ORDER

1. `git init`, skeleton + README → `chore: scaffold repository structure`
2. Law template, all 45 law files (Articles 1–9), REGISTRY.md, registry.json → `feat: ratify constitution laws v1.0 (Articles 1-9)`
3. Amendment process, template, AMD-2026-001 → `feat: add amendment and audit system`
4. CONSTITUTION.md + CLAUDE.md → `docs: add constitution and CLAUDE.md`
5. 8 persona skills + persona-council + law-clerk + persona-guide → `feat: add persona system for agentic coding`
6. Enforcement skills (constitution-enforcer + 5 supporting) with citation references → `feat: add citation-aware enforcement skills`
7. Configs + hooks + CONFIG-LAW-MAP → `feat: add law-mapped tooling configuration`
8. CI workflows including law-integrity → `feat: add quality, security, and law-integrity CI`
9. Templates, checklists, docs, ADR 0001, CHANGELOG → `docs: add templates, checklists, and guides`
10. Scripts (chmod +x), test law-lookup.sh against registry → `feat: add rollout and law-lookup scripts`
11. Acceptance checklist → fix gaps → `chore: v1.0.0 release`

---

## ACCEPTANCE CRITERIA

Verify ALL before declaring done:

**Law system**
- [ ] All ~45 laws exist with complete frontmatter, quotable Statement, Rationale, examples, and citation line
- [ ] registry.json is valid JSON; every law file ↔ registry entry is 1:1; versions match
- [ ] `./scripts/law-lookup.sh LAW-2.3` prints the full law record correctly
- [ ] REGISTRY.md table lists every law with correct owners

**Auditability**
- [ ] AMD-2026-001 exists, status ENACTED, referenced by every v1.0 law's amendment_history
- [ ] AMENDMENT-PROCESS.md describes proposal→review→decision→enactment→propagation with versioning rules, including that rejected amendments and repealed laws are retained
- [ ] law-integrity.yml fails a build when a law file changes without an accompanying amendment record (verify the logic by inspection)
- [ ] law-clerk skill refuses direct law edits and routes through amendments

**Personas**
- [ ] All 8 personas exist; security matches the canonical template verbatim in structure
- [ ] Every persona lists owned law IDs that actually exist in the registry
- [ ] Authority ladder is consistent everywhere it appears (Security veto > Architect veto > Quality block > advisory personas)
- [ ] persona-council surfaces conflicts verbatim and escalates per LAW-7.5
- [ ] Every persona's output format requires citations

**Citations**
- [ ] citation-format.md defines full and inline forms; constitution-enforcer, code-review-assistant, and all personas reference it
- [ ] CLAUDE.md instructs citation of laws and persona assumption

**Tooling & rollout**
- [ ] Configs map to laws (CONFIG-LAW-MAP.md complete); eslint/tsconfig/jest contents per Deliverable 7
- [ ] install.sh copies the registry into target docs/constitution/; update.sh prints law diffs with amendment motivations; validate.sh checks registry version sync
- [ ] All scripts executable; graceful handling of missing args

**Hygiene**
- [ ] Every cross-reference resolves; no placeholders except `[YOUR ORGANIZATION]` and sign-off blocks
- [ ] Clean git status; commit history matches the execution order

When complete, print: the repo tree, the law count per article, the one-command install instruction, and an example cited decision produced by the security persona.
