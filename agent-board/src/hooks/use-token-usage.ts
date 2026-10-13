import { useEffect, useState } from 'react';

import type { CostReport } from '../lib/token-cost-model';

export interface TokenUsageState {
  report: CostReport | null;
  error: string | null;
  loading: boolean;
}

export interface TokenUsageHook extends TokenUsageState {
  refresh: () => void;
}

/**
 * Fetches GET /api/token-usage once on mount and again whenever `refresh`
 * is called — deliberately not polled like `useBoardEvents`, since scanning
 * potentially-large transcript files on every tick would be wasteful (see
 * agent-board/README.md's "Token & Cost tab" section).
 */
export function useTokenUsage(): TokenUsageHook {
  const [state, setState] = useState<TokenUsageState>({ report: null, error: null, loading: true });
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    setState((previous) => ({ ...previous, loading: true }));

    async function load(): Promise<void> {
      try {
        const response = await fetch('/api/token-usage');
        if (!response.ok) {
          throw new Error(`request failed: ${response.status}`);
        }
        const report = (await response.json()) as CostReport;
        if (isCancelled) return;
        setState({ report, error: null, loading: false });
      } catch (error) {
        if (isCancelled) return;
        setState((previous) => ({
          ...previous,
          error: error instanceof Error ? error.message : 'unknown error',
          loading: false,
        }));
      }
    }

    void load();
    return () => {
      isCancelled = true;
    };
  }, [requestId]);

  return { ...state, refresh: () => setRequestId((id) => id + 1) };
}
