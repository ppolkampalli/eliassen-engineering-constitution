import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { AdrRecords } from './adr-records';
import type { AdrRecord, AdrResponse } from '../lib/types';

const first: AdrRecord = { filename: '0001-first.md', title: 'ADR-0001: First', content: '# ADR-0001: First\n\nFirst body.' };
const second: AdrRecord = { filename: '0002-second.md', title: 'ADR-0002: Second', content: '# ADR-0002: Second\n\nSecond body.' };

function jsonResponse(payload: AdrResponse): { ok: boolean; status: number; json: () => Promise<AdrResponse> } {
  return { ok: true, status: 200, json: () => Promise.resolve(payload) };
}

describe('AdrRecords', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('defaults to selecting and previewing the first record in the list', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ records: [first, second], mtimeMs: 1 }));
    render(<AdrRecords />);

    await waitFor(() => expect(screen.getByText('2 ADR documents')).toBeTruthy());
    expect(screen.getByText('First body.')).toBeTruthy();
    expect(screen.queryByText('Second body.')).toBeNull();
  });

  it('switches the preview when a different record is clicked in the nav', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ records: [first, second], mtimeMs: 1 }));
    render(<AdrRecords />);
    await waitFor(() => expect(screen.getByText('First body.')).toBeTruthy());

    fireEvent.click(screen.getByText('ADR-0002: Second'));
    expect(screen.getByText('Second body.')).toBeTruthy();
    expect(screen.queryByText('First body.')).toBeNull();
  });

  it('shows a singular-document message for exactly one record', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ records: [first], mtimeMs: 1 }));
    render(<AdrRecords />);
    await waitFor(() => expect(screen.getByText('1 ADR document')).toBeTruthy());
  });

  it('shows an empty-state message when no ADR documents exist', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse({ records: [], mtimeMs: null }));
    render(<AdrRecords />);
    await waitFor(() => expect(screen.getByText('No ADR documents found.')).toBeTruthy());
  });

  it('shows an error message for a failed request', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network down'));
    render(<AdrRecords />);
    await waitFor(() => expect(screen.getByText(/error: network down/i)).toBeTruthy());
  });
});
