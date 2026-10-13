# agent-board

A local Kanban viewer for Engineering Constitution workflows (WF-FEATURE,
WF-BUG, …): a small Vite + React app with its own tiny Node API, answering
one question for a developer or manager sitting next to an agent that's
running a governed workflow — *what stage is it in right now, is it
waiting on me, and what has it actually found or done?*

A Node server (not the browser) reads the local JSONL event log and exposes
it over one HTTP endpoint, `GET /api/events`; the React app polls that
endpoint and renders three tabs: the **Kanban Board** (three lanes — **In
Progress**, **Blocked**, **Done**), **Constitution Cohort**, a rollup view
for "how is work distributed across workflows, laws, and personas" rather
than "what is this one work item doing right now" (see "Constitution
Cohort tab" below), and **Token & Cost**, a Grafana-style view of what this
work actually costs in tokens and dollars (see "Token & Cost tab" below).

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

## Token & Cost tab

A third tab, answering "how much is this agentic work actually costing in
tokens and dollars, and where." Built as a read-only correlation layer over
two things already on disk — the board's own event log (for *when* each
work item/stage was open) and Claude Code's own session transcripts (for
*what tokens were spent when*) — with **no changes to the orchestrator's
write contract**.

- **What it reads**: every `*.jsonl` file under `~/.claude/projects/` whose
  recorded `cwd` matches this project. Files are matched by content, not by
  guessing Claude Code's project-directory name encoding — a real project
  directory was found encoding a space as `-20` (its hex code), proving
  that scheme isn't a simple `/`-to-`-` replace, so content-matching is the
  robust choice (`server/transcript-source.ts`).
- **What it extracts**: only the numeric `usage` fields (input/output/
  cache-read/cache-write tokens), the `model` string, and the `timestamp`
  from each assistant turn — raw transcript message content is never read
  for any other purpose, and never appears in the `GET /api/token-usage`
  response (LAW-7.2).
- **Attribution is approximate, by design**: a transcript turn is
  attributed to whichever work item/stage was open (per the board's own
  event timestamps) at that turn's time. A turn outside any open window, or
  inside more than one (ambiguous), is reported as `unattributed` rather
  than guessed — the dashboard shows this count explicitly, it's not hidden.
- **Dollar amounts depend on `model-pricing.json`** (a user-editable file
  at the project root, seeded with Anthropic's public list price as of the
  date in its `_comment` field). **Verify it against your actual contract
  or negotiated rates before trusting a total for a budget decision.** A
  `model` string not found in the table is reported as "unpriced," never
  silently priced at $0.
- **Not polled** like the Kanban board — scanning potentially-large
  transcript files every 1.5s would be wasteful. The tab fetches once on
  open and has a manual Refresh button.
- **The cwd gotcha has a built-in fix here**: Claude Code records a
  session's `cwd` as the project root, but the documented way to run this
  tool is `cd your-project/agent-board && npm run dev` — so
  `GET /api/token-usage` defaults to matching against the **parent** of
  `process.cwd()` whenever that directory is literally named `agent-board`
  (`AGENT_BOARD_PROJECT_CWD` overrides this for any other layout). Unlike
  the Kanban board's `AGENT_BOARD_LOG` gotcha, this one is corrected
  automatically rather than just documented.

## Directory layout

```
agent-board/
  package.json, tsconfig.json, vite.config.ts, jest.config.js, .eslintrc.json
  index.html                  # Vite entry shell
  model-pricing.json           # user-editable $/MTok rate table for the Token & Cost tab
  fixtures/                   # sample JSONL logs, used by tests and for manual testing
    transcripts/               # fixture ~/.claude/projects/-style directory trees
  test/style-mock.js          # Jest CSS-import stub
  test/resize-observer-mock.js # ReactFlow/recharts need a ResizeObserver in jsdom
  src/
    main.tsx, app.tsx
    lib/board-model.ts        # pure parsing/lane-derivation logic (100% test coverage)
    lib/cohort-model.ts       # pure law/persona/workflow-graph aggregation (100% test coverage)
    lib/token-cost-model.ts   # pure usage-parsing/attribution/pricing/aggregation (100% test coverage)
    hooks/                    # polling + elapsed-time-ticker hooks; on-demand token-usage fetch
    components/                # Board, Lane, Card, DetailOverlay, TimelineRow,
                                # Tabs, ConstitutionCohort, BarCohortChart, WorkflowCohortGraph,
                                # TokenCostDashboard, TokenCostTimeSeries, TokenCostStatTile, …
    styles/board.css
  server/
    create-events-handler.ts        # the GET /api/events request handler (100% test coverage)
    vite-plugin-board-api.ts        # wires it into `vite`/`vite preview`
    transcript-source.ts            # finds & reads this project's Claude Code session transcripts
    price-table.ts                  # loads and validates model-pricing.json
    create-token-usage-handler.ts   # the GET /api/token-usage request handler (100% test coverage)
    vite-plugin-token-usage-api.ts  # wires it into `vite`/`vite preview`
    http-errors.ts                   # shared ENOENT/error-message helpers for both handlers
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
| `fixtures/events.token-usage.jsonl` | A board log whose timestamps line up with `fixtures/transcripts/project-a/` for attribution tests |
| `fixtures/transcripts/` | Fixture project directories (real transcripts open with session-metadata lines before any line carries `cwd` — matched here too, not just a happy-path first line) |
| `fixtures/price-table-*.json` | Malformed JSON, a non-object, and an entry missing a required rate field |

To check against a real log manually:

```bash
AGENT_BOARD_LOG=/path/to/events.local.jsonl npm run preview
curl http://localhost:4173/api/events | jq '{eventCount: (.events|length), skippedCount, mtimeMs}'
curl http://localhost:4173/api/token-usage | jq '{totalCostUsd, unattributedRecordCount, unpricedRecordCount}'
```

### Demo dataset (manual exploration, not used by any test)

`fixtures/events.demo.jsonl` + `fixtures/transcripts-demo/crm-project/` is a
larger, hand-built dataset meant for looking at the UI, not for assertions —
no spec file references it. It's 7 work items across all 4 workflow types
(WF-FEATURE, WF-BUG, WF-SECBUG, WF-REFACTOR), all 6 personas, 3 priced
models plus one deliberately-unrecognized model string (to populate the
"unpriced" stat), one item that was blocked then approved, one still
genuinely in progress (so the Kanban board shows all three lanes at once),
and a handful of usage records timestamped in the gaps between items (to
populate "unattributed" realistically rather than leaving it at zero).
Run it with:

```bash
AGENT_BOARD_LOG=fixtures/events.demo.jsonl \
AGENT_BOARD_TRANSCRIPTS_ROOT=fixtures/transcripts-demo \
AGENT_BOARD_PROJECT_CWD=/Users/demo/crm-project \
npm run preview -- --port 4199
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
