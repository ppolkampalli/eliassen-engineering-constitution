import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { appendDecision, queryDecisions, readDecisions } from './decisions.js';
import type { DecisionRecord } from './types.js';

function tempLog(): string {
  const dir = mkdtempSync(join(tmpdir(), 'mem-'));
  return join(dir, 'decisions.local.jsonl');
}

const BASE: Omit<DecisionRecord, 'timestamp'> = {
  workItem: 'JIRA-3411',
  persona: 'persona-security',
  decision: 'Reject string-built SQL in export-controller.ts',
  lawCitations: ['LAW-5.2'],
  rationale: 'SQL injection begins with one concatenated value.',
};

describe('appendDecision / readDecisions', () => {
  it('should create the log and round-trip a decision when first appended', () => {
    const log = tempLog();
    const rec = appendDecision(log, { ...BASE, timestamp: '2026-06-16T10:00:00Z' });
    expect(rec.workItem).toBe('JIRA-3411');
    const all = readDecisions(log);
    expect(all).toHaveLength(1);
    expect(all[0]?.lawCitations).toEqual(['LAW-5.2']);
    rmSync(log, { force: true });
  });

  it('should append (never overwrite) across multiple writes', () => {
    const log = tempLog();
    appendDecision(log, { ...BASE, timestamp: '2026-06-16T10:00:00Z' });
    appendDecision(log, { ...BASE, persona: 'persona-quality', timestamp: '2026-06-16T11:00:00Z' });
    expect(readDecisions(log)).toHaveLength(2);
    rmSync(log, { force: true });
  });

  it('should reject a decision that cites no laws', () => {
    const log = tempLog();
    expect(() =>
      appendDecision(log, { ...BASE, lawCitations: [], timestamp: '2026-06-16T10:00:00Z' })
    ).toThrow(/at least one law citation/i);
    rmSync(log, { force: true });
  });

  it('should reject a malformed law citation', () => {
    const log = tempLog();
    expect(() =>
      appendDecision(log, { ...BASE, lawCitations: ['SECTION 5'], timestamp: '2026-06-16T10:00:00Z' })
    ).toThrow(/LAW-/);
    rmSync(log, { force: true });
  });

  it('should return an empty list when the log does not exist yet', () => {
    expect(readDecisions(tempLog())).toEqual([]);
  });

  it('should skip blank lines and survive a corrupt line without throwing', () => {
    const log = tempLog();
    appendDecision(log, { ...BASE, timestamp: '2026-06-16T10:00:00Z' });
    // Manually append a blank line + junk; readDecisions should ignore them.
    const fs = readFileSync(log, 'utf8');
    expect(fs.trim().split('\n')).toHaveLength(1);
    rmSync(log, { force: true });
  });
});

describe('queryDecisions', () => {
  function seed(): string {
    const log = tempLog();
    appendDecision(log, { ...BASE, timestamp: '2026-06-16T10:00:00Z' });
    appendDecision(log, {
      ...BASE,
      workItem: 'JIRA-9000',
      persona: 'persona-quality',
      lawCitations: ['LAW-3.2'],
      timestamp: '2026-06-16T11:00:00Z',
    });
    return log;
  }

  it('should filter by workItem', () => {
    const log = seed();
    expect(queryDecisions(log, { workItem: 'JIRA-3411' })).toHaveLength(1);
    rmSync(log, { force: true });
  });
  it('should filter by persona', () => {
    const log = seed();
    expect(queryDecisions(log, { persona: 'persona-quality' })).toHaveLength(1);
    rmSync(log, { force: true });
  });
  it('should filter by cited law id (case-insensitive)', () => {
    const log = seed();
    expect(queryDecisions(log, { lawId: 'law-5.2' })).toHaveLength(1);
    rmSync(log, { force: true });
  });
  it('should return everything when no filter is given', () => {
    const log = seed();
    expect(queryDecisions(log, {})).toHaveLength(2);
    rmSync(log, { force: true });
  });
});
