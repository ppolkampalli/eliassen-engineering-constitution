# Engineering Constitution

**Eliassen Group — SDLC Quality Standards for JavaScript/TypeScript Teams**

Version 1.2.0 · Ratified 2026-06-01 ([AMD-2026-001](amendments/records/AMD-2026-001-initial-ratification.md)) · Amended 2026-06-11 ([AMD-2026-002…010](amendments/records/))

This repository is the single source of truth for Eliassen Group's software engineering quality standards for **JavaScript/TypeScript (Node.js + React)** teams of 20–50 distributed, AI-assisted engineers. Standards are codified as numbered, versioned, **citable Laws** that humans and AI agents alike can quote, apply, and audit.

---

## The Five Purposes

1. **Constitution as Law** — Quality standards are numbered, versioned, citable Laws. Any skill, persona, or developer in any project can quote a law by ID (e.g., `LAW-2.3`) and retrieve its full text and rationale.
2. **Personas for Agentic Coding** — 8 persona skills that AI coding agents assume. Each persona has a mandate, owns specific laws, has defined decision authority, and **must cite laws when making or justifying decisions**.
3. **Amendment Audit Trail** — Laws change only through a formal amendment process. Every change records rationale, approver, and date, so any project can always answer: *"Why does this law exist, and why did it change?"*
4. **Claude Skills** — Enforcement skills that apply the laws whenever Claude assists with development in any project.
5. **Rollout Tooling** — Install scripts that copy the building blocks (laws, personas, configs, hooks, CI workflows, CLAUDE.md, skills) into any target project in one command.

---

## Quickstart

### Install into a project

```bash
git clone <this-repo> engineering-constitution
cd engineering-constitution
./scripts/install.sh /path/to/your-project
```

The installer copies CLAUDE.md, tooling configs, the pre-commit hook, CI workflows, the PR template, all Claude skills (including personas), checklists, and the law registry (`docs/constitution/`) into your project, then prints the devDependencies and package.json scripts to add.

### Validate an installation

```bash
./scripts/validate.sh /path/to/your-project
```

### Pull constitution updates into a project

```bash
./scripts/update.sh /path/to/your-project
```

Prints a diff of changed laws **with the amendment ID and motivation for each change** before applying.

### Look up a law

```bash
./scripts/law-lookup.sh LAW-2.3
```

```text
LAW-2.3 (v1.0, ACTIVE) — Prohibition of the `any` Type
Article 2: Code Standards
Owners: software-engineer, quality
Statement: The `any` type is prohibited in all TypeScript code...
Rationale: `any` silently disables type checking...
Amendments: AMD-2026-001
File: laws/article-2-code-standards/LAW-2.3.md
```

---

## How to Cite a Law

Every decision made under this constitution is articulated as a citation:

```text
DECISION: Rejecting use of `any` type in payment-service.ts line 47.
CITATION: [LAW-2.3 v1.0] "The `any` type is prohibited. Use `unknown`
with type narrowing."
RATIONALE (from law record): `any` silently disables type checking,
defeating the purpose of TypeScript and allowing type errors to reach
production.
PERSONA: Software Engineer (owner: Quality)
```

See [.claude/skills/constitution-enforcer/reference/citation-format.md](.claude/skills/constitution-enforcer/reference/citation-format.md) for the full and inline citation forms.

---

## Link Map

| Area | Where |
|---|---|
| The Constitution (preamble, governance, ratification) | [CONSTITUTION.md](CONSTITUTION.md) |
| All laws, human-readable index | [laws/REGISTRY.md](laws/REGISTRY.md) |
| All laws, machine-readable | [laws/registry.json](laws/registry.json) |
| Law files by article | [laws/](laws/) |
| Amendment process & audit records | [amendments/](amendments/) |
| Persona skills (8 + council + clerk) | [.claude/skills/personas/](.claude/skills/personas/) |
| Persona usage guide | [docs/persona-guide.md](docs/persona-guide.md) |
| Enforcement skills | [.claude/skills/](.claude/skills/) |
| Tooling configs (law-mapped) | [configs/](configs/) · [configs/CONFIG-LAW-MAP.md](configs/CONFIG-LAW-MAP.md) |
| CI workflows | [ci/github/](ci/github/) |
| Templates (PR, ADR, law, commits) | [templates/](templates/) |
| Checklists | [checklists/](checklists/) |
| Standards / testing / rollout guides | [docs/](docs/) |
| Install / validate / update / lookup scripts | [scripts/](scripts/) |
| Project-level Claude instructions | [CLAUDE.md](CLAUDE.md) |

---

## The Ten Articles

| Article | Domain | Laws |
|---|---|---|
| 1 | Foundational Principles | LAW-1.1 – 1.5 |
| 2 | Code Standards | LAW-2.1 – 2.6 |
| 3 | Testing & Quality | LAW-3.1 – 3.6 |
| 4 | Architecture | LAW-4.1 – 4.6 |
| 5 | Security | LAW-5.1 – 5.6 |
| 6 | Review & Documentation | LAW-6.1 – 6.5 |
| 7 | AI Governance | LAW-7.1 – 7.6 |
| 8 | Requirements & Domain | LAW-8.1 – 8.4 |
| 9 | Operations & Cost | LAW-9.1 – 9.7 |
| 10 | Agentic Development | LAW-10.1 – 10.6 |

**57 laws** total. Laws are amended — never silently edited — per the [Amendment Process](amendments/AMENDMENT-PROCESS.md).

**How work flows:** the [workflow catalog](workflows/README.md) (LAW-10.6) defines
staged persona chains for feature, research, bug, security-bug, refactor, and
amendment work — executable by agents, humans, or mixed teams, with recorded
deviations and inviolable hard gates.

---

## Governance

- Changes to laws go through the [Amendment Process](amendments/AMENDMENT-PROCESS.md). The `law-integrity` CI workflow fails any PR that changes a law without an accompanying amendment record.
- Repealed laws are never deleted; they remain citable for historical decisions.
- Quarterly constitution review; first review **2026-09-01**.

## License

Internal use only — see [LICENSE](LICENSE).
