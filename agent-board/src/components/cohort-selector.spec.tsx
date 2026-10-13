import { fireEvent, render, screen } from '@testing-library/react';

import { CohortSelector } from './cohort-selector';

describe('CohortSelector', () => {
  it('marks the active cohort type as pressed and the others as not', () => {
    render(<CohortSelector active="laws" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Laws' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Workflow' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'Personas' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('calls onChange with the clicked cohort type', () => {
    const onChange = jest.fn();
    render(<CohortSelector active="laws" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Personas' }));
    expect(onChange).toHaveBeenCalledWith('personas');
  });

  it('does not call onChange when clicking the already-active option (toggle group deselect)', () => {
    const onChange = jest.fn();
    render(<CohortSelector active="laws" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Laws' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
