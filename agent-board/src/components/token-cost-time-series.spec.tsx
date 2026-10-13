import { render, screen } from '@testing-library/react';

import { TokenCostTimeSeries, formatHourLabel, formatTooltipCost } from './token-cost-time-series';

describe('TokenCostTimeSeries', () => {
  it('renders an area chart for non-empty data', () => {
    const { container } = render(
      <TokenCostTimeSeries data={[{ bucketStart: '2026-10-13T10:00:00.000Z', costUsd: 1.5 }]} />
    );
    expect(container.querySelector('.recharts-area')).toBeTruthy();
  });

  it('shows an empty-state message when there is no data', () => {
    render(<TokenCostTimeSeries data={[]} />);
    expect(screen.getByText(/no token usage found/i)).toBeTruthy();
  });
});

describe('formatHourLabel', () => {
  it('formats an ISO timestamp as a locale date/time string', () => {
    expect(formatHourLabel('2026-10-13T10:00:00.000Z')).toBe(new Date('2026-10-13T10:00:00.000Z').toLocaleString());
  });
});

describe('formatTooltipCost', () => {
  it('formats a number as a 4-decimal dollar amount', () => {
    expect(formatTooltipCost(1.5)).toBe('$1.5000');
  });
});
