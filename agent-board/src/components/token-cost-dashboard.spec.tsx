import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TokenCostDashboard } from './token-cost-dashboard';
import type { CostReport } from '../lib/token-cost-model';

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 280 });
});

const report: CostReport = {
  totalCostUsd: 1.5,
  unpricedRecordCount: 2,
  unattributedRecordCount: 1,
  byWorkItem: [{ key: 'JIRA-1', count: 1.5 }],
  byWorkflow: [{ key: 'WF-BUG', count: 1.5 }],
  byStage: [{ key: 'fix', count: 1.5 }],
  byPersona: [{ key: 'persona-software-engineer', count: 1.5 }],
  byModel: [{ key: 'claude-sonnet-5', count: 1.5 }],
  timeSeries: [{ bucketStart: '2026-10-13T10:00:00.000Z', costUsd: 1.5 }],
};

function jsonResponse(payload: CostReport): { ok: boolean; status: number; json: () => Promise<CostReport> } {
  return { ok: true, status: 200, json: () => Promise.resolve(payload) };
}

describe('TokenCostDashboard', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders stat tiles and breakdowns once the report loads', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse(report));
    render(<TokenCostDashboard />);

    await waitFor(() => expect(screen.getByText('$1.50')).toBeTruthy());
    expect(screen.getByText('Up to date')).toBeTruthy();
    expect(screen.getByText('WF-BUG')).toBeTruthy();
    expect(screen.getByText('persona-software-engineer')).toBeTruthy();
  });

  it('re-fetches when Refresh is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(jsonResponse(report));
    render(<TokenCostDashboard />);
    await waitFor(() => expect(screen.getByText('$1.50')).toBeTruthy());

    const callsBefore = (global.fetch as jest.Mock).mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    await waitFor(() => expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(callsBefore));
  });

  it('shows an error message for a failed request', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network down'));
    render(<TokenCostDashboard />);
    await waitFor(() => expect(screen.getByText(/error: network down/i)).toBeTruthy());
  });
});
