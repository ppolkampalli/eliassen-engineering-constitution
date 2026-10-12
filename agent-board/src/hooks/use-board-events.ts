import { useEffect, useRef, useState } from 'react';

import type { BoardEvent, EventsResponse } from '../lib/types';

export interface BoardEventsState {
  events: BoardEvent[];
  skippedCount: number;
  error: string | null;
  loaded: boolean;
}

const POLL_INTERVAL_MS = 1500;

/**
 * Polls GET /api/events on an interval and only updates state when the
 * file's mtimeMs has actually changed — mirrors the old viewer's "skip
 * re-render on unchanged content" behavior without diffing full JSON text.
 * A failed poll sets `error` but keeps the last-known-good events, so the
 * board degrades gracefully instead of going blank.
 */
export function useBoardEvents(pollIntervalMs: number = POLL_INTERVAL_MS): BoardEventsState {
  const [state, setState] = useState<BoardEventsState>({
    events: [],
    skippedCount: 0,
    error: null,
    loaded: false,
  });
  const lastMtimeRef = useRef<number | null>(null);
  const hasPolledRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    async function poll(): Promise<void> {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`request failed: ${response.status}`);
        }
        const payload = (await response.json()) as EventsResponse;
        if (isCancelled) return;
        if (hasPolledRef.current && payload.mtimeMs === lastMtimeRef.current) {
          return;
        }
        hasPolledRef.current = true;
        lastMtimeRef.current = payload.mtimeMs;
        setState({ events: payload.events, skippedCount: payload.skippedCount, error: null, loaded: true });
      } catch (error) {
        if (isCancelled) return;
        setState((previous) => ({
          ...previous,
          error: error instanceof Error ? error.message : 'unknown error',
          loaded: true,
        }));
      }
    }

    void poll();
    const timer = setInterval(() => {
      void poll();
    }, pollIntervalMs);

    return () => {
      isCancelled = true;
      clearInterval(timer);
    };
  }, [pollIntervalMs]);

  return state;
}
