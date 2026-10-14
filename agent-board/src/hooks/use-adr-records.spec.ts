import { renderHook, waitFor } from '@testing-library/react';

import { useAdrRecords } from './use-adr-records';
import type { AdrRecord, AdrResponse } from '../lib/types';

const NO_REPEAT_INTERVAL_MS = 10_000_000;
const SHORT_INTERVAL_MS = 20;

function jsonResponse(payload: AdrResponse, ok = true): { ok: boolean; status: number; json: () => Promise<AdrResponse> } {
  return { ok, status: ok ? 200 : 500, json: () => Promise.resolve(payload) };
}

const sampleRecord: AdrRecord = { filename: '0001-first.md', title: 'First', content: '# First' };

describe('useAdrRecords', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('fetches on mount and reflects the response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ records: [], mtimeMs: null }));
    const { result } = renderHook(() => useAdrRecords(NO_REPEAT_INTERVAL_MS));

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.records).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('defaults to the standard poll interval when none is given', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ records: [], mtimeMs: null }));
    const { result } = renderHook(() => useAdrRecords());
    await waitFor(() => expect(result.current.loaded).toBe(true));
  });

  it('updates records when a later poll has a new mtimeMs', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ records: [], mtimeMs: 1 }));
    fetchMock.mockResolvedValue(jsonResponse({ records: [sampleRecord], mtimeMs: 2 }));
    const { result } = renderHook(() => useAdrRecords(SHORT_INTERVAL_MS));

    await waitFor(() => expect(result.current.records).toHaveLength(1));
  });

  it('does not thrash state when mtimeMs is unchanged across repeated polls', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ records: [sampleRecord], mtimeMs: 42 }));
    const { result } = renderHook(() => useAdrRecords(SHORT_INTERVAL_MS));
    await waitFor(() => expect(result.current.records).toHaveLength(1));

    const callsBefore = fetchMock.mock.calls.length;
    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(callsBefore));
    expect(result.current.records).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('keeps previous records and records an error when a poll fails', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ records: [sampleRecord], mtimeMs: 1 }));
    fetchMock.mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useAdrRecords(SHORT_INTERVAL_MS));

    await waitFor(() => expect(result.current.error).toBe('network down'));
    expect(result.current.records).toHaveLength(1);
  });

  it('records a descriptive error for a non-ok HTTP response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ records: [], mtimeMs: null }, false));
    const { result } = renderHook(() => useAdrRecords(NO_REPEAT_INTERVAL_MS));
    await waitFor(() => expect(result.current.error).toBe('request failed: 500'));
  });

  it('records a generic message when a non-Error is thrown', async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    fetchMock.mockRejectedValue('not an Error instance');
    const { result } = renderHook(() => useAdrRecords(NO_REPEAT_INTERVAL_MS));
    await waitFor(() => expect(result.current.error).toBe('unknown error'));
  });

  it('ignores a successful poll that resolves after unmount', async () => {
    let resolveFetch: (value: unknown) => void = () => undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    const { unmount } = renderHook(() => useAdrRecords(NO_REPEAT_INTERVAL_MS));
    unmount();
    resolveFetch(jsonResponse({ records: [], mtimeMs: null }));
    await Promise.resolve();
    await Promise.resolve();
  });

  it('ignores a failed poll that rejects after unmount', async () => {
    let rejectFetch: (reason: unknown) => void = () => undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectFetch = reject;
        })
    );
    const { unmount } = renderHook(() => useAdrRecords(NO_REPEAT_INTERVAL_MS));
    unmount();
    rejectFetch(new Error('late failure'));
    await Promise.resolve();
    await Promise.resolve();
  });
});
