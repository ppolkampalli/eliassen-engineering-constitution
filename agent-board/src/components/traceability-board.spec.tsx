import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TraceabilityBoard } from './traceability-board';
import type { EventsResponse, StageEvent } from '../lib/types';

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

function jsonResponse(payload: EventsResponse): { ok: boolean; status: number; json: () => Promise<EventsResponse> } {
  return { ok: true, status: 200, json: () => Promise.resolve(payload) };
}

describe('TraceabilityBoard', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('shows an empty-state message when there are no work items yet', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ events: [], skippedCount: 0, mtimeMs: null }));
    render(<TraceabilityBoard />);
    await waitFor(() => expect(screen.getByText('No work items yet.')).toBeTruthy());
  });

  it('shows an error message for a failed request', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network down'));
    render(<TraceabilityBoard />);
    await waitFor(() => expect(screen.getByText(/error: network down/i)).toBeTruthy());
  });

  it('defaults to the most recently active work item and its first AC, showing its test matrix', async () => {
    const events: StageEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        acceptanceCriteria: [{ id: 'AC-1', text: 'Shows the empty state' }],
      }),
      stageEvent({
        workItem: 'JIRA-2',
        timestamp: '2026-01-02T00:00:00Z',
        acceptanceCriteria: [
          { id: 'AC-1', text: 'Renders the list' },
          { id: 'AC-2', text: 'Handles pagination' },
        ],
      }),
      stageEvent({
        workItem: 'JIRA-2',
        timestamp: '2026-01-03T00:00:00Z',
        stageId: 'implement',
        testResults: [{ acId: 'AC-1', testId: '[AC-1] renders the list', testType: 'unit', status: 'pass' }],
      }),
    ];
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ events, skippedCount: 0, mtimeMs: 1 }));
    render(<TraceabilityBoard />);

    await waitFor(() => expect(screen.getByRole('button', { name: 'JIRA-2' })).toBeTruthy());
    expect(screen.getByText('Renders the list')).toBeTruthy();
    expect(screen.getByText('[AC-1] renders the list')).toBeTruthy();
    expect(screen.getByText('pass')).toBeTruthy();
  });

  it('switches work item and resets the AC selection, updating the matrix', async () => {
    const events: StageEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        acceptanceCriteria: [{ id: 'AC-1', text: 'First item AC' }],
      }),
      stageEvent({
        workItem: 'JIRA-2',
        timestamp: '2026-01-02T00:00:00Z',
        acceptanceCriteria: [{ id: 'AC-1', text: 'Second item AC' }],
      }),
    ];
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ events, skippedCount: 0, mtimeMs: 1 }));
    render(<TraceabilityBoard />);
    await waitFor(() => expect(screen.getByText('Second item AC')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: 'JIRA-1' }));
    expect(screen.getByText('First item AC')).toBeTruthy();
    expect(screen.queryByText('Second item AC')).toBeNull();
  });

  it('switches the AC selection when a different AC is clicked in the nav', async () => {
    const events: StageEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        acceptanceCriteria: [
          { id: 'AC-1', text: 'First criterion' },
          { id: 'AC-2', text: 'Second criterion' },
        ],
        testResults: [{ acId: 'AC-2', testId: '[AC-2] second', testType: 'integration', status: 'fail' }],
      }),
    ];
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ events, skippedCount: 0, mtimeMs: 1 }));
    render(<TraceabilityBoard />);
    await waitFor(() => expect(screen.getByText('First criterion')).toBeTruthy());
    expect(screen.getByText('No test results reported yet for AC-1.')).toBeTruthy();

    fireEvent.click(screen.getByText('Second criterion'));
    expect(screen.getByText('[AC-2] second')).toBeTruthy();
    expect(screen.getByText('fail')).toBeTruthy();
  });

  it('shows a no-ACs message when the active work item has no acceptance criteria', async () => {
    const events: StageEvent[] = [stageEvent({ workItem: 'JIRA-1', timestamp: '2026-01-01T00:00:00Z' })];
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ events, skippedCount: 0, mtimeMs: 1 }));
    render(<TraceabilityBoard />);
    await waitFor(() => expect(screen.getByText('No acceptance criteria reported yet for JIRA-1.')).toBeTruthy());
  });

  it('groups test results under each test type heading', async () => {
    const events: StageEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        acceptanceCriteria: [{ id: 'AC-1', text: 'Multi-type criterion' }],
        testResults: [
          { acId: 'AC-1', testId: 'unit-1', testType: 'unit', status: 'pass' },
          { acId: 'AC-1', testId: 'e2e-1', testType: 'e2e', status: 'pending' },
        ],
      }),
    ];
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ events, skippedCount: 0, mtimeMs: 1 }));
    render(<TraceabilityBoard />);

    await waitFor(() => expect(screen.getByText('unit-1')).toBeTruthy());
    expect(screen.getByText('pass')).toBeTruthy();
    expect(screen.getByText('e2e-1')).toBeTruthy();
    expect(screen.getByText('pending')).toBeTruthy();
    expect(screen.getByText('unit (1)')).toBeTruthy();
    expect(screen.getByText('e2e (1)')).toBeTruthy();
  });

  it('maps every unit test to the AC (one-to-many) and shows each test file for review', async () => {
    const events: StageEvent[] = [
      stageEvent({
        workItem: 'JIRA-1',
        timestamp: '2026-01-01T00:00:00Z',
        acceptanceCriteria: [{ id: 'AC-1', text: 'Multiple unit tests criterion' }],
        testResults: [
          { acId: 'AC-1', testId: '[AC-1] case one', testType: 'unit', status: 'pass', testFile: 'src/lib/segment-model.spec.ts' },
          { acId: 'AC-1', testId: '[AC-1] case two', testType: 'unit', status: 'pass', testFile: 'src/lib/segment-model.spec.ts' },
          {
            acId: 'AC-1',
            testId: '[AC-1] case three',
            testType: 'unit',
            status: 'fail',
            testFile: 'src/lib/segment-model-edge-cases.spec.ts',
          },
        ],
      }),
    ];
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ events, skippedCount: 0, mtimeMs: 1 }));
    render(<TraceabilityBoard />);

    await waitFor(() => expect(screen.getByText('unit (3)')).toBeTruthy());
    expect(screen.getByText('[AC-1] case one')).toBeTruthy();
    expect(screen.getByText('[AC-1] case two')).toBeTruthy();
    expect(screen.getByText('[AC-1] case three')).toBeTruthy();
    expect(screen.getAllByText('src/lib/segment-model.spec.ts')).toHaveLength(2);
    expect(screen.getByText('src/lib/segment-model-edge-cases.spec.ts')).toBeTruthy();
  });
});
