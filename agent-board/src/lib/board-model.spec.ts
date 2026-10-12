import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  deriveLane,
  deriveWorkItems,
  formatElapsed,
  isValidEvent,
  latestForLane,
  latestNoteText,
  parseLog,
  stageSummary,
  statusDotClass,
  statusMessage,
  truncate,
} from './board-model';
import type { DeviationEvent, StageEvent, WorkflowCompletedEvent, WorkflowSelectedEvent } from './types';

const FIXTURES_DIR = join(__dirname, '../../fixtures');
const readFixture = (name: string): string => readFileSync(join(FIXTURES_DIR, name), 'utf8');

const selected: WorkflowSelectedEvent = {
  schemaVersion: '1.0',
  timestamp: '2026-10-12T00:00:00Z',
  eventType: 'workflowSelected',
  workItem: 'JIRA-1',
  workflowId: 'WF-BUG',
};

const stage: StageEvent = {
  schemaVersion: '1.0',
  timestamp: '2026-10-12T00:01:00Z',
  eventType: 'stageEvent',
  workItem: 'JIRA-1',
  workflowId: 'WF-BUG',
  stageId: 'fix',
  persona: 'persona-software-engineer',
  status: 'entered',
  humanCheckpoint: 'none',
};

const deviation: DeviationEvent = {
  schemaVersion: '1.0',
  timestamp: '2026-10-12T00:02:00Z',
  eventType: 'deviation',
  workItem: 'JIRA-1',
  workflowId: 'WF-BUG',
  stageId: 'fix',
  deviationStatus: 'applied',
  reason: 'test reason',
};

const completed: WorkflowCompletedEvent = {
  schemaVersion: '1.0',
  timestamp: '2026-10-12T00:03:00Z',
  eventType: 'workflowCompleted',
  workItem: 'JIRA-1',
  workflowId: 'WF-BUG',
};

describe('isValidEvent', () => {
  it.each(['schemaVersion', 'timestamp', 'eventType', 'workItem', 'workflowId'])(
    'rejects an event missing envelope field %s',
    (field) => {
      const broken = { ...selected } as Record<string, unknown>;
      delete broken[field];
      expect(isValidEvent(broken)).toBe(false);
    }
  );

  it('rejects null', () => {
    expect(isValidEvent(null)).toBe(false);
  });

  it('rejects a non-object', () => {
    expect(isValidEvent('not an object')).toBe(false);
  });

  it('rejects an unrecognized eventType', () => {
    expect(isValidEvent({ ...selected, eventType: 'somethingElse' })).toBe(false);
  });

  it.each(['stageId', 'persona', 'status', 'humanCheckpoint'])(
    'rejects a stageEvent missing %s',
    (field) => {
      const broken = { ...stage } as Record<string, unknown>;
      delete broken[field];
      expect(isValidEvent(broken)).toBe(false);
    }
  );

  it.each(['stageId', 'deviationStatus', 'reason'])('rejects a deviation missing %s', (field) => {
    const broken = { ...deviation } as Record<string, unknown>;
    delete broken[field];
    expect(isValidEvent(broken)).toBe(false);
  });

  it('accepts a valid workflowCompleted event', () => {
    expect(isValidEvent(completed)).toBe(true);
  });
});

describe('parseLog against fixtures', () => {
  it('parses the full sample lifecycle with no skips', () => {
    const { events, skippedCount } = parseLog(readFixture('events.sample.jsonl'));
    expect(events).toHaveLength(16);
    expect(skippedCount).toBe(0);
  });

  it('returns an empty result for an empty file', () => {
    const { events, skippedCount } = parseLog(readFixture('events.empty.jsonl'));
    expect(events).toHaveLength(0);
    expect(skippedCount).toBe(0);
  });

  it('skips unparseable lines without throwing', () => {
    const { events, skippedCount } = parseLog(readFixture('events.malformed-mixed.jsonl'));
    expect(events).toHaveLength(3);
    expect(skippedCount).toBe(2);
  });

  it('skips schema-invalid lines (missing fields, unknown eventType)', () => {
    const { events, skippedCount } = parseLog(readFixture('events.schema-invalid.jsonl'));
    expect(events).toHaveLength(2);
    expect(skippedCount).toBe(3);
  });

  it('parses the deviation-latest fixture', () => {
    const { events, skippedCount } = parseLog(readFixture('events.deviation-latest.jsonl'));
    expect(events).toHaveLength(3);
    expect(skippedCount).toBe(0);
  });
});

describe('latestForLane / deriveLane', () => {
  it('returns null and inProgress for an empty list', () => {
    expect(latestForLane([])).toBeNull();
    expect(deriveLane(null)).toBe('inProgress');
  });

  it('skips a trailing deviation to find the real latest event', () => {
    expect(latestForLane([stage, deviation])).toBe(stage);
  });

  it('maps workflowCompleted to done', () => {
    expect(deriveLane(completed)).toBe('done');
  });

  it('maps workflowSelected to inProgress', () => {
    expect(deriveLane(selected)).toBe('inProgress');
  });

  it('maps a blocked stageEvent to blocked', () => {
    expect(deriveLane({ ...stage, status: 'blocked' })).toBe('blocked');
  });

  it('maps an entered stageEvent with a required checkpoint to blocked', () => {
    expect(deriveLane({ ...stage, status: 'entered', humanCheckpoint: 'required' })).toBe('blocked');
  });

  it('maps an entered stageEvent with no required checkpoint to inProgress', () => {
    expect(deriveLane({ ...stage, status: 'entered', humanCheckpoint: 'none' })).toBe('inProgress');
  });

  it('maps a complete stageEvent to inProgress', () => {
    expect(deriveLane({ ...stage, status: 'complete' })).toBe('inProgress');
  });
});

