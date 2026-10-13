import { render, screen } from '@testing-library/react';

import { BarCohortChart } from './bar-cohort-chart';

describe('BarCohortChart', () => {
  it('renders the title and a bar label per bucket', () => {
    render(<BarCohortChart title="Laws" data={[{ key: 'LAW-8.1', count: 3 }, { key: 'LAW-4.5', count: 1 }]} />);
    expect(screen.getByText('Laws')).toBeTruthy();
    expect(screen.getByText('LAW-8.1')).toBeTruthy();
    expect(screen.getByText('LAW-4.5')).toBeTruthy();
  });

  it('shows an empty-state message when there is no data', () => {
    render(<BarCohortChart title="Laws" data={[]} />);
    expect(screen.getByText('Laws')).toBeTruthy();
    expect(screen.getByText(/no laws activity/i)).toBeTruthy();
  });
});
