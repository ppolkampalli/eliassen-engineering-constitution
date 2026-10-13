# agent-board

A local Kanban viewer for Engineering Constitution workflows (WF-FEATURE,
WF-BUG, …): a small Vite + React app with its own tiny Node API, answering
one question for a developer or manager sitting next to an agent that's
running a governed workflow — *what stage is it in right now, is it
waiting on me, and what has it actually found or done?*

A Node server (not the browser) reads the local JSONL event log and exposes
it over one HTTP endpoint, `GET /api/events`; the React app polls that
endpoint and renders two tabs: the **Kanban Board** (three lanes — **In
Progress**, **Blocked**, **Done**) and **Constitution Cohort**, a rollup
view for "how is work distributed across workflows, laws, and personas"
rather than "what is this one work item doing right now." See
"Constitution Cohort tab" below.

This is **not** the centrally-hosted, multi-team visibility design in
`docs/proposals/agentic-visibility/` (still PROPOSED, tied to the
not-yet-ratified `AMD-2026-011`). That design is for aggregating many
teams' workflow activity behind a dashboard adapter. This tool is the
opposite end of the spectrum: one developer, one project, today. If the
centrally-hosted version is ever built, mapping this log's field names onto
that system's payload shape is a cheap, mechanical step — not a redesign —
because both already use the same plain JSON event shape.

## Install (manual distribution, like `memory-service/` and `crm-demo/`)

Not wired into `scripts/install.sh`, `validate.sh`, `update.sh`, or the
Claude Code plugin manifest — copy it into a consuming project like the
other standalone tools in this repo:

```bash
cp -r agent-board/ /path/to/your-project/agent-board/
cd /path/to/your-project/agent-board
npm install
```

Gitignore the local event log in the consuming project (it's generated at
runtime, machine/session-specific, never meant to be committed):

```
# in your-project/.gitignore
.claude/board/events.local.jsonl
```

## Run it

```bash
npm run dev        # development — hot reload + the live API
# or, for a production-style single run:
npm run build && npm run preview
```

Open the printed URL (`http://localhost:5173` for `dev`, `:4173` for
`preview`) — **if that port is already in use, Vite automatically picks the
next free one and prints the URL it actually used; always read it from the
terminal rather than assuming the default.** No file picker, no "Open Log
File" button — every browser just calls the same API, so there's no
Chrome/Edge-vs-Firefox/Safari distinction to worry about.

**cwd / `AGENT_BOARD_LOG` gotcha:** by default the server reads
`.claude/board/events.local.jsonl` relative to **the directory `npm run
dev`/`preview` was started from**. If you run those commands from inside
`agent-board/` itself (e.g. `cd your-project/agent-board && npm run dev`),
the real log is one level up — point at it explicitly:

```bash
AGENT_BOARD_LOG=../.claude/board/events.local.jsonl npm run dev
```

If you instead run from the consuming project's root with `--prefix
agent-board`, the default path is already correct.

See `docs/agent-board.md` for the full team-facing install/run guide and a
troubleshooting section (empty board, missing cards, slow updates, trying
it before any real workflow has run).

## How a workflow run gets into the board

`skills/workflow-orchestrator/SKILL.md` appends one JSON line per event to
`.claude/board/events.local.jsonl` as a best-effort, non-blocking side
effect of running a workflow (see SKILL.md §6, "Board Events"). This is
prose instruction followed by an LLM agent, not type-checked code in the
call path — if the write fails for any reason, the workflow proceeds
unaffected. Visibility is never a dependency of correctness (mirrors the
resilience principle behind LAW-4.6). This write-side contract is unchanged
from the original static-viewer version of this tool.

## API

**`GET /api/events`** — the only route. Resolves `AGENT_BOARD_LOG` from the
environment **once, at server start** (never from the request — see
"Security" below) and returns:

```json
{ "events": [ /* BoardEvent[], already parsed and schema-validated */ ],
  "skippedCount": 2, "mtimeMs": 1728739200123 }
