# Agent Board — Watching a Workflow Run Locally

A small Vite + React app with its own tiny Node API that renders governed
workflow activity (WF-FEATURE, WF-BUG, …) in three tabs: a three-lane
Kanban board (**In Progress**, **Blocked**, **Done**), a **Constitution
Cohort** tab — node-graph and bar-chart rollups of the same log by
workflow, law, and persona, for a manager who wants a distribution view
rather than a per-item one — and a **Token & Cost** tab, which joins that
same log against Claude Code's own session transcripts to show
approximately what each work item/stage cost in tokens and dollars
(LAW-9.3). A Node server reads a local JSON-lines log off disk and exposes
it over one HTTP endpoint; the browser just polls that endpoint — no file
picker, no browser-specific file-access quirks.

## What it is

When `workflow-orchestrator` runs a workflow, it now also appends events to
`.claude/board/events.local.jsonl` as a best-effort side effect
(`skills/workflow-orchestrator/SKILL.md` §6). This doc is for the human
watching that run, not the agent writing to it — see `agent-board/README.md`
for the full event schema if you're integrating something with the log
yourself.

## Prerequisites

Node.js 18+ and npm. No other project-wide tooling — this doesn't depend on
anything else installed by `scripts/install.sh`.

## Install it

One-time setup, done once per project by whoever sets it up for the team:

```bash
# from inside your application project
cp -r <path-to-engineering-constitution>/agent-board ./agent-board
cd agent-board
npm install
```

Add the local log to `your-project/.gitignore` (it's generated at runtime
and is machine/session-specific — never commit it):

```
.claude/board/events.local.jsonl
```

That's it. Nothing else in the project needs to change, and this doesn't
touch anything installed by `scripts/install.sh`.

## Run it

Anyone on the team who wants to watch a workflow run does this from the
`agent-board/` directory:

```bash
npm run dev                       # development, hot reload — use this day to day
# or, for a production-style single run:
npm run build && npm run preview
```

Vite prints the URL to open, e.g. `http://localhost:5173`. **If that port is
already busy (common if you have another Vite app running), it automatically
tries the next one and prints the URL it actually used** — always use the
URL from the terminal output, don't assume 5173.

Open that URL — every browser works identically, since the Node server (not
the browser) is what reads the file; there's no file picker and no
Chrome/Edge-vs-Firefox/Safari distinction to think about. Leave the tab open
while a workflow runs; it polls automatically.

**One gotcha:** the default log path (`.claude/board/events.local.jsonl`) is
resolved relative to **the directory you ran `npm run dev`/`preview`
from**. Running those commands from inside `agent-board/` itself (as above)
means the real log is one level up, in the application project root:

```bash
AGENT_BOARD_LOG=../.claude/board/events.local.jsonl npm run dev
```

If your team always runs it this way, consider adding that env var to an
`.env`/README note for the project, or a tiny wrapper script, so nobody has
to remember it.

## Reading the board

Each card is one work item (a ticket/item id). Its lane reflects the
*latest* stage event for that item, not a fixed set of stage names — WF-BUG
and WF-FEATURE have different stages, but every workflow's progress lands in
one of the same three lanes:

- **In Progress** — the workflow has started and isn't stopped on anything.
- **Blocked** — stopped: either a stage explicitly reported `blocked`, or it
  hit a human checkpoint marked `required` and, per SKILL.md, is waiting for
  you (LAW-6.1, LAW-7.1 — agents never self-approve through these).
- **Done** — the workflow emitted its end-of-run summary.

Click a card to see a process flowchart of every stage it actually passed
through, in order — including a distinct dashed node for a stage skipped
entirely via an applied deviation. Click a step to see its full detail
below the chart: persona, status, hard/human-checkpoint badges, any
recorded deviation's reason and who approved it, the short status note,
and — when the stage produced one — the **full decision content**: the
actual Acceptance Criteria text, an ADR's full rationale, a test list, a
security finding, not just a one-line summary. That full-content field
(`detail` in the event schema) is the closest thing this tool has to "what
did the agent actually decide, in full, right now" — see
`agent-board/README.md`'s "Kanban card detail view" section for the
complete breakdown.

A hard-stage badge marks stages that can't be skipped or softened
(LAW-6.2); a citation count on each card tells you how many `LAW-X.Y`
references the work has touched so far.

