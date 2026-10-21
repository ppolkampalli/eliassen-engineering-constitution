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
        id: 'greenfield-cursor',
        title: 'Using Cursor instead of Claude Code',
        body: `The constitution is not tied to one coding tool. LAW-7.4 says the standards are identical no matter who — or what agent — is doing the work; the installer honors that for Cursor users too.

AGENTS.md needs nothing extra: Cursor reads it natively at your project root (and in subdirectories), so every build/test command, naming rule, and Article 10 agentic rule in it already applies the moment install.sh runs — regardless of which --ide flag you pass.

The one real gap is the 17 skills (8 personas, workflow-orchestrator, and the enforcement skills), which are built on Claude Code's own skill format. Installing with --ide cursor converts each one into Cursor's own mechanisms instead of copying .claude/skills/:

- .cursor/rules/*.mdc — auto-attaches by description, the same way a Claude skill auto-activates
- .cursor/commands/*.md — explicit /persona-security, /workflow-orchestrator, etc.

./scripts/install.sh /path/to/your-project --ide cursor
./scripts/install.sh /path/to/your-project --ide both   # mixed Claude Code / Cursor team

Both are generated from the exact same skills/*/SKILL.md source — not a separately maintained copy — so the personas, the authority ladder, and the workflow gates a Cursor user sees are the same ones a Claude Code user sees, word for word.`,
        lawRefs: ['LAW-7.4', 'LAW-1.3', 'LAW-10.4'],
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
      {
        id: 'greenfield-q6',
        prompt: 'A teammate uses Cursor instead of Claude Code. Does the constitution apply to them?',
        options: [
          'No — the personas and workflows are Claude Code-only',
          'Yes — AGENTS.md already works natively in Cursor, and --ide cursor converts the 17 skills into .cursor/rules and .cursor/commands from the same source files',
          'Only the law registry, not the personas or workflows',
          'Only if they manually rewrite each skill for Cursor',
        ],
        correctIndex: 1,
        explanation:
          'LAW-7.4: standards are identical regardless of tool. install.sh --ide cursor generates .cursor/rules/*.mdc and .cursor/commands/*.md from the same skills/*/SKILL.md source Claude Code uses — not a separately maintained fork.',
        lawRef: 'LAW-7.4',
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
  {
    id: 'crm-walkthrough',
    title: 'Worked Example: Building the CRM with WF-FEATURE',
    summary:
      'A real, runnable feature built stage by stage under WF-FEATURE — read the plan, read the plan, run the tests, and watch a fresh-context review catch a real gap.',
    lessons: [
      {
        id: 'crm-why-this-example',
        title: 'Why a CRM demo, and what it proves',
        body: `Every other lesson in this app explains a law. This one walks through a single real feature — a small CRM with self-service registration and admin-only customer records — built end to end under WF-FEATURE, so you can see the laws operating together instead of one at a time. It lives in this repository's crm-demo/ directory; everything described here is real code you can clone and run, not illustrative pseudocode.

Before any code existed, the work was declared: "WF-FEATURE on the CRM reference implementation." That declaration matters more than it looks — LAW-10.1 requires substantial agent-executed work to proceed from a reviewed plan that names the laws bearing on it, not a jump straight to implementation. An agent (or engineer) that starts writing files before the plan exists has already exceeded its mandate, even if the code turns out fine — because "fine" was never defined before work began.

Four artifacts came out of the planning stages, in this order:

- requirements.md — the Product Owner's acceptance criteria (LAW-8.1): five observable behaviors, each with a stated verification method
- design.md — the Architect's domain placement and pattern choices (LAW-4.1, LAW-4.4)
- ADR-0003 — the three deliberate scope cuts (no auth stack, no web layer, no real database) and why each was made (LAW-4.5)
- test-list.md — Quality's Canon TDD test list, written before any implementation (LAW-3.1)

Notice what order that is: acceptance criteria first, design second, tests third, code last. Reversing that order is the single most common way agent-assisted work goes wrong — code that solves a plausible-sounding problem nobody actually defined.`,
        lawRefs: ['LAW-10.1', 'LAW-8.1'],
        workflowRefs: ['WF-FEATURE'],
      },
      {
        id: 'crm-domain-first',
        title: 'Reading the design before the code',
        body: `The design stage named two domains, not two layers: users (registration, identity, roles) and customers (the CRM records an admin manages). This is LAW-4.1 in practice — applications are organized by business domain first, with the full stack (application, domain logic, persistence) inside each domain, and cross-domain access only through a public interface.

The design went further than "two folders." It named the one thing allowed to cross between them: a plain Caller { id, role } value type, representing what a real auth layer would already have resolved — not either domain's internals. Everything else stays local: users never imports from customers, and customers never imports from users.

Why this is worth noticing: a design document that only says "we'll use good architecture" is not a design — LAW-4.5 requires significant structural decisions to be recorded with context, options considered, and the laws bearing on the decision, specifically so a future reader doesn't have to reverse-engineer intent from file layout. ADR-0003 recorded three such decisions explicitly: why no auth stack yet (LAW-5.4 deferred, not violated), why no web framework (use-cases are the public interface a future adapter would call), and why in-memory persistence (LAW-9.1 — no infrastructure needed for a reference app). Each decision names what it costs and what stays reversible.

- Domain-first, not layer-first: users and customers each own their full stack
- One shared value type crosses the boundary — never either domain's internals
- Every deliberate scope cut is in writing, with its reasoning, not left for someone to wonder about later`,
        lawRefs: ['LAW-4.1', 'LAW-4.5'],
      },
      {
        id: 'crm-test-list-first',
        title: 'The test list, then the code — not the other way around',
        body: `Before a line of users/ or customers/ implementation existed, Quality's test-definition stage produced a numbered list: twenty-nine behaviors, each traced back to one of the five acceptance criteria. "Should throw DuplicateEmailError when registering with an email differing only in case." "Should throw NotAuthorizedError when caller role is customer, creating nothing." Nothing speculative — no test exists for behavior nobody asked for, and no acceptance criterion exists without at least one test proving it.

This is Canon TDD's actual sequence (LAW-3.1): write the test list, convert one item into a failing test, make it pass, move to the next — never write a batch of implementation and backfill tests to match what the code happens to do. The guardrail that makes this non-negotiable: a failing test is fixed or its requirement is formally changed through the plan — it is never quietly deleted or weakened to reach green.

The result, run for real: 34 tests across 8 suites, 100% line/branch/function/statement coverage, a clean strict-TypeScript check with zero any. LAW-10.2 is the reason that sentence has numbers in it instead of just saying "tests pass" — verifiable completion means a runnable check and its actual output count as evidence; a confident claim does not. You can reproduce every one of those numbers yourself: clone the repo, cd crm-demo, run npm test -- --coverage, and read your own terminal.`,
        lawRefs: ['LAW-3.1', 'LAW-10.2'],
      },
      {
        id: 'crm-fresh-context-review',
        title: 'A context that did not write it, reviews it',
        body: `Here is the part most teams skip under time pressure, and the part that actually caught something real. LAW-10.5 requires agent-produced work to be reviewed by a context that did not produce it — specifically because the author (human or agent) is the worst-positioned judge of their own blind spots. For the CRM, that meant handing the finished implementation to a reviewer with zero memory of having written it, and asking it to independently re-run the tests rather than trust the claim that they passed.

It found a real gap. The partial-update logic for a customer record — update only phone and company, leave status untouched — had only ever been tested in one direction. The code was correct; the test suite claiming to prove it wasn't actually exercising that branch. Overall branch coverage read 96%, comfortably above the 90% floor, which is exactly how a real gap hides behind a healthy-looking aggregate number — the floor was never the problem; the false confidence in what it measured was.

The fix was one new test and five minutes of work. The point isn't that the bug was dramatic — it wasn't. The point is that it was found at all, and it was found because review was structurally independent rather than because someone remembered to be extra careful. A reviewer with the same blind spot as the author catches nothing a second read of the same assumptions would catch.

- Self-review catches typos; it rarely catches the assumption the author never questioned
- A healthy aggregate coverage number can still hide an untested branch
- Independent review is a structural property of the process, not a personality trait of the reviewer`,
        lawRefs: ['LAW-10.5', 'LAW-3.2'],
      },
      {
        id: 'crm-run-it-yourself',
        title: 'Run it yourself',
        body: `Every number in this lesson came from an actual terminal, and you can get the same ones:

- npm install — installs the pinned dependencies (strict TypeScript, Jest, ts-jest)
- npm run type-check — zero any, strict mode, clean
- npm test -- --coverage — 34 tests, 100% lines/branches/functions/statements
- npm run build — compiles to dist/
- npm run demo — runs the compiled (or, via npm run demo in dev, the source) use-cases end to end: register a visitor, watch a non-admin get rejected from an admin action, create two customer records, filter them by status, update one, and print every result as it happens

That last command is worth running even if you skip everything else — it's the difference between a coverage report and watching the thing actually work. The full artifact trail — requirements.md, design.md, test-list.md, the ADR, and the implementation itself — is in crm-demo/ in this repository, not summarized from memory. Clone it and read the real files; every claim in this lesson should check out against them.`,
        lawRefs: ['LAW-6.5'],
      },
    ],
    quiz: [
      {
        id: 'crm-q1',
        prompt: 'The CRM feature declared "WF-FEATURE" before any code was written. Why does that declaration matter?',
        options: [
          'It is a formality required for the PR template',
          'LAW-10.1 requires substantial agent-executed work to proceed from a reviewed plan naming the bearing laws — not a jump straight to implementation',
          'It only matters for human-written code, not agent-assisted work',
          'It lets the team skip the design stage',
        ],
        correctIndex: 1,
        explanation:
          'LAW-10.1: multi-file changes and new features proceed from a written specification or plan reviewed before implementation begins — the plan is what defines "done" before anyone starts typing.',
        lawRef: 'LAW-10.1',
      },
      {
        id: 'crm-q2',
        prompt: 'Why did the design split the CRM into users and customers domains instead of frontend/backend layers?',
        options: [
          'Layers are easier to staff',
          'LAW-4.1: applications organize by business domain first, with the full stack inside each domain and cross-domain access only through a public interface',
          'It was an arbitrary choice with no law behind it',
          'Because the test framework requires it',
        ],
        correctIndex: 1,
        explanation:
          'Domain-first splitting means each domain can be built, tested, and reviewed independently — a layer-first split would have made every change touch both domains at once.',
        lawRef: 'LAW-4.1',
      },
      {
        id: 'crm-q3',
        prompt: 'The fresh-context review found an untested branch even though overall branch coverage was 96%, above the 90% floor. What does this demonstrate?',
        options: [
          'The coverage floor is set too low and should be raised',
          'A healthy aggregate coverage number can still hide a real untested branch — which is exactly why LAW-10.5 requires independent review, not just a passing metric',
          'Coverage floors are not useful',
          'The reviewer made a mistake',
        ],
        correctIndex: 1,
        explanation:
          'LAW-10.5: a context that did not produce the work reviews it. The author of a healthy-looking metric is poorly positioned to notice what that metric is failing to measure.',
        lawRef: 'LAW-10.5',
      },
      {
        id: 'crm-q4',
        prompt: 'ADR-0003 records three deliberate scope cuts (no auth stack, no web layer, no real database) for the CRM demo. Why write this down instead of just not building those things?',
        options: [
          'So a future maintainer does not mistake a deliberate decision for an unfinished gap — LAW-4.5 requires significant structural decisions to be recorded with context and reasoning',
          'It is required paperwork with no practical value',
          'So the team can bill more hours',
          'ADRs are only for decisions that were implemented, not ones that were skipped',
        ],
        correctIndex: 0,
        explanation:
          'LAW-4.5: an ADR records context, options considered, the decision, and its consequences — exactly so "why is it like this?" has a written answer instead of requiring archaeology.',
        lawRef: 'LAW-4.5',
      },
      {
        id: 'crm-q5',
        prompt: 'The lesson claims "34 tests, 100% coverage" for the CRM demo. What makes that claim trustworthy rather than just a confident assertion?',
        options: [
          'It was written by a careful author',
          'LAW-10.2: verifiable completion means a runnable check and its actual output are the evidence — you can run npm test -- --coverage yourself and get the same numbers',
          'It does not matter whether it is trustworthy',
          'The numbers are rounded, so minor inaccuracies are fine',
        ],
        correctIndex: 1,
        explanation:
          'LAW-10.2 rejects "should work" as a standard of evidence. A number anyone can reproduce by running the same command is evidence; an unverified claim is not.',
        lawRef: 'LAW-10.2',
      },
    ],
  },
];
