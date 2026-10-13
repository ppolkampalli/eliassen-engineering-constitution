import { MarkerType, type Edge, type Node } from '@xyflow/react';

import { STAGE_NODE_GAP_PX } from './cohort-model';
import type {
  DeviationEvent,
  DeviationStatus,
  HumanCheckpoint,
  StageEvent,
  StageStatus,
  WorkflowCompletedEvent,
  WorkflowSelectedEvent,
  WorkItem,
} from './types';

export type ItemFlowNodeKind = 'start' | 'stage' | 'deviationOnly' | 'end';

export interface ItemFlowStageEvent {
  timestamp: string;
  status: StageStatus;
  humanCheckpoint: HumanCheckpoint;
  note: string | null;
  detail: string | null;
}

export interface ItemFlowDeviation {
  status: DeviationStatus;
  reason: string;
  approvedBy: string | null;
  timestamp: string;
}

export interface ItemFlowNodeData {
  kind: ItemFlowNodeKind;
  stageId: string | null;
  persona: string | null;
  status: StageStatus | null;
  hard: boolean;
  humanCheckpoint: HumanCheckpoint | null;
  note: string | null;
  detail: string | null;
  lawCitations: string[];
  /** One entry per stageEvent seen for this node's stage — only populated for kind 'stage'. */
  history: ItemFlowStageEvent[];
  deviation: ItemFlowDeviation | null;
  workflowVersion: string | null;
  chain: string | null;
  outcome: string | null;
  deviationCount: number | null;
  timestamp: string;
  [key: string]: unknown;
}

export type ItemFlowNode = Node<ItemFlowNodeData, 'itemStage'>;

function emptyNodeData(partial: Partial<ItemFlowNodeData> & Pick<ItemFlowNodeData, 'kind' | 'timestamp'>): ItemFlowNodeData {
  return {
    stageId: null,
    persona: null,
    status: null,
    hard: false,
    humanCheckpoint: null,
    note: null,
    detail: null,
    lawCitations: [],
    history: [],
    deviation: null,
    workflowVersion: null,
    chain: null,
    outcome: null,
    deviationCount: null,
    ...partial,
  };
}

function nodeId(data: ItemFlowNodeData): string {
  return data.stageId ?? data.kind;
}

function handleWorkflowSelected(event: WorkflowSelectedEvent, order: ItemFlowNodeData[]): void {
  order.push(
    emptyNodeData({
      kind: 'start',
      timestamp: event.timestamp,
      note: event.note ?? null,
      detail: event.detail ?? null,
      lawCitations: event.lawCitations ?? [],
      workflowVersion: event.workflowVersion ?? null,
      chain: event.chain ?? null,
    })
  );
}

function handleWorkflowCompleted(event: WorkflowCompletedEvent, order: ItemFlowNodeData[]): void {
  order.push(
    emptyNodeData({
      kind: 'end',
      timestamp: event.timestamp,
      note: event.note ?? null,
      detail: event.detail ?? null,
      lawCitations: event.lawCitations ?? [],
      outcome: event.outcome ?? null,
      deviationCount: event.deviationCount ?? null,
    })
  );
}

function handleStageEvent(event: StageEvent, order: ItemFlowNodeData[], stageNodes: Map<string, ItemFlowNodeData>): void {
  let node = stageNodes.get(event.stageId);
  if (!node) {
    node = emptyNodeData({ kind: 'stage', timestamp: event.timestamp, stageId: event.stageId });
    stageNodes.set(event.stageId, node);
    order.push(node);
  }
  node.persona = event.persona;
  node.status = event.status;
  node.humanCheckpoint = event.humanCheckpoint;
  node.hard = event.hard ?? node.hard;
  node.timestamp = event.timestamp;
  if (event.note) node.note = event.note;
  if (event.detail) node.detail = event.detail;
  if (event.lawCitations) node.lawCitations = [...node.lawCitations, ...event.lawCitations];
  node.history.push({
    timestamp: event.timestamp,
    status: event.status,
    humanCheckpoint: event.humanCheckpoint,
    note: event.note ?? null,
    detail: event.detail ?? null,
  });
}

function handleDeviation(event: DeviationEvent, order: ItemFlowNodeData[], stageNodes: Map<string, ItemFlowNodeData>): void {
  const deviation: ItemFlowDeviation = {
    status: event.deviationStatus,
    reason: event.reason,
    approvedBy: event.approvedBy ?? null,
    timestamp: event.timestamp,
  };
  const existing = stageNodes.get(event.stageId);
  if (existing) {
    existing.deviation = deviation;
    return;
  }
  const deviationOnly = emptyNodeData({
    kind: 'deviationOnly',
    timestamp: event.timestamp,
    stageId: event.stageId,
    deviation,
    note: event.note ?? null,
    detail: event.detail ?? null,
    lawCitations: event.lawCitations ?? [],
  });
  stageNodes.set(event.stageId, deviationOnly);
  order.push(deviationOnly);
}

/**
 * Turns one work item's actual event history into a left-to-right flowchart:
 * one node per distinct stage it visited (collapsing repeated stageEvents at
 * the same stage into one node with the latest status), a start node for
 * workflowSelected, an end node for workflowCompleted, and a muted
 * "deviationOnly" node for a stage that was overridden (skipped or a refused
 * skip attempt) without ever getting a stageEvent of its own. Order follows
 * when this item actually reached each stage, not the workflow's declared
 * chain order — this is "what happened," not "what's possible."
 */
export function buildItemFlowElements(item: WorkItem): { nodes: ItemFlowNode[]; edges: Edge[] } {
  const stageNodes = new Map<string, ItemFlowNodeData>();
  const order: ItemFlowNodeData[] = [];

  for (const event of item.events) {
    if (event.eventType === 'workflowSelected') handleWorkflowSelected(event, order);
    else if (event.eventType === 'workflowCompleted') handleWorkflowCompleted(event, order);
    else if (event.eventType === 'stageEvent') handleStageEvent(event, order, stageNodes);
    else handleDeviation(event, order, stageNodes);
  }

  const nodes: ItemFlowNode[] = order.map((data, index) => ({
    id: nodeId(data),
    type: 'itemStage',
    position: { x: index * STAGE_NODE_GAP_PX, y: 0 },
    data,
  }));

  const edges: Edge[] = [];
  for (let index = 1; index < nodes.length; index += 1) {
    const previous = nodes[index - 1] as ItemFlowNode;
    const current = nodes[index] as ItemFlowNode;
    edges.push({ id: `${previous.id}->${current.id}`, source: previous.id, target: current.id, markerEnd: { type: MarkerType.ArrowClosed } });
  }

  return { nodes, edges };
}

/** The node to select by default when the flowchart first renders — the item's current/latest node, so the detail panel isn't empty on open. */
export function defaultSelectedNodeId(nodes: ItemFlowNode[]): string | null {
  return nodes.length > 0 ? (nodes[nodes.length - 1] as ItemFlowNode).id : null;
}
