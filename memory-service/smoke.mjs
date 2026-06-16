// End-to-end smoke test: spawn the built stdio server via the MCP client,
// list tools, exercise a read and a governed write. Run: node smoke.mjs
// (after `npm run build`). Exits non-zero on any failure.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const log = join(mkdtempSync(join(tmpdir(), 'mem-smoke-')), 'decisions.local.jsonl');
const assert = (cond, msg) => {
  if (!cond) {
    console.error('FAIL:', msg);
    process.exit(1);
  }
  console.log('ok  -', msg);
};

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/server.js'],
  env: { ...process.env, MEMORY_LOG_PATH: log },
});
const client = new Client({ name: 'smoke', version: '1.0.0' });

try {
  await client.connect(transport);

  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  assert(names.length === 6, `exposes 6 tools (got ${names.length}: ${names.join(', ')})`);
  for (const expected of [
    'look_up_law',
    'list_laws',
    'get_workflow',
    'get_amendment_history',
    'query_decisions',
    'record_decision',
  ]) {
    assert(names.includes(expected), `tool present: ${expected}`);
  }

  const law = await client.callTool({ name: 'look_up_law', arguments: { query: 'LAW-5.2' } });
  assert(law.content[0].text.includes('Parameterized Queries'), 'look_up_law returns LAW-5.2 record');

  const wf = await client.callTool({ name: 'get_workflow', arguments: { id: 'WF-FEATURE' } });
  assert(wf.content[0].text.includes('New Feature Development'), 'get_workflow returns WF-FEATURE');

  // Schema guard: zod min(1) blocks a citation-less decision at the protocol layer.
  let schemaBlocked = false;
  try {
    await client.callTool({
      name: 'record_decision',
      arguments: {
        workItem: 'SMOKE-1',
        persona: 'persona-security',
        decision: 'no citation',
        lawCitations: [],
        rationale: 'x',
      },
    });
  } catch {
    schemaBlocked = true;
  }
  assert(schemaBlocked, 'record_decision schema rejects a citation-less decision (min 1)');

  // Handler guard: a present-but-malformed citation passes the schema, fails the LAW-ID check.
  const bad = await client.callTool({
    name: 'record_decision',
    arguments: {
      workItem: 'SMOKE-1',
      persona: 'persona-security',
      decision: 'bad citation form',
      lawCitations: ['SECTION 5'],
      rationale: 'x',
    },
  });
  assert(/malformed law citation/i.test(bad.content[0].text), 'record_decision rejects a malformed citation');

  const good = await client.callTool({
    name: 'record_decision',
    arguments: {
      workItem: 'SMOKE-1',
      persona: 'persona-security',
      decision: 'Reject string-built SQL',
      lawCitations: ['LAW-5.2'],
      rationale: 'SQL injection begins with one concatenated value.',
    },
  });
  assert(good.content[0].text.includes('Recorded decision'), 'record_decision appends a cited decision');

  const q = await client.callTool({ name: 'query_decisions', arguments: { workItem: 'SMOKE-1' } });
  assert(q.content[0].text.includes('SMOKE-1'), 'query_decisions reads the appended decision back');

  console.log('\nSMOKE PASS — 6 tools, read + governed write verified end to end.');
  await client.close();
  rmSync(log, { force: true });
  process.exit(0);
} catch (error) {
  console.error('SMOKE ERROR:', error);
  process.exit(1);
}
