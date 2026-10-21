# ADR-0007: Cursor IDE Support via Generated Rules and Commands

- **Status:** ACCEPTED
- **Date:** 2026-10-20
- **Deciders:** P. Polkampalli (direction); Architect + Software Engineer
  personas (design/implement)
- **Work item:** direct request — "update the installation of constitution
  for cursor" — no separate research spike; this ADR records the decision
  because it changes the shared `scripts/install.sh` installer (LAW-4.5).

## Context

Every mechanism this constitution ships for coding agents — the 17 skills in
`skills/*/SKILL.md`, their auto-activation by `description`, and their
`/engineering-constitution:<skill>` invocation — is built on Claude Code's
own plugin/skill format. A team member using Cursor instead of Claude Code
had no supported path to the personas, the workflow orchestrator, or the
enforcement skills; only the IDE-agnostic parts (`CLAUDE.md`/`AGENTS.md`
steering files, lint/test/CI configs, the law registry) already worked
regardless of tool, and only by accident of `install.sh` already shipping
both steering files per LAW-10.4.

Direct verification of Cursor's current documentation (not assumed from
memory) found:

- Cursor reads **`AGENTS.md`** natively, at the project root and in any
  subdirectory, as a cross-IDE standard rule file — no conversion needed for
  anything already in this repo's `AGENTS.md`.
- Cursor's durable, always-or-conditionally-loaded context comes from
  **`.cursor/rules/*.mdc`** files: YAML frontmatter (`description`, `globs`,
  `alwaysApply`) plus a markdown body, with four apply modes (Always, Apply
  Intelligently via `description` matching, Apply to Specific Files via
  `globs`, Apply Manually). "Apply Intelligently" is a direct structural
  match for how a Claude skill's `description` drives auto-activation today.
- Cursor supports explicit, user-typed **`.cursor/commands/*.md`** files,
  inserted into chat on `/<name>` — a direct structural match for Claude
  Code's `/engineering-constitution:<skill>` explicit invocation.
- Cursor's MCP config (`.cursor/mcp.json` / `~/.cursor/mcp.json`) uses the
  same `mcpServers` JSON shape as Claude's — no translation needed beyond the
  file path, relevant to the optional `memory-service` MCP server.

## Options Considered

### Option A — Status quo (Claude Code only)
- Consequences: zero cost, but Cursor users remain fully unsupported — every
  persona, the workflow orchestrator, and every enforcement skill is
  unavailable to them, leaving LAW-7.4 ("identical standards" regardless of
  who — or what tool — is doing the work) unmet for a whole class of user.

### Option B — Generate `.cursor/rules/*.mdc` + `.cursor/commands/*.md` from the existing `skills/*/SKILL.md` source, add an `--ide` flag to `install.sh`
- Consequences: one new generation step in the existing installer (no new
  script, no new source of truth — LAW-1.3), each skill's frontmatter
  `description` maps directly onto the `.mdc` `description` field, and the
  body is reused verbatim for both the rule and the command file. Backward
  compatible: `--ide` defaults to `claude`, so every existing call to
  `install.sh` behaves exactly as before. `AGENTS.md` needs no change at all.
  Tradeoff, stated plainly: the generated files are a point-in-time snapshot,
  not a live sync — `scripts/update.sh` does not yet regenerate them, so a
  Cursor install must re-run `install.sh --ide cursor --force` after pulling
  constitution updates (documented in `docs/cursor-install.md`, not silently
  left as a surprise).

### Option C — Hand-author and separately maintain a parallel Cursor skill set
- Consequences: full control over Cursor-specific wording, but a second
  source of truth that drifts from `skills/*/SKILL.md` the moment either is
  edited without the other — the exact failure mode LAW-1.3 and this
  session's own prior ADR-0006 decision (reuse over duplicate) warn against.
  Rejected for the same reason Option C was rejected there.

## Decision

**Option B.** `scripts/install.sh` gained an `--ide claude|cursor|both` flag
(default `claude`, so existing behavior is unchanged for every current
caller). `--ide cursor`/`--ide both` adds an `emit_cursor_skill` step that,
for each `skills/<name>/SKILL.md`, strips the YAML frontmatter and writes:
- `.cursor/rules/<name>.mdc` — `description` (copied from the skill's
  frontmatter) + `alwaysApply: false`, body unchanged
- `.cursor/commands/<name>.md` — the same body, no frontmatter, for explicit
  `/<name>` invocation

`scripts/validate.sh` gained a conditional "Cursor IDE support" section that
only runs its checks when `.cursor/` exists in the target — a Claude-only
install reports those checks as `SKIP`, never `FAIL`, matching this repo's
existing optional/best-effort posture (LAW-4.6) for anything not every
project installs. `docs/cursor-install.md` documents the whole path;
`memory-service/README.md` gained a `.cursor/mcp.json` config block alongside
its existing Claude one.

## Consequences

- **New:** `--ide` flag and `emit_cursor_skill` in `install.sh`; the
  conditional Cursor section in `validate.sh`; `docs/cursor-install.md`; a
  `.cursor/mcp.json` snippet in `memory-service/README.md`.
- **Unchanged:** every law, workflow, and skill's actual content — this is a
  packaging/format change only, never a content fork. `AGENTS.md` itself is
  untouched; it already worked for Cursor before this ADR.
- **Risk accepted, stated plainly**: Cursor's "Apply Intelligently" rule
  auto-attach, like Claude's description-matched skill dispatch, is a model
  judgment call, not a guarantee — identical honesty to the limitation
  already stated for Claude Code's own mechanism, not a new or hidden one.
- **Follow-up, not started**: `scripts/update.sh` does not regenerate
  `.cursor/` files on `constitution` updates yet — stated as a known gap in
  `docs/cursor-install.md`, workaround given (`--ide cursor --force`), not
  silently left undocumented.

## Laws Considered

- [LAW-4.5 v1.0] — this ADR itself, triggered by a change to the shared
  installer's behavior.
- [LAW-1.3 v1.0] — consistency: Option C (a hand-maintained parallel skill
  set) was rejected in favor of generating from the single existing source
  (`skills/*/SKILL.md`), mirroring ADR-0006's reuse-over-duplicate precedent.
- [LAW-7.4 v1.0] — identical standards regardless of tool: the motivating
  gap this ADR closes is that Cursor users had no supported path to the same
  personas and workflows Claude Code users already had.
- [LAW-4.6 v1.0] — resilience: the Cursor-specific `validate.sh` checks are
  conditional and never fail an install that legitimately targeted Claude
  Code only.
- [LAW-10.4 v1.0] — governed steering files: `AGENTS.md`'s existing
  tool-agnostic design is exactly what let it work for Cursor with zero
  changes; this ADR extends that same discipline to the skills layer.