describe('latestNoteText', () => {
  it('returns empty string for no events', () => {
    expect(latestNoteText([])).toBe('');
  });

  it('returns the deviation reason when the last event is a deviation', () => {
    expect(latestNoteText([stage, deviation])).toBe('Deviation (applied): test reason');
  });

  it("returns the latest event's note when present", () => {
    expect(latestNoteText([{ ...stage, note: 'working on it' }])).toBe('working on it');
  });

  it('falls back to empty string when nothing has a note', () => {
    expect(latestNoteText([selected])).toBe('');
  });
});

describe('deriveWorkItems', () => {
  it('buckets the sample fixture into the three lanes with correct citation counts', () => {
    const { events } = parseLog(readFixture('events.sample.jsonl'));
    const items = deriveWorkItems(events);
    expect(items.get('JIRA-3411')?.lane).toBe('done');
    expect(items.get('JIRA-3411')?.citationCount).toBe(3);
    expect(items.get('JIRA-3500')?.lane).toBe('blocked');
    expect(items.get('JIRA-3600')?.lane).toBe('inProgress');
  });

  it('keeps a card in its prior lane when the latest event is a deviation, but surfaces the deviation note', () => {
    const { events } = parseLog(readFixture('events.deviation-latest.jsonl'));
    const items = deriveWorkItems(events);
    const item = items.get('JIRA-9200');
    expect(item?.lane).toBe('blocked');
    expect(item?.latestNote).toMatch(/^Deviation \(applied\)/);
    expect(item?.chain).toContain('architect(design*)');
  });

  it('returns an empty map for no events', () => {
    expect(deriveWorkItems([]).size).toBe(0);
  });

  it('keeps two already-ascending events in order', () => {
    const earlier = { ...selected, timestamp: '2026-10-12T00:00:00Z' };
    const later = { ...completed, timestamp: '2026-10-12T00:01:00Z' };
    expect(deriveWorkItems([earlier, later]).get('JIRA-1')?.events).toEqual([earlier, later]);
  });

  it('sorts two out-of-order events back into ascending order', () => {
    const earlier = { ...selected, timestamp: '2026-10-12T00:00:00Z' };
    const later = { ...completed, timestamp: '2026-10-12T00:01:00Z' };
    expect(deriveWorkItems([later, earlier]).get('JIRA-1')?.events).toEqual([earlier, later]);
  });

  it('preserves stable order for two events with an identical timestamp', () => {
    const first = { ...selected, timestamp: '2026-10-12T00:00:00Z' };
    const second = { ...completed, timestamp: '2026-10-12T00:00:00Z' };
    expect(deriveWorkItems([first, second]).get('JIRA-1')?.events).toEqual([first, second]);
  });
});

describe('formatElapsed', () => {
  const NOW = new Date('2026-10-12T12:00:00Z').getTime();

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  it('returns "unknown" for an unparseable timestamp', () => {
    expect(formatElapsed('not-a-date')).toBe('unknown');
  });

  it('returns "just now" for under a minute', () => {
    expect(formatElapsed(new Date(NOW - 30_000).toISOString())).toBe('just now');
  });

  it('returns minutes for under an hour', () => {
    expect(formatElapsed(new Date(NOW - 5 * 60_000).toISOString())).toBe('5m');
  });

  it('returns hours and minutes for under a day', () => {
    expect(formatElapsed(new Date(NOW - (2 * 60 + 10) * 60_000).toISOString())).toBe('2h 10m');
  });

  it('returns days and hours beyond a day', () => {
    expect(formatElapsed(new Date(NOW - (26 * 60) * 60_000).toISOString())).toBe('1d 2h');
  });
});

describe('truncate', () => {
  it('returns empty string for falsy input', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('leaves short text untouched', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('truncates long text with an ellipsis', () => {
    expect(truncate('a very long note indeed', 10)).toBe('a very lo…');
  });
});

describe('stageSummary / statusDotClass / statusMessage', () => {
  it('returns empty string / status-entered for no latest event', () => {
    expect(stageSummary(null)).toBe('');
    expect(statusDotClass(null)).toBe('status-entered');
  });

  it('describes a stageEvent', () => {
    expect(stageSummary(stage)).toBe('fix · persona-software-engineer');
    expect(statusDotClass(stage)).toBe('status-entered');
  });

  it('describes a workflowSelected event', () => {
    expect(stageSummary(selected)).toBe('not yet started');
  });

  it('describes a workflowCompleted event', () => {
    expect(stageSummary(completed)).toBe('complete');
    expect(statusDotClass(completed)).toBe('status-complete');
  });

  it('describes a deviation as neither stage nor terminal', () => {
    expect(stageSummary(deviation)).toBe('');
    expect(statusDotClass(deviation)).toBe('status-entered');
  });

  it('formats singular and plural counts', () => {
    expect(statusMessage(1, 0)).toBe('1 event loaded');
    expect(statusMessage(2, 0)).toBe('2 events loaded');
    expect(statusMessage(3, 1)).toBe('3 events loaded (1 malformed line skipped)');
    expect(statusMessage(3, 2)).toBe('3 events loaded (2 malformed lines skipped)');
  });
});

describe('deriveLane direct-call edge case', () => {
  it('falls through to inProgress when called directly with a deviation event', () => {
    // deriveWorkItems never passes a deviation to deriveLane (latestForLane
    // filters those out first), so this branch needs a direct unit test.
    expect(deriveLane(deviation)).toBe('inProgress');
  });
});
