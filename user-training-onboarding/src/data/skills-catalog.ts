/**
 * Full catalog of the constitution's installable skills, grouped for the Learn
 * page. Command slugs match the skill directory / frontmatter name exactly, so
 * the namespaced invocation is `/engineering-constitution:<command>`.
 * Kept free of typed LawRefs deliberately — this catalog documents COMMANDS and
 * USAGE; the Personas page covers owned-law detail (and is integrity-tested).
 */
export type SkillCategory = 'Persona' | 'Orchestration' | 'Enforcement';

export interface CatalogSkill {
  /** Skill directory + frontmatter name; the part after the plugin namespace. */
  command: string;
  displayName: string;
  category: SkillCategory;
  /** One-line what-it-is. */
  summary: string;
  /** When it triggers / when to reach for it. */
  whenToUse: string;
  /** Natural-language ways to invoke it (work even without the slash command). */
  examples: string[];
}

/** The plugin namespace; full command is `/${PLUGIN_NAMESPACE}:${command}`. */
export const PLUGIN_NAMESPACE = 'engineering-constitution';

export const skillCatalog: CatalogSkill[] = [
  // ── Personas ──────────────────────────────────────────────────────────────
  {
    command: 'persona-security',
    displayName: 'Security',
    category: 'Persona',
    summary: 'Owns Article 5; holds VETO authority on CRITICAL findings — top of the authority ladder.',
    whenToUse:
      'Code touches authentication, authorization, user input, persistence, secrets, dependencies, or external APIs — or any security question or review.',
    examples: [
      '“Act as the Security persona and review this webhook handler.”',
      '“Put on the Security hat — is this query injectable?”',
    ],
  },
  {
    command: 'persona-architect',
    displayName: 'Architect',
    category: 'Persona',
    summary: 'Owns Article 4 + LAW-1.4; VETO on layer violations and circular dependencies; requires ADRs before significant structural merges.',
    whenToUse:
      'System design, module boundaries, design patterns, ADRs, significant refactors, or new services/dependencies.',
    examples: [
      '“Act as the Architect persona and review this module structure.”',
      '“As Architect — does this need an ADR before we merge?”',
    ],
  },
  {
    command: 'persona-quality',
    displayName: 'Quality',
    category: 'Persona',
    summary: 'Owns Article 3, LAW-6.1/6.2; BLOCKS merges below coverage floors; arbitrates “is this tested enough?”',
    whenToUse:
      'Test strategy, coverage decisions, defect analysis, review standards, mutation scores, or agent-output verification.',
    examples: [
      '“As the Quality persona, is this tested enough to merge?”',
      '“Quality persona: do these generated tests actually kill mutants?”',
    ],
  },
  {
    command: 'persona-software-engineer',
    displayName: 'Software Engineer',
    category: 'Persona',
    summary: 'Owns Article 2, executes LAW-3.1; the DEFAULT persona for implementation, working within every other persona’s constraints.',
    whenToUse:
      'Implementation work — writing or modifying application code, fixing bugs, building features — when no more specific persona applies.',
    examples: [
      '“Implement this as the Software Engineer persona — cite your laws.”',
      '“Build the feature; self-check against the constitution before showing me.”',
    ],
  },
  {
    command: 'persona-product-owner',
    displayName: 'Product Owner',
    category: 'Persona',
    summary: 'Owns LAW-8.1/8.4; BLOCKS implementation lacking acceptance criteria; cannot waive quality, security, or review gates.',
    whenToUse:
      'Requirements, scope decisions, acceptance criteria, prioritization, or “what should this do?” questions.',
    examples: [
      '“As Product Owner — is JIRA-3500 in scope, and what are the ACs?”',
      '“PO persona: write acceptance criteria for this request.”',
    ],
  },
  {
    command: 'persona-industry-sme',
    displayName: 'Industry SME',
    category: 'Persona',
    summary: 'Owns LAW-8.2/8.3; verifies code matches documented business rules and regulatory mappings (PCI, GDPR, HIPAA).',
    whenToUse:
      'Domain logic, business rules, industry calculations, or regulatory/compliance questions.',
    examples: [
      '“SME persona: does this match business rule BR-ACCT-014?”',
      '“As Industry SME — is this path on the PCI compliance map?”',
    ],
  },
  {
    command: 'persona-devops',
    displayName: 'DevOps',
    category: 'Persona',
    summary: 'Owns LAW-9.1/9.2/9.5–9.7; mechanically enforces LAW-6.2; BLOCKS deploys without a rollback plan.',
    whenToUse:
      'CI/CD pipelines, git hooks, infrastructure, deployment, environments, releases, SLOs, or error budgets.',
    examples: [
      '“DevOps persona: what’s the rollback story for this release?”',
      '“As DevOps — are our SLOs and error-budget policy defined?”',
    ],
  },
  {
    command: 'persona-finops',
    displayName: 'FinOps',
    category: 'Persona',
    summary: 'Owns LAW-9.3/9.4; blocks untagged resources and unevaluated licenses; explicitly subordinate to Security.',
    whenToUse:
      'Cloud cost, resource sizing, licensing decisions, paid APIs/services, or AI/compute budgets.',
    examples: [
      '“FinOps persona: what does this enrichment API cost at our volume?”',
      '“As FinOps — is this dependency’s license safe to adopt?”',
    ],
  },
  // ── Orchestration ─────────────────────────────────────────────────────────
  {
    command: 'workflow-orchestrator',
    displayName: 'Workflow Orchestrator',
    category: 'Orchestration',
    summary: 'Drives work through the six defined workflows, assuming the right persona at each stage and enforcing hard gates.',
    whenToUse:
      'Starting any nontrivial work item, running a named workflow, or reshaping a flow (“skip the architect stage”).',
    examples: [
      '“Run WF-FEATURE on TICKET-123.”',
      '“Run WF-BUG on this issue, but add an extra security pass.”',
    ],
  },
  {
    command: 'persona-council',
    displayName: 'Persona Council',
    category: 'Orchestration',
    summary: 'Convenes multiple personas for cross-cutting changes or conflicts; surfaces disagreements verbatim and applies the authority ladder.',
    whenToUse:
      'A new service, major refactor, or a dependency with combined cost + security + architecture implications — or when two personas conflict.',
    examples: [
      '“Convene the persona council on this new payments service.”',
      '“Security and FinOps disagree here — run the council.”',
    ],
  },
  {
    command: 'law-clerk',
    displayName: 'Law Clerk',
    category: 'Orchestration',
    summary: 'Looks up laws, answers “why does this law exist?”, and drafts amendments — never edits laws directly; routes through the amendment process.',
    whenToUse:
      'Looking up a law by ID or topic, understanding a law’s history, or proposing a change to the constitution.',
    examples: [
      '“Look up LAW-2.3 and tell me why it exists.”',
      '“Draft an amendment to relax the function-size threshold.”',
    ],
  },
  // ── Enforcement ───────────────────────────────────────────────────────────
  {
    command: 'constitution-enforcer',
    displayName: 'Constitution Enforcer',
    category: 'Enforcement',
    summary: 'Always-on enforcement for any code work; applies Articles 1–7 as hard rules and self-checks before presenting code.',
    whenToUse:
      'Writing, modifying, reviewing, or generating any code in a governed project — it runs in the background and corrects with citations.',
    examples: [
      '“Self-check this code against the constitution before I commit.”',
      '(Auto-activates on code work; flags violations with the law ID.)',
    ],
  },
  {
    command: 'tdd-assistant',
    displayName: 'TDD Assistant',
    category: 'Enforcement',
    summary: 'Enforces test-first development (Canon TDD); shows the failing test before implementation and cites LAW-3.1 when asked to “just write the code.”',
    whenToUse: 'Implementing any feature or bugfix — to keep the red → green → refactor discipline.',
    examples: [
      '“Use TDD for this — show me the failing test first.”',
      '(Pushes back, citing LAW-3.1, on “skip the tests, just ship it.”)',
    ],
  },
  {
    command: 'code-review-assistant',
    displayName: 'Code Review Assistant',
    category: 'Enforcement',
    summary: 'Runs the article-organized review checklist; every verdict cites a law, and AI-generated code gets the verify-never-assume lens (LAW-7.4).',
    whenToUse: 'Reviewing a pull request, diff, or change — human-authored or AI-generated.',
    examples: [
      '“Review this PR against the constitution.”',
      '“Code-review this diff in a fresh context and report gaps.”',
    ],
  },
  {
    command: 'security-checker',
    displayName: 'Security Checker',
    category: 'Enforcement',
    summary: 'A focused Article 5 pass — injection surfaces, secrets, auth, dependency risk, encryption — outputting cited findings with severities.',
    whenToUse:
      'A quick security scan of code, a diff, or a dependency change. (For veto decisions, assume the Security persona itself.)',
    examples: [
      '“Run a security check over this diff.”',
      '“Scan this for SQL injection and secret leakage.”',
    ],
  },
  {
    command: 'documentation-generator',
    displayName: 'Documentation Generator',
    category: 'Enforcement',
    summary: 'Enforces the documentation laws — JSDoc on public APIs, WHY-comments, same-PR doc updates — and generates ADRs per LAW-4.5.',
    whenToUse: 'Writing or updating docs, documenting a public API, or producing an ADR.',
    examples: [
      '“Generate JSDoc for this module’s public functions.”',
      '“Draft an ADR for the caching decision we just made.”',
    ],
  },
  {
    command: 'ai-transparency',
    displayName: 'AI Transparency',
    category: 'Enforcement',
    summary: 'Enforces AI provenance (LAW-7.1–7.3) — the [Claude-assisted] commit tag, the PR AI-assistance disclosure, and data-protection checks.',
    whenToUse: 'Committing or opening a PR for AI-assisted work, or questions about AI tool usage and data exposure.',
    examples: [
      '“Write the AI-assistance disclosure for this PR.”',
      '“Tag this commit correctly — Claude wrote most of it.”',
    ],
  },
];
