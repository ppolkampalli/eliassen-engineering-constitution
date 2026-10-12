import type { Article } from './articles-types';

/**
 * Thought-leadership articles. Each was drafted by an independent agent from
 * the practice's first-principles framework (processes exist to fit human
 * limitations; question before you inherit) and human-reviewed before publish.
 */
export const articles: Article[] = [
  {
    id: 'many-agents-one-source-of-truth',
    title: 'Many Agents, One Source of Truth',
    deck: 'A how-to for running governed multi-agent development — every agent wearing the right persona, an orchestrator running the workflow, and a central memory service the agents ask before they act.',
    author: 'Pramod Polkampalli',
    published: '2026-06-15',
    readingMinutes: 9,
    body: `Put one capable coding agent on a task and you get speed. Put ten on a project and, without structure, you get a crowd: agents that re-decide settled questions, contradict each other's assumptions, re-derive the same business rule three different ways, and leave behind code no one can explain. Adding agents multiplies output — and, by default, multiplies divergence at the same rate.

Multi-agent orchestration platforms — Multica.ai and its peers — solve the mechanical half of this. They spin up agents, route tasks between them, run them in parallel, and collect results. What they deliberately leave open is the governance half: which agent should do what, by what rules, and against what shared understanding of "true." That gap is exactly the shape of the Engineering Constitution, and closing it takes two things most multi-agent setups are missing.

## The two things every multi-agent system needs

The first is a definition of **who** — not "agent 3," but a *role* with a mandate, owned responsibilities, and bounded authority. A security review and a cost estimate are different jobs requiring different judgment; an agent with no role is an agent with no point of view, and ten of those produce mush. The constitution already defines eight such roles — its personas — each a skill an agent can assume.

The second is a shared definition of **what is true** — a single place every agent reads before acting and writes to after deciding. Without it, each agent carries its own private context, and private context is how two agents "both finish" a feature having made incompatible assumptions about it.

> A multi-agent system without shared memory isn't a team. It's a crowd that happens to share a repository.

The constitution supplies the first directly (personas) and, less obviously, the second: it was always a *memory* — a place where decisions and the reasons behind them are written down so they are never silently re-litigated. Turning that into a service the agents can query is what makes multi-agent governance real rather than aspirational.

## Step one: give every agent a persona

On a platform like Multica.ai, an "agent" is essentially a model plus a system identity plus a set of tools. The constitution maps onto that cleanly: **each agent's identity is a persona skill.** The agent assigned to security work boots with the Security persona — it owns Article 5, it cites laws in every finding, and it holds veto authority on CRITICAL issues. The agent doing implementation wears the Software Engineer persona; the one writing acceptance criteria wears Product Owner; and so on across the eight.

Above them sits one more agent with a different job: the **orchestrator**, whose identity is the workflow itself. It does not write code — it runs the declared workflow (WF-FEATURE, WF-BUG, WF-SECBUG…), dispatching each stage to the agent wearing the persona that owns it, and refusing to let a hard-gated stage be skipped.

@@figure:persona-mesh@@

This is the difference between "ten agents working" and "a team working." The orchestrator knows that design comes before implementation, that security review is not optional on an Article-5 surface, and that a stage's owner is fixed — so the Security agent reviews, the Architect agent designs, and neither is asked to do the other's job. The authority ladder (Security veto over Architect veto over Quality block over the rest) gives the orchestrator a deterministic rule for resolving conflicts between agents instead of averaging their opinions into nonsense.

## Step two: the part everyone underestimates — shared memory

Here is where most multi-agent experiments quietly fail. Each agent reasons from its own window of context, and those windows drift apart the moment work fans out in parallel. The Engineer agent assumes the dormancy threshold is 90 days; the Industry SME agent knows the regulation says 60; nobody reconciles it because nobody shares a memory. The fix is a **Central Memory Service** — a single knowledge graph the agents query before they act and append to after they decide.

@@figure:memory-service@@

The constitution is almost entirely composed of things that belong in that memory:

- **The 57 laws**, as a registry — so any agent can answer "what does LAW-5.2 actually require?" with the same quoted text, not a paraphrase from memory.
- **The six workflow definitions** — so the orchestrator and every agent agree on the stages and gates.
- **ADRs and design decisions** — so the Architect agent doesn't re-decide the database choice that was settled (with reasons) last sprint.
- **A decision-and-citation log** — every persona decision, with its law citation and rationale, appended as it happens.
- **The amendment history** — so "why is the rule like this?" has an answer, and a rejected idea isn't proposed again.

Two access rules make this safe rather than chaotic. **Laws are read-only to working agents** — only the Law Clerk writes to them, and only through the amendment process, so no agent can quietly "improve" a rule mid-task. And **everything else is append-only** — decisions and ADRs accumulate, they don't overwrite, so the provenance trail is complete and no agent erases another's reasoning.

> The question that makes multi-agent work safe isn't "what can this agent do?" It's "what does this agent have to ask before it acts?"

Concretely, you can implement the memory service as an MCP server (or your platform's equivalent tool/service interface) that exposes a few operations over the constitution's registry and a decision graph: look up a law by ID or topic, fetch the workflow definition, query prior decisions on a file or feature, and append a new cited decision. Every persona agent gets that service as a tool. The "MemoryGraph as a service" pattern is just this: the shared brain the agents consult, sitting outside any one agent's context window so it survives across all of them.

## A feature, end to end

Put the two pieces together and a single feature flows through the system like this: the orchestrator selects WF-FEATURE; the Product Owner agent reads the relevant laws and prior decisions from memory, writes acceptance criteria, and appends them; the Architect agent reads those, designs, and records an ADR; Quality derives the test list; the Engineer implements test-first; a fresh-context reviewer and the Security agent gate the result — each one reading the laws its stage is gated by and writing back a cited decision.

@@figure:feature-flow@@

Notice what the memory service buys you across that chain. No stage starts from a blank slate — each agent inherits the cited decisions of the ones before it. No decision is unaccountable — every step names the law it stands on. And when something conflicts, the conflict surfaces against shared facts ("the SME decision in memory says 60 days, your code says 90") instead of disappearing into a private assumption. The merged feature carries an audit trail that no single agent authored and any human can read.

## Wiring it up

A practical checklist for standing this up on a multi-agent platform:

- **One persona per working agent.** The persona skill is the agent's system identity, not a suggestion in its prompt. Ship it the skill, not a paraphrase.
- **One orchestrator agent = the workflow.** It owns sequencing and gates; it does not implement. Give it the workflow-orchestrator skill and the authority ladder.
- **Memory as a service, not a shared file.** Expose the law registry, workflow definitions, decision log, and amendment history through a queryable interface (MCP server or platform tool) every agent can call. Reads cheap, laws read-only, decisions append-only.
- **A citation contract.** Every agent's output must include the DECISION / CITATION / RATIONALE / PERSONA block. An uncited decision is rejected by the next stage — that's what keeps the memory trustworthy.
- **Hard gates as orchestration checkpoints.** The orchestrator enforces "no implementation without acceptance criteria," "no merge without security review on Article-5 surfaces," and the rest — structurally, not by hoping an agent remembers.
- **Human checkpoints where the law requires them.** Two human approvals still stand (LAW-6.1); a CRITICAL security veto is overridden only by a named human. The agents prepare the decision; humans make the ones reserved for humans.

## What still needs a human — and an honest caveat

This pattern moves the bottleneck, it doesn't remove the human. The expensive, irreplaceable work becomes *verification* — confirming the agents' cited decisions are actually sound — and the memory service makes that tractable by giving a reviewer the trail to check rather than a pile of unexplained output. Budget for it; generation is cheap, judgment is not.

And the honest caveat: the exact wiring depends on your platform's primitives. Multica.ai and its peers differ in how they model agent identity, tool access, and shared state, so treat the three pieces here — persona-as-identity, orchestrator-as-workflow, constitution-as-memory — as the architecture, not as API calls. The constitution ships the personas and skills as an installable plugin and the registry as queryable data; how you expose them as a service to your specific platform is the integration work. The principle underneath is platform-independent and older than any of these tools: a team is not a number of workers, it's a shared set of rules and a shared memory of what's already been decided. Give your agents both, and ten of them become a team instead of a crowd.

## A reference implementation you can run

This isn't only a diagram. The constitution ships a working reference of the Central Memory Service — a local MCP server (in the repository's memory-service directory) that exposes exactly the architecture above. It reads the live law and workflow registries and serves six tools to any agent: look up a law by ID or topic, list the laws, get a workflow definition, get a law's amendment history, query prior decisions, and record a new cited decision. The two access rules are enforced in code, not merely described — laws are read-only, and record_decision refuses any decision that does not cite at least one well-formed law. Point each agent in your platform at the same server (in Claude Code, a few lines of MCP configuration) and they share one memory and one append-only decision log. Build it, run its end-to-end smoke test, and you have something to wire into a real multi-agent setup rather than a picture to admire.`,
  },
  {
    id: 'the-token-is-not-the-bill',
    title: 'The Token Is Not the Bill',
    deck: 'Per-token costs are collapsing, total AI spend is climbing, and most of the value is unproven — which means the unit you measure decides whether you can see what you’re buying at all.',
    author: 'Pramod Polkampalli',
    published: '2026-06-13',
    readingMinutes: 6,
    body: `There is a number that finance teams have learned to watch, and it is the wrong number. It is the price of a token — the fraction of a cent an AI model charges to read or write a word. It is wrong not because it is inaccurate, but because it is the cost of an ingredient being used to reason about the price of a meal. The token is not the bill. And the gap between the two is where most enterprise AI budgets are quietly being decided by no one.

Start with the genuinely good news, because it is real. The cost of inference — running a model to get an answer — is falling at a pace that has few precedents in computing. Epoch AI, which tracks this carefully, puts it at "very roughly a 5 to 10 times cost reduction per year for reaching a given capability level." Eight months separated two models reaching the same score on a hard math benchmark; the later one used roughly a third of the tokens. If you are pricing a use case on today's per-token rate, the rate will likely embarrass you within a year — in your favor.

## The cheaper it gets, the more you spend

Here is the trap. Falling unit prices have not produced falling bills. They have produced larger ones.

The mechanism is an old one, named for the economist who noticed in 1865 that more efficient steam engines increased coal consumption rather than reducing it. Cheaper coal made more uses of coal worth it. Cheaper tokens do the same. When a model call cost real money, you sent the model one carefully framed question. When it costs almost nothing, you build an agent that calls the model in a loop — planning, criticizing itself, calling tools, retrying — and a single agentic coding task can consume on the order of a thousand times the tokens of the equivalent chat message. Deloitte's early-2026 reading captures the scissor exactly: cost-per-token down roughly tenfold in two years, token consumption up roughly a hundredfold.

> The price of the ingredient fell. The size of the meal grew faster.

So the per-token line on your dashboard slopes reassuringly down while the total at the bottom of the invoice climbs. Watching the unit cost is not just unhelpful here; it is actively misleading. It tells a story of efficiency over a reality of escalation.

## The value side is thin — and harder to see than the cost side

If spend were the only question, this would be a procurement problem. It is not, because the value side of the ledger is both weaker and far harder to read than the vendors' case studies suggest.

The most sober numbers come from McKinsey's State of AI survey: only 39 percent of organizations attribute any EBIT impact at all to their AI use, and most of those put it below five percent. Gartner, surveying thousands of organizations, expects more than 40 percent of agentic AI projects to be canceled by the end of 2027 — citing escalating costs and unclear business value. These are not the numbers of a technology failing to work. They are the numbers of a technology working in demos and evaporating somewhere between the pilot and the income statement.

And then there is the finding that should unsettle anyone who measures AI value by asking people whether it helped. In a controlled trial, the research group METR had experienced open-source developers complete real tasks on codebases they knew well, with and without early-2025 AI tools. The developers predicted AI would speed them up by 24 percent. Afterward, they reported it had sped them up by about 20 percent. Measured against the clock, the AI had slowed them down by 19 percent.

> They were slower, and they were certain they were faster. Both were true at once.

Hold that study at the right distance — it is sixteen expert developers, on mature code, with year-old tooling, and it should not be stretched into a verdict on all AI everywhere. But its core lesson is not about a tool. It is about measurement. Self-reported productivity, the instrument most organizations actually use to justify their AI spend, pointed almost forty percentage points away from reality. If your ROI case rests on a satisfaction survey, you may be measuring enthusiasm and calling it value.

## Measure the meal

The fix is not a better token-tracking dashboard. It is a change in the unit of measurement.

The discipline forming around this — the FinOps Foundation calls it FinOps for AI — makes the point bluntly: "the only real way to understand the total cost of ownership of leveraging AI for a business outcome is to measure the entire use case." Tokens are, in their words, "only a small piece of the puzzle." The unit that matters is cost per useful business outcome — a resolved support ticket, a merged and verified pull request, a closed claim — with everything that outcome actually required folded in: the model calls, yes, but also the infrastructure, the integration work, the governance, and the increasingly large line item of human oversight. Generation got cheap. Verification did not. The person who has to confirm the agent's output is correct is often the most expensive token in the loop, and they do not appear on the API invoice at all.

This reframing also explains why the cost levers that work are unglamorous and specific. Inference is 80 to 90 percent of production spend, so that is where optimization compounds — not training. Routing simple requests to smaller, non-reasoning models instead of sending everything to the most capable one saves between 40 and 70 percent of inference cost in reported deployments, because most requests never needed the expensive model. Caching repeated context can cut its cost by 90 percent. None of this shows up if you are measuring the average price of a token. All of it shows up if you are measuring the cost of an outcome.

## What the winners are actually doing

The organizations capturing value are not the ones who found a cheaper token. They are the ones who changed what they were measuring and, more importantly, what they were doing.

The single strongest pattern in McKinsey's data is not a tool choice or a model choice. Of twenty-five attributes they tested, fundamental redesign of workflows had the highest correlation with bottom-line impact; the high performers were nearly three times as likely to have done it. This is the same lesson the steam engine taught, inverted: efficiency in one component does not help if the system around it is unchanged. Bolting an AI agent onto a process designed for human throughput mostly produces faster generation of work that humans must still review at human speed — which is precisely how you end up 19 percent slower while feeling 20 percent faster.

So the questions worth bringing to the AI budget review are not about the price of tokens. They are: What outcome are we buying, and what does a unit of it actually cost us all-in, including the humans? Are we measuring that, or are we measuring adoption and sentiment? And have we redesigned the work to fit a world of cheap generation and expensive verification — or have we just made the old work generate faster?

The token is not the bill. It never was. The bill is the total cost of an outcome you can actually attribute value to — and the first enterprises to measure that, rather than the price of the ingredient, will be the ones who can still tell, a year from now, whether any of this was worth it.`,
  },
  {
    id: 'what-is-your-sprint-protecting-now',
    title: 'What Is Your Sprint Protecting Now?',
    deck: 'Scrum’s ceremonies were precision-fitted to human limitations in a world that no longer exists — the limits remain, the world doesn’t, and that gap deserves harder questions than most teams are asking.',
    author: 'Pramod Polkampalli',
    published: '2026-06-12',
    readingMinutes: 7,
    body: `Every process is a scar. Somewhere behind each ceremony, gate, and artifact in your delivery pipeline is a wound — a project that shipped eighteen months late, a team that built the wrong thing in confident silence, an organization that made the same mistake every year because nobody wrote down what went wrong the last time. Process is how organizations remember pain. That is not a criticism. It is the most generous and most accurate way to understand why Scrum looks the way it does — and the only honest starting point for asking whether it should still look that way.

## The Problems Were Real

It is worth being precise about what each ceremony was for, because each one was an elegant answer to a specific human limitation of its era.

The daily standup answered information asymmetry. In the world that produced it, status lived in people's heads. There was no CI dashboard, no pull-request feed, no persistent chat. If you wanted to know what happened yesterday, you had to ask the human who did it. Fifteen minutes of synchronized broadcast was a genuinely efficient protocol for a team whose shared state had no other home.

The sprint answered our inability to estimate long horizons. Waterfall asked humans to make eighteen-month promises, and humans — being humans — produced fiction. The two-week sprint was an act of epistemic humility: we cannot see far, so we will commit only to what we can see, and re-aim often. The timebox was sized to the distance a team could reliably predict implementation work.

The retrospective answered the absence of a feedback loop. Organizations repeated mistakes annually because learning had no scheduled venue. The retro institutionalized reflection at a cadence short enough that the lessons were still warm.

Story points answered unknowable velocity. Estimating in hours was a lie everyone had agreed to tell. Points decoupled estimation from the clock and let throughput emerge empirically, because there was no other way to know how fast a team could build things than to watch it build things.

> Scrum's genius was never the ceremonies. It was that it took human limitations seriously.

Notice what all four have in common: each is fitted to a constraint in the humans, calibrated against the speed of the work. That fit is why Scrum won. It is also why the question of its continued relevance is not ideological. It is empirical: do the premises still hold?

## The Premise Moved

Here is the uncomfortable observation. A developer working with AI agents can now produce, in an afternoon, the volume of code that once defined a sprint. An agent dispatched at five o'clock can return the next morning with three days' worth of implementation. The work the sprint was sized to — and the work the standup reported on, and the work the points estimated — has changed speed by an order of magnitude or more.

So ask the first-principles questions, ceremony by ceremony.

If the standup answered information asymmetry, and your PR stream, CI dashboard, and agent transcripts now answer it better and continuously — what information does the standup move that nothing else moves? Some teams will answer honestly: it moves cohesion, not status. Fine. But then it is a different ceremony than the one you think you are running, and it should be designed as one. And what does "since yesterday" even mean when the most productive contributor on the team worked through the night and isn't in the circle?

If the sprint answered our inability to estimate long implementation horizons, what is the timebox protecting when implementation takes hours? A two-week container around four hours of generation and nine days of review is not a sprint. It is a verification queue wearing a sprint's clothes. That might be exactly the right structure — but only if you have noticed that's what it is.

If story points priced the cost of generation, what does velocity mean when generation is approaching free and verification is not? A team that burns eighty points of generated code may be in materially worse shape than a team that burns thirty and understands every line. Your burndown chart cannot tell these teams apart. One of them is accumulating an invisible debt denominated in unverified behavior.

## The Constraint That Didn't Move

It would be convenient if the humans had accelerated along with the tooling. They have not. Working memory still holds a handful of chunks. Review quality still degrades sharply after the first few hundred lines and the first hour of sustained attention. Our capacity for vigilance — for noticing the one subtly wrong assumption in a sea of plausible code — is exactly what it was in 2001, when the Agile Manifesto's authors built a process around it.

And the new failure modes lean precisely on those unchanged limits. AI-generated code fails differently than tired-human code: it is plausible-but-wrong, syntactically confident, idiomatically fluent, and incorrect in ways that survive a skim. Generated tests can be hollow — asserting that the implementation does what the implementation does, rather than what the requirement intended, achieving coverage without achieving scrutiny. Meanwhile code volume grows faster than review queues drain, and every shortcut a reviewer takes under that pressure is a small withdrawal from an account nobody is auditing.

> The bottleneck moved from typing to judging — and judgment runs on hardware that hasn't had an upgrade since 2001.

This is the crux, and it is why "just go faster" is not a process. The ceremonies were load-bearing structures fitted to human limits for a particular distribution of work. The limits remain. The distribution of work does not. A process fitted to yesterday's bottleneck doesn't merely become useless — it becomes a place where the new risks hide, because everyone is watching the old ones.

## Questions Worth Bringing to Your Next Planning Meeting

This article will not tell you to abandon Scrum, because the honest answer is that nobody yet knows what replaces it, and prescriptions sold this early are mostly confidence theater. But there are questions an engineering leader can ask now, and the discomfort of the answers is diagnostic.

- What is your sprint protecting now? Name it specifically. If you cannot, the timebox is a habit, not a tool.
- What work does each ceremony actually do today — not the work it was born to do? If a standup is really a cohesion ritual, would you design it the same way on purpose?
- What is your unit of commitment when implementation takes hours? The story? The verified behavior? The decision?
- If velocity counts generated output, what number on your dashboard tracks verified understanding? Is anything measuring the thing that is actually scarce?
- How much code can your team genuinely review per day — not approve, review — and is your intake rate above or below that line? For how many consecutive sprints?
- What does your retro examine? If it has never surfaced a verification failure — a hollow test, a plausible-but-wrong merge — is that because they aren't happening, or because the ceremony isn't looking?
- Which parts of your process exist because someone got burned in 2009? Would you re-create them today, from scratch, knowing only today's constraints?
- And the hardest one: if you re-derived your process from first principles — abundant generation, scarce attention, unchanged humans — what would survive? Be suspicious if the answer is "all of it." Be equally suspicious if the answer is "none of it."

Keeping a ceremony is a perfectly defensible outcome of this exercise. Keeping it without re-deriving it is not. The teams that ran Scrum well never ran it on autopilot anyway; the framework's own inspect-and-adapt loop was always pointed at everything, including itself.

## The Human Is the Spec

Here is the conclusion this all builds toward: the SDLC must now evolve for the same reason it evolved in 2001 — to fit the humans — except the humans are no longer the engine of the loop, they are the governor of it. We are the one component in the accelerated system that did not accelerate, which makes human attention the scarcest resource in software development and human judgment the activity everything else should be organized around. A process re-derived from today's constraints would protect attention the way sprints once protected focus — budgeting review capacity as deliberately as we ever budgeted story points. It would structure verification as a first-class discipline rather than a tax: increments sized to what a human can actually hold, provenance that tells a reviewer where to aim their skepticism, tests that encode intent rather than echo implementation. It would measure what is scarce instead of what is now abundant. None of this is anti-Agile, and none of it is AI triumphalism. It is the same move the manifesto's authors made when they looked at waterfall, took human limitations seriously, and designed for the world as it actually was. The world has changed again. The humans have not. The most Agile thing your organization can do is question Agile the way its authors questioned what came before — and rebuild the process around the one element you cannot upgrade.`,
  },
  {
    id: 'the-engineer-of-intent',
    title: 'The Engineer of Intent',
    deck: 'AI agents didn’t diminish the Product Owner — they exposed how hard the job always was, and then handed over the first real tools to do it.',
    author: 'Pramod Polkampalli',
    published: '2026-06-12',
    readingMinutes: 7,
    body: `For most of the history of software, everyone knew where the line formed. Business wanted things; engineering built things; the wanting always outran the building. Roadmap meetings were essentially auctions for scarce engineering capacity. The backlog was a waiting room. Entire professions — including, let's be honest, much of the Product Owner role as practiced — grew up around managing that waiting room: prioritizing it, grooming it, apologizing for it.

Then the building got fast. Not incrementally fast — categorically fast. An AI agent will take a ticket and return working code in the time it used to take to schedule the refinement meeting about the ticket. And teams adopting agentic delivery are noticing something disorienting: the queue has reversed. Engineering capacity is no longer the thing everyone is waiting on. Increasingly, the agents are waiting on us — waiting for someone to say, precisely, what they actually want.

So we should ask the uncomfortable question out loud: is the business now the bottleneck?

## Where the Constraint Actually Went

Honestly: partly yes. If your delivery pipeline can produce a feature in hours but your organization takes three weeks to decide what the feature should do, the constraint is no longer in the codebase. It has moved upstream, into requirements, decisions, and intent. That's not an insult; it's just queueing theory. Constraints don't disappear when you remove them — they relocate.

But "the business is the bottleneck" is a lazy framing, and it misses what actually changed. The work of specifying — translating ambiguous human wants into something precise enough to act on — was always slow and always hard. It just never showed up as the slow part, because coding was slower. Specification got to hide inside the shadow of implementation. A vague ticket on Monday wasn't a crisis, because the engineer wouldn't reach it until Thursday, and the gaps got patched in a hallway conversation on Wednesday. The system had slack, and the slack absorbed the ambiguity.

Here is a first principle worth holding onto: nearly every process we inherited was designed around a human limitation. Sprints, refinement ceremonies, story templates, three-amigos sessions — these weren't handed down on tablets. Each one was invented because some team got burned and built a guardrail. Specifically, most agile ceremony exists to compensate for two facts that were true for decades: code was expensive to produce, and clarification was cheap to get mid-stream. You could afford to start vague because the build was slow enough to course-correct inside.

Both facts just flipped. Code is now cheap to produce, and mid-stream clarification has nowhere to live — because the agent doesn't wander over to your desk on Wednesday. It fills the gap itself, instantly, confidently, and at scale. An underspecified ticket used to cost a conversation. Now it costs a fully built, fully tested, fully wrong feature, manufactured at machine speed from requirements nobody actually wrote.

## The Job Nobody Tooled

Before anything else, the Product Owners reading this deserve an acknowledgment that's been overdue for about twenty years: you were given one of the hardest jobs in software and almost none of the tooling.

Consider the asymmetry. When an engineer makes a mistake, an entire civilization of instruments catches it. The compiler objects. The type system objects. The linter nags. The test suite fails. CI blocks the merge. A colleague reviews the diff. Engineers operate inside a dense lattice of feedback loops, every one of them built because engineers — being human — make mistakes, and the industry decided those mistakes were worth catching early.

When a Product Owner makes a mistake — leaves an edge case unstated, carries a contradiction between two stories, assumes a definition of "active user" that nobody else shares — what catches it? Nothing. There is no compiler for intent. The error sails through refinement, through the sprint, into production, and surfaces weeks later as a demo that lands wrong, by which point it's indistinguishable from a delivery failure. The PO got a ticketing system, a story template, and a calendar full of meetings. That's it. That was the entire toolchain for the discipline of translating messy human desire into precise, buildable intent — arguably the most cognitively demanding translation task in the whole delivery chain.

> The Product Owner didn't get worse. The tolerance for ambiguity collapsed.

So when agentic delivery suddenly makes every gap in a spec visible — loudly, expensively, the same afternoon — the right reading is not that POs are failing. It's that the slack that used to hide the difficulty of their job has been removed, all at once, without anyone first handing them better instruments. If you feel exposed right now, that's not a verdict on your competence. It's the sensation of doing precision work in public for the first time, with the safety net gone and the tools still in transit.

The good news: the tools are no longer in transit.

## Turning the Machinery Around

The same AI-SDLC that exposed the gap is the first technology in the history of the role that actually equips the PO side of the house. Not metaphorically — concretely. Here is what that looks like in practice.

- Make the agent interview you, before any code exists. The most underused inversion in agentic workflows: instead of writing a spec and hoping it's complete, sit down with an agent whose only job is to interrogate your idea. What happens when the user has zero items? What if two of these rules conflict? You said "recent" — recent by what clock? A good requirements-interview session surfaces in forty minutes the edge cases that used to surface in week three. This is the spec-first discipline, and it gives the PO what engineers have had forever: a tireless adversary that finds your bugs before they ship.

- Write acceptance criteria as executable contracts. In a test-first agent pipeline, your acceptance criteria are not a description of the work — they become the work's verification. Each criterion, written precisely, becomes a test the agent must make pass. This changes the writing itself: "the form should validate input" is unenforceable prose; "submitting an email without an @ shows the inline error and blocks submission" is a contract a machine can hold the implementation to. For the first time, what the PO writes down is directly, mechanically load-bearing. That is power, not paperwork.

- Run decisions through a research workflow. For the genuinely hard calls — build versus integrate, which compliance posture, what to do about the legacy export — use the shape that works: the PO frames the question, agents do the investigation legwork, the output is options with explicit tradeoffs, and a human records the decision and the reasoning. The agent does the reading; the PO does the deciding. Nobody confuses the two.

- Let the workflow gates protect you. A pipeline rule that says "implementation cannot begin without written acceptance criteria" sounds like bureaucracy until you realize who it serves. It makes "that's not defined yet" a structural fact instead of a personal stand a PO has to take in a room full of people who want to start. Scope changes routing back for sign-off means drift requires your signature. Process, designed from first principles for this era, becomes the PO's ally — the system enforcing the boundaries of the role rather than pressuring them to wave things through.

- Prototype to specify. Throwaway prototypes are now nearly free, and this changes the epistemology of requirements. Humans are mediocre at imagining what they want and excellent at reacting to what's in front of them — every kitchen renovation and every wedding playlist proves it. When an agent can produce three working sketches of a flow by tomorrow morning, "not that — more like the second one, but with the dates inline" becomes a legitimate, efficient specification method.

> Specification stops being an act of imagination and becomes an act of reaction.

## A Promotion, Not an Obituary

Put the pieces together and the honest answer to "what is the role of the Product Owner now?" is not the anxious one making the rounds.

The version of the role that is genuinely ending is the backlog administrator: the person who shepherded tickets through a queue because the queue was long and somebody had to manage the waiting. That work existed because of a constraint that no longer binds. Mourning it is like mourning the job of winding the office clocks.

What replaces it is bigger. When implementation was the constraint, a brilliant spec and a mediocre spec converged to similar outcomes, because the engineering gauntlet caught and reshaped both. Now the spec propagates at machine speed: clarity compounds and so does vagueness. The differential value of precise intent has never been higher — which makes the person responsible for intent more consequential, not less.

That is a promotion. From administrator of the backlog to engineer of intent: the person who interrogates wants until they become commitments, who writes contracts machines can verify, who decides with researched tradeoffs in hand, and who holds the gate that says nothing gets built until we know what we mean. Every profession that came before the PO got its instruments eventually — the navigators their charts, the engineers their compilers. The Product Owner's instruments have finally arrived. They came in the same box as the disruption, which is either irony or mercy, depending on the day.

But they're here. And the teams that win the next five years will be the ones whose POs picked them up first.`,
  },
  {
    id: 'two-teams-one-constitution',
    title: 'Two Teams, One Constitution: Shipping a Shared CRM Without Forking the Rules',
    deck: 'A step-by-step walkthrough of two scrum teams installing the Engineering Constitution and building a shared CRM together — same install, same workflow, different domains, zero drift.',
    author: 'Pramod Polkampalli',
    published: '2026-10-05',
    readingMinutes: 11,
    body: `Leadership's question is always some version of the same thing: "This works beautifully for one team. What happens to it at five?" It's a fair worry — most standards survive exactly one team before someone ships under deadline pressure, cuts a corner, and the exception becomes the precedent. This is a walkthrough of two teams, not one, installing the same constitution and building one shared application — a small CRM — and what actually happened when their work met in the middle.

## The setup: one CRM, two domains, two teams

The application is deliberately small: a CRM with self-service user registration and admin-only customer-relationship-management operations. Two teams own it. **Team Falcon** owns the users domain — registration, identity, roles. **Team Atlas** owns customers — the CRM records an admin creates, lists, and updates. Neither team's code imports the other's internals. If this sounds like an arbitrary toy example, it isn't — it's the actual reference implementation now sitting in this repository's crm-demo/ directory, built exactly the way this article describes, with real tests and real coverage numbers, not illustrative pseudocode.

## Step one: install, once, the same way

Both teams ran the identical command against their own checkout — scripts/install.sh — and got the identical kit: lint/type/test configs, the pre-commit hook, CI workflows, the PR template, every persona skill, both steering files, and the full law registry for offline citation (LAW-1.3). Nobody in either team debated tabs versus spaces, or whether any is acceptable "just this once." That conversation was already over before either team wrote a line, which is the entire point of installing a constitution instead of writing a wiki page: a wiki page is read once and drifts; a linter config is enforced every commit, forever.

## Step two: declare the workflow before writing a line

Before either team touched a keyboard, the work was declared: WF-FEATURE on the CRM reference implementation. The orchestrator announced the chain — Product Owner writes acceptance criteria, Architect designs and places the work, Quality writes the test list, Engineer implements test-first, a fresh context reviews it, Security passes over it, DevOps checks release-readiness. That announcement is not ceremony. It's the difference between "we'll figure out the sequence as we go" (how security review quietly gets skipped under deadline pressure) and a sequence that was declared out loud before anyone could conveniently forget a stage.

The Product Owner persona's acceptance criteria named five observable behaviors — AC1 through AC5 — covering registration, role-gated admin actions, record creation, listing with filters, and partial updates. Each one stated not just what should happen, but how to verify it. "Done" was written down before "how" was discussed, which is LAW-8.1 in one sentence: coding against an undefined "done" is the root failure this constitution exists to prevent.

## Step three: split the work by domain, not by file

@@figure:two-team-split@@

This is where most multi-team efforts quietly go wrong: splitting work by layer ("you take the frontend, I'll take the backend") instead of by domain. Layer-first splits mean every feature touches both teams' code, every PR waits on both teams' review, and "whose bug is this" becomes a standing argument. The constitution's architecture law (LAW-4.1) mandates the opposite: domains first, with the full stack — application, domain logic, persistence — inside each domain, and cross-domain access only through a public interface.

So Team Falcon's users domain and Team Atlas's customers domain each contain their own full stack, and the only thing that crosses the line between them is a single shared value type — Caller { id, role } — representing an already-authenticated caller's identity, the same way a real auth middleware would hand it to application code. Neither domain imports the other's persistence, entities, or use-cases. This wasn't a design aspiration left to good behavior; it was verified by grep in the fresh-context code review described below, and it's the architectural reason Team Falcon can refactor its password-hashing strategy next sprint without asking Team Atlas's permission.

## Step four: build test-first, with evidence

Both teams worked from the same test list — Quality's output from Canon TDD's first step: a written list of behaviors to prove, one at a time, before any implementation exists. "Should throw DuplicateEmailError when registering with an email differing only in case," "should throw NotAuthorizedError when caller role is customer, creating nothing," "should leave name and email unchanged regardless of update payload" — twenty-nine items, each traced back to one of the five acceptance criteria, none of them speculative coverage for behavior nobody asked for.

The result, run for real rather than asserted: 34 tests, 8 suites, 100% line/branch/function/statement coverage, a clean strict-TypeScript type-check with zero any. Not "should be green" — an actual terminal showing green, because LAW-10.2 doesn't accept a confident claim as evidence. It accepts a runnable check and its output.

## Step five: a context that didn't write it, reviews it

Here is the part most governance frameworks only gesture at. LAW-10.5 says agent-produced work is reviewed by a context that didn't produce it — not as a formality, but because the agent that just wrote the code is the worst-positioned reviewer of it: it's confident in exactly the places it should be suspicious. So the implementation was handed to a fresh agent with zero memory of having written it, and told to independently re-run the tests, grep for violations, and find real problems.

It found one. The partial-update logic for a customer record — input.status ?? existing.status — had never been exercised in the direction where status is omitted and only phone/company are given. The code was correct; the test coverage claiming to prove it wasn't actually proving that branch. Branch coverage was 96% overall, comfortably above the 90% floor, which is exactly how a real gap hides behind a healthy-looking aggregate number. The fix was one new test, five minutes of work — but it only happened because review was structurally independent, not because anyone remembered to be careful.

> The question a governance framework should answer isn't "did someone review this?" It's "could the reviewer have missed what the author missed, for the same reason?"

## Step six: see it work

@@figure:memory-service@@

Tests proving behavior is one kind of evidence; watching the thing actually run is another, and leadership reads the second kind far more easily than a coverage report. The reference implementation ships a small runnable demo — not a web server (that's explicitly out of scope for this reference slice, recorded as an ADR rather than left as an unexplained gap) but an in-process script exercising every acceptance criterion end to end: register a visitor, watch a non-admin get rejected from an admin action, create two customer records, filter them by status, update one, and print every result as it happens. One command, real output, nothing staged.

## The part that actually scales: staying one constitution at five teams

Two teams splitting one small CRM by domain is the easy case. The harder, leadership-grade question is what happens at five teams, ten subsystems, a platform nobody holds in their head at once — and whether "stay consistent" quietly becomes "stay identical in ways that no longer fit," which is how good standards curdle into bureaucracy teams route around.

The constitution's own research had already flagged this as unresolved — a watch-listed, deliberately deferred question about whether every convention should really be zero-exception, or whether a tiered model (hard constitutional gates everywhere, a paved path elsewhere teams may deviate from with recorded rationale) fits the federated reality better. Building this CRM across two teams was the concrete trigger to stop deferring it: a formal amendment proposal — still in PROPOSED status, awaiting real persona and human review, not self-ratified — now names the inviolable set explicitly (every Security veto, the quality gates, the two human approvals, acceptance-criteria-first, the TDD guardrail, tooling consistency) and names everything outside it as a recorded, auditable choice rather than either silent drift or rigid uniformity. Teams don't fork the constitution to get flexibility; they deviate within it, on the record, and a deviation repeated by more than one team becomes a candidate amendment instead of a permanent fork.

The same build also sketched — again as a reviewed, not-yet-ratified proposal — what a leadership-visible dashboard across teams would need underneath it: the Central Memory Service shown above, already append-only and cited for a single project, extended with stage-transition and blocker events and hosted once instead of once-per-project, so a manager can see which workflow stage every team's work is actually in without reading every PR by hand. The design deliberately keeps that governed, tested, append-only log as the one source of truth and treats whatever dashboard renders it — Multica.ai or anything else — as a swappable consumer, never the record itself. Tools come and go; the two invariants (laws read-only, decisions append-only) are what the constitution actually protects.

## What leadership actually gets

- The same install, every team. No team debates lint rules or coverage floors; that conversation ran once, centrally, and is enforced mechanically forever after.
- Independent delivery, zero merge archaeology. Domain-first splitting means Team Falcon and Team Atlas shipped on their own schedules, reviewed their own PRs, and never once waited on each other's code.
- A declared, auditable sequence. Every stage of WF-FEATURE left a citation trail — which persona decided what, against which law — instead of a Slack thread nobody can find in six months.
- Review that actually catches things. The one real gap this build produced was caught by a structurally independent reviewer, not by hoping the author was careful twice.
- Flexibility that doesn't mean drift. The still-pending Golden Paths proposal gives teams room to diverge on the things that should flex, while keeping the five or six things that should never flex — security, the quality gates, human approval — identical no matter how many teams exist.

## Build it yourself

The complete artifact trail is real and in the repository, not summarized from memory: crm-demo/docs/requirements.md, design.md, and test-list.md for the three planning stages; docs/adr/0003-crm-reference-implementation-scope.md for the three deliberate scope cuts and why each was made; crm-demo/src/ for the implementation itself, domain by domain; and crm-demo/README.md for the three commands — install, test, demo — that take you from a clone to watching it run. Clone it, run npm test -- --coverage and read the real number, then run npm run demo and watch two domains, owned by two imaginary teams, cooperate through nothing but a shared value type and a shared set of rules neither of them had to invent.`,
  },
  {
    id: 'watching-agentic-work-the-agent-board',
    title: 'Watch It Run: A Window Into Agentic Work',
    deck: 'A manager asked "what is the agent actually doing right now?" and a citation trail in a PR description couldn’t answer it — so we built a one-screen, local Kanban board that can, and shipped it the same governed way as everything else here.',
    author: 'Pramod Polkampalli',
    published: '2026-10-12',
    readingMinutes: 9,
    body: `A PR description tells you what an agent decided and which law it cited for the decision. It does not tell you anything while the work is still happening — whether it is making progress, stuck waiting on you, or three stages into a chain nobody in the room remembers approving. "Run WF-FEATURE on TICKET-123" announces a plan before any code is written, which solves the silent-process problem. It does not solve the next one: once that chain is running, where do you actually look to see it move?

That gap is what agent-board answers. Not a dashboard for executives, not a second governance system — a small, local, zero-drama Kanban board that turns the workflow-orchestrator's own stage transitions into three lanes: In Progress, Blocked, Done. This is the story of building it, including the two genuinely surprising bugs that only showed up once it was real.

## The problem a citation trail can't solve

Every governed workflow in this constitution already produces an audit trail — a stage-by-stage record of which persona did what, against which law, with what evidence. That trail is excellent at answering "what happened," after the fact, once someone goes looking for it. It was never built to answer "what is happening, right now, without me having to go looking." Those are different questions, and conflating them is how teams end up either over-interrupting an agent to ask for a status update, or under-watching it until a blocked stage sits unnoticed for a day because nobody happened to check the PR.

The constitution already has a planned answer to this at enterprise scale — a centrally-hosted memory and events service feeding a dashboard adapter, described in docs/proposals/agentic-visibility. That design is still PROPOSED, tied to an amendment that hasn't been ratified, and it is solving a genuinely different problem: aggregating many teams' activity for leadership. What one developer needs today, watching one workflow run in one project, is something you can have running in two minutes with nothing to provision. That's agent-board.

## What it actually is

workflow-orchestrator already announces its chain and records stage completions as part of running a workflow (SKILL.md §1 and §2). agent-board adds one more, deliberately minor, side effect: at four points — chain announcement, stage entry and completion, a required-checkpoint stop, and the run summary — it appends one JSON line to a local event log, .claude/board/events.local.jsonl. A small Node server reads that file and serves it over one HTTP endpoint; a React app polls that endpoint every 1.5 seconds and renders the three lanes.

## Three commands, from zero

Copy the folder into your project, install its dependencies, and start the dev server: cp -r engineering-constitution/agent-board ./agent-board, then cd agent-board && npm install && npm run dev. Open the URL Vite prints — usually port 5173, though if that port is already busy it automatically tries the next one and prints whichever it actually used, so read the terminal rather than assuming the default. No file picker, no "choose a log file" step, no Chrome-versus-Firefox distinction to think about: the Node server reads the file, every browser just calls the same API.

@@figure:agent-board-mockup@@

## Reading the lanes

A card's lane is derived from the *latest* non-deviation event for that work item, not from a fixed list of stage names — WF-BUG and WF-FEATURE have completely different stages, but every workflow's progress still lands in one of three buckets. **In Progress** means the workflow has started and isn't stopped on anything. **Blocked** means a stage explicitly reported itself as blocked, or it hit a human checkpoint marked required — and per SKILL.md and LAW-6.1/LAW-7.1, agents never self-approve through a required checkpoint, so "blocked" here always means "waiting on you," not "the agent gave up." **Done** means the workflow emitted its end-of-run summary.

One rule is easy to get backwards and worth stating precisely: a recorded deviation — a soft stage skipped or softened, with its reason on the record — annotates the card's note and citation count, but it never moves the card to a different lane by itself. If a work item's chronologically last event happens to be a deviation sitting on top of an earlier blocked stage event, the card stays blocked. The note changes; the lane doesn't. Getting this backwards would mean a deviation could accidentally make a stuck work item look unstuck, which is exactly the kind of quiet error a visibility tool exists to prevent, not cause — so it has its own dedicated test fixture proving exactly this case, rather than being left to incidental coverage.

Click a card and the full timeline opens: every stage it passed through, the persona and status at each step, any deviation's reason and who approved it, and the free-text note the agent left — the closest thing this tool has to "what is the agent actually thinking right now." A hard-stage badge marks stages that cannot be skipped or softened (LAW-6.2); a running citation count shows how many LAW-X.Y references the work has touched.

## Security, by construction, not by promise

The log path is resolved from an environment variable exactly once, at server start. The request handler never reads a path from the request itself — no query string, no header, no body field can change which file gets served. This isn't a validation rule that could be forgotten later; there is no code path through which a client-supplied path could reach the file system at all. We proved it the boring way, not the confident way: with the dev server running, requesting the events endpoint and then requesting it again with a path parameter appended, trying to point it at /etc/passwd, and diffing the two responses byte for byte. Identical. That diff, not the design intent, is the evidence (LAW-5.1, LAW-10.2).

## What building it for real surfaced

Two bugs showed up only once the thing was real, and both are worth naming because they're the kind that "should work" would have missed. First, a detail-view modal that opened with just a close button and no content — traced to the fact that a card's work-item id was being looked up fresh on every click instead of carried with the click itself, invisible until you actually clicked something in a running browser rather than reading the code. Second, once the server-side logic had real tests: spying on the filesystem module's read function kept throwing a property-redefinition error, and separately, a real file-not-found error from Node's own filesystem module kept failing an instanceof check that is correct in every normal Node process. Both traced to the same root cause — Jest runs each test file in its own sandboxed realm, so a namespace-style import's non-configurable property wrapper and a cross-realm error-identity mismatch both bite only inside the test harness, never in the real server process. The fix for both was the same shape: stop relying on identity checks that assume a single realm, and check structurally instead — a default import where a namespace import had been wrapped, and a duck-typed property check where an identity check had been assumed safe. Neither bug was visible from reading the code in isolation; both were caught because the test suite was real enough to hit them, which is the entire argument for LAW-10.2's "runnable check, not a confident claim" in one small example.

## Built the same governed way as everything else

This tool didn't get a casual pass just because it's a convenience viewer. It went through the same type-check, lint, and test-coverage gates as every other reference implementation in this repository — 100% coverage on the pure parsing and lane-derivation logic and on the server's request handler (the actual security boundary), with five dedicated fixture files proving the edge cases that matter: a fully worked three-lane example, an empty log, a log mixing valid lines with genuinely unparseable text, a log with schema-valid JSON that's still missing required fields, and the deviation-stays-in-lane case described above. A malformed or schema-invalid line is skipped, not fatal — the orchestrator writes its log as prose-following output, not type-checked code in the call path, so the viewer degrades instead of crashing, and the on-screen status line reports exactly how many lines it skipped.

## What a team actually gets

- A live answer to "what's it doing right now," without interrupting the agent to ask or reading a raw log file by hand.
- "Blocked" that always means "waiting on a human," never "the agent silently gave up" — because that distinction is load-bearing for LAW-6.1 and LAW-7.1, not cosmetic.
- A security guarantee you can verify yourself with one terminal command, not one you have to take on faith.
- Nothing new to operate. No database, no auth, no second place for state to drift — one log file, one small Node process, one browser tab.

## Build it yourself

Everything described here is real and in the repository: agent-board/README.md for the full event schema, lane rules, and directory layout; docs/agent-board.md for the team-facing install and run guide, including a troubleshooting section for the port-fallback behavior and the cwd gotcha around where the log path resolves from; and agent-board/fixtures/ for the five sample logs described above, including a fully worked example if you want to see the board populated before any real workflow has written anything. Copy it in, install it, run the dev server, and watch a workflow move — that's the whole pitch, and it holds up because it's three commands and one diffed response, not a slide.`,
  },
];
