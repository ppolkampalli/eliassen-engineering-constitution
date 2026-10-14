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
| `note` | string | no | Free-text "what I'm doing/finding right now" — the thinking surfaced on the card. Kept short. |
| `detail` | string | no | The full decision content when a stage produced a structured artifact — e.g. the actual Acceptance Criteria text, an ADR's full rationale, a test list, a security finding. May be multi-line. Shown only in the per-item flowchart's detail panel, never in compact views. |
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

## Kanban card detail view

Clicking a card opens a process flowchart (via
[`@xyflow/react`](https://reactflow.dev), `src/lib/item-flow-model.ts` +
`src/components/item-flow-chart.tsx`, 100%/≥70% test coverage) of that one
work item's **actual** event history, left to right in the order it
happened — not the workflow's full declared chain, just what this item
really did. Repeated `stageEvent`s at the same stage (entered → blocked →
complete) collapse into one node showing its latest status; a stage
skipped entirely via an applied `deviation` (no `stageEvent` of its own)
gets a distinct dashed "skipped" node, since an override is itself a
decision worth seeing, not something to hide.

Clicking a node opens a detail panel below the chart with everything
recorded for that step: the persona, status, hard/human-checkpoint badges,
the short `note`, the full `detail` (the actual Acceptance Criteria, ADR
rationale, test list, etc. — see "Event schema" above), `LAW-X.Y` citations,
any attached deviation's reason/approver, and every underlying event's
timestamp. The panel defaults to the item's current/latest step on open so
it's never empty.

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

## ADR Records tab

A fourth tab, answering "which architecture decisions has this project's
agentic work actually recorded." A left-nav list of every `.md` file in the
project's ADR folder, plus a markdown preview pane on the right that always
defaults to the **first** file in the list (by filename — the
`NNNN-<kebab-title>.md` zero-padded convention from `templates/adr-template.md`
sorts correctly as a plain string sort).

- **What it reads**: `GET /api/adr` resolves `AGENT_BOARD_ADR_DIR` from the
  environment **once, at server start** (default `docs/adr`, same
  once-at-startup posture as `AGENT_BOARD_LOG` — see "Security" above) and
  returns every `.md` file's full filename, derived title, and content in one
  response (`server/adr-source.ts`, `server/create-adr-handler.ts`, both 100%
  test coverage). Returning all files in one shot — not a per-filename route
  — means there's no client-controlled filename anywhere in this endpoint
  (LAW-5.1), mirroring `/api/events` and `/api/token-usage`. A missing
  directory returns an empty list, not an error.
- **Title derivation**: the first `# Heading` line in the file's content; if
  none is found, the filename with `.md` stripped.
- **Markdown rendering is a hand-rolled parser** (`src/lib/markdown-model.ts`,
  100% test coverage), not a dependency. `react-markdown`, `marked`, and
  `markdown-to-jsx` are all ESM-only in their current major versions, which
  breaks under this project's Jest config (`ts-jest`, no Babel, no
  `transformIgnorePatterns` override) without extra tooling — and the actual
  markdown this project's ADRs use is a narrow, bounded subset. The parser
  supports headings (`#`–`######`), paragraphs, unordered/ordered lists,
  fenced code blocks, and inline bold/italic/code/links; it renders through
  real React elements (`src/components/markdown-view.tsx`), never
  `dangerouslySetInnerHTML`. **Stated gap**: anything outside that subset
  (tables, images, nested emphasis, blockquotes) renders as literal text, not
  garbled HTML — visible and honest rather than silently mishandled.
- **Polls like the Kanban board**, but on a longer 5s default interval
  (`src/hooks/use-adr-records.ts`, 100% test coverage) — ADR files change far
  less often than board events, and this endpoint returns full file content
  on every tick, not a compact event log.
- Read-only — no editing or writing from the UI.

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
    lib/item-flow-model.ts    # pure per-item event-history-to-flowchart logic (100% test coverage)
    lib/token-cost-model.ts   # pure usage-parsing/attribution/pricing/aggregation (100% test coverage)
    lib/markdown-model.ts     # pure markdown-subset parser for the ADR Records tab (100% test coverage)
    hooks/                    # polling + elapsed-time-ticker hooks; on-demand token-usage fetch
    components/                # Board, Lane, Card, DetailOverlay, ItemFlowChart, ItemStageNode,
                                # Tabs, ConstitutionCohort, BarCohortChart, WorkflowCohortGraph,
                                # TokenCostDashboard, TokenCostTimeSeries, TokenCostStatTile,
                                # AdrRecords, MarkdownView, …
    styles/board.css
  server/
    create-events-handler.ts        # the GET /api/events request handler (100% test coverage)
    vite-plugin-board-api.ts        # wires it into `vite`/`vite preview`
    transcript-source.ts            # finds & reads this project's Claude Code session transcripts
    price-table.ts                  # loads and validates model-pricing.json
    create-token-usage-handler.ts   # the GET /api/token-usage request handler (100% test coverage)
    vite-plugin-token-usage-api.ts  # wires it into `vite`/`vite preview`
    adr-source.ts                    # lists/reads ADR .md files from AGENT_BOARD_ADR_DIR (100% test coverage)
    create-adr-handler.ts            # the GET /api/adr request handler (100% test coverage)
    vite-plugin-adr-api.ts           # wires it into `vite`/`vite preview`
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
| `fixtures/adr/` | ADR Records tab: headings/bold/inline-code/links/list in one file, a fenced code block in another, a file with no `# ` heading (title fallback), a non-`.md` file and a directory named `*.md` (both filtered out) |

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
