import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { deriveWorkItems, parseLog } from './board-model';
import {
  aggregateByLaw,
  aggregateByPersona,
  aggregateWorkflowGraph,
  buildFlowElements,
  parseChainStages,
} from './cohort-model';
import type { StageEvent, WorkflowCompletedEvent, WorkflowSelectedEvent } from './types';

const FIXTURES_DIR = join(__dirname, '../../fixtures');
const readFixture = (name: string): string => readFileSync(join(FIXTURES_DIR, name), 'utf8');

const sampleEvents = parseLog(readFixture('events.sample.jsonl')).events;

describe('aggregateByLaw', () => {
  it('counts each law citation across every event in the sample fixture', () => {
    expect(aggregateByLaw(sampleEvents)).toEqual([
      { key: 'LAW-3.1', count: 1 },
      { key: 'LAW-3.6', count: 1 },
      { key: 'LAW-4.5', count: 1 },
      { key: 'LAW-5.2', count: 1 },
      { key: 'LAW-8.1', count: 1 },
    ]);
  });

  it('returns an empty list when there are no events', () => {
    expect(aggregateByLaw([])).toEqual([]);
  });

  it('ignores events with no lawCitations field and events with an empty array', () => {
    const noCitations: WorkflowSelectedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-12T00:00:00Z',
      eventType: 'workflowSelected',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
    };
    const emptyCitations: WorkflowCompletedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-12T00:01:00Z',
      eventType: 'workflowCompleted',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      lawCitations: [],
    };
    expect(aggregateByLaw([noCitations, emptyCitations])).toEqual([]);
  });

  it('sorts ties by key ascending and counts repeats correctly', () => {
    const makeEvent = (law: string): WorkflowCompletedEvent => ({
      schemaVersion: '1.0',
      timestamp: '2026-10-12T00:00:00Z',
      eventType: 'workflowCompleted',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      lawCitations: [law],
    });
    const events = [makeEvent('LAW-9.1'), makeEvent('LAW-1.1'), makeEvent('LAW-1.1')];
    expect(aggregateByLaw(events)).toEqual([
      { key: 'LAW-1.1', count: 2 },
      { key: 'LAW-9.1', count: 1 },
    ]);
  });
});

describe('aggregateByPersona', () => {
  it('counts stage events by persona across the sample fixture', () => {
    expect(aggregateByPersona(sampleEvents)).toEqual([
      { key: 'persona-quality', count: 5 },
      { key: 'persona-software-engineer', count: 4 },
      { key: 'persona-architect', count: 1 },
      { key: 'persona-product-owner', count: 1 },
    ]);
  });

  it('ignores non-stageEvent event types, which carry no persona field', () => {
    const selected: WorkflowSelectedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-12T00:00:00Z',
      eventType: 'workflowSelected',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
    };
    expect(aggregateByPersona([selected])).toEqual([]);
  });

  it('returns an empty list when there are no events', () => {
    expect(aggregateByPersona([])).toEqual([]);
  });
});

describe('parseChainStages', () => {
  it('parses every marker combination found in the sample fixture', () => {
    expect(parseChainStages('product-owner(requirements*) -> architect(design) -> security(security-review^)')).toEqual([
      { persona: 'product-owner', stageId: 'requirements', hard: true, conditional: false, humanRequired: false },
      { persona: 'architect', stageId: 'design', hard: false, conditional: false, humanRequired: false },
      { persona: 'security', stageId: 'security-review', hard: false, conditional: true, humanRequired: false },
    ]);
  });

  it('parses a stage that is both hard and human-checkpointed', () => {
    expect(parseChainStages('quality(code-review*+human)')).toEqual([
      { persona: 'quality', stageId: 'code-review', hard: true, conditional: false, humanRequired: true },
    ]);
  });

  it('skips a segment that does not match the expected shape instead of throwing', () => {
    expect(parseChainStages('architect(design) -> not-a-valid-segment -> quality(verify*)')).toEqual([
      { persona: 'architect', stageId: 'design', hard: false, conditional: false, humanRequired: false },
      { persona: 'quality', stageId: 'verify', hard: true, conditional: false, humanRequired: false },
    ]);
  });

  it('returns an empty list for an empty chain string', () => {
    expect(parseChainStages('')).toEqual([]);
  });
});

