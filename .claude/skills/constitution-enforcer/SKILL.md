---
name: constitution-enforcer
description: Always-on enforcement of the Engineering Constitution for any code work — writing, modifying, reviewing, or generating code in a governed project. Applies Articles 1–7 as hard rules, self-checks before presenting code, and expresses every correction or refusal as a law citation.
---

# Constitution Enforcer

The always-on skill for any code work in a constitution-governed project. The laws
of Articles 1–7 are hard rules here; Articles 8–9 apply when requirements/scope or
infra/cost enter the work. Every correction or refusal **must cite the law ID and
quote its statement** per [reference/citation-format.md](reference/citation-format.md).

## Hard Rules (enforce without negotiation)

- **Article 1:** 30-second readability (LAW-1.1); no deferred quality, no TODO
  without ticket+context (LAW-1.2); zero convention exceptions (LAW-1.3); no
  unrecorded architecture decisions (LAW-1.4); security blocks merge regardless of
  deadline (LAW-1.5).
- **Article 2:** naming table (LAW-2.1); Prettier only (LAW-2.2); no `any` —
  `unknown` + narrowing (LAW-2.3); explicit return types on exports (LAW-2.4);
  import order (LAW-2.5); ≤30-line single-purpose functions, no magic numbers
  (LAW-2.6).
- **Article 3:** failing test first (LAW-3.1); coverage floors never lowered
  (LAW-3.2); AAA + should/when names (LAW-3.3); isolated <1s unit tests (LAW-3.4);
  no unticketed skips, no hollow assertions (LAW-3.5).
- **Article 4:** downward-only layering (LAW-4.1); SOLID one-line tests (LAW-4.2);
  no cycles (LAW-4.3); sanctioned patterns or ADR (LAW-4.4); ADR before structural
  merge (LAW-4.5).
- **Article 5:** allowlist-validate all external input (LAW-5.1); parameterized
  queries only (LAW-5.2); no secrets in code/logs (LAW-5.3); established auth only
  (LAW-5.4); dependency scanning + pinned lockfiles (LAW-5.5); TLS 1.2+ and at-rest
  encryption (LAW-5.6).
- **Article 6:** two approvals incl. domain expert (LAW-6.1); gates inviolable
  (LAW-6.2); JSDoc on public APIs (LAW-6.3); WHY-comments only (LAW-6.4); docs in
  the same PR (LAW-6.5).
- **Article 7:** human owns every line (LAW-7.1); no protected data to unapproved
  AI tools (LAW-7.2); `[Claude-assisted]` tag + PR disclosure (LAW-7.3); identical
  standards for AI code — verify, never assume (LAW-7.4); stop and ask on
  uncertainty (LAW-7.5).

## Self-Check Before Presenting Any Code

Run this checklist; do not present code that fails an item:

1. **Lint-clean** — would pass `npm run lint` with the constitution ESLint config (LAW-2.x)
2. **Strict types** — no `any`, explicit exported return types, strict-mode sound (LAW-2.3, LAW-2.4)
3. **Tests written first** — the failing test exists and is shown (LAW-3.1)
4. **Coverage floors hold** — 80% business logic / 100% utilities / 70% controllers (LAW-3.2)
5. **Security rules** — inputs validated, queries parameterized, no secrets, vetted auth (Article 5)
6. **Docs** — JSDoc on public surfaces, WHY-comments, same-PR doc updates (LAW-6.3–6.5)

If an item cannot be satisfied (e.g., user explicitly forbids tests), state the
violation with its citation rather than silently complying — then follow LAW-7.5 if
the conflict stands.

## Severity & Response

Severity mapping lives in [reference/violation-severity.md](reference/violation-severity.md):
CRITICAL stops the line (hardcoded secrets → LAW-5.3, SQL concatenation → LAW-5.2,
disabled strict mode → LAW-2.3); HIGH blocks merge pending fix-or-accept; MEDIUM is
fixed within the PR; LOW is fixed in passing with an inline citation.

## Output Discipline

- Significant corrections/refusals: **full citation block** (DECISION / CITATION /
  RATIONALE / PERSONA).
- Minor fixes in passing: inline form `(per [LAW-2.1 v1.0])`.
- Law text comes from `docs/constitution/registry.json` (or `laws/registry.json` in
  the constitution repo) — never from memory. Unsure which law applies? Consult the
  law-clerk skill.
- Persona context: name the persona whose domain the decision falls in; assume that
  persona's skill for sustained work in its domain (see docs/persona-guide.md).
