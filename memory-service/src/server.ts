#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { formatCitation, formatLawRecord } from './citation.js';
import { appendDecision, queryDecisions } from './decisions.js';
import { resolvePaths } from './paths.js';
import {
  getAmendmentsForLaw,
  getWorkflow,
  listLaws,
  loadLawRegistry,
  loadWorkflowRegistry,
  searchLaws,
} from './registry.js';
import type { DecisionRecord } from './types.js';

const paths = resolvePaths(process.env);

/** Wrap a string payload as an MCP text result. */
function text(payload: string): { content: { type: 'text'; text: string }[] } {
  return { content: [{ type: 'text', text: payload }] };
}

const server = new McpServer(
  { name: 'constitution-memory', version: '1.2.0' },
  {
    instructions:
      'Central Memory Service for the Engineering Constitution. Before acting, look_up_law / query_decisions to ground your work in the shared memory; after deciding, record_decision with a law citation. Laws are read-only here — propose changes through the amendment process, not this server.',
  }
);

// ── Read the laws ───────────────────────────────────────────────────────────
server.registerTool(
  'look_up_law',
  {
    description:
      'Look up a constitution law by exact ID (e.g. "LAW-5.2") or by topic keyword (e.g. "secrets", "mutation"). Returns the full law record with its quotable citation. Use before making any decision a law might govern.',
    inputSchema: { query: z.string().describe('A law ID like LAW-5.2, or a topic keyword.') },
    annotations: { readOnlyHint: true },
  },
  ({ query }) => {
    const registry = loadLawRegistry(paths.lawRegistry);
    const matches = searchLaws(registry, query);
    if (matches.length === 0) return text(`No law matches "${query}".`);
    if (matches.length === 1 && matches[0] !== undefined) return text(formatLawRecord(matches[0]));
    const lines = matches.map((law) => `${law.id} (v${law.version}) — ${law.title}`);
    return text(`${matches.length} laws match "${query}":\n${lines.join('\n')}`);
  }
);

server.registerTool(
  'list_laws',
  {
    description:
      'List every law, or just those in one article. Returns ID, version, title, and owners — the index an agent skims to find the right law.',
    inputSchema: { article: z.number().int().min(1).max(99).optional().describe('Article number, e.g. 5.') },
    annotations: { readOnlyHint: true },
  },
  ({ article }) => {
    const registry = loadLawRegistry(paths.lawRegistry);
    const laws = listLaws(registry, article);
    const lines = laws.map(
      (law) => `${law.id} (v${law.version}) — ${law.title} [${law.owner_personas.join(', ')}]`
    );
    return text(
      `${laws.length} laws (constitution v${registry.constitution_version}):\n${lines.join('\n')}`
    );
  }
);

server.registerTool(
  'get_workflow',
  {
    description:
      'Get a workflow definition by ID (e.g. "WF-FEATURE"), or list all workflows when no ID is given. Use to know which persona owns each stage and where the hard gates are.',
    inputSchema: { id: z.string().optional().describe('Workflow ID like WF-FEATURE; omit to list all.') },
    annotations: { readOnlyHint: true },
  },
  ({ id }) => {
    const registry = loadWorkflowRegistry(paths.workflowRegistry);
    if (id === undefined) {
      const lines = registry.workflows.map((w) => `${w.id} — ${w.title}: ${w.trigger}`);
      return text(`${registry.workflows.length} workflows:\n${lines.join('\n')}`);
    }
    const workflow = getWorkflow(registry, id);
    if (workflow === undefined) return text(`No workflow "${id}".`);
    return text(
      `${workflow.id} (v${workflow.version}) — ${workflow.title}\nWhen: ${workflow.trigger}\nChain: ${workflow.chain}\nFile: ${workflow.file}`
    );
  }
);

server.registerTool(
  'get_amendment_history',
  {
    description:
      'Return the amendment IDs recorded on a law — answers "why does this law say this, and what changed?" Pair with the amendment records for full rationale.',
    inputSchema: { lawId: z.string().describe('A law ID like LAW-2.6.') },
    annotations: { readOnlyHint: true },
  },
  ({ lawId }) => {
    const registry = loadLawRegistry(paths.lawRegistry);
    const amendments = getAmendmentsForLaw(registry, lawId);
    if (amendments.length === 0) return text(`No amendments recorded for "${lawId}" (or unknown law).`);
    return text(`${lawId} amendment history: ${amendments.join(', ')}`);
  }
);

// ── Read prior decisions ────────────────────────────────────────────────────
server.registerTool(
  'query_decisions',
  {
    description:
      'Query the shared decision log by work item, persona, and/or cited law ID (all optional). Use to check whether something has already been decided before re-deciding it.',
    inputSchema: {
      workItem: z.string().optional().describe('Ticket/PR id, e.g. JIRA-3411.'),
      persona: z.string().optional().describe('Persona id, e.g. persona-security.'),
      lawId: z.string().optional().describe('A cited law id, e.g. LAW-5.2.'),
    },
    annotations: { readOnlyHint: true },
  },
  ({ workItem, persona, lawId }) => {
    const matches = queryDecisions(paths.decisionLog, { workItem, persona, lawId });
    if (matches.length === 0) return text('No matching decisions in the log.');
    const lines = matches.map(
      (d) => `[${d.timestamp}] ${d.persona} on ${d.workItem}: ${d.decision} (${d.lawCitations.join(', ')})`
    );
    return text(`${matches.length} decision(s):\n${lines.join('\n')}`);
  }
);

// ── Append a cited decision (the only write path agents have) ────────────────
server.registerTool(
  'record_decision',
  {
    description:
      'Append a cited decision to the shared memory. Every decision MUST cite at least one law (LAW-X.Y). This is how an agent makes its reasoning durable and auditable for the others. Laws themselves are read-only — use the amendment process to change a law.',
    inputSchema: {
      workItem: z.string().describe('Ticket/PR this decision belongs to.'),
      persona: z.string().describe('The persona making the decision, e.g. persona-security.'),
      decision: z.string().describe('The decision, stated plainly.'),
      lawCitations: z.array(z.string()).min(1).describe('Law IDs cited, e.g. ["LAW-5.2"].'),
      rationale: z.string().describe("The law's rationale, applied to this case."),
    },
    annotations: { readOnlyHint: false, idempotentHint: false },
  },
  ({ workItem, persona, decision, lawCitations, rationale }) => {
    const record: DecisionRecord = {
      timestamp: new Date().toISOString(),
      workItem,
      persona,
      decision,
      lawCitations,
      rationale,
    };
    try {
      appendDecision(paths.decisionLog, record);
    } catch (error) {
      return text(`Rejected: ${error instanceof Error ? error.message : String(error)}`);
    }
    // Echo the canonical citation form so the agent can paste it into the PR.
    const registry = loadLawRegistry(paths.lawRegistry);
    const cited = lawCitations
      .map((id) => registry.laws.find((law) => law.id.toLowerCase() === id.toLowerCase()))
      .filter((law): law is NonNullable<typeof law> => law !== undefined)
      .map(formatCitation);
    return text(
      `Recorded decision on ${workItem} by ${persona}.\n${cited.join('\n')}`.trim()
    );
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  process.stderr.write(`constitution-memory failed to start: ${String(error)}\n`);
  process.exit(1);
});
