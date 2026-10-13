import { MarkerType, type Edge, type Node } from '@xyflow/react';

import type { BoardEvent, ChainStage, CohortBucket, WorkItem, WorkflowGraph } from './types';

const CHAIN_SEGMENT_PATTERN = /^([\w-]+)\(([\w-]+)([*^]*)(\+human)?\)$/;
const STAGE_NODE_GAP_PX = 260;

export interface WorkflowStageNodeData extends ChainStage {
  eventCount: number;
  activeCount: number;
  [key: string]: unknown;
}

export type StageNode = Node<WorkflowStageNodeData, 'stage'>;

function sortBuckets(counts: Map<string, number>): CohortBucket[] {
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.key.localeCompare(b.key)));
}

/** Counts how many times each law is cited across every event, regardless of event type. */
export function aggregateByLaw(events: BoardEvent[]): CohortBucket[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    if (!Array.isArray(event.lawCitations)) continue;
    for (const law of event.lawCitations) {
      counts.set(law, (counts.get(law) ?? 0) + 1);
    }
  }
  return sortBuckets(counts);
}

/** Counts stage events per persona — the only event type that carries a persona. */
export function aggregateByPersona(events: BoardEvent[]): CohortBucket[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    if (event.eventType !== 'stageEvent') continue;
    counts.set(event.persona, (counts.get(event.persona) ?? 0) + 1);
  }
  return sortBuckets(counts);
}

/**
 * Parses a chain string like `persona(stageId*) -> persona(stageId^+human)`
 * into its stages. A segment that doesn't match the expected shape is
 * skipped rather than failing the whole chain — the chain is descriptive
 * metadata, not the schema boundary that `parseLog` guards.
 */
export function parseChainStages(chain: string): ChainStage[] {
  const stages: ChainStage[] = [];
  for (const rawSegment of chain.split('->')) {
    const match = CHAIN_SEGMENT_PATTERN.exec(rawSegment.trim());
    if (!match) continue;
    // Groups 1-3 are mandatory in the pattern (group 3 uses `*`, so it always
    // captures at least an empty string), so they're always defined when match succeeds.
    const persona = match[1] as string;
    const stageId = match[2] as string;
    const markers = match[3] as string;
    stages.push({
      persona,
      stageId,
      hard: markers.includes('*'),
      conditional: markers.includes('^'),
      humanRequired: match[4] !== undefined,
    });
  }
  return stages;
}

/**
 * One graph per distinct workflowId: its stage chain (from the first
 * `workflowSelected` event seen for it), how many stageEvents have ever
 * touched each stage, and how many work items are currently sitting there
 * (their latest event is a stageEvent at that stage).
 */
export function aggregateWorkflowGraph(events: BoardEvent[], workItems: Map<string, WorkItem>): WorkflowGraph[] {
  const workflowIds: string[] = [];
  const chains = new Map<string, string>();
  const stageEventCounts = new Map<string, Map<string, number>>();
  const usageCounts = new Map<string, number>();

  for (const event of events) {
    if (!workflowIds.includes(event.workflowId)) workflowIds.push(event.workflowId);
    if (event.eventType === 'workflowSelected') {
      usageCounts.set(event.workflowId, (usageCounts.get(event.workflowId) ?? 0) + 1);
      if (event.chain && !chains.has(event.workflowId)) chains.set(event.workflowId, event.chain);
    }
    if (event.eventType === 'stageEvent') {
      const counts = stageEventCounts.get(event.workflowId) ?? new Map<string, number>();
      counts.set(event.stageId, (counts.get(event.stageId) ?? 0) + 1);
      stageEventCounts.set(event.workflowId, counts);
    }
  }

  const activeCounts = new Map<string, Map<string, number>>();
  for (const item of workItems.values()) {
    if (item.latest?.eventType !== 'stageEvent') continue;
    const counts = activeCounts.get(item.workflowId) ?? new Map<string, number>();
    counts.set(item.latest.stageId, (counts.get(item.latest.stageId) ?? 0) + 1);
    activeCounts.set(item.workflowId, counts);
  }

  return workflowIds.map((workflowId) => ({
    workflowId,
    stages: parseChainStages(chains.get(workflowId) ?? ''),
    stageEventCounts: Object.fromEntries(stageEventCounts.get(workflowId) ?? []),
    stageActiveCounts: Object.fromEntries(activeCounts.get(workflowId) ?? []),
    usageCount: usageCounts.get(workflowId) ?? 0,
  }));
}

/** Pure translation of a WorkflowGraph into ReactFlow's node/edge shapes — left-to-right, one node per stage. */
export function buildFlowElements(graph: WorkflowGraph): { nodes: StageNode[]; edges: Edge[] } {
  const nodes: StageNode[] = graph.stages.map((stage, index) => ({
    id: stage.stageId,
    type: 'stage',
    position: { x: index * STAGE_NODE_GAP_PX, y: 0 },
    data: {
      ...stage,
      eventCount: graph.stageEventCounts[stage.stageId] ?? 0,
      activeCount: graph.stageActiveCounts[stage.stageId] ?? 0,
    },
  }));

  const edges: Edge[] = [];
  let previousStage: ChainStage | undefined;
  for (const stage of graph.stages) {
    if (previousStage) {
      edges.push({
        id: `${previousStage.stageId}->${stage.stageId}`,
        source: previousStage.stageId,
        target: stage.stageId,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }
    previousStage = stage;
  }

  return { nodes, edges };
}
