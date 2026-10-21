# Constitution Memory Service — reference implementation

The runnable reference for the **Central Memory Service** described in the article
[“Many Agents, One Source of Truth”](../user-training-onboarding/src/data/articles-content.ts):
a local **MCP server** that exposes the Engineering Constitution to AI agents as a
shared, queryable memory. Point your agents (Claude Code, or any multi-agent
platform that speaks MCP) at it, and every agent reads the same laws, sees the same
prior decisions, and writes its own decisions back — cited and append-only.

It is itself governed by the constitution: strict TypeScript (extends
`../configs/tsconfig.base.json`), domain logic written test-first at 100% coverage
(LAW-3.x), and an end-to-end smoke test.

## The two access rules (the whole governance idea)

- **Laws are read-only.** Agents look laws up; they never change them. Changing a
  law goes through the amendment process and the Law Clerk — not this server.
- **Decisions are append-only.** Every decision an agent records is appended with
  its law citations and survives forever, so provenance is never overwritten
  (LAW-7.3, LAW-10.6).

## The six tools

| Tool | Purpose | Access |
|---|---|---|
| `look_up_law` | Law by ID (`LAW-5.2`) or topic keyword → full record + citation | read |
| `list_laws` | The law index, optionally filtered by article | read |
| `get_workflow` | A workflow definition (stages, personas, gates), or list all | read |
| `get_amendment_history` | The amendment IDs recorded on a law | read |
| `query_decisions` | Prior decisions by work item / persona / cited law | read |
| `record_decision` | Append a cited decision (≥ 1 `LAW-X.Y` citation required) | **append** |

## Run it

```bash
cd memory-service
npm install
npm run build      # compile to dist/
npm start          # launches the stdio MCP server
# or, no build step:
npm run dev        # runs src/server.ts via tsx

npm test           # 29 unit tests (domain logic, 100% covered)
npm run build && node smoke.mjs   # end-to-end: spawn server, list + call tools
```

By default it reads `../laws/registry.json` and `../workflows/registry.json` (i.e.
this repo) and writes to `./decisions.local.jsonl`. Override with environment
variables:

- `CONSTITUTION_ROOT` — repo root holding `laws/` and `workflows/` (default `..`).
- `MEMORY_LOG_PATH` — the append-only decision log (default `./decisions.local.jsonl`).

A committed [`decisions.sample.jsonl`](decisions.sample.jsonl) shows the log format;
the live log (`decisions.local.jsonl`) is gitignored per-project memory.

## Register it with an agent

**Claude Code (project scope):** add an `.mcp.json` at your project root —

```json
{
  "mcpServers": {
    "constitution-memory": {
      "command": "node",
      "args": ["./memory-service/dist/server.js"],
      "env": {
        "CONSTITUTION_ROOT": "./docs/constitution-source",
        "MEMORY_LOG_PATH": "./.memory/decisions.local.jsonl"
      }
    }
  }
}
```

Then every agent in that project gets the six tools. In a multi-agent platform,
give the same stdio command to each agent so they share one memory and one decision
log — the architecture in Figure 2 of the article.

**Cursor (project scope):** same `mcpServers` shape, different file —
`.cursor/mcp.json` at your project root (or `~/.cursor/mcp.json` for user
scope, available in every project):

```json
{
  "mcpServers": {
    "constitution-memory": {
      "command": "node",
      "args": ["./memory-service/dist/server.js"],
      "env": {
        "CONSTITUTION_ROOT": "./docs/constitution-source",
        "MEMORY_LOG_PATH": "./.memory/decisions.local.jsonl"
      }
    }
  }
}
```

See [docs/cursor-install.md](../docs/cursor-install.md) for the rest of the
Cursor install path (personas, workflow orchestrator, and enforcement skills
as `.cursor/rules/`/`.cursor/commands/`).

## How this maps to the article

- **Figure 2 (Central Memory Service):** this server is the MemoryGraph. The “57
  Laws,” “6 Workflows,” and “Amendment history” nodes are the read tools over the
  registries; the “Decision & citation log” node is `record_decision` /
  `query_decisions`.
- **Laws read-only, decisions append-only:** enforced here in code (no tool mutates
  a law; `record_decision` only appends and demands a citation).
- **Citation contract:** `record_decision` rejects a decision with no citation (zod
  `min(1)`) or a malformed one (must match `LAW-X.Y`).

## Distribution — the next step (honest status)

This is a **local stdio reference implementation**: it runs from a clone, reads the
repo’s registries, and is wired per project via `.mcp.json`. To ship it so teams
get it with zero setup, the upgrade paths are:

1. **Bundle it into the `engineering-constitution` plugin** via a plugin-root
   `.mcp.json` so `/plugin install` also installs the memory service. This needs the
   server’s dependencies available at run time (publish to npm and invoke via
   `npx`, or commit a self-contained bundle) — deliberately not done here to avoid
   committing build artifacts.
2. **Package as an MCPB** (bundled runtime) for non-Node teams.
3. **Host it remotely** if a team wants one shared memory across projects (the
   decision log then becomes a shared store, not a local file).

The architecture — persona-as-agent-identity, orchestrator-as-workflow,
constitution-as-memory — is unchanged across all three; only the packaging differs.
