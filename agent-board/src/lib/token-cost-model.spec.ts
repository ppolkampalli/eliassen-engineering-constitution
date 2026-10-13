import { deriveWorkItems } from './board-model';
import {
  aggregateCostReport,
  attributeUsageToWorkItems,
  formatUsd,
  parseUsageRecords,
  priceRecord,
  type AttributedUsageRecord,
  type PricedUsageRecord,
  type PriceTable,
} from './token-cost-model';
import type { StageEvent, WorkflowCompletedEvent, WorkflowSelectedEvent } from './types';

function usageLine(overrides: Partial<{ timestamp: string; sessionId: string; role: string; model: string; usage: Record<string, unknown> }> = {}): string {
  const base = {
    timestamp: '2026-10-13T10:00:00.000Z',
    sessionId: 's1',
    role: 'assistant',
    model: 'claude-sonnet-5',
    usage: {
      input_tokens: 10,
      output_tokens: 5,
      cache_read_input_tokens: 2,
      cache_creation_input_tokens: 7,
      cache_creation: { ephemeral_5m_input_tokens: 6, ephemeral_1h_input_tokens: 1 },
    },
    ...overrides,
  };
  return JSON.stringify({
    timestamp: base.timestamp,
    sessionId: base.sessionId,
    message: { role: base.role, model: base.model, usage: base.usage },
  });
}

describe('parseUsageRecords', () => {
  it('extracts a usage record from a well-formed assistant line, preferring the split cache_creation object', () => {
    expect(parseUsageRecords([usageLine()])).toEqual([
      {
        timestamp: '2026-10-13T10:00:00.000Z',
        sessionId: 's1',
        model: 'claude-sonnet-5',
        inputTokens: 10,
        outputTokens: 5,
        cacheWrite5mTokens: 6,
        cacheWrite1hTokens: 1,
        cacheReadTokens: 2,
      },
    ]);
  });

  it('falls back to the flat cache_creation_input_tokens field as a 5m write when no split object is present', () => {
    const line = usageLine({ usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 9 } });
    const [record] = parseUsageRecords([line]);
    expect(record).toMatchObject({ cacheWrite5mTokens: 9, cacheWrite1hTokens: 0 });
  });

  it('skips a user-role message', () => {
    expect(parseUsageRecords([usageLine({ role: 'user' })])).toEqual([]);
  });

  it('skips an assistant line with no usage object', () => {
    const line = JSON.stringify({ timestamp: 't', sessionId: 's1', message: { role: 'assistant', model: 'm' } });
    expect(parseUsageRecords([line])).toEqual([]);
  });

  it('skips a line missing timestamp, sessionId, or model', () => {
    const missingTimestamp = JSON.stringify({ sessionId: 's1', message: { role: 'assistant', model: 'm', usage: { input_tokens: 1 } } });
    const missingSessionId = JSON.stringify({ timestamp: 't', message: { role: 'assistant', model: 'm', usage: { input_tokens: 1 } } });
    const missingModel = JSON.stringify({ timestamp: 't', sessionId: 's1', message: { role: 'assistant', usage: { input_tokens: 1 } } });
    expect(parseUsageRecords([missingTimestamp, missingSessionId, missingModel])).toEqual([]);
  });

  it('skips malformed JSON and blank lines without throwing', () => {
    expect(parseUsageRecords(['not json', '', '   '])).toEqual([]);
  });

  it('defaults a missing numeric usage field to 0', () => {
    const line = usageLine({ usage: { input_tokens: 5 } });
    const [record] = parseUsageRecords([line]);
    expect(record).toMatchObject({ outputTokens: 0, cacheReadTokens: 0 });
  });

  it('skips a line whose top-level value is not a JSON object', () => {
    expect(parseUsageRecords(['42', '"a string"'])).toEqual([]);
  });

  it('returns an empty list for no lines', () => {
    expect(parseUsageRecords([])).toEqual([]);
  });
});

