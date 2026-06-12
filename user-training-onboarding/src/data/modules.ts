import type { TrainingModule } from './content-types';

/**
 * The training catalog. Every lawRef/workflowRef here is validated against the
 * live registries by content-validation.spec.ts — content cannot reference a
 * law that no longer exists. When amendments change behavior described in a
 * lesson, update that lesson in the same propagation pass (WF-AMENDMENT stage 5).
 */
export const trainingModules: TrainingModule[] = [
  {
    id: 'orientation',
    title: 'Orientation: How the Constitution Works',
    summary:
      'Laws, citations, personas, and workflows — the four ideas everything else builds on.',
    lessons: [
      {
        id: 'orientation-what-it-is',
        title: 'What the constitution is (and why it exists)',
        body: `The Engineering Constitution codifies our SDLC quality standards as numbered, versioned, citable Laws — currently 10 articles covering principles, code standards, testing, architecture, security, review, AI governance, requirements, operations, and agentic development.

It exists because of six founding pain points: review bottlenecks, inconsistent standards, low test coverage, security vulnerabilities reaching production, poor documentation, and silently compounding tech debt. Every law's Rationale section traces back to one of these.

Three things make it different from a wiki of guidelines:

- Laws are citable by ID — decisions reference [LAW-2.3 v1.0], not "our standards"
- Laws change only through a recorded amendment process — never silently
- AI agents and humans are bound identically`,
        lawRefs: ['LAW-1.3', 'LAW-7.4'],
      },
      {
        id: 'orientation-citations',
        title: 'Citing laws: the decision format',
        body: `Every significant decision made under the constitution is articulated as a citation: DECISION (what), CITATION (the law ID and its quoted statement), RATIONALE (the law's why, applied to this case), and PERSONA (who decided).

Minor corrections use the inline form: "Renamed IUserRepo to UserRepository (per [LAW-2.1 v1.0])".

Two rules keep citations honest:

- Quote the law verbatim — paraphrases drift; quotes are auditable
- Cite from the registry, never from memory — use the law browser in this app or ./scripts/law-lookup.sh`,
        lawRefs: ['LAW-2.1'],
      },
      {
        id: 'orientation-personas',
        title: 'Personas and the authority ladder',
        body: `Eight personas — Security, Architect, Quality, Software Engineer, Product Owner, Industry SME, DevOps, FinOps — define WHO decides what. Each owns specific laws, has bounded authority, and must cite laws in every decision.

When personas disagree, precedence is fixed by the authority ladder:

- Security VETO (CRITICAL findings; only a named human security lead overrides)
- Architect VETO (layer violations, circular dependencies)
- Quality BLOCK (coverage floors, gate integrity)
- Domain blocks (DevOps: no rollback; PO: no acceptance criteria)
- Advisory (Industry SME, FinOps — and FinOps is explicitly subordinate to Security)

Deadlines never waive gates: the Product Owner persona cannot override Articles 3, 5, or 6.`,
        lawRefs: ['LAW-1.5', 'LAW-6.2', 'LAW-9.3'],
      },
      {
        id: 'orientation-workflows',
        title: 'Workflows: how work moves',
        body: `Workflows define HOW work flows between personas — staged chains with gates and human checkpoints. The catalog has six: WF-FEATURE, WF-RESEARCH, WF-BUG, WF-SECBUG, WF-REFACTOR, and WF-AMENDMENT.

Nontrivial work declares which workflow it follows. You can reshape a flow conversationally ("skip the architect stage, this is tiny") — the orchestrator applies it if the stage isn't hard, and records the deviation on the work item. Hard stages (marked * in the explorer) are never skippable: they guard inviolable laws.

Explore all six chains in this app's Workflow Explorer.`,
        lawRefs: ['LAW-10.6'],
        workflowRefs: ['WF-FEATURE', 'WF-BUG'],
      },
      {
        id: 'orientation-amendments',
        title: 'How laws change: amendments',
        body: `Laws are never edited directly. Changes flow through a five-stage process: proposal, review by owner personas, a HUMAN decision, enactment (one commit updating law + registry + changelog), and propagation to consuming projects.

Why this matters to you as a learner: every law in this app is rendered live from the registry. When an amendment enacts, this app shows the new text and version automatically — and rejected amendments stay on record, so you can learn why an idea was declined.

CI enforces this: a law file changed without an amendment record fails the build.`,
        lawRefs: ['LAW-10.6'],
        workflowRefs: ['WF-AMENDMENT'],
      },
    ],
    quiz: [
      {
        id: 'orientation-q1',
        prompt: 'A teammate says "skip the tests, the deadline is tomorrow." Who can waive the testing gates?',
        options: [
          'The Product Owner, since they own the deadline',
          'Any two engineers agreeing in review',
          'Nobody — quality gates have no override path',
          'The Architect persona',
        ],
        correctIndex: 2,
        explanation:
          'LAW-6.2: no change merges unless every gate is green, and no override path exists — not for admins, hotfixes, or deadlines. Deadline pressure is exactly what the inviolability protects against.',
        lawRef: 'LAW-6.2',
      },
      {
        id: 'orientation-q2',
        prompt: 'Which persona sits at the top of the authority ladder?',
        options: ['Architect', 'Security', 'Quality', 'Product Owner'],
        correctIndex: 1,
        explanation:
          'Security VETO on CRITICAL findings outranks everything; only a named human security lead can override it, recorded in the PR (LAW-1.5).',
        lawRef: 'LAW-1.5',
      },
      {
        id: 'orientation-q3',
        prompt: 'How does a law get changed?',
        options: [
          'Edit the law file and open a PR',
          'Through the amendment process: proposal → review → human decision → enactment → propagation',
          'The Architect persona rewrites it',
          'Laws are permanent',
        ],
        correctIndex: 1,
        explanation:
          'Laws change only via recorded amendments (WF-AMENDMENT). A law file edited without an amendment record fails the law-integrity CI build.',
      },
      {
        id: 'orientation-q4',
        prompt: 'You want to skip a workflow stage marked hard. What happens?',
        options: [
          'It is skipped and recorded',
          'The orchestrator refuses with a law citation',
          'It is skipped silently',
          'You need two approvals to skip it',
        ],
        correctIndex: 1,
        explanation:
          'LAW-10.6: hard stages guard inviolable laws and may not be overridden conversationally or by project files. Non-hard stages can be skipped — with the deviation recorded.',
        lawRef: 'LAW-10.6',
      },
    ],
  },
  {
    id: 'greenfield',
    title: 'Greenfield: Starting a New Application',
    summary: 'Day-zero setup: install the constitution, wire the gates, work governed from the first commit.',
    lessons: [
      {
        id: 'greenfield-install',
        title: 'Day zero: one command',
        body: `New projects skip the phased rollout entirely. From the constitution repo, run:

./scripts/install.sh /path/to/your-project

This installs everything: CLAUDE.md and AGENTS.md (agent steering), the ESLint/Prettier/tsconfig/Jest configs, the pre-commit hook, CI workflows, the PR template, all skills including the eight personas, and the law registry into docs/constitution/ — so your project can cite laws offline.

Then add the devDependencies and package.json scripts the installer prints, run npm run prepare to activate the hook, and verify with ./scripts/validate.sh — it runs ~25 checks and must say PASS.`,
        lawRefs: ['LAW-1.3', 'LAW-10.4'],
      },
      {
        id: 'greenfield-steering',
        title: 'Steering files are code',
        body: `Your new project ships with CLAUDE.md and AGENTS.md — the files coding agents read at session start. Treat them as code: version-controlled, reviewed in PRs, kept concise, pruned regularly.

The discipline that matters: every line must earn its context cost. Ask "would removing this cause the agent to make mistakes?" If not, cut it. Bloated steering files cause agents to ignore the rules that matter.

And the golden rule: rules that must ALWAYS hold become hooks or CI gates, never steering-file prose — prose is advisory; gates are physics.`,
        lawRefs: ['LAW-10.4', 'LAW-6.2'],
      },
      {
        id: 'greenfield-first-feature',
        title: 'Your first feature: declare WF-FEATURE',
        body: `From the first ticket, work flows through WF-FEATURE: the Product Owner persona writes acceptance criteria, the Architect places the work in a domain, Quality writes the test list from the ACs, the engineer implements test-first, then fresh-context code review, security review, and release readiness.

Two stages will feel new if you have not worked governed before:

- test-definition: the Canon TDD test list is written from the ACs BEFORE implementation
- code-review: a context that did not write the code reviews it — for agent work, that means a fresh session or subagent

Acceptance criteria are non-negotiable: no implementation begins until "done" is written down.`,
        lawRefs: ['LAW-8.1', 'LAW-3.1', 'LAW-10.5'],
        workflowRefs: ['WF-FEATURE'],
      },
      {
        id: 'greenfield-architecture',
        title: 'Structure: domains first, modular monolith by default',
        body: `Organize the codebase by business domain (orders/, billing/, inventory/), not by technical tier (controllers/, models/, services/). Inside each domain, the four layers apply: Presentation → Application → Domain logic → Persistence, dependencies pointing down, no framework imports in domain logic.

The deployment default is a modular monolith. Extracting a microservice requires an ADR demonstrating a real extraction criterion: independent scaling, sensitive-data isolation, or divergent tech needs. "Microservices because modern" is not a criterion.

Every call across a network boundary gets timeouts, bounded retries with jitter, idempotency keys, and a circuit breaker with a defined degraded mode — from day one, when it is cheap.`,
        lawRefs: ['LAW-4.1', 'LAW-4.5', 'LAW-4.6'],
      },
      {
        id: 'greenfield-reliability',
        title: 'SLOs and error budgets from day one',
        body: `Before your service takes production traffic, write its SLO document: availability and latency targets for the critical user journeys, each with a measured SLI, signed off by product, development, and operations.

Each SLO carries a four-week error budget with a written policy: budget exhausted means feature releases halt — only P0 and security fixes ship — until back within SLO. Agreeing to this on day one, before any incident, is the entire point: the reliability-versus-velocity argument gets settled as a contract, not fought per-incident.

And test recovery before you need it: rollback, failover, and restore are exercised quarterly. An untested recovery procedure is assumed broken.`,
        lawRefs: ['LAW-9.5', 'LAW-9.6', 'LAW-9.7'],
      },
    ],
    quiz: [
      {
        id: 'greenfield-q1',
        prompt: 'What is the first thing to run when starting a governed greenfield project?',
        options: [
          'npm init',
          'The constitution installer: ./scripts/install.sh <project>',
          'git flow init',
          'A kickoff meeting to choose coding standards',
        ],
        correctIndex: 1,
        explanation:
          'install.sh delivers the whole governance kit in one command — configs, hooks, CI, skills, steering files, and the offline law registry. Standards are not chosen per-project (LAW-1.3: zero exceptions).',
        lawRef: 'LAW-1.3',
      },
      {
        id: 'greenfield-q2',
        prompt: 'When can implementation of your first feature begin?',
        options: [
          'As soon as the ticket title is clear',
          'After written acceptance criteria exist',
          'After the sprint planning meeting',
          'Once the architect approves the design',
        ],
        correctIndex: 1,
        explanation:
          'LAW-8.1: no implementation begins without written acceptance criteria — observable behaviors, edge cases, verification. A ticket whose body is its title is not implementable.',
        lawRef: 'LAW-8.1',
      },
      {
        id: 'greenfield-q3',
        prompt: 'Your team wants to start with six microservices. What does the constitution say?',
        options: [
          'Fine — microservices are the sanctioned pattern',
          'Modular monolith by default; each extraction needs an ADR with a documented criterion',
          'Maximum three services',
          'Architecture is a team preference',
        ],
        correctIndex: 1,
        explanation:
          'LAW-4.1 v1.1: domain-first modular monolith is the default; service extraction requires an ADR demonstrating independent scaling, data isolation, or divergent tech needs.',
        lawRef: 'LAW-4.1',
      },
      {
        id: 'greenfield-q4',
        prompt: 'A rule must NEVER be violated by coding agents. Where does it belong?',
        options: [
          'In CLAUDE.md, written in bold',
          'In a hook or CI gate — deterministic, not advisory',
          'In the README',
          'In sprint kickoff notes',
        ],
        correctIndex: 1,
        explanation:
          'LAW-10.4: steering-file prose is advisory by nature. Always-rules become hooks or gates that cannot be ignored — LAW-6.2 logic applied to agents.',
        lawRef: 'LAW-10.4',
      },
      {
        id: 'greenfield-q5',
        prompt: 'When is the error-budget policy agreed?',
        options: [
          'After the first incident',
          'Before production traffic — day one, as a pre-agreed contract',
          'At the quarterly review',
          'When finance asks about reliability',
        ],
        correctIndex: 1,
        explanation:
          'LAW-9.6: the budget converts reliability-vs-velocity from a per-incident negotiation into a pre-agreed contract. Agreeing during an incident is renegotiation under pressure — prohibited.',
        lawRef: 'LAW-9.6',
      },
    ],
  },
  {
    id: 'rewrite',
    title: 'Rewriting an Existing Application',
    summary: 'Bringing a legacy codebase under the constitution: phased rollout, safety nets, structural migration.',
    lessons: [
      {
        id: 'rewrite-phased-rollout',
        title: 'The 12-week phased rollout — never big-bang',
        body: `An existing codebase cannot adopt 57 laws overnight, and trying breeds bypass pressure — the exact culture the constitution exists to prevent. The rollout guide phases adoption over 12 weeks:

- Weeks 1–3 Foundation: install tooling, gates ADVISORY (visible, not blocking), fix the noisy violations (one prettier --write commit), ticket the type debt
- Weeks 4–6 Quality mechanics: coverage baseline, TDD sessions, review checklist — then gates become REQUIRED
- Weeks 7–9 Architecture & security: layering map, cycle scan, Article 5 pass, rotate any found secrets
- Weeks 10–12 Full governance: personas, AI governance, ops laws, first amendment proposals from real friction

Anti-pattern to avoid: local exceptions "to ease adoption". Exceptions go through amendments or not at all.`,
        lawRefs: ['LAW-1.3', 'LAW-6.2'],
      },
      {
        id: 'rewrite-baseline',
        title: 'Measure before you touch: baselines',
        body: `Before changing anything, capture the before-state: test coverage of affected paths, mutation score, duplication and churn metrics. Two reasons:

- You cannot demonstrate improvement without a baseline — and a refactor that cannot demonstrate improvement gets its rationale questioned
- Legacy code with thin coverage needs characterization tests FIRST — tests that pin current behavior (even buggy behavior) so restructuring under a weak net does not silently change it

If coverage is below the floors, the ramp plan is written down and tracked — never silently configured around.`,
        lawRefs: ['LAW-7.6', 'LAW-3.2', 'LAW-3.6'],
      },
      {
        id: 'rewrite-refactor-workflow',
        title: 'WF-REFACTOR: structure changes, behavior does not',
        body: `Structural rewrites run the refactor workflow: Architect writes the ADR (the target shape IS your acceptance criteria), Quality captures baselines and adds characterization tests, the engineer restructures in reviewable increments with the suite green after each, and Quality verifies both behavior preservation and measured structural improvement.

The agent guardrail matters doubly here: a failing test during a refactor means behavior changed. The answer is revert-and-rethink — never adjusting the test to match the new behavior.

If you discover the work changes behavior on purpose, stop: that part is WF-FEATURE or WF-BUG. Split it.`,
        lawRefs: ['LAW-4.5', 'LAW-3.1'],
        workflowRefs: ['WF-REFACTOR'],
      },
      {
        id: 'rewrite-domain-migration',
        title: 'Migrating to domain-first structure',
        body: `Most legacy apps are organized by technical tier. The target is domain-first: top-level modules mirroring business domains with layers inside each. Migrate opportunistically — module moves are refactors, not rewrites:

- Map the real domains first (orders, billing, inventory…) — this is discovery work with the Industry SME persona
- Move one domain at a time via WF-REFACTOR, starting with the least-entangled
- Cross-domain access goes through public interfaces as you go — each move tightens a boundary
- Resist the full big-bang restructure; Shopify-scale evidence says domain-first organization pays off through discoverability and ownership, delivered incrementally`,
        lawRefs: ['LAW-4.1', 'LAW-8.2'],
        workflowRefs: ['WF-REFACTOR'],
      },
      {
        id: 'rewrite-security-debt',
        title: 'Security debt: triage first, fix by severity',
        body: `Legacy codebases carry Article 5 debt: concatenated queries, hardcoded secrets, home-grown auth. Run a security pass early (weeks 7–9) and triage by the violation severity matrix:

- CRITICAL (secrets in code, SQL concatenation, custom crypto): work stops, fix now — and a secret that was EVER committed gets rotated, not just removed; git history never forgets
- HIGH (vulnerable dependencies, missing validation): fix-or-accept recorded within the sprint
- MEDIUM/LOW: ticketed and scheduled

Suspected vulnerabilities switch to WF-SECBUG immediately — suspicion is enough.`,
        lawRefs: ['LAW-5.2', 'LAW-5.3', 'LAW-1.5'],
        workflowRefs: ['WF-SECBUG'],
      },
    ],
    quiz: [
      {
        id: 'rewrite-q1',
        prompt: 'You inherit a legacy repo. When do CI gates become required (blocking)?',
        options: [
          'Day one — standards are standards',
          'Around week 6, after baselines are fixed and teams have seen gates run advisory',
          'Never for legacy code',
          'When the client asks',
        ],
        correctIndex: 1,
        explanation:
          'Big-bang gating on a legacy repo breeds bypass pressure — the culture LAW-6.2 exists to prevent. The rollout runs gates advisory first, then flips them to required once green is achievable.',
        lawRef: 'LAW-6.2',
      },
      {
        id: 'rewrite-q2',
        prompt: 'The module you must restructure has almost no tests. First move?',
        options: [
          'Refactor carefully and manually test after',
          'Write characterization tests pinning current behavior, then restructure',
          'Rewrite it from scratch instead',
          'Lower the coverage threshold for that module',
        ],
        correctIndex: 1,
        explanation:
          'WF-REFACTOR\'s baseline stage: refactoring under a weak net turns "behavior-preserving" into a hope. Characterization tests come first; lowering thresholds violates LAW-3.2.',
        lawRef: 'LAW-3.2',
      },
      {
        id: 'rewrite-q3',
        prompt: 'Mid-refactor, a test fails. The new structure "works better anyway." What now?',
        options: [
          'Update the test to match the improved behavior',
          'Delete the test — it tested old behavior',
          'Revert and rethink: a failing test during refactor means behavior changed',
          'Add a .skip and a ticket',
        ],
        correctIndex: 2,
        explanation:
          'LAW-3.1 v1.1 guardrail: failing tests are never deleted, skipped, or weakened to reach green. In a refactor, red means behavior changed — which is the one thing a refactor must not do. Intended behavior changes are WF-FEATURE work.',
        lawRef: 'LAW-3.1',
      },
      {
        id: 'rewrite-q4',
        prompt: 'You find an AWS key hardcoded in a 3-year-old commit. It was removed last year. Action?',
        options: [
          'Nothing — it was already removed',
          'Rotate the key now: a secret that has ever been committed is compromised',
          'Squash the old commits',
          'Add it to .gitignore',
        ],
        correctIndex: 1,
        explanation:
          'LAW-5.3: version control never forgets — the key survives in every clone and backup. Removal creates the illusion of remediation; rotation is the remediation.',
        lawRef: 'LAW-5.3',
      },
    ],
  },
  {
    id: 'enhance',
    title: 'Enhancing an Existing Application',
    summary: 'Day-to-day governed work: picking the right workflow, scope discipline, working with AI agents.',
    lessons: [
      {
        id: 'enhance-pick-workflow',
        title: 'Pick the workflow, declare it',
        body: `Every nontrivial work item starts by declaring its workflow:

- New behavior or user-facing change → WF-FEATURE
- Existing behavior is wrong → WF-BUG (engineer reproduces with a failing test, fixes, QA verifies; unresolved issues loop to the PO)
- Any security suspicion → WF-SECBUG, immediately — suspicion is enough
- Structure without behavior change → WF-REFACTOR
- "Should we build X?" → WF-RESEARCH first

Say it out loud to the orchestrator: "run WF-BUG on JIRA-3411". The declared workflow is what makes "did security see this?" answerable from the record instead of memory.`,
        lawRefs: ['LAW-10.6'],
        workflowRefs: ['WF-FEATURE', 'WF-BUG', 'WF-SECBUG', 'WF-RESEARCH'],
      },
      {
        id: 'enhance-scope',
        title: 'Scope discipline: no smuggling',
        body: `You are fixing a rounding bug and notice the ORM is two majors behind, the service naming is inconsistent, and a CSV export would be easy to add "while you are in here." The constitution's answer:

- Fix the rounding bug — that is the ticket
- File tickets for the ORM and the naming (deferred quality gets a ticket, never a TODO without one)
- Raise the CSV idea with the Product Owner — scope expansion needs recorded PO sign-off BEFORE implementation

Why so strict: each "small extra" widens the review surface, invalidates estimates, and ships behavior no stakeholder agreed to. AI assistance makes generating the extra feature cost seconds — so the discipline must live in process, not effort.`,
        lawRefs: ['LAW-8.4', 'LAW-1.2'],
      },
      {
        id: 'enhance-agentic-etiquette',
        title: 'Working with AI agents: the Article 10 contract',
        body: `When you or an agent works on governed code, five rules shape the session:

- Substantial work starts from a reviewed plan naming the laws that bear on it
- Every task defines a runnable check first — tests, build, lint — and the agent presents EVIDENCE (test output), never just "done"
- Autonomous runs are sandboxed: filesystem AND network isolation, explicit tool allowlists
- Agent output is reviewed by a context that did not produce it — fresh session, subagent, or you
- On ambiguity, agents stop and ask. A plausible guess silently embedded in code is a defect even when it turns out correct`,
        lawRefs: ['LAW-10.1', 'LAW-10.2', 'LAW-10.3', 'LAW-10.5', 'LAW-7.5'],
      },
      {
        id: 'enhance-ai-disclosure',
        title: 'AI provenance: tag, disclose, own',
        body: `AI involvement is disclosed where the change is recorded:

- Commits with AI-generated code carry the [Claude-assisted] tag (or your tool's equivalent)
- The PR's AI Assistance section states what the AI produced and what YOU verified or modified
- You own every line you merge: "the AI wrote it" is never an explanation, a defense, or a substitute for understanding

Disclosure is provenance, not confession — undisclosed AI involvement is the violation, never the involvement itself. Reviewers calibrate to it: AI code fails in characteristic ways (invented APIs, inverted edge conditions) that deserve the verify-never-assume lens.`,
        lawRefs: ['LAW-7.1', 'LAW-7.3', 'LAW-7.4'],
      },
      {
        id: 'enhance-tests-honest',
        title: 'Keeping the test suite honest under AI velocity',
        body: `AI generates tests fast — and generated tests have a documented failure mode: 100% line coverage with a ~4% mutation score. Green that detects nothing.

The defenses you will use day-to-day:

- Generated test suites are accepted only when the mutation report shows they kill mutants beyond the existing suite
- Every test must be able to fail: assert outcomes, not just that mocks were called
- .skip requires a ticket reference — a skipped test is a known blind spot, and without a ticket it is a permanent one
- Duplication and churn metrics are tracked per release; sustained regression becomes scheduled refactoring work, not ambient decay`,
        lawRefs: ['LAW-3.5', 'LAW-3.6', 'LAW-7.6'],
      },
    ],
    quiz: [
      {
        id: 'enhance-q1',
        prompt: 'While fixing a bug you suspect the endpoint might be injectable. What happens to your WF-BUG run?',
        options: [
          'Finish the bug fix first, then report it',
          'Switch to WF-SECBUG immediately — suspicion is enough',
          'Add a TODO and continue',
          'Ask the PO to prioritize it next sprint',
        ],
        correctIndex: 1,
        explanation:
          'WF-BUG\'s escalation rule: a suspected security implication switches the work to WF-SECBUG the moment it appears — Security triages severity and containment before anything else proceeds (LAW-1.5).',
        lawRef: 'LAW-1.5',
      },
      {
        id: 'enhance-q2',
        prompt: 'An agent reports "Implementation complete, should work correctly." What is missing?',
        options: [
          'Nothing, agents are reliable',
          'Evidence: the runnable check\'s output — test results, build status',
          'A second agent\'s opinion',
          'A screenshot of the code',
        ],
        correctIndex: 1,
        explanation:
          'LAW-10.2: completion claims without runnable evidence are presumed unverified. "Looks done" is the only signal an agent has unless you give it a check it can run — and require the output.',
        lawRef: 'LAW-10.2',
      },
      {
        id: 'enhance-q3',
        prompt: 'The AI-generated test suite raised coverage to 95%. When is it accepted?',
        options: [
          'Immediately — 95% beats the 80% floor',
          'After the mutation report shows the new tests kill mutants beyond the existing suite',
          'After a week in CI',
          'When the agent confirms the tests are good',
        ],
        correctIndex: 1,
        explanation:
          'LAW-3.6: coverage proves code ran; mutation score proves tests notice when code breaks. Generated suites reaching high coverage with near-zero mutation kill are hollow (LAW-3.5) and rejected.',
        lawRef: 'LAW-3.6',
      },
      {
        id: 'enhance-q4',
        prompt: 'You added a small CSV export while fixing a date bug. The PO never asked for it. This is…',
        options: [
          'Initiative — ship it',
          'A scope violation: out-of-scope changes need recorded PO sign-off before implementation',
          'Fine if the tests pass',
          'Fine if it took under an hour',
        ],
        correctIndex: 1,
        explanation:
          'LAW-8.4: scope expansion is unplanned, stakeholder-unreviewed work. Good ideas are raised with the PO or ticketed — never smuggled into an unrelated diff.',
        lawRef: 'LAW-8.4',
      },
      {
        id: 'enhance-q5',
        prompt: 'Which statement about the [Claude-assisted] commit tag is true?',
        options: [
          'It signals lower-quality code',
          'It is provenance: undisclosed AI involvement is the violation, not the involvement',
          'It exempts the commit from review',
          'It is optional for small commits',
        ],
        correctIndex: 1,
        explanation:
          'LAW-7.3: disclosure enables calibrated review and auditability. The no-stigma framing is deliberate — the moment tagging reads as confession, honest tagging stops.',
        lawRef: 'LAW-7.3',
      },
    ],
  },
];
