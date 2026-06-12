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
  {
    id: 'agentic-rescue',
    archetype: 'The Rescue',
    headline: 'Agents ran wild — recovering from vibe-coded debt',
    profile:
      'They adopted AI coding tools enthusiastically and ungoverned. Eighteen months later: duplication everywhere, tests that are green but detect nothing, and modules nobody — human or agent — can explain. Velocity is collapsing under code that was cheap to write and is now expensive to touch.',
    before: [
      'Duplication and churn climbing release over release',
      'Coverage high, mutation score near zero — green means nothing',
      '"The AI wrote it" is the answer to every incident question',
      'Engineers afraid to touch generated modules',
    ],
    after: [
      'Debt measured, mapped, and burning down on a schedule',
      'Generated tests must kill mutants — hollow green rejected at the gate',
      'A human owner can explain every merged line',
      'Agents still ship fast — inside guardrails this time',
    ],
    stages: [
      {
        phase: 'Day 0',
        title: 'Measure the damage',
        description:
          'Baseline the code health: duplication percentage, churn, mutation scores, module-by-module. The fear becomes a number — and numbers can be burned down.',
        mood: 'pain',
      },
      {
        phase: 'Weeks 1–2',
        title: 'Stop the bleeding',
        description:
          'Article 10 guardrails land: agents now plan first, show evidence, work sandboxed, and never grade their own output. New debt stops accumulating immediately.',
        mood: 'shift',
      },
      {
        phase: 'Weeks 3–6',
        title: 'Honest tests first',
        description:
          'Characterization tests pin the behavior that matters; mutation gates reject hollow suites. The safety net becomes real before any restructuring begins.',
        mood: 'shift',
      },
      {
        phase: 'Months 2–3',
        title: 'Refactor in governed waves',
        description:
          'WF-REFACTOR runs module by module: ADR defines the target, baselines prove behavior preserved, metrics prove structure improved. Agents do the heavy lifting — verified.',
        mood: 'win',
      },
      {
        phase: 'Quarter 2',
        title: 'Velocity restored, instruments on',
        description:
          'Duplication trending down, every release graphed, every agent commit owned and tagged. The same tools that dug the hole — now governed — fill it.',
        mood: 'win',
      },
    ],
    lawRefs: ['LAW-7.6', 'LAW-3.6', 'LAW-7.1', 'LAW-10.5'],
    workflowRefs: ['WF-REFACTOR', 'WF-BUG'],
  },
  {
    id: 'regulated-client',
    archetype: 'The Regulated Client',
    headline: 'From audit panic to evidence on demand',
    profile:
      'Healthcare, fintech, or anyone under PCI, HIPAA, or SOC 2: every audit is a fire drill of screenshots and recollection, and "are you using AI to write code?" is the question they dread most. Compliance lives in people’s heads — exactly where auditors can’t see it.',
    before: [
      'Audit prep measured in weeks of archaeology',
      'No map from regulation to the code that satisfies it',
      'AI usage policy is "please be careful"',
      'Every control demonstrated by interview, not evidence',
    ],
    after: [
      'Compliance map links each requirement to code and tests',
      '"Did AI touch this?" answered from commit tags in seconds',
      'Change history IS the audit trail — laws, amendments, deviations',
      'Audit prep becomes a report run, not a fire drill',
    ],
    stages: [
      {
        phase: 'Day 0',
        title: 'Map the obligations',
        description:
          'Each regulatory requirement gets a row: the control, the code path that satisfies it, the test that proves it. The Industry SME persona owns keeping it current.',
        mood: 'pain',
      },
      {
        phase: 'Weeks 1–2',
        title: 'Provenance switches on',
        description:
          'AI-assisted commits tagged, PR disclosures mandatory, agent data-protection rules enforced. From here forward, AI involvement is a record, not a rumor.',
        mood: 'shift',
      },
      {
        phase: 'Weeks 3–6',
        title: 'Mapped paths get teeth',
        description:
          'Changes touching compliance-mapped code require the map updated in the same PR and SME review. Drift between "documented" and "deployed" becomes structurally impossible.',
        mood: 'shift',
      },
      {
        phase: 'Month 2',
        title: 'Recovery rehearsed',
        description:
          'Quarterly game days exercise restore, failover, and degraded modes — the resilience evidence regulators increasingly ask for, generated before they ask.',
        mood: 'win',
      },
      {
        phase: 'Audit day',
        title: 'Evidence on demand',
        description:
          '"Show me your AI governance" → the registry, the tags, the deviation records. "Show me control 3.4" → the map, the code, the test. The dreaded questions become the easy ones.',
        mood: 'win',
      },
    ],
    lawRefs: ['LAW-8.3', 'LAW-7.3', 'LAW-7.2', 'LAW-9.7'],
    workflowRefs: ['WF-SECBUG'],
  },
  {
    id: 'consultant-drop-in',
    archetype: 'The Consultant Drop-In',
    headline: 'Day-one productive in any client repo — the Eliassen way',
    profile:
      'An Eliassen consultant — increasingly a consultant-plus-agent pair — lands in a client engagement. Traditionally, the first two weeks vanish into "how does this team work?" The constitution makes the standards travel with the consultant, so the ramp is measured in hours.',
    before: [
      'Weeks 1–2 of every engagement lost to convention archaeology',
      'Each consultant re-derives review and quality norms per client',
      'Agent tooling reconfigured from scratch per engagement',
      'Engagement quality depends on which consultant you got',
    ],
    after: [
      'Same laws, personas, and workflows on every engagement',
      'Consultant’s agent reads the steering files and is briefed instantly',
      'Deliverables carry citations clients can audit after we leave',
      'Eliassen quality is a system, not a staffing lottery',
    ],
    stages: [
      {
        phase: 'Hour 1',
        title: 'Land and install',
        description:
          'The constitution installs into the engagement repo — or maps onto what the client already runs. Either way, the consultant’s working rules are explicit by lunch.',
        mood: 'pain',
      },
      {
        phase: 'Day 1',
        title: 'Agent briefed automatically',
        description:
          'CLAUDE.md and AGENTS.md brief the consultant’s coding agent: conventions, gates, workflows, escalation rules. No tribal knowledge required — it’s all written down.',
        mood: 'shift',
      },
      {
        phase: 'Week 1',
        title: 'First governed delivery',
        description:
          'The first feature ships through WF-FEATURE with cited decisions and disclosed AI assistance. The client sees the process, not just the output.',
        mood: 'shift',
      },
      {
        phase: 'Ongoing',
        title: 'Compounding trust',
        description:
          'Every deliverable carries its citations and deviation records. Client reviews get faster because the evidence arrives with the work.',
        mood: 'win',
      },
      {
        phase: 'Handoff',
        title: 'Leave the system behind',
        description:
          'When the engagement ends, the governance stays: registry, workflows, training app. The client keeps the operating system — and knows who installed it.',
        mood: 'win',
      },
    ],
    lawRefs: ['LAW-1.3', 'LAW-10.4', 'LAW-7.3'],
    workflowRefs: ['WF-FEATURE'],
  },
  {
    id: 'ma-integration',
    archetype: 'The M&A Integration',
    headline: 'Three acquired engineering orgs, one operating system',
    profile:
      'An acquisition just closed — or three did. Each inherited org has its own stack, standards, review culture, and AI policy. Leadership needs one answer to "how do we build software?" before the integration window closes and the dialects calcify permanently.',
    before: [
      'Per-org standards, mutually unintelligible',
      'Integration teams blocked on process disputes, not code',
      'Diligence flagged unknown AI usage in two of three orgs',
      'Talent retention at risk from heavy-handed harmonization',
    ],
    after: [
      'One ratified floor; org-specific flexibility preserved as recorded overrides',
      'Cross-org staffing works — same laws everywhere',
      'AI usage inventoried, tagged, and governed in the first quarter',
      'Harmonization by amendment process, not by decree',
    ],
    stages: [
      {
        phase: 'Day 0',
        title: 'Ratify the floor, time-box the rest',
        description:
          'Leadership ratifies the non-negotiables — security veto, quality gates, AI provenance — as the integration baseline. Everything else is explicitly open for the amendment process.',
        mood: 'pain',
      },
      {
        phase: 'Month 1',
        title: 'Inventory and install',
        description:
          'Each org installs against the baseline; existing practices map to laws or become recorded local overrides. The diligence unknowns — especially AI usage — become a registry.',
        mood: 'shift',
      },
      {
        phase: 'Months 2–3',
        title: 'Dialects become amendments',
        description:
          'Where orgs genuinely disagree, the best practice wins through proposals with evidence — not by whoever acquired whom. Losing positions stay on record, which keeps the peace.',
        mood: 'shift',
      },
      {
        phase: 'Quarter 2',
        title: 'One talent pool',
        description:
          'Engineers and agents move across former org boundaries and find the same constitution. Integration staffing stops being a special project.',
        mood: 'win',
      },
      {
        phase: 'Year 1',
        title: 'The integration that stuck',
        description:
          'One operating system, an audit trail of how it was harmonized, and no resentment archaeology — because every decision has its rationale on record.',
        mood: 'win',
      },
    ],
    lawRefs: ['LAW-1.3', 'LAW-10.6', 'LAW-1.5'],
    workflowRefs: ['WF-AMENDMENT', 'WF-REFACTOR'],
  },
];
