import type { Article } from './articles-types';

/**
 * Thought-leadership articles. Each was drafted by an independent agent from
 * the practice's first-principles framework (processes exist to fit human
 * limitations; question before you inherit) and human-reviewed before publish.
 */
export const articles: Article[] = [
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
];
