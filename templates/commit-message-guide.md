# Commit Message Guide

Conventional Commits, constitution-extended. Commit messages are part of the audit
trail: they carry AI provenance (LAW-7.3) and amendment enactments.

## Format

```text
<type>(<optional scope>): <imperative summary ≤72 chars> [Claude-assisted]?

<body: the WHY — context, constraint, trade-off (LAW-6.4 applies to commits too)>

<footer: ticket refs, breaking changes>
```

## Types

| Type | Use |
|---|---|
| `feat` | New behavior |
| `fix` | Bug fix |
| `test` | Tests only (red commits in TDD, LAW-3.1) |
| `refactor` | Structure change, behavior identical |
| `docs` | Documentation only |
| `chore` | Tooling, deps, scaffolding |
| `perf` | Performance change (with measurements) |
| `ci` | Pipeline/workflow changes |
| `law` | **Reserved: amendment enactments only** |

## The `[Claude-assisted]` tag (LAW-7.3)

Any commit containing AI-generated code carries the tag in the subject line:

```text
feat(orders): add reconciliation job [Claude-assisted]
```

Threshold: AI produced code that survived into the commit. When in doubt, tag.
Other approved tools use their own tag (`[Copilot-assisted]`). Undisclosed AI
involvement is the violation — never the involvement itself.

## The `law:` prefix (reserved)

Used exclusively for amendment enactments, by the exact format in
[AMENDMENT-PROCESS.md](../amendments/AMENDMENT-PROCESS.md):

```text
law: amend LAW-X.Y via AMD-YYYY-NNN — <summary>
```

A `law:` commit must contain the law file change, registry updates, the ENACTED
amendment record, and the CHANGELOG entry — one commit, per the enactment stage.

## TDD commit rhythm (LAW-3.1)

```text
test(pricing): proration charges partial month at daily rate (red)
feat(pricing): implement proration (green) [Claude-assisted]
refactor(pricing): extract DailyRateCalculator
```

## Examples

```text
fix(auth): reject expired refresh tokens at introspection

Vendor contract §4.2 caps token lifetime at 15m for regulated data
(BR-SEC-009); we were honoring the JWT exp only, not the introspection
revocation. JIRA-2231.
```

```text
law: amend LAW-2.4 via AMD-2026-002 — extend explicit return types to public class accessors
```
