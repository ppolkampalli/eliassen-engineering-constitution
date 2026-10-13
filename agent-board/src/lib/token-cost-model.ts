import type { BoardEvent, CohortBucket, WorkItem } from './types';

export interface UsageRecord {
  timestamp: string;
  sessionId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheWrite5mTokens: number;
  cacheWrite1hTokens: number;
  cacheReadTokens: number;
}

export interface AttributedUsageRecord extends UsageRecord {
  workItem: string | null;
  workflowId: string | null;
  stageId: string | null;
  persona: string | null;
}

export interface ModelRate {
  input: number;
  cacheWrite5m: number;
  cacheWrite1h: number;
  cacheRead: number;
  output: number;
}

export type PriceTable = Record<string, ModelRate>;

export interface PricedUsageRecord extends AttributedUsageRecord {
  /** null means the model wasn't found in the price table — never silently priced at 0. */
  costUsd: number | null;
}

export interface CostReport {
  totalCostUsd: number;
  unpricedRecordCount: number;
  unattributedRecordCount: number;
  byWorkItem: CohortBucket[];
  byWorkflow: CohortBucket[];
  byStage: CohortBucket[];
  byPersona: CohortBucket[];
  byModel: CohortBucket[];
  timeSeries: { bucketStart: string; costUsd: number }[];
}

const UNATTRIBUTED_KEY = 'unattributed';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function numberField(value: Record<string, unknown>, key: string): number {
  const field = value[key];
  return typeof field === 'number' ? field : 0;
}

/**
 * Parses raw transcript JSONL lines into UsageRecords. Keeps only
 * assistant messages that carry a `usage` object; everything else
 * (user turns, tool results, malformed lines) is skipped, not fatal —
 * same philosophy as `parseLog`. Never retains message content, only the
 * numeric usage fields and the identifying metadata needed to attribute
 * and price them.
 */
export function parseUsageRecords(lines: string[]): UsageRecord[] {
  const records: UsageRecord[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (!isRecord(parsed)) continue;
    const message = parsed.message;
    if (!isRecord(message) || message.role !== 'assistant') continue;
    const usage = message.usage;
    if (!isRecord(usage)) continue;
    if (typeof parsed.timestamp !== 'string') continue;
    if (typeof parsed.sessionId !== 'string') continue;
    if (typeof message.model !== 'string') continue;

    const cacheCreation = usage.cache_creation;
    const hasSplitCacheCreation = isRecord(cacheCreation);
    const cacheWrite5mTokens = hasSplitCacheCreation
      ? numberField(cacheCreation, 'ephemeral_5m_input_tokens')
      : numberField(usage, 'cache_creation_input_tokens');
    const cacheWrite1hTokens = hasSplitCacheCreation ? numberField(cacheCreation, 'ephemeral_1h_input_tokens') : 0;

    records.push({
      timestamp: parsed.timestamp,
      sessionId: parsed.sessionId,
      model: message.model,
      inputTokens: numberField(usage, 'input_tokens'),
      outputTokens: numberField(usage, 'output_tokens'),
      cacheWrite5mTokens,
      cacheWrite1hTokens,
      cacheReadTokens: numberField(usage, 'cache_read_input_tokens'),
    });
  }
  return records;
}

interface AttributionWindow {
  start: string;
  end: string | null; // null = open-ended, extends through "now"
  workflowId: string;
  stageId: string | null;
  persona: string | null;
}

function windowTags(event: BoardEvent): { stageId: string | null; persona: string | null } {
  if (event.eventType === 'stageEvent') return { stageId: event.stageId, persona: event.persona };
  if (event.eventType === 'deviation') return { stageId: event.stageId, persona: null };
  return { stageId: null, persona: null };
}

function buildWindows(item: WorkItem): AttributionWindow[] {
  const windows: AttributionWindow[] = [];
  let previous: BoardEvent | undefined;
  for (const event of item.events) {
    if (previous) {
      windows.push({ start: previous.timestamp, end: event.timestamp, workflowId: previous.workflowId, ...windowTags(previous) });
    }
    previous = event;
  }
  const isCompleted = item.latest?.eventType === 'workflowCompleted';
  if (previous && !isCompleted) {
    windows.push({ start: previous.timestamp, end: null, workflowId: previous.workflowId, ...windowTags(previous) });
  }
  return windows;
}

function isWithinWindow(timestamp: string, window: AttributionWindow): boolean {
  if (timestamp < window.start) return false;
  if (window.end !== null && timestamp >= window.end) return false;
  return true;
}

