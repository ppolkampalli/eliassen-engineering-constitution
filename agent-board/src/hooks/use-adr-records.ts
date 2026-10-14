import { useEffect, useRef, useState } from 'react';

import type { AdrRecord, AdrResponse } from '../lib/types';

export interface AdrRecordsState {
  records: AdrRecord[];
  error: string | null;
  loaded: boolean;
}

/** ADR files change far less often than board events, and this endpoint returns full file content on every tick, not a compact event log — a longer default interval keeps that cheap. */
const POLL_INTERVAL_MS = 5000;

/** Polls GET /api/adr on an interval; skips the state update when the file set's mtimeMs is unchanged — same pattern as useBoardEvents. */
export function useAdrRecords(pollIntervalMs: number = POLL_INTERVAL_MS): AdrRecordsState {
  const [state, setState] = useState<AdrRecordsState>({ records: [], error: null, loaded: false });
  const lastMtimeRef = useRef<number | null>(null);
  const hasPolledRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    async function poll(): Promise<void> {
      try {
        const response = await fetch('/api/adr');
        if (!response.ok) {
          throw new Error(`request failed: ${response.status}`);
        }
        const payload = (await response.json()) as AdrResponse;
        if (isCancelled) return;
        if (hasPolledRef.current && payload.mtimeMs === lastMtimeRef.current) {
          return;
        }
        hasPolledRef.current = true;
        lastMtimeRef.current = payload.mtimeMs;
        setState({ records: payload.records, error: null, loaded: true });
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
