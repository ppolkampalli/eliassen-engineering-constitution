import type { LawRef, WorkflowRef } from './content-types';

/**
 * Client journey maps for the Client Journeys page — marketing material
 * showing how the AI-SDLC takes three client archetypes from where they are
 * to governed agentic delivery. Refs validated by marketing-content.spec.ts.
 */
export interface JourneyStage {
  /** Short phase label shown on the timeline node, e.g. "Day 0". */
  phase: string;
  title: string;
  description: string;
  /** Visual state of the node: where the pain is vs. where the wins land. */
  mood: 'pain' | 'shift' | 'win';
}

export interface ClientJourney {
  id: string;
  /** The client archetype, e.g. "The Heroic Shippers". */
  archetype: string;
  headline: string;
  /** Who this client is, in two sentences they would recognize. */
  profile: string;
  before: string[];
  after: string[];
  stages: JourneyStage[];
  lawRefs: LawRef[];
  workflowRefs: WorkflowRef[];
}

export const clientJourneys: ClientJourney[] = [
  {
    id: 'zero-to-governed',
    archetype: 'The Heroic Shippers',
    headline: 'From no SDLC to governed delivery — without stopping the line',
    profile:
      'A fast-moving product team where shipping depends on heroes: no consistent reviews, tests "when there’s time," production firefights as a lifestyle. They want AI agents for speed — but bolting agents onto no process means amplifying chaos at machine speed.',
    before: [
      'Releases are events, with breath-holding',
      'Quality lives in two senior engineers’ heads',
      'No audit trail — "why is it like this?" has no answer',
      'AI tools used ad hoc, output pasted unreviewed',
    ],
    after: [
      'Every merge passed the same gates — no exceptions, no heroes needed',
      'Decisions citable by law ID; onboarding measured in days',
      'Agents work inside workflows with evidence required',
      'Releases are boring. Boring is the goal.',
    ],
    stages: [
      {
        phase: 'Day 0',
        title: 'Install, don’t debate',
        description:
          'One command delivers the entire standards stack — configs, gates, personas, steering files, the law registry. The standards conversation that never ends? It ends.',
        mood: 'pain',
      },
      {
        phase: 'Weeks 1–3',
        title: 'Foundation, gates advisory',
        description:
          'Gates run visibly but don’t block yet. One formatting commit, type debt ticketed, the team sees red turn green without a single mandate meeting.',
        mood: 'shift',
      },
      {
        phase: 'Weeks 4–6',
        title: 'Gates go live',
        description:
          'Lint, types, tests, coverage become required checks. First bugs flow through WF-BUG: failing test first, fresh-context verify. The safety net is real now.',
        mood: 'shift',
      },
      {
        phase: 'Weeks 7–12',
        title: 'Full governance',
        description:
          'Personas active, security pass done (found secrets rotated), SLOs signed. AI agents onboard into Article 10 guardrails — plans, evidence, sandboxes.',
        mood: 'win',
      },
      {
        phase: 'Quarter 2',
        title: 'Audit-ready velocity',
        description:
          'New engineers and new agents are productive in days, every decision has a citation, and the team ships faster than the hero era — sustainably.',
        mood: 'win',
      },
    ],
    lawRefs: ['LAW-1.3', 'LAW-6.2', 'LAW-8.1'],
    workflowRefs: ['WF-BUG', 'WF-FEATURE'],
  },
  {
    id: 'ai-on-good-sdlc',
    archetype: 'The Mature Shop',
    headline: 'Great SDLC already — now adopt AI tools without losing it',
    profile:
      'Strong CI, real reviews, healthy coverage — and a leadership mandate to "use AI." Their fear is justified: industry data shows AI assistance driving duplication up and refactoring down. They don’t need process; they need the agentic layer their process is missing.',
    before: [
      'Solid human SDLC, zero agent governance',
      'AI pilots stalled after plausible-but-wrong demos',
      'No policy for what agents may touch or send',
      'Generated tests inflate coverage, detect nothing',
    ],
    after: [
      'Agents follow the same staged workflows as humans',
      'Generated tests must kill mutants — hollow green is rejected',
      'Duplication/churn tracked per release; drift is a ticket, not a surprise',
      'Provenance on every AI-assisted commit — audit answers in seconds',
    ],
    stages: [
      {
        phase: 'Day 0',
        title: 'Map, don’t replace',
        description:
          'Their existing standards map onto the law registry — most laws they already live by. The gap analysis shows what’s genuinely new: Article 10, the agentic layer.',
        mood: 'pain',
      },
      {
        phase: 'Week 1',
        title: 'The agentic layer lands',
        description:
          'Steering files as governed code, sandbox doctrine (filesystem AND network), verifiable completion: every agent task defines a check it must pass and show.',
        mood: 'shift',
      },
      {
        phase: 'Weeks 2–4',
        title: 'Pilot under WF-FEATURE',
        description:
          'Two teams run agent-assisted features through the declared workflow: plan first, evidence required, fresh-context review, mutation gates on generated tests.',
        mood: 'shift',
      },
      {
        phase: 'Month 2',
        title: 'Scale with instruments on',
        description:
          'Org-wide rollout with AI code-health metrics live: duplication, churn, moved-vs-copied per release. The drift everyone fears is now a graph everyone sees.',
        mood: 'win',
      },
      {
        phase: 'Quarter',
        title: 'Velocity without decay',
        description:
          'Agent-assisted throughput up, duplication trend flat, every AI commit tagged and disclosed. The mandate is met — on their quality terms.',
        mood: 'win',
      },
    ],
    lawRefs: ['LAW-10.2', 'LAW-10.3', 'LAW-3.6', 'LAW-7.6', 'LAW-7.3'],
    workflowRefs: ['WF-FEATURE'],
  },
  {
    id: 'federated-teams',
    archetype: 'The Federated Enterprise',
    headline: 'Five teams, five processes — one constitution, real flexibility',
    profile:
      'Every team grew its own dialect: different review rules, different definitions of done, different AI policies (or none). Cross-team moves cost weeks, platform standards die as suggestions, and leadership can’t answer "are we governed?" because the honest answer is "depends which team."',
    before: [
      'Standards exist per team — none are organizational',
      'Engineer mobility costs weeks of relearning per move',
      'Five different answers to "may agents touch prod code?"',
      'Central mandates ignored as one-size-fits-all',
    ],
    after: [
      'One authority ladder and hard-gate floor, org-wide',
      'Teams keep autonomy via recorded workflow overrides',
      'Disagreement has a channel: the amendment process',
      'Any engineer or agent is productive on any repo, day one',
    ],
    stages: [
      {
        phase: 'Day 0',
        title: 'Ratify the floor',
        description:
          'Leadership ratifies the baseline: hard gates (security review, quality gates, acceptance criteria) are organizational law. Everything else is paved path, not mandate.',
        mood: 'pain',
      },
      {
        phase: 'Month 1',
        title: 'Onboarding waves',
        description:
          'Teams install in waves, each keeping what’s genuinely local: project workflow overrides by ID — recorded, reviewable, and never softer than the org floor.',
        mood: 'shift',
      },
      {
        phase: 'Month 2',
        title: 'Federation in practice',
        description:
          'Team A skips design stages for small changes (recorded deviation); Team B adds an extra security pass. Both compliant. Disagreements become amendment proposals, not workarounds.',
        mood: 'shift',
      },
      {
        phase: 'Quarter',
        title: 'Mobility unlocked',
        description:
          'An engineer — or an agent — moves teams and finds the same laws, the same personas, the same citation format. Ramp-up drops from weeks to days.',
        mood: 'win',
      },
      {
        phase: 'Ongoing',
        title: 'Governed AND flexible',
        description:
          'Leadership answers "are we governed?" with a registry, an audit trail, and per-team deviation records. Flexibility is no longer the opposite of governance — it’s a feature of it.',
        mood: 'win',
      },
    ],
    lawRefs: ['LAW-10.6', 'LAW-1.3', 'LAW-1.5'],
    workflowRefs: ['WF-AMENDMENT', 'WF-FEATURE'],
  },
];
