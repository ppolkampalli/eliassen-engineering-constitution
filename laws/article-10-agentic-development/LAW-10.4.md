---
id: LAW-10.4
title: Steering Files Are Governed Artifacts
article: 10
article_name: Agentic Development
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [software-engineer, quality]
enforcement: review
enforcement_mechanism: "Steering files reviewed in PRs like code; conciseness and pruning checked in review; install.sh ships CLAUDE.md + AGENTS.md"
amendment_history:
  - amendment: AMD-2026-002
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-10.4: Steering Files Are Governed Artifacts

## Statement (quotable)

> Agent steering files (CLAUDE.md, AGENTS.md, and equivalents) are code:
> version-controlled, reviewed in PRs, kept concise, and pruned regularly. Every
> line must earn its context cost — "would removing this cause the agent to make
> mistakes?" Rules that must ALWAYS hold are implemented as hooks or CI gates,
> not steering-file prose (deterministic > advisory). Projects ship both
> CLAUDE.md and the open-standard AGENTS.md; in monorepos, nested steering files
> follow closest-takes-precedence.

## Rationale (the WHY — always citable alongside the statement)

Steering files are the constitution's delivery mechanism into every agent
session — and they fail by accretion: Anthropic's verified guidance warns
"bloated CLAUDE.md files cause Claude to ignore your actual instructions," and
prescribes treating the file "like code: review it when things go wrong, prune
it regularly, and test changes by observing whether the agent's behavior
actually shifts." The hooks-over-prose rule exists because steering text is
advisory by nature — a rule that must never be violated belongs in a mechanism
that cannot be ignored (LAW-6.2's logic applied to agents). AGENTS.md is
required alongside CLAUDE.md because it is the open standard — stewarded by the
Linux Foundation's Agentic AI Foundation, adopted by 60k+ projects, supported
across Codex, Jules, Cursor, Aider, VS Code, Devin, and Copilot — and
single-vendor steering strands the standards investment (LAW-1.3 across tools).

## Compliance Examples

VIOLATION:
```text
A 900-line CLAUDE.md accreted over a year, never pruned, containing
file-by-file codebase descriptions, stale commands, and "write clean
code" platitudes. The agent misses the three rules that matter.
```

COMPLIANT:
```text
A one-page CLAUDE.md + AGENTS.md pair, PR-reviewed like code. The
"never commit to main" rule is a pre-commit hook, not prose. A quarterly
prune removes lines the agent follows correctly without instruction.
```

## Related Laws
- LAW-1.3 (Consistency Enables Collaboration)
- LAW-6.2 (Quality Gates Are Inviolable)
- LAW-6.5 (Docs Travel With Code)

## Citation Format
[LAW-10.4 v1.0] "Steering files are code — version-controlled, PR-reviewed, concise, and pruned; always-rules become hooks or gates, not prose; projects ship both CLAUDE.md and AGENTS.md."
