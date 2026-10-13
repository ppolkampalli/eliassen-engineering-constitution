import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { deriveWorkItems, parseLog } from './board-model';
import { buildItemFlowElements, defaultSelectedNodeId } from './item-flow-model';
import type { DeviationEvent, StageEvent, WorkflowCompletedEvent, WorkflowSelectedEvent } from './types';

const FIXTURES_DIR = join(__dirname, '../../fixtures');
const readFixture = (name: string): string => readFileSync(join(FIXTURES_DIR, name), 'utf8');

const sampleEvents = parseLog(readFixture('events.sample.jsonl')).events;
const sampleWorkItems = deriveWorkItems(sampleEvents);

describe('buildItemFlowElements', () => {
  it('collapses repeated stageEvents at the same stage into one node, in visitation order, ending with a workflowCompleted end node', () => {
    const item = sampleWorkItems.get('JIRA-3411');
    expect(item).toBeDefined();
    const { nodes, edges } = buildItemFlowElements(item!);

    expect(nodes.map((node) => node.id)).toEqual(['start', 'reproduce-and-fix', 'verify', 'end']);
    expect(nodes.map((node) => node.position)).toEqual([
      { x: 0, y: 0 },
      { x: 260, y: 0 },
      { x: 520, y: 0 },
      { x: 780, y: 0 },
    ]);

    const fix = nodes.find((node) => node.id === 'reproduce-and-fix');
    expect(fix?.data.kind).toBe('stage');
    expect(fix?.data.status).toBe('complete'); // latest of its two events (entered, then complete)
    expect(fix?.data.history).toHaveLength(2);
    expect(fix?.data.lawCitations).toEqual(['LAW-5.2']);

    const end = nodes.find((node) => node.id === 'end');
    expect(end?.data.kind).toBe('end');
    expect(end?.data.outcome).toBe('Fixed and verified; no escalation needed.');
    expect(end?.data.deviationCount).toBe(0);

    expect(edges).toEqual([
      { id: 'start->reproduce-and-fix', source: 'start', target: 'reproduce-and-fix', markerEnd: { type: 'arrowclosed' } },
      { id: 'reproduce-and-fix->verify', source: 'reproduce-and-fix', target: 'verify', markerEnd: { type: 'arrowclosed' } },
      { id: 'verify->end', source: 'verify', target: 'end', markerEnd: { type: 'arrowclosed' } },
    ]);
  });

  it('synthesizes a deviationOnly node for a stage skipped via override, with no stageEvent of its own', () => {
    const item = sampleWorkItems.get('JIRA-3500');
    expect(item).toBeDefined();
    const { nodes } = buildItemFlowElements(item!);

    // requirements (complete) -> design (skipped via deviation) -> test-definition -> implement -> code-review (blocked)
    expect(nodes.map((node) => node.id)).toEqual(['start', 'requirements', 'design', 'test-definition', 'implement', 'code-review']);

    const design = nodes.find((node) => node.id === 'design');
    expect(design?.data.kind).toBe('deviationOnly');
    expect(design?.data.status).toBeNull();
    expect(design?.data.deviation).toEqual({
      status: 'applied',
      reason: 'Single-file copy change; no structural impact.',
      approvedBy: 'P. Polkampalli, 2026-10-12',
      timestamp: '2026-10-12T15:02:00Z',
    });

    const codeReview = nodes.find((node) => node.id === 'code-review');
    expect(codeReview?.data.status).toBe('blocked');
    expect(codeReview?.data.humanCheckpoint).toBe('required');
  });

  it('attaches a deviation to its stage node as an annotation when the stage was also visited', () => {
    const entered: StageEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-13T00:00:00Z',
      eventType: 'stageEvent',
      workItem: 'JIRA-1',
      workflowId: 'WF-REFACTOR',
      stageId: 'refactor',
      persona: 'persona-software-engineer',
      status: 'entered',
      humanCheckpoint: 'none',
      note: 'Starting the extraction.',
    };
    const deviation: DeviationEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-13T00:05:00Z',
      eventType: 'deviation',
      workItem: 'JIRA-1',
      workflowId: 'WF-REFACTOR',
      stageId: 'refactor',
      deviationStatus: 'applied',
      reason: 'Widened scope to cover two extra call sites.',
    };
    const complete: StageEvent = {
      ...entered,
      timestamp: '2026-10-13T00:20:00Z',
      status: 'complete',
      note: 'Extraction complete across all call sites.',
      detail: 'Extracted validateContact() from 13 call sites (11 planned + 2 added via the recorded deviation).',
    };
    const item = deriveWorkItems([entered, deviation, complete]).get('JIRA-1');
    const { nodes } = buildItemFlowElements(item!);

    expect(nodes.map((node) => node.id)).toEqual(['refactor']);
    const refactor = nodes[0];
    expect(refactor?.data.kind).toBe('stage');
    expect(refactor?.data.status).toBe('complete');
    expect(refactor?.data.deviation?.reason).toBe('Widened scope to cover two extra call sites.');
    expect(refactor?.data.detail).toBe(
      'Extracted validateContact() from 13 call sites (11 planned + 2 added via the recorded deviation).'
    );
    expect(refactor?.data.history).toHaveLength(2);
  });

  it('captures the announced chain and workflowVersion on the start node', () => {
    const selected: WorkflowSelectedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-13T00:00:00Z',
      eventType: 'workflowSelected',
      workItem: 'JIRA-2',
      workflowId: 'WF-BUG',
      workflowVersion: '1.0',
      chain: 'software-engineer(reproduce-and-fix*) -> quality(verify*)',
    };
    const item = deriveWorkItems([selected]).get('JIRA-2');
    const { nodes, edges } = buildItemFlowElements(item!);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toMatchObject({ id: 'start', data: { kind: 'start', workflowVersion: '1.0', chain: selected.chain } });
    expect(edges).toEqual([]);
  });

  it('falls back to null for every optional field the underlying events omit', () => {
    const minimalSelected: WorkflowSelectedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-13T00:00:00Z',
      eventType: 'workflowSelected',
      workItem: 'JIRA-3',
      workflowId: 'WF-BUG',
    };
    const minimalStage: StageEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-13T00:01:00Z',
      eventType: 'stageEvent',
      workItem: 'JIRA-3',
      workflowId: 'WF-BUG',
      stageId: 'fix',
      persona: 'persona-software-engineer',
      status: 'complete',
      humanCheckpoint: 'none',
    };
    const minimalCompleted: WorkflowCompletedEvent = {
      schemaVersion: '1.0',
      timestamp: '2026-10-13T00:02:00Z',
      eventType: 'workflowCompleted',
      workItem: 'JIRA-3',
      workflowId: 'WF-BUG',
    };
    const item = deriveWorkItems([minimalSelected, minimalStage, minimalCompleted]).get('JIRA-3');
    const { nodes } = buildItemFlowElements(item!);

    expect(nodes.find((node) => node.id === 'start')?.data).toMatchObject({ workflowVersion: null, chain: null });
    expect(nodes.find((node) => node.id === 'fix')?.data.history).toEqual([
      { timestamp: '2026-10-13T00:01:00Z', status: 'complete', humanCheckpoint: 'none', note: null, detail: null },
    ]);
    expect(nodes.find((node) => node.id === 'end')?.data).toMatchObject({ outcome: null, deviationCount: null });
  });

  it('returns no nodes or edges for a work item with no events', () => {
    const { nodes, edges } = buildItemFlowElements({
      workItem: 'JIRA-EMPTY',
      workflowId: 'WF-BUG',
      chain: null,
      events: [],
      citationCount: 0,
      firstTimestamp: '',
      lastTimestamp: '',
      latest: null,
      lane: 'inProgress',
      latestNote: '',
    });
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });
});

describe('defaultSelectedNodeId', () => {
  it('returns the id of the last node, so the detail panel defaults to the current/latest step', () => {
    const item = sampleWorkItems.get('JIRA-3411');
    const { nodes } = buildItemFlowElements(item!);
    expect(defaultSelectedNodeId(nodes)).toBe('end');
  });

  it('returns null when there are no nodes', () => {
    expect(defaultSelectedNodeId([])).toBeNull();
  });
});