describe('attributeUsageToWorkItems', () => {
  const selected: WorkflowSelectedEvent = {
    schemaVersion: '1.0',
    timestamp: '2026-10-13T10:00:00.000Z',
    eventType: 'workflowSelected',
    workItem: 'JIRA-1',
    workflowId: 'WF-BUG',
  };
  const stageFix: StageEvent = {
    schemaVersion: '1.0',
    timestamp: '2026-10-13T10:05:00.000Z',
    eventType: 'stageEvent',
    workItem: 'JIRA-1',
    workflowId: 'WF-BUG',
    stageId: 'fix',
    persona: 'persona-software-engineer',
    status: 'entered',
    humanCheckpoint: 'none',
  };
  const stageVerify: StageEvent = {
    schemaVersion: '1.0',
    timestamp: '2026-10-13T10:10:00.000Z',
    eventType: 'stageEvent',
    workItem: 'JIRA-1',
    workflowId: 'WF-BUG',
    stageId: 'verify',
    persona: 'persona-quality',
    status: 'entered',
    humanCheckpoint: 'none',
  };

  function makeUsage(timestamp: string): AttributedUsageRecord {
    return {
      timestamp,
      sessionId: 's1',
      model: 'claude-sonnet-5',
      inputTokens: 1,
      outputTokens: 1,
      cacheWrite5mTokens: 0,
      cacheWrite1hTokens: 0,
      cacheReadTokens: 0,
      workItem: null,
      workflowId: null,
      stageId: null,
      persona: null,
    };
  }

  it('leaves a record before the first event of any work item unattributed', () => {
    const workItems = deriveWorkItems([selected, stageFix, stageVerify]);
    const [result] = attributeUsageToWorkItems([makeUsage('2026-10-13T09:59:00.000Z')], workItems);
    expect(result).toMatchObject({ workItem: null, workflowId: null, stageId: null, persona: null });
  });

  it('attributes a record in the gap between workflowSelected and the first stage to the workflow with no stage/persona yet', () => {
    const workItems = deriveWorkItems([selected, stageFix, stageVerify]);
    const [result] = attributeUsageToWorkItems([makeUsage('2026-10-13T10:02:00.000Z')], workItems);
    expect(result).toMatchObject({ workItem: 'JIRA-1', workflowId: 'WF-BUG', stageId: null, persona: null });
  });

  it('attributes a record during a stage window to that stage and persona', () => {
    const workItems = deriveWorkItems([selected, stageFix, stageVerify]);
    const [result] = attributeUsageToWorkItems([makeUsage('2026-10-13T10:07:00.000Z')], workItems);
    expect(result).toMatchObject({ workItem: 'JIRA-1', stageId: 'fix', persona: 'persona-software-engineer' });
  });

  it('attributes a record after the last event to that last stage when the item is still in progress', () => {
    const workItems = deriveWorkItems([selected, stageFix, stageVerify]);
    const [result] = attributeUsageToWorkItems([makeUsage('2026-10-13T10:20:00.000Z')], workItems);
    expect(result).toMatchObject({ workItem: 'JIRA-1', stageId: 'verify', persona: 'persona-quality' });
  });

  it('does not attribute anything after a work item has completed', () => {
    const completed: WorkflowCompletedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-13T10:15:00.000Z',
      eventType: 'workflowCompleted',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
    };
    const workItems = deriveWorkItems([selected, stageFix, stageVerify, completed]);
    const [result] = attributeUsageToWorkItems([makeUsage('2026-10-13T10:30:00.000Z')], workItems);
    expect(result).toMatchObject({ workItem: null, workflowId: null, stageId: null, persona: null });
  });

  it('leaves a record unattributed when it falls inside more than one work item window (ambiguous)', () => {
    const otherSelected: WorkflowSelectedEvent = { ...selected, workItem: 'JIRA-2', timestamp: '2026-10-13T09:00:00.000Z' };
    const workItems = deriveWorkItems([selected, stageFix, stageVerify, otherSelected]);
    const [result] = attributeUsageToWorkItems([makeUsage('2026-10-13T10:07:00.000Z')], workItems);
    expect(result).toMatchObject({ workItem: null, workflowId: null, stageId: null, persona: null });
  });

  it('returns an empty list for no records', () => {
    expect(attributeUsageToWorkItems([], new Map())).toEqual([]);
  });

  it('tags a window opened by a deviation event with its stageId but no persona', () => {
    const deviation = {
      schemaVersion: '1.0',
      timestamp: '2026-10-13T10:06:00.000Z',
      eventType: 'deviation' as const,
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      stageId: 'fix',
      deviationStatus: 'applied' as const,
      reason: 'minor',
    };
    const workItems = deriveWorkItems([selected, stageFix, deviation, stageVerify]);
    const [result] = attributeUsageToWorkItems([makeUsage('2026-10-13T10:08:00.000Z')], workItems);
    expect(result).toMatchObject({ stageId: 'fix', persona: null });
  });
});