## Reading the Constitution Cohort tab

Click the **Constitution Cohort** tab and pick **Workflow**, **Laws**, or
**Personas**. Workflow shows each distinct workflow's stage chain as a small
graph, with per-stage counts of how many items are there now vs. have ever
passed through; Laws and Personas show a bar chart of citation/activity
counts. See `agent-board/README.md`'s "Constitution Cohort tab" section for
the full breakdown of what each view computes.

## Reading the Token & Cost tab

Click the **Token & Cost** tab to see total spend, a cost-per-hour time
series, and breakdowns by work item, workflow, stage, persona, and model.
It works by matching this project's Claude Code session transcripts
(`~/.claude/projects/.../*.jsonl`) against the board's own event log,
attributing each transcript turn to whichever work item/stage was open at
that turn's timestamp — an approximate, time-window join, not a precise
instrumentation link, so a turn outside any open window shows up as
**unattributed** rather than being guessed. Dollar totals come from the
user-editable `agent-board/model-pricing.json` rate table; an unrecognized
model string is reported as **unpriced** rather than silently costed at
$0 — check that file's `_comment` field for its pricing provenance/date
before trusting a total for a budget decision. Only numeric usage fields
(token counts, model, timestamp) are ever read out of a transcript — never
raw message content (LAW-7.2). Unlike the Kanban/Cohort tabs, this one
isn't polled automatically; it fetches once on open and on **Refresh**,
since rescanning transcript files on every tick would be wasteful. See
`agent-board/README.md`'s "Token & Cost tab" section for the full design
and its known cwd gotcha (auto-corrected by default, but overridable via
`AGENT_BOARD_PROJECT_CWD` for non-standard layouts).

## Troubleshooting

- **Board shows "No events yet" and never updates.** Either no workflow has
  run yet in this project, or `AGENT_BOARD_LOG` isn't pointing at the right
  file (see the cwd gotcha above). Quick check:
  `cat .claude/board/events.local.jsonl` (from the project root) — if that
  file doesn't exist or is empty, the orchestrator hasn't written anything
  yet. Run a workflow (`workflow-orchestrator`) and check again.
- **Terminal shows a different port than you expected.** Normal — see "Run
  it" above. Use whatever URL Vite actually printed.
- **Updates feel delayed.** The board polls every ~1.5s by design, not
  instantly — that's expected, not a bug.
- **A work item you expect to see is missing, or a line looks skipped.**
  Malformed or schema-invalid lines are silently skipped rather than
  crashing the board (by design — see "What this is not" below). Check the
  status line at the top of the page: it reports how many lines were
  skipped. `cat` the raw log file to find the bad line if you need to debug
  the orchestrator's output itself.
- **Want to try it before a real workflow has run anything.** Point it at
  the bundled example instead of a real log:
  `AGENT_BOARD_LOG=./fixtures/events.sample.jsonl npm run dev` (run from
  inside `agent-board/`) — shows a fully worked example across all three
  lanes.
- **Want to see the Token & Cost tab with real-looking numbers.** There's a
  larger demo dataset (7 work items, every workflow type, every persona,
  multiple models) with matching fake transcripts — see
  `agent-board/README.md`'s "Demo dataset" section for the one-line command
  to point `npm run preview` at it.

## What this is not

This is a single-project, zero-infrastructure convenience viewer — point it
at one log file on one machine. It is **not** the centrally-hosted,
multi-team visibility design in `docs/proposals/agentic-visibility/` (still
PROPOSED, tied to the not-yet-ratified `AMD-2026-011`), which is meant for
aggregating many teams' activity behind a dashboard for leadership. If that
design is ever built, this tool's event log maps onto it with a one-line
field-name translation — not a redesign — because both use the same plain
JSON event shape.

There's no authentication, no multi-project rollup, and no CI wiring: the
log is written by an LLM agent following prose instructions, not enforced by
type-checked code, so a malformed line is simply skipped by the server
rather than rejected at write time. The log file path is fixed by the
`AGENT_BOARD_LOG` environment variable at server start and is never
accepted from the browser — a deliberate LAW-5.1 control, not an
oversight. See `agent-board/README.md` for the full scope notes and the
event schema reference.