/**
 * Attributes each usage record to the work item/stage that was open at its
 * timestamp, per the board's own event log. A record is only attributed
 * when its timestamp falls inside exactly one open window across every
 * work item — zero or multiple matches are ambiguous and left
 * unattributed rather than guessed.
 */
export function attributeUsageToWorkItems(
  records: UsageRecord[],
  workItems: Map<string, WorkItem>
): AttributedUsageRecord[] {
  const windowsByWorkItem = [...workItems.entries()].map(([workItem, item]) => ({
    workItem,
    windows: buildWindows(item),
  }));

  return records.map((record) => {
    const matches: { workItem: string; window: AttributionWindow }[] = [];
    for (const { workItem, windows } of windowsByWorkItem) {
      for (const window of windows) {
        if (isWithinWindow(record.timestamp, window)) matches.push({ workItem, window });
      }
    }
    if (matches.length !== 1) {
      return { ...record, workItem: null, workflowId: null, stageId: null, persona: null };
    }
    // The length check above guarantees exactly one element.
    const match = matches[0] as NonNullable<(typeof matches)[number]>;
    return {
      ...record,
      workItem: match.workItem,
      workflowId: match.window.workflowId,
      stageId: match.window.stageId,
      persona: match.window.persona,
    };
  });
}

/** Prices a usage record against a model rate table. Unknown model -> costUsd: null, never 0. */
export function priceRecord(record: AttributedUsageRecord, priceTable: PriceTable): PricedUsageRecord {
  const rate = priceTable[record.model];
  if (!rate) return { ...record, costUsd: null };
  const costUsd =
    (record.inputTokens * rate.input +
      record.cacheWrite5mTokens * rate.cacheWrite5m +
      record.cacheWrite1hTokens * rate.cacheWrite1h +
      record.cacheReadTokens * rate.cacheRead +
      record.outputTokens * rate.output) /
    1_000_000;
  return { ...record, costUsd };
}

function addToBucket(counts: Map<string, number>, key: string, amount: number): void {
  counts.set(key, (counts.get(key) ?? 0) + amount);
}

function bucketsFrom(counts: Map<string, number>): CohortBucket[] {
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.key.localeCompare(b.key)));
}

function hourBucketStart(timestamp: string): string {
  const date = new Date(timestamp);
  date.setUTCMinutes(0, 0, 0);
  return date.toISOString();
}

/** Sums and groups priced records into a CostReport. `byModel` always has an entry; the other breakdowns use 'unattributed' for records with no matching work-item window. */
export function aggregateCostReport(records: PricedUsageRecord[]): CostReport {
  const byWorkItem = new Map<string, number>();
  const byWorkflow = new Map<string, number>();
  const byStage = new Map<string, number>();
  const byPersona = new Map<string, number>();
  const byModel = new Map<string, number>();
  const byHour = new Map<string, number>();

  let totalCostUsd = 0;
  let unpricedRecordCount = 0;
  let unattributedRecordCount = 0;

  for (const record of records) {
    const cost = record.costUsd ?? 0;
    if (record.costUsd === null) unpricedRecordCount += 1;
    if (record.workItem === null) unattributedRecordCount += 1;

    totalCostUsd += cost;
    addToBucket(byWorkItem, record.workItem ?? UNATTRIBUTED_KEY, cost);
    addToBucket(byWorkflow, record.workflowId ?? UNATTRIBUTED_KEY, cost);
    addToBucket(byStage, record.stageId ?? UNATTRIBUTED_KEY, cost);
    addToBucket(byPersona, record.persona ?? UNATTRIBUTED_KEY, cost);
    addToBucket(byModel, record.model, cost);
    addToBucket(byHour, hourBucketStart(record.timestamp), cost);
  }

  const timeSeries = [...byHour.entries()]
    .map(([bucketStart, costUsd]) => ({ bucketStart, costUsd }))
    .sort((a, b) => a.bucketStart.localeCompare(b.bucketStart));

  return {
    totalCostUsd,
    unpricedRecordCount,
    unattributedRecordCount,
    byWorkItem: bucketsFrom(byWorkItem),
    byWorkflow: bucketsFrom(byWorkflow),
    byStage: bucketsFrom(byStage),
    byPersona: bucketsFrom(byPersona),
    byModel: bucketsFrom(byModel),
    timeSeries,
  };
}

/** Formats a dollar amount for display, keeping sub-cent totals (common for a single turn) legible instead of rounding them to $0.00. */
export function formatUsd(amount: number): string {
  if (amount > 0 && amount < 0.01) return `$${amount.toFixed(4)}`;
  return `$${amount.toFixed(2)}`;
}
