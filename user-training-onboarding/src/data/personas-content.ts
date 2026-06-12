import type { LawRef } from './content-types';

/**
 * Marketing-grade persona profiles for the "Meet the Council" page.
 * ownedLaws are typed LawRefs, validated against the live registry by
 * marketing-content.spec.ts — same consistency guarantee as lesson content.
 */
export interface PersonaProfile {
  /** Matches the persona skill directory name. */
  id: string;
  name: string;
  /** The one-line hook. */
  tagline: string;
  /** 2–3 sentences that sell the persona to a skeptical engineer. */
  pitch: string;
  /** Authority tier on the ladder. */
  authority: 'VETO' | 'BLOCK' | 'DECIDE' | 'ADVISE';
  authorityDetail: string;
  /** Situations that summon this persona. */
  summonWhen: string[];
  ownedLaws: LawRef[];
  /** A real phrase you can say to invoke it. */
  invocation: string;
}

export const personaProfiles: PersonaProfile[] = [
  {
    id: 'security',
    name: 'Security',
    tagline: 'The veto nobody talks past.',
    pitch:
      'Security is the only persona whose "no" cannot be outvoted, outranked, or out-deadlined — only a named human security lead can override a CRITICAL finding, in writing. That is not bureaucracy; it is the end of arguing about security under pressure. The argument is pre-decided, so you never have to win it at 5pm on release day.',
    authority: 'VETO',
    authorityDetail:
      'Blocks any change with a CRITICAL finding. Sits at the top of the authority ladder — above Architect, Quality, and every deadline ever set.',
    summonWhen: [
      'Code touches auth, user input, persistence, secrets, or dependencies',
      'Any vulnerability is suspected — suspicion alone switches work to WF-SECBUG',
      'An agent needs sandbox boundaries or credential scopes reviewed',
    ],
    ownedLaws: ['LAW-5.1', 'LAW-5.2', 'LAW-5.3', 'LAW-5.4', 'LAW-5.5', 'LAW-5.6', 'LAW-10.3'],
    invocation: '“Put on the Security hat — does this webhook handler hold up?”',
  },
  {
    id: 'architect',
    name: 'Architect',
    tagline: 'Structure is a decision, not an accident.',
    pitch:
      'Every system you have ever cursed "grew that way." The Architect persona exists so yours never does: domains first, layers inside, every significant decision written down with the options that lost. Six months from now, you will know exactly why it is like this — because it says so, in an ADR, with your name on the reasoning.',
    authority: 'VETO',
    authorityDetail:
      'Vetoes layer violations and circular dependencies. Second on the ladder — only Security outranks it.',
    summonWhen: [
      'Designing a new feature’s placement, module boundaries, or patterns',
      'Anything that smells like a new service, dependency, or layer',
      'A refactor — the Architect writes the ADR that defines "done"',
    ],
    ownedLaws: ['LAW-4.1', 'LAW-4.2', 'LAW-4.3', 'LAW-4.4', 'LAW-4.5', 'LAW-4.6', 'LAW-1.4'],
    invocation: '“Act as the Architect persona and review this module structure.”',
  },
  {
    id: 'quality',
    name: 'Quality',
    tagline: 'Green must mean something.',
    pitch:
      'A test suite you cannot trust is worse than no suite — it is confidence you have not earned. Quality guards the meaning of green: coverage floors that never move down, mutation scores that catch hollow tests, and review standards that hold whether the code came from a human or an agent. When Quality says it ships, it ships.',
    authority: 'BLOCK',
    authorityDetail:
      'Blocks merges below coverage floors, with hollow tests, or attempting any gate bypass. Arbitrates "is this tested enough?" with laws, not vibes.',
    summonWhen: [
      'Deciding the test plan for a change — what must be tested and how',
      'AI-generated tests arrive — mutation re-validation is Quality’s call',
      'Anyone proposes touching a coverage threshold or skipping a test',
    ],
    ownedLaws: ['LAW-3.1', 'LAW-3.2', 'LAW-3.3', 'LAW-3.4', 'LAW-3.5', 'LAW-3.6', 'LAW-6.1', 'LAW-6.2'],
    invocation: '“As the Quality persona — is this tested enough to merge?”',
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    tagline: 'The default. The one doing the work.',
    pitch:
      'This is the persona writing the code — yours or your agent’s. It owns the craft laws (naming, types, structure) and executes test-first on every change. Its superpower is the self-check: code is verified against the constitution before anyone else sees it, which means reviews argue about ideas instead of semicolons.',
    authority: 'DECIDE',
    authorityDetail:
      'Decides implementation detail within the laws. Cannot grant its own exceptions, waive gates, or expand scope — and that constraint is what makes its output trustworthy.',
    summonWhen: [
      'Any implementation work — it is the default when nothing more specific applies',
      'An agent starts substantial work — the plan it writes is this persona’s plan',
      'Steering files (CLAUDE.md / AGENTS.md) need authoring or pruning',
    ],
    ownedLaws: ['LAW-2.1', 'LAW-2.2', 'LAW-2.3', 'LAW-2.4', 'LAW-2.5', 'LAW-2.6', 'LAW-10.1', 'LAW-10.4'],
    invocation: '“Implement this as the Software Engineer persona — cite your laws.”',
  },
  {
    id: 'product-owner',
    name: 'Product Owner',
    tagline: '“Done” is defined here — before the first line.',
    pitch:
      'The most expensive feature is the one built three times: once as imagined, once as meant, once as needed. The PO persona blocks implementation until "done" is written down — and guards scope so the thing you ship is the thing everyone agreed to. It also cannot waive a single quality gate, which means deadline pressure stops at its desk.',
    authority: 'BLOCK',
    authorityDetail:
      'Blocks implementation lacking acceptance criteria; signs off scope changes. Explicitly cannot override testing, security, or review gates — deadlines never beat laws.',
    summonWhen: [
      'A ticket arrives whose body is its own title',
      '"While I’m here" additions appear in a diff',
      'Research needs framing or options need a prioritization decision',
    ],
    ownedLaws: ['LAW-8.1', 'LAW-8.4', 'LAW-10.6'],
    invocation: '“As Product Owner — is JIRA-3500 in scope, and what are the ACs?”',
  },
  {
    id: 'industry-sme',
    name: 'Industry SME',
    tagline: 'The domain has receipts.',
    pitch:
      'Five years from now, nobody will remember whether that 90-day threshold was a regulation, a client preference, or a bug that shipped. The SME persona makes domain logic citable: every business rule links to its documented source, every regulated code path lives on a compliance map. Domain truth by reference, not by memory.',
    authority: 'ADVISE',
    authorityDetail:
      'Advises on domain correctness; routes undocumented rules to the catalog before merge. Regulatory interpretation escalates to human compliance — always.',
    summonWhen: [
      'Domain logic lands without a cited business rule',
      'A change touches a compliance-mapped path (PCI, GDPR, HIPAA)',
      'Anyone says "I think the rule is…" about the client’s domain',
    ],
    ownedLaws: ['LAW-8.2', 'LAW-8.3'],
    invocation: '“SME persona: does this match BR-ACCT-014, and is the map current?”',
  },
  {
    id: 'devops',
    name: 'DevOps',
    tagline: 'The path to prod is paved — and reversible.',
    pitch:
      'DevOps owns the machinery that makes the constitution physical: the pipeline that cannot be bypassed, the rollback that was rehearsed before you needed it, the SLOs that turn reliability arguments into arithmetic. When the error budget runs out, releases stop — not because someone won an argument, but because everyone agreed before the incident.',
    authority: 'BLOCK',
    authorityDetail:
      'Blocks deploys without verified rollback plans, console-built infrastructure, and any PR that weakens a pipeline gate.',
    summonWhen: [
      'Anything touches CI/CD, infrastructure, environments, or releases',
      'SLOs and error budgets need defining or a freeze decision looms',
      'Agents run unattended — sandbox and allowlist review',
    ],
    ownedLaws: ['LAW-9.1', 'LAW-9.2', 'LAW-9.5', 'LAW-9.6', 'LAW-9.7'],
    invocation: '“DevOps persona: what’s the rollback story for this release?”',
  },
  {
    id: 'finops',
    name: 'FinOps',
    tagline: 'Every dollar has a name on it.',
    pitch:
      'Cloud spend is the only cost engineers commit in code and finance discovers on an invoice. FinOps puts the price tag on the PR — before merge, with numbers, next to alternatives. It blocks untagged resources and unvetted licenses, and it is explicitly subordinate to Security: a cheaper-but-exposed design is not an optimization.',
    authority: 'ADVISE',
    authorityDetail:
      'Advises with cost estimates; blocks untagged resources and unevaluated licenses. Subordinate to Security on CRITICAL/HIGH findings — by law, not by negotiation.',
    summonWhen: [
      'A new paid API, instance class, or storage-heavy design appears',
      'A dependency’s license is copyleft or unknown',
      'AI/compute budgets need an owner',
    ],
    ownedLaws: ['LAW-9.3', 'LAW-9.4'],
    invocation: '“FinOps persona: what does this enrichment API cost at our volume?”',
  },
];
