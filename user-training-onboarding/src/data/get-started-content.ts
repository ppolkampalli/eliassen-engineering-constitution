import type { LawRef, WorkflowRef } from './content-types';

/**
 * The step-by-step "new development" walkthrough for the Start Here page.
 * Law/workflow refs are validated against the live registries by
 * marketing-content.spec.ts.
 */
export interface StartStep {
  id: string;
  title: string;
  /** The sell: why this step pays off, in 1–3 sentences. */
  narrative: string;
  /** Terminal commands shown in a console block (empty = no commands). */
  commands: string[];
  /** What you should see / what "done" looks like for this step. */
  checkpoint: string;
  lawRefs: LawRef[];
  workflowRefs?: WorkflowRef[];
}

export const startSteps: StartStep[] = [
  {
    id: 'install',
    title: 'Install the constitution into your project',
    narrative:
      'One command delivers the whole kit: lint/type/test configs, the pre-commit hook, CI workflows, the PR template, eight personas, every enforcement skill, both agent steering files, and the full law registry for offline citation. No meetings about coding standards. Ever. (Want just the personas and skills to develop with — not the full stack? Install the Claude Code plugin instead, second command below.)',
    commands: [
      'git clone <engineering-constitution-repo>',
      './engineering-constitution/scripts/install.sh /path/to/your-project',
      '# — or, for the agentic layer only, inside Claude Code —',
      '/plugin marketplace add ppolkampalli/eliassen-engineering-constitution',
      '/plugin install engineering-constitution',
    ],
    checkpoint: 'install.sh reports ~36 files installed; or the plugin shows 17 skills available.',
    lawRefs: ['LAW-1.3'],
  },
  {
    id: 'wire',
    title: 'Wire the gates',
    narrative:
      'Add the printed devDependencies and scripts, then activate the hook. From this moment, lint, type-check, and tests run before every commit — the gates are physics now, not policy.',
    commands: [
      'npm install --save-dev typescript prettier eslint jest ts-jest husky lint-staged \\',
      '  @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import \\',
      '  eslint-import-resolver-typescript eslint-config-prettier @types/jest',
      'npm run prepare',
    ],
    checkpoint: 'A commit with a type error is rejected by the hook, citing the law it broke.',
    lawRefs: ['LAW-6.2', 'LAW-2.3'],
  },
  {
    id: 'verify-install',
    title: 'Prove the installation',
    narrative:
      'Trust, but verify — the constitution’s own habit, applied to itself. The validator runs ~25 checks: configs present, strict flags intact, hook executable, registry in sync with the source repo.',
    commands: ['./engineering-constitution/scripts/validate.sh /path/to/your-project'],
    checkpoint: 'RESULT: PASS. Anything else tells you exactly which file to fix.',
    lawRefs: ['LAW-1.3'],
  },
  {
    id: 'steering',
    title: 'Meet your steering files',
    narrative:
      'CLAUDE.md and AGENTS.md are now in your repo root — the rules every coding agent reads at session start. Treat them like code: keep them lean, prune what the agent already does right, and move any must-always-hold rule into a hook instead of prose.',
    commands: [],
    checkpoint:
      'Open CLAUDE.md — your agent now cites laws, declares workflows, and stops to ask instead of guessing.',
    lawRefs: ['LAW-10.4', 'LAW-7.5'],
  },
  {
    id: 'first-ticket',
    title: 'Pick up your first ticket — and declare the workflow',
    narrative:
      'Say it out loud: "run WF-FEATURE on TICKET-123." The orchestrator announces the chain — PO writes acceptance criteria, Architect places the work, Quality writes the test list, you (or your agent) implement, fresh-context review, security pass, release check. No stage gets forgotten, because the sequence is declared, not remembered.',
    commands: [
      '# In your agent session — natural language:',
      '“Run WF-FEATURE on TICKET-123”',
      '# — or the explicit skill command —',
      '/engineering-constitution:workflow-orchestrator',
    ],
    checkpoint:
      'The orchestrator prints the stage chain with hard markers before any code is written.',
    lawRefs: ['LAW-10.6', 'LAW-8.1'],
    workflowRefs: ['WF-FEATURE'],
  },
  {
    id: 'build',
    title: 'Build test-first — with evidence',
    narrative:
      'The test list comes from the acceptance criteria; implementation makes one failing test pass at a time. Agents work the same loop and must show the receipts: test output, not "should work." A failing test is never deleted to reach green — by law.',
    commands: ['npm test -- --watch', '# agent: “show the failing test, then make it pass”'],
    checkpoint: 'Every behavior in the ACs has a named test; the agent’s last message includes test output.',
    lawRefs: ['LAW-3.1', 'LAW-10.2'],
  },
  {
    id: 'ship',
    title: 'Review fresh, gate hard, ship tagged',
    narrative:
      'A context that did not write the code reviews it. Gates run green — there is no override path to argue about. AI-assisted commits carry the [Claude-assisted] tag and the PR says what the human verified. Then it ships, with a rollback path that already exists.',
    commands: [
      'npm run lint && npm run type-check && npm test',
      'git commit -m "feat: TICKET-123 export endpoint [Claude-assisted]"',
    ],
    checkpoint: 'Two human approvals, green gates, AI disclosure complete — merge.',
    lawRefs: ['LAW-10.5', 'LAW-6.2', 'LAW-7.3', 'LAW-9.2'],
  },
  {
    id: 'when-stuck',
    title: 'When you’re unsure — look it up, or ask',
    narrative:
      'Every rule has an ID, a rationale, and a lookup tool; every judgment call has a persona; every conflict has an escalation path. You are never arguing against a vibe — you are reading a law, or summoning the persona that owns it.',
    commands: [
      './engineering-constitution/scripts/law-lookup.sh LAW-2.3',
      '# or, with the plugin: “as the Quality persona, is this tested enough?”',
      '# or explicitly: /engineering-constitution:persona-quality',
    ],
    checkpoint: 'You cited a law in a review comment and nobody argued. Welcome aboard.',
    lawRefs: ['LAW-7.5'],
  },
];
