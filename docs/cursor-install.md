# Installing the Engineering Constitution for Cursor

The constitution is not Claude-Code-only. Cursor users get the same laws, the
same personas, and the same workflows — translated into Cursor's own
mechanisms rather than Claude Code's. See
[ADR-0007](adr/0007-cursor-ide-support.md) for why this works the way it does.

## What already works with zero setup

`AGENTS.md` — installed at your project root by `install.sh` regardless of
`--ide` — is read **natively** by Cursor, in the project root and in any
subdirectory. Everything in it (build/test commands, naming, TDD discipline,
Article 10 agentic rules, security basics, commit/PR guidelines) already
applies the moment the file exists in your repo. There is nothing
Cursor-specific to install for this part.

## What needs a Cursor-specific install: the 17 skills

Claude Code skills (`skills/*/SKILL.md`: 8 personas, 3 orchestration skills,
6 enforcement skills) use a format and an auto-activation mechanism
(`description`-matched Skill-tool dispatch) that is specific to Claude Code.
Cursor's nearest equivalents are:

| Cursor mechanism | What it's for |
|---|---|
| `.cursor/rules/*.mdc` (`description` + `alwaysApply: false`, "Apply Intelligently" mode) | Auto-attaches when the agent judges the rule relevant — the closest match to a Claude skill auto-activating by its description |
| `.cursor/commands/*.md` | Explicit `/<name>` invocation from the chat input — the closest match to Claude's `/engineering-constitution:<skill>` |

## Install

```bash
git clone <this-repo> engineering-constitution
cd engineering-constitution
./scripts/install.sh /path/to/your-project --ide cursor
```

This installs everything `install.sh` always installs (CLAUDE.md, AGENTS.md,
tooling configs, the pre-commit hook, CI workflows, the PR template,
checklists, the offline law registry, the workflow catalog) **and**, instead
of `.claude/skills/`, generates:

- `.cursor/rules/persona-security.mdc`, `.cursor/rules/workflow-orchestrator.mdc`, … (17 total)
- `.cursor/commands/persona-security.md`, `.cursor/commands/workflow-orchestrator.md`, … (17 total)

Already have a Claude Code install and want to add Cursor support alongside
it (a mixed-IDE team) rather than replace it?

```bash
./scripts/install.sh /path/to/your-project --ide both
```

Verify either way:

```bash
./scripts/validate.sh /path/to/your-project
```

`validate.sh` checks the Cursor files only when `.cursor/` is present —
a Claude-only install still passes with those checks reported as `SKIP`, not
`FAIL` (installing for one IDE is never a defect).

## Use

Two ways to summon a persona or workflow, same shape as Claude Code:

1. **Auto-attach** — just describe the work; Cursor's agent pulls in the
   matching rule by its `description` when it judges the rule relevant:
   > "This touches authentication — review it as Security would."
2. **Explicit** — type `/` in Cursor's chat input and pick the command:
   ```text
   /persona-security
   /workflow-orchestrator
   ```

Every citation format, authority ladder, and workflow gate is identical to
the Claude Code experience — the content is generated from the exact same
`skills/*/SKILL.md` source files, just repackaged for Cursor's rule and
command formats (LAW-7.4: identical standards regardless of tool).

## Keeping Cursor files current

`scripts/update.sh` does not yet regenerate `.cursor/` files on an existing
install — re-run `install.sh --ide cursor --force` after pulling constitution
updates to refresh them (this will overwrite any local edits to the generated
`.cursor/rules/*.mdc` / `.cursor/commands/*.md` files, by design: they are
generated artifacts, not something to hand-edit).

## Optional: the memory-service MCP server

If you've also installed `memory-service/` (the decision-log MCP server, see
its own README), Cursor's equivalent of Claude Desktop/Code's `.mcp.json` is
`.cursor/mcp.json` (project scope) or `~/.cursor/mcp.json` (user scope) — same
`mcpServers` JSON shape. See memory-service/README.md's "Cursor" config block.

## Limits, stated plainly

- Cursor's rule auto-attach is a judgment call by Cursor's own agent, not a
  guaranteed dispatch — same honest limitation Claude Code's own
  description-matched skill dispatch has today.
- The generated `.cursor/` files are a point-in-time conversion of
  `skills/*/SKILL.md`; they do not live-sync. Re-run the installer (above)
  after a constitution update.
