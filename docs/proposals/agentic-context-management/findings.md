# Findings: What This Repo Does Today, and What Current Practice Recommends

**Persona:** Software Engineer · **Workflow:** WF-RESEARCH v1.0 (investigate stage)
**Entry:** `requirements.md`'s problem statement
**Gates:** LAW-7.2 (Part B is public research only), LAW-8.2 (every claim cited)

## Part A — Internal Audit: What This Repo Relies On Today

**Only one existing context-isolation mechanism**: LAW-10.5's fresh-context
subagent dispatch (`skills/workflow-orchestrator/SKILL.md` §2 step 3, built
this session), triggered when a stage's `gates` cites `LAW-10.5` — today
exactly two stages catalog-wide (WF-FEATURE's `code-review`, WF-BUG's
`verify`). Every other stage, across every other workflow, runs inside one
continuous session with no context-budget awareness at all — confirmed by a
full read of `workflow-orchestrator/SKILL.md` (201 lines): no step checks
diff size, stage count, or review-content size against context limits.

**`memory-service`'s decision log is narrow by design, not a context-
reconstruction tool.** `record_decision`/`query_decisions` store a compact,
citation-bearing record (`{workItem, persona, decision, lawCitations,
rationale}`) — enough to check "has this already been decided," explicitly
not a transcript or reasoning chain (`memory-service/README.md`).

**`agent-board`'s JSONL event log *can* reconstruct state, but is framed
only as a human-facing dashboard, never as an agent-context mechanism.**
The per-item detail view can show "everything recorded for that step:
persona, status, badges, note, full `detail`" (`agent-board/README.md`) —
functionally sufficient for a new session to read "what happened so far"
without the original transcript — but every description of this feature
frames it as visibility for humans, not as a resume mechanism for agents.

**No law frames markdown-writing as context management.** Checked LAW-7.3,
LAW-4.5, LAW-10.1 directly: LAW-7.3's rationale is entirely human-facing
provenance; LAW-10.1's is about correctness-before-code. **LAW-4.5 comes
closest** — its rationale states an ADR makes "agent assistance safe (an AI
extending the system can read the intent, not just the artifact)" — but
even this is framed as architectural safety/reversibility, not token
economics. This is a real, confirmed gap, not an inferred one.

**No documented multi-session resume protocol exists, despite every
workflow having at least one hard stop.** All six workflows
(`workflows/WF-*.md`) have ≥1 `human_checkpoint: required` stage — a run
can pause for an extended period waiting on a human. Nothing in
`workflow-orchestrator/SKILL.md` or any workflow file says how a session
(the same one, hours later, or a different one entirely) resumes. Whatever
reconstruction happens today relies on `memory-service`/`agent-board` only
by inference, not because any text instructs it.

**This repo's own steering file is clean on the one checkable risk found in
Part B**: only one `CLAUDE.md` exists repo-wide (root-scoped, 58 lines), no
nested or path-scoped rule files anywhere (`find` confirmed) — so the
"nested rules don't survive compaction" risk (Part B, finding 1) doesn't
currently apply here. Worth stating as a verified-clean finding, not left
unchecked.

**A previously refuted claim, correctly distinguished from this spike's
concern**: `docs/research/2026-06-13-token-economics-enterprise-roi-research.md`
lists "Context Window Creep is the largest hidden cost" as refuted (1-2
adversarial votes) — but that is a cost-economics claim (is this the
biggest spend driver), not the reliability claim this spike investigates
(does context growth degrade correctness). Distinct claims; this spike does
not resurrect the refuted one.

**Prior art already exists for steering-file hygiene specifically**:
`docs/research/2026-06-11-agentic-constitution-research.md` already cites
Anthropic's guidance to "treat CLAUDE.md like code: review it when things go
wrong, prune it regularly... bloat causes instruction loss" — this spike
builds on that research rather than re-deriving it.

## Part B — External Research: Anthropic's Own Framework, Directly on Point