```

- Missing log file → 200, `{"events":[],"skippedCount":0,"mtimeMs":null}`.
- Empty log file → 200, same shape but `mtimeMs` non-null (distinguishes
  "nothing has happened yet" from "no log exists yet").
- Any other read error → 500, `{"error": "<message>"}`.

The client polls this every 1.5s and only re-renders when `mtimeMs`
changes; lane/work-item derivation always runs fresh against whatever the
server returns — there's no incremental state to reconcile client-side, so
a shrunk or rewritten log is simply a fresh read.

## Security (LAW-5.1)

The log path is resolved exactly once, when the server starts, from the
`AGENT_BOARD_LOG` environment variable. The request handler never reads a
path from the request itself — no query parameter, header, or body field
can change which file gets served. This is enforced architecturally (there
is no code path through which a client could supply a path), not by
sanitizing client input.

## Event schema

One JSON object per line (JSONL). Every line has this envelope:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `schemaVersion` | string | yes | Always `"1.0"` for this version of the schema. |
| `timestamp` | string | yes | ISO-8601 UTC, e.g. `"2026-10-12T14:00:00Z"`. |
| `eventType` | string | yes | One of `workflowSelected`, `stageEvent`, `deviation`, `workflowCompleted`. |
| `workItem` | string | yes | The ticket/item id — the Kanban card's grouping key, e.g. `"JIRA-3411"`. |
| `workflowId` | string | yes | e.g. `"WF-FEATURE"`, `"WF-BUG"`. |
| `note` | string | no | Free-text "what I'm doing/finding right now" — the thinking surfaced on the card. |
| `lawCitations` | string[] | no | `LAW-X.Y` ids relevant to this event. |

Additional fields by `eventType`:

**`workflowSelected`** — emitted once, when the workflow chain is announced:
- `workflowVersion` (string, optional)
- `chain` (string, optional) — the announced chain, verbatim

**`stageEvent`** — emitted at each stage transition:
- `stageId` (string, required)
- `persona` (string, required) — e.g. `"persona-software-engineer"`
- `status` (string, required) — one of `entered`, `blocked`, `complete`
- `humanCheckpoint` (string, required) — one of `none`, `recommended`, `required`
- `hard` (boolean, optional) — whether this is a hard (non-overridable) stage

**`deviation`** — emitted when a soft stage is overridden:
- `stageId` (string, required)
- `deviationStatus` (string, required) — one of `applied`, `refused`
- `reason` (string, required)
- `approvedBy` (string, optional)

**`workflowCompleted`** — emitted once, at the end-of-run summary:
- `outcome` (string, optional)
- `deviationCount` (number, optional)

## Kanban lane rules

Lanes are derived from the **latest non-deviation** event per `workItem`
(not from literal stage names — different workflows have different stage
sets):

| Lane | Rule |
|---|---|
| **In Progress** | Latest event is `workflowSelected`, or a `stageEvent` with `status: entered` or `complete` that is not stopped on a required checkpoint. |
| **Blocked** | Latest event is a `stageEvent` with `status: blocked`, or `status: entered` with `humanCheckpoint: required` (mirrors SKILL.md: "required means stop and wait"). |
| **Done** | Latest event is `workflowCompleted`. |

A `deviation` event annotates the current card (updates its note and
citation count) without moving it to a different lane — even when it's the
chronologically last event for that work item (see
`fixtures/events.deviation-latest.jsonl`).

## Constitution Cohort tab

A second tab, next to the Kanban board, answering a different question —
not "what is each work item doing" but "how is work distributed across the
things the Constitution cares about." A selector switches between three
views, all derived client-side from the same `GET /api/events` response
(`src/lib/cohort-model.ts`, 100% test coverage, no new API calls):

- **Workflow** — one small node-graph (via [`@xyflow/react`](https://reactflow.dev))
  per distinct `workflowId`, built straight from the chain each
  `workflowSelected` event announces (`persona(stageId*) -> ...`). Each stage
  node shows its hard/conditional/human-checkpoint badges and two counts:
  how many work items are **currently** sitting there, and how many
  `stageEvent`s have **ever** touched it.
- **Laws** — a horizontal bar chart (via [`recharts`](https://recharts.org))
  of how many times each `LAW-X.Y` id has been cited across every event.
- **Personas** — the same bar chart shape, counting `stageEvent`s per
  `persona`.

This is a read-only lens on data the Kanban board already has — no new
server route, no new write-side contract. It's a deliberately different
tool from the separate, still-PROPOSED `docs/proposals/agentic-visibility/`
multi-team dashboard: this cohort view rolls up *one* project's log
client-side; that design aggregates *many* teams' logs behind a server.

## Directory layout

```
agent-board/
  package.json, tsconfig.json, vite.config.ts, jest.config.js, .eslintrc.json
  index.html                  # Vite entry shell
  fixtures/                   # sample JSONL logs, used by tests and for manual testing
  test/style-mock.js          # Jest CSS-import stub
  src/
    main.tsx, app.tsx
    lib/board-model.ts        # pure parsing/lane-derivation logic (100% test coverage)
    lib/cohort-model.ts       # pure law/persona/workflow-graph aggregation (100% test coverage)
    hooks/                    # polling + elapsed-time-ticker hooks
    components/                # Board, Lane, Card, DetailOverlay, TimelineRow,
                                # Tabs, ConstitutionCohort, BarCohortChart, WorkflowCohortGraph, …
    styles/board.css
  server/
    create-events-handler.ts  # the GET /api/events request handler (100% test coverage)
    vite-plugin-board-api.ts  # wires the handler into `vite`/`vite preview`
```

## Fixtures and tests

```bash
npm test                # run the suite
npm run test:coverage   # with coverage (100% on src/lib/ and server/, 90% on src/hooks/, 70% on src/components/)
```

| Fixture | Exercises |
|---|---|
| `fixtures/events.sample.jsonl` | Full lifecycle: 3 work items across all 3 lanes |
| `fixtures/events.empty.jsonl` | Empty-file vs. missing-file distinction |
| `fixtures/events.malformed-mixed.jsonl` | Unparseable lines are skipped, not fatal |
| `fixtures/events.schema-invalid.jsonl` | Valid JSON but missing required fields / unknown `eventType` → skipped |
| `fixtures/events.deviation-latest.jsonl` | A trailing `deviation` doesn't move the card's lane |

To check against a real log manually:

```bash
AGENT_BOARD_LOG=/path/to/events.local.jsonl npm run preview
curl http://localhost:4173/api/events | jq '{eventCount: (.events|length), skippedCount, mtimeMs}'
```

## What this is not (scope)

- No authentication, no multi-project or multi-team aggregation — that's
  the separate, still-PROPOSED `docs/proposals/agentic-visibility/` design.
- No write-side schema enforcement in code. The writer is an LLM agent
  following prose instructions in `SKILL.md`, not type-checked code in a
  call path — a malformed line is simply skipped by the server, not
  rejected at write time.
- No changes to `scripts/install.sh`, `validate.sh`, `update.sh`, or the
  plugin manifest.
- No persisted "last opened file" — moot now; there's no file picker, the
  server always points at one fixed, configured path. (The previous
  static-HTML version of this tool noted an IndexedDB-file-handle fast
  follow here; that idea no longer applies and has been dropped, not
  forgotten.)
