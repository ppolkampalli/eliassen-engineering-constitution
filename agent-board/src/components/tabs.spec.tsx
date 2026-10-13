import { fireEvent, render, screen } from '@testing-library/react';

import { Tabs } from './tabs';

const TAB_DEFS = [
  { id: 'kanban', label: 'Kanban Board' },
  { id: 'cohort', label: 'Constitution Cohort' },
];

describe('Tabs', () => {
  it('marks the active tab as selected and the other as not', () => {
    render(<Tabs tabs={TAB_DEFS} active="kanban" onChange={jest.fn()} />);
    expect(screen.getByRole('tab', { name: 'Kanban Board' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: 'Constitution Cohort' }).getAttribute('aria-selected')).toBe('false');
  });

  it('calls onChange with the clicked tab id', () => {
    const onChange = jest.fn();
    render(<Tabs tabs={TAB_DEFS} active="kanban" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Constitution Cohort' }));
    expect(onChange).toHaveBeenCalledWith('cohort');
  });
});