describe('aggregateWorkflowGraph', () => {
  it('builds one graph per workflowId from the sample fixture, with event and active counts', () => {
    const workItems = deriveWorkItems(sampleEvents);
    const graphs = aggregateWorkflowGraph(sampleEvents, workItems);

    expect(graphs.map((graph) => graph.workflowId)).toEqual(['WF-BUG', 'WF-FEATURE', 'WF-REFACTOR']);

    const bug = graphs.find((graph) => graph.workflowId === 'WF-BUG');
    expect(bug?.stages.map((stage) => stage.stageId)).toEqual(['reproduce-and-fix', 'verify']);
    expect(bug?.stageEventCounts).toEqual({ 'reproduce-and-fix': 2, verify: 2 });
    // JIRA-3411 finished (workflowCompleted) — a completed item sits at no stage.
    expect(bug?.stageActiveCounts).toEqual({});
    expect(bug?.usageCount).toBe(1);

    const feature = graphs.find((graph) => graph.workflowId === 'WF-FEATURE');
    expect(feature?.stageEventCounts).toEqual({ requirements: 1, 'test-definition': 1, implement: 1, 'code-review': 1 });
    // JIRA-3500's latest non-deviation event is the blocked code-review stage.
    expect(feature?.stageActiveCounts).toEqual({ 'code-review': 1 });
    expect(feature?.usageCount).toBe(1);

    const refactor = graphs.find((graph) => graph.workflowId === 'WF-REFACTOR');
    expect(refactor?.stageEventCounts).toEqual({ adr: 1, baseline: 1, refactor: 1 });
    expect(refactor?.stageActiveCounts).toEqual({ refactor: 1 });
    expect(refactor?.usageCount).toBe(1);
  });

  it('returns an empty-stages graph for a workflowId whose workflowSelected event has no chain', () => {
    const noChain: WorkflowSelectedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-12T00:00:00Z',
      eventType: 'workflowSelected',
      workItem: 'JIRA-1',
      workflowId: 'WF-NO-CHAIN',
    };
    const workItems = deriveWorkItems([noChain]);
    expect(aggregateWorkflowGraph([noChain], workItems)).toEqual([
      { workflowId: 'WF-NO-CHAIN', stages: [], stageEventCounts: {}, stageActiveCounts: {}, usageCount: 1 },
    ]);
  });

  it('counts every workflowSelected event toward usageCount, even across different work items', () => {
    const first: WorkflowSelectedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-12T00:00:00Z',
      eventType: 'workflowSelected',
      workItem: 'JIRA-1',
      workflowId: 'WF-DUPLICATE',
      chain: 'architect(design)',
    };
    const second: WorkflowSelectedEvent = {
      ...first,
      workItem: 'JIRA-2',
      timestamp: '2026-10-12T00:05:00Z',
      chain: 'quality(verify)',
    };
    const workItems = deriveWorkItems([first, second]);
    const [graph] = aggregateWorkflowGraph([first, second], workItems);
    // Keeps the first-seen chain for the stage graph...
    expect(graph?.stages.map((stage) => stage.stageId)).toEqual(['design']);
    // ...but still counts both selections toward usage.
    expect(graph?.usageCount).toBe(2);
  });

  it('returns an empty list for an empty event log', () => {
    expect(aggregateWorkflowGraph([], new Map())).toEqual([]);
  });

  it('reports usageCount 0 for a workflowId seen only via stageEvents, with no workflowSelected on record', () => {
    const stageOnly: StageEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-12T00:00:00Z',
      eventType: 'stageEvent',
      workItem: 'JIRA-1',
      workflowId: 'WF-NO-SELECTION',
      stageId: 'verify',
      persona: 'persona-quality',
      status: 'entered',
      humanCheckpoint: 'none',
    };
    const workItems = deriveWorkItems([stageOnly]);
    const [graph] = aggregateWorkflowGraph([stageOnly], workItems);
    expect(graph?.usageCount).toBe(0);
  });
});

describe('buildFlowElements', () => {
  it('lays out stages left to right and connects consecutive stages with arrow edges', () => {
    const stageEvent: StageEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-12T00:00:00Z',
      eventType: 'stageEvent',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      stageId: 'verify',
      persona: 'persona-quality',
      status: 'entered',
      humanCheckpoint: 'none',
    };
    const workItems = deriveWorkItems([stageEvent]);
    const [graph] = aggregateWorkflowGraph(
      [
        { ...stageEvent, eventType: 'workflowSelected', chain: 'software-engineer(fix*) -> quality(verify)' },
        stageEvent,
      ],
      workItems,
    );
    expect(graph).toBeDefined();
    const { nodes, edges } = buildFlowElements(graph as NonNullable<typeof graph>);

    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toMatchObject({ id: 'fix', position: { x: 0, y: 0 }, data: { eventCount: 0, activeCount: 0 } });
    expect(nodes[1]).toMatchObject({ id: 'verify', position: { x: 260, y: 0 }, data: { eventCount: 1, activeCount: 1 } });

    expect(edges).toEqual([
      { id: 'fix->verify', source: 'fix', target: 'verify', markerEnd: { type: 'arrowclosed' } },
    ]);
  });

  it('returns no edges for a single-stage graph', () => {
    const { nodes, edges } = buildFlowElements({
      workflowId: 'WF-SOLO',
      stages: [{ persona: 'quality', stageId: 'verify', hard: true, conditional: false, humanRequired: false }],
      stageEventCounts: {},
      stageActiveCounts: {},
      usageCount: 1,
    });
    expect(nodes).toHaveLength(1);
    expect(edges).toEqual([]);
  });

  it('returns no nodes or edges for an empty-stages graph', () => {
    const { nodes, edges } = buildFlowElements({
      workflowId: 'WF-EMPTY',
      stages: [],
      stageEventCounts: {},
      stageActiveCounts: {},
      usageCount: 0,
    });
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });
});
