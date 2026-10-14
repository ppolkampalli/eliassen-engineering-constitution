export type EventType = 'workflowSelected' | 'stageEvent' | 'deviation' | 'workflowCompleted';

export type StageStatus = 'entered' | 'blocked' | 'complete';

export type HumanCheckpoint = 'none' | 'recommended' | 'required';

export type DeviationStatus = 'applied' | 'refused';

export type Lane = 'inProgress' | 'blocked' | 'done';

interface EventEnvelope {
  schemaVersion: string;
  timestamp: string;
  workItem: string;
  workflowId: string;
  note?: string;
  /** Full decision content — ACs, ADR rationale, a test list, a security finding, etc. May be multi-line. */
  detail?: string;
  lawCitations?: string[];
}

export interface WorkflowSelectedEvent extends EventEnvelope {
  eventType: 'workflowSelected';
  workflowVersion?: string;
  chain?: string;
}

export interface StageEvent extends EventEnvelope {
  eventType: 'stageEvent';
  stageId: string;
  persona: string;
  status: StageStatus;
  humanCheckpoint: HumanCheckpoint;
  hard?: boolean;
}

export interface DeviationEvent extends EventEnvelope {
  eventType: 'deviation';
  stageId: string;
  deviationStatus: DeviationStatus;
  reason: string;
  approvedBy?: string;
}

export interface WorkflowCompletedEvent extends EventEnvelope {
  eventType: 'workflowCompleted';
  outcome?: string;
  deviationCount?: number;
}

export type BoardEvent = WorkflowSelectedEvent | StageEvent | DeviationEvent | WorkflowCompletedEvent;

export interface WorkItem {
  workItem: string;
  workflowId: string;
  chain: string | null;
  events: BoardEvent[];
  citationCount: number;
  firstTimestamp: string;
  lastTimestamp: string;
  latest: BoardEvent | null;
  lane: Lane;
  latestNote: string;
}

export interface EventsResponse {
  events: BoardEvent[];
  skippedCount: number;
  mtimeMs: number | null;
}

export interface CohortBucket {
  key: string;
  count: number;
}

export interface ChainStage {
  persona: string;
  stageId: string;
  hard: boolean;
  conditional: boolean;
  humanRequired: boolean;
}

export interface WorkflowGraph {
  workflowId: string;
  stages: ChainStage[];
  stageEventCounts: Record<string, number>;
  stageActiveCounts: Record<string, number>;
  /** How many times this workflow was selected for a work item (count of `workflowSelected` events). */
  usageCount: number;
}

export interface AdrRecord {
  filename: string;
  title: string;
  content: string;
}

export interface AdrResponse {
  records: AdrRecord[];
  mtimeMs: number | null;
}
