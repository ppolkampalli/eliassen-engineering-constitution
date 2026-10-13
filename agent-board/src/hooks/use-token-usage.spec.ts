import { act, renderHook, waitFor } from '@testing-library/react';

import { useTokenUsage } from './use-token-usage';
import type { CostReport } from '../lib/token-cost-model';

function jsonResponse(report: CostReport, ok = true): { ok: boolean; status: number; json: () => Promise<CostReport> } {
  return { ok, status: ok ? 200 : 500, json: () => Promise.resolve(report) };
}

const emptyReport: CostReport = {
  totalCostUsd: 0,
  unpricedRecordCount: 0,
  unattributedRecordCount: 0,
  byWorkItem: [],
  byWorkflow: [],
  byStage: [],
  byPersona: [],
  byModel: [],
  timeSeries: [],
};

describe('useTokenUsage', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('fetches once on mount and reflects the response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ...emptyReport, totalCostUsd: 1.23 }));
    const { result } = renderHook(() => useTokenUsage());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.report?.totalCostUsd).toBe(1.23);
    expect(result.current.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('re-fetches when refresh is called', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ...emptyReport, totalCostUsd: 1 }));
    fetchMock.mockResolvedValueOnce(jsonResponse({ ...emptyReport, totalCostUsd: 2 }));
    const { result } = renderHook(() => useTokenUsage());
    await waitFor(() => expect(result.current.report?.totalCostUsd).toBe(1));

    act(() => result.current.refresh());

    await waitFor(() => expect(result.current.report?.totalCostUsd).toBe(2));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('records a descriptive error for a non-ok HTTP response', async () => {
    fetchMock.mockResolvedValue(jsonResponse(emptyReport, false));
    const { result } = renderHook(() => useTokenUsage());
    await waitFor(() => expect(result.current.error).toBe('request failed: 500'));
  });

  it('records a generic message when a non-Error is thrown', async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    fetchMock.mockRejectedValue('not an Error instance');
    const { result } = renderHook(() => useTokenUsage());
    await waitFor(() => expect(result.current.error).toBe('unknown error'));
  });

  it('ignores a response that resolves after unmount', async () => {
    let resolveFetch: (value: unknown) => void = () => undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    const { unmount } = renderHook(() => useTokenUsage());
    unmount();
    resolveFetch(jsonResponse(emptyReport));
    await Promise.resolve();
    await Promise.resolve();
  });

  it('ignores a rejection that happens after unmount', async () => {
    let rejectFetch: (reason: unknown) => void = () => undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectFetch = reject;
        })
    );
    const { unmount } = renderHook(() => useTokenUsage());
    unmount();
    rejectFetch(new Error('late failure'));
    await Promise.resolve();
    await Promise.resolve();
  });
});
