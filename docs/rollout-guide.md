# Rollout Guide — Adopting the Constitution in 12 Weeks

How an existing project or team adopts the Engineering Constitution. New projects
skip the phasing: run `install.sh` on day zero and start governed.

## The Building Blocks (what install.sh delivers)

| Block | Installed to | Laws it carries |
|---|---|---|
| CLAUDE.md | project root | Distilled rules, persona instructions |
| ESLint/Prettier/tsconfig/Jest/lint-staged configs | project root | LAW-2.1–2.6, 3.2, 4.3 |
| pre-commit hook | `.husky/` | LAW-6.2 (local stage), 2.2 |
| quality.yml + security.yml | `.github/workflows/` | LAW-6.2, 5.5, 3.2 |
| PR template | `.github/` | LAW-7.3, 6.x checklist |
| All skills (personas + enforcement) | `.claude/skills/` | Whole constitution, cited |
| Checklists + standards | `docs/` | Review practice |
| **Law registry** (REGISTRY.md + registry.json) | `docs/constitution/` | Offline citability — every project can quote laws |

## Phase 1 — Foundation (Weeks 1–3)

**Goal: tooling installed, gates advisory.**

- Week 1: Run `scripts/install.sh <project>`; add devDependencies and scripts it
  prints; verify with `scripts/validate.sh <project>`. Hold the kickoff: the six
  founding pain points, the citation idea, where the registry lives.
- Week 2: CI workflows live but **not yet required checks** — teams see gate
  results without being blocked; fix the noisiest violations (formatting via one
  `prettier --write .` commit per LAW-2.2; auto-fixable lint).
- Week 3: Type debt triage — count `any`s (LAW-2.3) and strict-flag violations;
  ticket the burn-down (LAW-1.2: each TODO gets a ticket).

**Exit criteria:** validate.sh PASS; lint/format/type baselines green or ticketed.

## Phase 2 — Quality Mechanics (Weeks 4–6)

**Goal: tests and review practices real.**

- Week 4: Coverage baseline measured; floors configured (LAW-3.2) with a written
  ramp if legacy coverage is below floor (ramp plan is an amendment-tracked
  exception, not a silent local edit — LAW-1.3).
- Week 5: TDD working sessions (LAW-3.1) using the tdd-assistant skill; review
  checklist adopted; two-approval + code-owners configured (LAW-6.1).
- Week 6: **Gates become required checks** (LAW-6.2). From here, no override path.

**Exit criteria:** gates required; new code arriving test-first; reviews citing laws.

## Phase 3 — Architecture & Security (Weeks 7–9)

**Goal: structural and security laws active.**

- Week 7: Architecture review against LAW-4.1/4.3 (layering map, cycle scan);
  ADR practice starts — first ADR documents the current architecture (LAW-4.5).
- Week 8: Security pass per Article 5 with the security-checker skill: input
  validation boundaries, query construction, secret scan (rotate anything found —
  LAW-5.3), dependency audit (LAW-5.5).
- Week 9: security.yml strict; compliance map drafted if regulated (LAW-8.3).

**Exit criteria:** zero CRITICAL findings; cycle-free imports; ADR flow operating.

## Phase 4 — Full Governance (Weeks 10–12)

**Goal: personas, AI governance, ops laws — the whole constitution.**

- Week 10: Persona system live (docs/persona-guide.md); AI governance practices:
  commit tagging, PR disclosure (LAW-7.3), approved-tool list circulated (LAW-7.2).
- Week 11: Ops laws — IaC inventory (LAW-9.1), rollback docs for active services
  (LAW-9.2), resource tagging + license scan (LAW-9.3/9.4).
- Week 12: Retrospective → first amendment proposals from real friction (the
  process working as designed); rollout review with metrics against the six pain
  points.

**Exit criteria:** validate.sh PASS, all gates required, personas in use,
amendment pipeline receiving proposals.

## Staying Current

`scripts/update.sh <project>` pulls registry/config/skill updates and prints each
changed law **with its amendment ID and motivation** before applying — adoption of
changes is informed, never silent (AMENDMENT-PROCESS.md stage 5).

## Rollout Anti-Patterns

- **Big-bang gating** (week-1 required checks on a legacy repo) — breeds bypass
  pressure, which LAW-6.2 exists to prevent; ramp as designed instead.
- **Local exceptions** to "make adoption easier" — LAW-1.3's zero-exception rule
  is the point; exceptions go through amendments or not at all.
- **Skipping the WHY** — teams follow laws they understand; the kickoff and the
  Rationale sections are load-bearing, not ceremony.
