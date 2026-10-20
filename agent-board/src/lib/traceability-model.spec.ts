import { deriveWorkItems } from './board-model';
import { buildTraceabilityMatrix, latestAcceptanceCriteria, mergedTestResults, mostRecentWorkItemId } from './traceability-model';
import type { BoardEvent, StageEvent } from './types';

function stageEvent(overrides: Partial<StageEvent> & Pick<StageEvent, 'workItem' | 'timestamp'>): StageEvent {
  return {
    schemaVersion: '1.0',
    eventType: 'stageEvent',
    workflowId: 'WF-FEATURE',
    stageId: 'requirements',
    persona: 'product-owner',
    status: 'entered',
    humanCheckpoint: 'none',
    ...overrides,
  };
}

describe('latestAcceptanceCriteria', () => {
  it('returns an empty list when no event carries acceptanceCriteria', () => {
    const events: BoardEvent[] = [stageEvent({ workItem: 'JIRA-1', timestamp: '2026-01-01T00:00:00Z' })];
    expect(latestAcceptanceCriteria(events)).toEqual([]);
  });

  it('returns the most recently declared set, not an earlier one', () => {
    const events: BoardEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        acceptanceCriteria: [{ id: 'AC-1', text: 'old' }],
      }),
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-02T00:00:00Z',
        acceptanceCriteria: [
          { id: 'AC-1', text: 'new' },
          { id: 'AC-2', text: 'second' },
        ],
      }),
    ];
    expect(latestAcceptanceCriteria(events)).toEqual([
      { id: 'AC-1', text: 'new' },
      { id: 'AC-2', text: 'second' },
    ]);
  });

  it('ignores non-stageEvent events when searching backwards', () => {
    const events: BoardEvent[] = [
      stageEvent({ workItem: 'JIRA-1', timestamp: '2026-01-01T00:00:00Z', acceptanceCriteria: [{ id: 'AC-1', text: 'a' }] }),
      {
        schemaVersion: '1.0',
        eventType: 'workflowCompleted',
        workItem: 'JIRA-1',
        workflowId: 'WF-FEATURE',
        timestamp: '2026-01-02T00:00:00Z',
      },
    ];
    expect(latestAcceptanceCriteria(events)).toEqual([{ id: 'AC-1', text: 'a' }]);
  });
});

describe('mergedTestResults', () => {
  it('returns an empty list when no event carries testResults', () => {
    expect(mergedTestResults([stageEvent({ workItem: 'JIRA-1', timestamp: '2026-01-01T00:00:00Z' })])).toEqual([]);
  });

  it('merges results from multiple events', () => {
    const events: BoardEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        testResults: [{ acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pending' }],
      }),
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-02T00:00:00Z',
        testResults: [{ acId: 'AC-2', testId: 'unit-2', testType: 'unit', status: 'pass' }],
      }),
    ];
    expect(mergedTestResults(events)).toEqual([
      { acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pending' },
      { acId: 'AC-2', testId: 'unit-2', testType: 'unit', status: 'pass' },
    ]);
  });

  it('preserves an optional testFile unchanged', () => {
    const events: BoardEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        testResults: [{ acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pass', testFile: 'src/lib/segment-model.spec.ts' }],
      }),
    ];
    expect(mergedTestResults(events)).toEqual([
      { acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pass', testFile: 'src/lib/segment-model.spec.ts' },
    ]);
  });

  it('a later event overrides an earlier result for the same acId+testId', () => {
    const events: BoardEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        testResults: [{ acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pending' }],
      }),
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-02T00:00:00Z',
        testResults: [{ acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pass' }],
      }),
    ];
    expect(mergedTestResults(events)).toEqual([{ acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pass' }]);
  });
});

describe('buildTraceabilityMatrix', () => {
  it('returns an empty list when there are no acceptance criteria', () => {
    expect(buildTraceabilityMatrix([stageEvent({ workItem: 'JIRA-1', timestamp: '2026-01-01T00:00:00Z' })])).toEqual([]);
  });

  it('joins each AC to its own test results, in AC declaration order', () => {
    const events: BoardEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        acceptanceCriteria: [
          { id: 'AC-1', text: 'first' },
          { id: 'AC-2', text: 'second' },
        ],
      }),
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-02T00:00:00Z',
        testResults: [
          { acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pass' },
          { acId: 'AC-2', testId: 'e2e-1', testType: 'e2e', status: 'fail' },
        ],
      }),
    ];
    expect(buildTraceabilityMatrix(events)).toEqual([
      { ac: { id: 'AC-1', text: 'first' }, results: [{ acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pass' }] },
      { ac: { id: 'AC-2', text: 'second' }, results: [{ acId: 'AC-2', testId: 'e2e-1', testType: 'e2e', status: 'fail' }] },
    ]);
  });

  it('gives an AC with no reported test results yet an empty results array', () => {
    const events: BoardEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        acceptanceCriteria: [{ id: 'AC-1', text: 'first' }],
      }),
    ];
    expect(buildTraceabilityMatrix(events)).toEqual([{ ac: { id: 'AC-1', text: 'first' }, results: [] }]);
  });
});

describe('mostRecentWorkItemId', () => {
  it('returns null for an empty map', () => {
    expect(mostRecentWorkItemId(new Map())).toBeNull();
  });

  it('returns the work item whose lastTimestamp is most recent', () => {
    const events: BoardEvent[] = [
      stageEvent({ workItem: 'JIRA-1', timestamp: '2026-01-01T00:00:00Z' }),
      stageEvent({ workItem: 'JIRA-2', timestamp: '2026-01-03T00:00:00Z' }),
      stageEvent({ workItem: 'JIRA-2', timestamp: '2026-01-02T00:00:00Z' }),
    ];
    expect(mostRecentWorkItemId(deriveWorkItems(events))).toBe('JIRA-2');
  });
});
