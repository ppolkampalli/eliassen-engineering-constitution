import type { BoardEvent, EventType, Lane, WorkItem } from './types';

const EVENT_TYPES: EventType[] = ['workflowSelected', 'stageEvent', 'deviation', 'workflowCompleted'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Narrows a parsed JSON value to a BoardEvent, checking the envelope fields
 * every event needs plus the extra required fields for its eventType. This
 * is the schema boundary — nothing past this function should need to guard
 * against malformed input again.
 */
export function isValidEvent(value: unknown): value is BoardEvent {
  if (!isRecord(value)) return false;
  const envelope = ['schemaVersion', 'timestamp', 'eventType', 'workItem', 'workflowId'];
  for (const field of envelope) {
    if (value[field] === undefined) return false;
  }
  if (typeof value.eventType !== 'string' || !EVENT_TYPES.includes(value.eventType as EventType)) return false;
  if (value.eventType === 'stageEvent') {
    return (
      value.stageId !== undefined &&
      value.persona !== undefined &&
      value.status !== undefined &&
      value.humanCheckpoint !== undefined
    );
  }
  if (value.eventType === 'deviation') {
    return value.stageId !== undefined && value.deviationStatus !== undefined && value.reason !== undefined;
  }
  return true;
}

/**
 * Parses a JSONL event log. Malformed or schema-invalid lines are skipped,
 * not fatal — the caller gets back everything that was readable plus a
 * count of what wasn't.
 */
export function parseLog(text: string): { events: BoardEvent[]; skippedCount: number } {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const events: BoardEvent[] = [];
  let skippedCount = 0;
  for (const line of lines) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      skippedCount += 1;
      continue;
    }
    if (!isValidEvent(parsed)) {
      skippedCount += 1;
      continue;
    }
    events.push(parsed);
  }
  return { events, skippedCount };
}

/** The latest event that isn't a `deviation` — deviations annotate a card without moving its lane. */
export function latestForLane(events: BoardEvent[]): BoardEvent | null {
  for (const event of [...events].reverse()) {
    if (event.eventType !== 'deviation') return event;
  }
  return null;
}

export function deriveLane(latest: BoardEvent | null): Lane {
  if (!latest) return 'inProgress';
  if (latest.eventType === 'workflowCompleted') return 'done';
  if (latest.eventType === 'workflowSelected') return 'inProgress';
  if (latest.eventType === 'stageEvent') {
    if (latest.status === 'blocked') return 'blocked';
    if (latest.status === 'entered' && latest.humanCheckpoint === 'required') return 'blocked';
    return 'inProgress';
  }
  return 'inProgress';
}

export function latestNoteText(events: BoardEvent[]): string {
  for (const event of [...events].reverse()) {
    if (event.eventType === 'deviation') {
      return `Deviation (${event.deviationStatus}): ${event.reason}`;
    }
    if (event.note) return event.note;
  }
  return '';
}

/**
 * Groups events by workItem and derives each item's lane, latest event,
 * note, and citation count. Always a full rebuild from the given events —
 * there's no incremental state to reconcile, so a shrunk or out-of-order
 * log is simply a fresh read.
 */
export function deriveWorkItems(events: BoardEvent[]): Map<string, WorkItem> {
  const map = new Map<string, WorkItem>();
  for (const event of events) {
    let item = map.get(event.workItem);
    if (!item) {
      item = {
        workItem: event.workItem,
        workflowId: event.workflowId,
        chain: null,
        events: [],
        citationCount: 0,
        firstTimestamp: event.timestamp,
        lastTimestamp: event.timestamp,
        latest: null,
        lane: 'inProgress',
        latestNote: '',
      };
      map.set(event.workItem, item);
    }
    item.events.push(event);
    if (event.eventType === 'workflowSelected' && event.chain) item.chain = event.chain;
    if (Array.isArray(event.lawCitations)) item.citationCount += event.lawCitations.length;
  }
  for (const item of map.values()) {
    item.events.sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
    const first = item.events[0];
    const last = item.events[item.events.length - 1];
    if (first) item.firstTimestamp = first.timestamp;
    if (last) item.lastTimestamp = last.timestamp;
    item.latest = latestForLane(item.events);
    item.lane = deriveLane(item.latest);
    item.latestNote = latestNoteText(item.events);
  }
  return map;
}

export function truncate(text: string, max: number): string {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function formatElapsed(fromIso: string): string {
  const from = new Date(fromIso).getTime();
  if (Number.isNaN(from)) return 'unknown';
  const diffMs = Math.max(0, Date.now() - from);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export function statusMessage(count: number, skippedCount: number): string {
  const base = `${count} event${count === 1 ? '' : 's'} loaded`;
  return skippedCount > 0 ? `${base} (${skippedCount} malformed line${skippedCount === 1 ? '' : 's'} skipped)` : base;
}

export function stageSummary(latest: BoardEvent | null): string {
  if (!latest) return '';
  if (latest.eventType === 'stageEvent') return `${latest.stageId} · ${latest.persona}`;
  if (latest.eventType === 'workflowSelected') return 'not yet started';
  if (latest.eventType === 'workflowCompleted') return 'complete';
  return '';
}

export function statusDotClass(latest: BoardEvent | null): string {
  if (!latest) return 'status-entered';
  if (latest.eventType === 'workflowCompleted') return 'status-complete';
  if (latest.eventType === 'stageEvent') return `status-${latest.status}`;
  return 'status-entered';
}
