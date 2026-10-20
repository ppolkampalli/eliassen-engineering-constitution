# Findings: The Lang Ecosystem (LangGraph, LangChain, LangFlow, LangSmith)

**Persona:** Software Engineer · **Workflow:** WF-RESEARCH v1.0 (investigate stage)
**Entry:** `requirements.md`'s problem statement and decision criteria
**Gates:** LAW-7.2 (what may be sent to external sources during research — none
of this research touched constitution content or project data), LAW-8.2
(cited business rules — every claim below is sourced)

All claims below are sourced; where a source wasn't checked directly, it's
marked **unverified**. Researched via web search against official docs/repos
as of 2026-10-14 — version/pricing facts can drift; re-verify before acting.

## 1. LangGraph

Graph/state-machine library for orchestrating agents: typed state, nodes,
conditional/cyclic edges — not a linear chain.

- **License:** MIT (LangChain, Inc.) — [repo license](https://github.com/langchain-ai/langgraph/blob/main/LICENSE)
- **Human-in-the-loop:** `interrupt()` pauses a node and persists full graph
  state via a checkpointer; a human later calls `Command(resume=value)` to
  continue. Documented as supporting **indefinite, multi-day pauses**, not
  just same-session waits. — [Interrupts docs](https://docs.langchain.com/oss/python/langgraph/interrupts)
- **Persistence:** checkpointers (Postgres/SQLite/Mongo in production)
  snapshot state at every step, keyed by a `thread_id` — enables resume after
  a crash/restart and "time-travel" debugging of past states. — [Checkpointers docs](https://docs.langchain.com/oss/python/langgraph/checkpointers), [Persistence docs](https://docs.langchain.com/oss/python/langgraph/persistence)
- **Deployment:** the library itself is free and self-hosted ($0). A separate
  hosted option, **LangGraph Platform** (bundled under "LangSmith
  Deployment"), adds managed durable persistence/task queues/scaling —
  Developer tier free, Plus ~$39/seat/mo + per-minute/per-node-execution
  usage, Enterprise custom. — [TrueFoundry pricing breakdown](https://www.truefoundry.com/blog/langgraph-pricing)

**This directly answers requirements.md's capability-gap question**: yes,
`interrupt()`/`Command(resume=...)` is a first-class, documented pattern for
"a human must approve before this step proceeds," and yes, it is explicitly
built for the indefinite/multi-day pauses a `human_checkpoint: required`
stage in this constitution can sit at today.

## 2. LangChain

Model/tool/retriever integration library (600+ integrations) plus LCEL for
simple pipelines.

- **Merged with LangGraph as of the Oct 22, 2025 joint 1.0 release**:
  `langchain`'s `create_agent` now runs on LangGraph's engine under the hood;
  installing `langchain` pulls in `langgraph` as a dependency. They are no
  longer independent alternatives to choose between — "LangChain vs.
  LangGraph" is not a live decision anymore, only "LangGraph (the engine)
  plus however much of LangChain's integration surface you also want." —
  [agent.nexus comparison](https://agent.nexus/blog/langchain-vs-langgraph)

## 3. LangFlow

MIT-licensed, low-code visual drag-and-drop builder for LangChain/LangGraph
agent and RAG flows; can export runnable code, not locked to running only
inside its own UI.

- **Ownership:** open-sourced 2023 → acquired by DataStax 2024 → DataStax
  itself acquired by IBM, closed May 28, 2025 — LangFlow is now IBM-owned.
  DataStax's managed-cloud offering for it was shut down Apr 9, 2026, but the
  **core OSS project remains MIT and free to self-host.** — [review citing the acquisition timeline](https://www.promptquorum.com/power-local-llm/langflow-visual-ai-orchestration-review)

Relevant to the earlier multica.ai conversation: this is a second candidate
for a visual "human in the middle" canvas, MIT-licensed and self-hostable,
though it is a flow **builder/prototyping tool**, not a production execution
runtime or a pure read-only dashboard like `agent-board`.

## 4. LangSmith

Observability/tracing/eval platform for LangChain/LangGraph applications.

- **Closed-source, commercial SaaS** — no free self-host; self-hosting
  requires an Enterprise contract. Free Developer tier (5k traces/mo, 1
  seat); Plus $39/seat/mo (10k traces included, then metered). Captures full
  traces, token usage, and evals — directly usable as an audit trail. —
  [pricing explainer](https://inference.net/content/langsmith-pricing/)

## 5. Real Trade-Offs (not vendor marketing)

- Building a nontrivial LangGraph workflow (typed `StateGraph`, conditional
  edges) is reported to take a senior engineer **2–4 weeks**, versus the
  current model's cost of zero engineering time (a markdown file an LLM
  reads). Every new stage/condition means re-wiring graph topology in code. —
  [field comparison](https://theagenticreview.substack.com/p/orchestrator-react-agents-beats-langgraph)
- Debugging across nodes and conditional edges is reported to be harder to
  trace than linear code; systems with more than ~5 agents are reported to
  become disproportionately harder to monitor. — [alternatives roundup](https://www.zenml.io/blog/langgraph-alternatives)
- The practical dependency this ecosystem creates is **vendor, not
  license**: the execution engine is free and MIT, but production-grade
  observability realistically means adopting LangSmith — closed-source,
  paid. This is an "open core" shape (free engine, paid ops layer), **not** a
  LAW-9.4 copyleft-license flag. — [license/business-model analysis](http://rvernica.github.io/2026/03/langchain-license)

## Observed vs. Inferred

- **Observed** (sourced above): licenses, `interrupt()`/checkpointer
  mechanics, the LangChain/LangGraph merge, LangFlow's ownership chain,
  LangSmith's pricing tiers.
- **Inferred, not verified**: the "2–4 weeks" and ">5 agents is
  disproportionately harder" figures are *reported* in the cited sources, not
  independently reproduced here — treat as directional, not precise.
- **Not researched**: LangSmith's actual data-handling/retention practices
  (would need a LAW-7.2 review before any real adoption, explicitly out of
  scope per `requirements.md`).
