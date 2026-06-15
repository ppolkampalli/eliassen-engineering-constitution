# Installing the Engineering Constitution as a Claude Code Plugin

The constitution ships as a Claude Code **plugin** so any team can install it into
their own work and develop *under the constitution* — assuming its governance
personas, running its enforcement skills, driving its workflows, and citing its laws
— without copying anything into their repository.

This is **Option A** in the [README](../README.md). For full whole-repo governance
(configs, CI, hooks, registry copied in), use **Option B**, `scripts/install.sh`.

---

## What the plugin provides

| Capability | What you get |
|---|---|
| **8 personas** | `persona-security`, `persona-architect`, `persona-quality`, `persona-software-engineer`, `persona-product-owner`, `persona-industry-sme`, `persona-devops`, `persona-finops` |
| **Orchestration** | `persona-council` (multi-persona review), `law-clerk` (lookup + amendments), `workflow-orchestrator` (drive the 6 workflows) |
| **Enforcement** | `constitution-enforcer`, `tdd-assistant`, `code-review-assistant`, `security-checker`, `documentation-generator`, `ai-transparency` |
| **Citable laws** | The full 57-law registry bundled in the plugin (`laws/registry.json`), so personas cite law text and versions offline |

All personas and skills are namespaced under the plugin: `engineering-constitution`.

## Install

### From the git marketplace (shareable)

```text
/plugin marketplace add ppolkampalli/eliassen-engineering-constitution
/plugin install engineering-constitution
```

Installs at user scope by default (available in all your projects). For a single
project shared with your team via version control, install at project scope:

```text
/plugin install engineering-constitution --scope project
```

### Locally (development / testing)

No marketplace needed — point Claude Code at a clone:

```bash
claude --plugin-dir /path/to/eliassen-engineering-constitution
```

Or register the local clone as a marketplace to exercise the real install flow:

```text
/plugin marketplace add /path/to/eliassen-engineering-constitution
/plugin install engineering-constitution
```

## Use

Two ways to summon a persona once installed:

1. **Explicit** — invoke the skill by its namespaced command:
   ```text
   /engineering-constitution:persona-security
   /engineering-constitution:workflow-orchestrator
   ```
2. **Natural language** — just describe the work, and the matching persona
   auto-activates by its description:
   > "Act as the Security persona and review this webhook handler."
   > "Run WF-FEATURE on this ticket."
   > "Look up LAW-2.3 and tell me why it exists."

Every persona decision arrives as a citation — `DECISION / CITATION [LAW-X.Y vN] /
RATIONALE / PERSONA` — so you can trace any call back to the law that grounds it.
See [persona-guide.md](persona-guide.md) for the authority ladder and worked
examples, and [../workflows/README.md](../workflows/README.md) for the workflow
catalog.

## Updating

```text
/plugin update engineering-constitution
```

The plugin is versioned (currently 1.2.0, tracking the constitution version). When
laws are amended and a new version is published, updating pulls the new law text and
any new/changed skills.

## Plugin vs. install.sh — which do I want?

- **Plugin (this guide):** "I want to *develop* with the constitution's personas and
  skills." Clean, versioned, no files added to your repo. Does **not** install your
  project's lint/test/CI configs or copy the registry into your `docs/`.
- **`install.sh`:** "I want my *whole repo* governed." Copies the full stack —
  configs, pre-commit hook, CI workflows, PR template, checklists, offline registry,
  and the skills — into the target project. See [rollout-guide.md](rollout-guide.md).

Many teams use both: the plugin for day-to-day persona-driven development, and
`install.sh` to put the enforcement machinery (gates, CI) into each governed repo.