describe('priceRecord', () => {
  const attributed: AttributedUsageRecord = {
    timestamp: 't',
    sessionId: 's1',
    model: 'claude-sonnet-5',
    inputTokens: 1_000_000,
    outputTokens: 1_000_000,
    cacheWrite5mTokens: 1_000_000,
    cacheWrite1hTokens: 1_000_000,
    cacheReadTokens: 1_000_000,
    workItem: null,
    workflowId: null,
    stageId: null,
    persona: null,
  };
  const priceTable: PriceTable = {
    'claude-sonnet-5': { input: 2, cacheWrite5m: 2.5, cacheWrite1h: 4, cacheRead: 0.2, output: 10 },
  };

  it('computes cost from per-million-token rates', () => {
    expect(priceRecord(attributed, priceTable).costUsd).toBeCloseTo(2 + 2.5 + 4 + 0.2 + 10);
  });

  it('prices an unrecognized model as null, not zero', () => {
    expect(priceRecord({ ...attributed, model: 'unknown-model' }, priceTable).costUsd).toBeNull();
  });
});

describe('aggregateCostReport', () => {
  function makePriced(overrides: Partial<PricedUsageRecord>): PricedUsageRecord {
    return {
      timestamp: '2026-10-13T10:00:00.000Z',
      sessionId: 's1',
      model: 'claude-sonnet-5',
      inputTokens: 0,
      outputTokens: 0,
      cacheWrite5mTokens: 0,
      cacheWrite1hTokens: 0,
      cacheReadTokens: 0,
      workItem: null,
      workflowId: null,
      stageId: null,
      persona: null,
      costUsd: 0,
      ...overrides,
    };
  }

  it('sums totals, groups by dimension with an unattributed bucket, and buckets the time series by hour', () => {
    const records = [
      makePriced({ workItem: 'JIRA-1', workflowId: 'WF-BUG', stageId: 'fix', persona: 'persona-software-engineer', costUsd: 1.5 }),
      makePriced({ costUsd: 0.5 }),
      makePriced({ workItem: 'JIRA-1', workflowId: 'WF-BUG', stageId: 'fix', persona: 'persona-software-engineer', model: 'unknown-model', costUsd: null }),
      makePriced({ timestamp: '2026-10-13T11:15:00.000Z', costUsd: 3 }),
    ];

    const report = aggregateCostReport(records);

    expect(report.totalCostUsd).toBeCloseTo(5);
    expect(report.unpricedRecordCount).toBe(1);
    expect(report.unattributedRecordCount).toBe(2);
    expect(report.byWorkItem).toEqual([
      { key: 'unattributed', count: 3.5 },
      { key: 'JIRA-1', count: 1.5 },
    ]);
    expect(report.byModel).toEqual([
      { key: 'claude-sonnet-5', count: 5 },
      { key: 'unknown-model', count: 0 },
    ]);
    expect(report.timeSeries).toEqual([
      { bucketStart: '2026-10-13T10:00:00.000Z', costUsd: 2 },
      { bucketStart: '2026-10-13T11:00:00.000Z', costUsd: 3 },
    ]);
  });

  it('sorts equal-cost buckets by key ascending', () => {
    const records = [
      makePriced({ workItem: 'JIRA-2', workflowId: 'WF-BUG', costUsd: 1 }),
      makePriced({ workItem: 'JIRA-1', workflowId: 'WF-BUG', costUsd: 1 }),
    ];
    expect(aggregateCostReport(records).byWorkItem).toEqual([
      { key: 'JIRA-1', count: 1 },
      { key: 'JIRA-2', count: 1 },
    ]);
  });

  it('returns a zeroed report for no records', () => {
    expect(aggregateCostReport([])).toEqual({
      totalCostUsd: 0,
      unpricedRecordCount: 0,
      unattributedRecordCount: 0,
      byWorkItem: [],
      byWorkflow: [],
      byStage: [],
      byPersona: [],
      byModel: [],
      timeSeries: [],
    });
  });
});

describe('formatUsd', () => {
  it('shows exactly $0.00 for zero', () => {
    expect(formatUsd(0)).toBe('$0.00');
  });

  it('keeps 4 decimal places for a positive sub-cent amount', () => {
    expect(formatUsd(0.0001902)).toBe('$0.0002');
  });

  it('shows 2 decimal places for a cent or more', () => {
    expect(formatUsd(1.5)).toBe('$1.50');
    expect(formatUsd(1234.5)).toBe('$1234.50');
  });
});
