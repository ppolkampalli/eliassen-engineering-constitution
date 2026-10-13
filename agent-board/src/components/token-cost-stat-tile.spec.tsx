import { render, screen } from '@testing-library/react';

import { TokenCostStatTile } from './token-cost-stat-tile';

describe('TokenCostStatTile', () => {
  it('renders the label and value', () => {
    render(<TokenCostStatTile label="Total cost" value="$1.23" />);
    expect(screen.getByText('Total cost')).toBeTruthy();
    expect(screen.getByText('$1.23')).toBeTruthy();
  });
});
