import { renderHook, waitFor } from '@testing-library/react';

import { useBoardEvents } from './use-board-events';
import type { BoardEvent, EventsResponse } from '../lib/types';

// Large enough that the interval never fires again within a test's
// lifetime, so only the immediate on-mount poll is exercised — avoids
// racing the real setInterval timer against assertions.
const NO_REPEAT_INTERVAL_MS = 10_000_000;
const SHORT_INTERVAL_MS = 20;

function jsonResponse(
  payload: EventsResponse,
  ok = true
): { ok: boolean; status: number; json: () => Promise<EventsResponse> } {
  return { ok, status: ok ? 200 : 500, json: () => Promise.resolve(payload) };
}

const sampleEvent: BoardEvent = {
  schemaVersion: '1.0',
  timestamp: '2026-10-12T00:00:00Z',
  eventType: 'workflowCompleted',
  workItem: 'JIRA-1',
  workflowId: 'WF-BUG',
};

describe('useBoardEvents', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('fetches on mount and reflects the response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ events: [], skippedCount: 0, mtimeMs: null }));
    const { result } = renderHook(() => useBoardEvents(NO_REPEAT_INTERVAL_MS));

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('updates events when a later poll has a new mtimeMs', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ events: [], skippedCount: 0, mtimeMs: 1 }));
    fetchMock.mockResolvedValue(jsonResponse({ events: [sampleEvent], skippedCount: 0, mtimeMs: 2 }));
    const { result } = renderHook(() => useBoardEvents(SHORT_INTERVAL_MS));

    await waitFor(() => expect(result.current.events).toHaveLength(1));
  });

  it('does not thrash state when mtimeMs is unchanged across repeated polls', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ events: [sampleEvent], skippedCount: 0, mtimeMs: 42 }));
    const { result } = renderHook(() => useBoardEvents(SHORT_INTERVAL_MS));
    await waitFor(() => expect(result.current.events).toHaveLength(1));

    const callsBefore = fetchMock.mock.calls.length;
    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(callsBefore));
    expect(result.current.events).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('keeps previous events and records an error when a poll fails', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ events: [sampleEvent], skippedCount: 0, mtimeMs: 1 }));
    fetchMock.mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useBoardEvents(SHORT_INTERVAL_MS));

    await waitFor(() => expect(result.current.error).toBe('network down'));
    expect(result.current.events).toHaveLength(1);
  });

  it('records a descriptive error for a non-ok HTTP response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ events: [], skippedCount: 0, mtimeMs: null }, false));
    const { result } = renderHook(() => useBoardEvents(NO_REPEAT_INTERVAL_MS));
    await waitFor(() => expect(result.current.error).toBe('request failed: 500'));
  });

  it('records a generic message when a non-Error is thrown', async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    fetchMock.mockRejectedValue('not an Error instance');
    const { result } = renderHook(() => useBoardEvents(NO_REPEAT_INTERVAL_MS));
    await waitFor(() => expect(result.current.error).toBe('unknown error'));
  });

  it('unmounts cleanly without further state updates', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ events: [], skippedCount: 0, mtimeMs: null }));
    const { result, unmount } = renderHook(() => useBoardEvents(NO_REPEAT_INTERVAL_MS));
    await waitFor(() => expect(result.current.loaded).toBe(true));
    unmount();
  });

  it('ignores a successful poll that resolves after unmount', async () => {
    let resolveFetch: (value: unknown) => void = () => undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    const { unmount } = renderHook(() => useBoardEvents(NO_REPEAT_INTERVAL_MS));
    unmount();
    resolveFetch(jsonResponse({ events: [], skippedCount: 0, mtimeMs: null }));
    await Promise.resolve();
    await Promise.resolve();
    // No assertion beyond "doesn't throw" — this exercises the post-unmount
    // cancelled-guard on the success path, which has nothing observable
    // left to check once the hook has been torn down.
  });

  it('ignores a failed poll that rejects after unmount', async () => {
    let rejectFetch: (reason: unknown) => void = () => undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectFetch = reject;
        })
    );
    const { unmount } = renderHook(() => useBoardEvents(NO_REPEAT_INTERVAL_MS));
    unmount();
    rejectFetch(new Error('late failure'));
    await Promise.resolve();
    await Promise.resolve();
    // Same rationale as above, for the post-unmount cancelled-guard on the
    // catch path.
  });
});