**1. Claude Code's actual compaction mechanics** (official docs,
`code.claude.com/docs/en/context-window`): triggers automatically near the
limit or via `/compact`. What survives, re-injected **from disk**, not
message history: project-root `CLAUDE.md`, auto memory, skill descriptions,
the plan-mode plan file, a fresh git-status snapshot. Invoked skill bodies
are re-injected but capped (5,000 tokens/skill, 25,000 total, oldest
dropped first, truncation keeps the file's *start* — critical instructions
belong at the top of a `SKILL.md`). Up to 5 most-recently-touched files are
re-read post-compaction, but a file over 5,000 tokens returns as a path
reference only. **Nested/path-scoped `CLAUDE.md` content loads into message
history and is summarized away like everything else** — only root-scoped
content reliably survives. Subagents run in an isolated context window;
only their final summary returns to the parent.

**2. "Context rot" is well-established, not speculative.** Chroma's
July 2025 study (18 frontier models including Claude 4) found performance
degrades as input length grows *even on trivially simple tasks*, holding
task complexity constant — genuine reliability decay, not just "harder to
find a needle." Anthropic's own engineering blog adopts this framing
directly, attributing it architecturally to the model's attention
mechanism stretching thin as context grows.

**3. Anthropic's own three-technique framework directly answers the user's
three named options** (`anthropic.com/engineering/
effective-context-engineering-for-ai-agents`):
- **Compaction** — "the first lever," but risks real information loss:
  "overly aggressive compaction can result in the loss of subtle but
  critical context whose importance only becomes apparent later." Fits
  "tasks requiring extensive back-and-forth."
- **Structured note-taking** — a persistent file (NOTES.md-style) outside
  the context window, pulled back in later: "provides persistent memory
  with minimal overhead," demonstrated maintaining state "across context
  resets." Fits "iterative development with clear milestones."
- **Sub-agent architectures** — isolated context per focused task,
  returning only a condensed summary to the lead agent. Fits "complex
  research and analysis where parallel exploration pays dividends" — this
  is, concretely, the mechanism `ADR-0004` already built for LAW-10.5,
  independently arrived at before this research confirmed it's the
  recommended pattern for exactly this situation.

Stated bottom line: "treating context as a precious, finite resource will
remain central to building reliable, effective agents."

**4. Cross-tool convergence on file-based session handoff — real pattern,
not yet a formal standard.** Across Claude Code, Cursor, Aider, Devin, and
others, a recurring convention: a structured markdown handoff file (goal,
done, changed files, verified checks, blocked items, next step, do-not-
touch notes), rewritten at each handoff so a new session or different agent
can resume without replaying the original conversation. Example:
`sidorovanthon/handoff-prompt` (tool-agnostic resume prompt). Devin's own
guidance recommends the same shape before resuming a paused session.
Treat as directionally correct convention, not a settled spec.

**5. The clearest single discriminator across all sources**: anything that
must survive with zero information loss belongs in a file that gets
explicitly re-read, not conversation history relying on lossy compaction.
Compaction and note-taking/sub-agents are not competing choices — they
address different failure modes (within-session conversational bloat vs.
durable facts surviving a reset or session boundary).

## Synthesis

Mapped onto the user's three named options: **automatic compaction** is
already handled by Claude Code itself — no repo action needed or possible
beyond keeping `CLAUDE.md` lean (already true here). **Markdown
externalization** is this repo's underused structured-note-taking layer —
`agent-board`'s event log, `memory-service`'s decisions, and `docs/adr`/
`docs/proposals` already exist and already work, but nothing currently
instructs an agent to *read them back* when resuming a paused work item.
**Sub-agent isolation** is LAW-10.5's fresh-context dispatch, already built
— for a different original reason (self-grading bias), now independently
confirmed by external research as also the correct pattern for context
isolation. The real gap `design.md` addresses is narrower than "pick a
technique": it's "instruct the orchestrator to actually use the
externalization this repo already has, when resuming."
