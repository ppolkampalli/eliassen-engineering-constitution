# Changelog

All notable changes to the Engineering Constitution. Law changes reference their
amendment records (the authoritative audit trail in `amendments/records/`).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow the constitution versioning rules in
[AMENDMENT-PROCESS.md](amendments/AMENDMENT-PROCESS.md).

## [1.1.0] — 2026-06-11

### Added

- **Article 10 — Agentic Development** ratified via
  [AMD-2026-002](amendments/records/AMD-2026-002-agentic-development-article.md):
  LAW-10.1 Spec-Driven Agent Work, LAW-10.2 Verifiable Completion, LAW-10.3
  Agent Sandboxing and Permissions, LAW-10.4 Steering Files Are Governed
  Artifacts, LAW-10.5 Fresh-Context Review.

## [1.0.0] — 2026-06-01

### Added

- **All 45 laws ratified at v1.0** across Articles 1–9 via
  [AMD-2026-001](amendments/records/AMD-2026-001-initial-ratification.md)
  (initial ratification; motivated by the six founding pain points).
- Law registry: human-readable `laws/REGISTRY.md` + machine-readable
  `laws/registry.json`.
- Amendment & audit system: five-stage process, template, `law-integrity` CI gate.
- Persona system: 8 personas with authority ladder, persona-council, law-clerk,
  persona guide.
- Enforcement skills: constitution-enforcer (+ citation-format and
  violation-severity references), tdd-assistant, code-review-assistant,
  security-checker, documentation-generator, ai-transparency.
- Law-mapped tooling configs (ESLint, Prettier, tsconfig, Jest, lint-staged),
  pre-commit hook, CONFIG-LAW-MAP.
- CI workflows: quality, security, law-integrity.
- Templates (PR, ADR, law, commit guide, new-project README) and checklists
  (code review, pre-commit).
- Docs: standards, testing guide, 12-week rollout guide, persona guide, ADR-0001.
- Rollout scripts: install.sh, validate.sh, update.sh, law-lookup.sh.
