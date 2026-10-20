import type { AcceptanceCriterion, BoardEvent, TestResult, WorkItem } from './types';

/** The most recently declared AC set for a work item — a later declaration replaces an earlier one wholesale. */
export function latestAcceptanceCriteria(events: BoardEvent[]): AcceptanceCriterion[] {
  for (const event of [...events].reverse()) {
    if (event.eventType === 'stageEvent' && event.acceptanceCriteria) return event.acceptanceCriteria;
  }
  return [];
}

/** Merges every testResults entry across a work item's events, a later event overriding an earlier one for the same acId+testId. */
export function mergedTestResults(events: BoardEvent[]): TestResult[] {
  const byKey = new Map<string, TestResult>();
  for (const event of events) {
    if (event.eventType !== 'stageEvent' || !event.testResults) continue;
    for (const result of event.testResults) {
      byKey.set(`${result.acId}::${result.testId}`, result);
    }
  }
  return [...byKey.values()];
}

export interface AcTestRow {
  ac: AcceptanceCriterion;
  results: TestResult[];
}

/** Joins each AC to its own test results, in AC declaration order; an AC with nothing reported yet gets an empty results array. */
export function buildTraceabilityMatrix(events: BoardEvent[]): AcTestRow[] {
  const acs = latestAcceptanceCriteria(events);
  const results = mergedTestResults(events);
  return acs.map((ac) => ({ ac, results: results.filter((result) => result.acId === ac.id) }));
}

/** The work item whose latest event is most recent — the sensible default selection for a per-item view. */
export function mostRecentWorkItemId(workItems: Map<string, WorkItem>): string | null {
  let bestId: string | null = null;
  let bestTimestamp = '';
  for (const item of workItems.values()) {
    if (bestId === null || item.lastTimestamp > bestTimestamp) {
      bestId = item.workItem;
      bestTimestamp = item.lastTimestamp;
    }
  }
  return bestId;
}
