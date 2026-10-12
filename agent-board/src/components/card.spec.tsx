import { fireEvent, render, screen } from '@testing-library/react';

import { Card } from './card';
import type { StageEvent, WorkItem } from '../lib/types';

function makeStage(overrides: Partial<StageEvent> = {}): StageEvent {
  return {
    schemaVersion: '1.0',
    timestamp: 't',
    eventType: 'stageEvent',
    workItem: 'JIRA-1',
    workflowId: 'WF-BUG',
    stageId: 'fix',
    persona: 'persona-software-engineer',
    status: 'entered',
    humanCheckpoint: 'none',
    ...overrides,
  };
}

function makeItem(overrides: Partial<WorkItem> = {}): WorkItem {
  return {
    workItem: 'JIRA-1',
    workflowId: 'WF-BUG',
    chain: null,
    events: [],
    citationCount: 0,
    firstTimestamp: new Date(Date.now() - 5 * 60_000).toISOString(),
    lastTimestamp: new Date(Date.now() - 60_000).toISOString(),
    latest: null,
    lane: 'inProgress',
    latestNote: '',
    ...overrides,
  };
}

describe('Card', () => {
  it('renders a hard badge when the latest stage is hard', () => {
    render(<Card item={makeItem({ latest: makeStage({ hard: true }) })} onSelect={jest.fn()} />);
    expect(screen.getByText('hard')).toBeTruthy();
  });

  it('does not render a hard badge for a non-hard stage', () => {
    render(<Card item={makeItem({ latest: makeStage() })} onSelect={jest.fn()} />);
    expect(screen.queryByText('hard')).toBeNull();
  });

  it('pluralizes a single citation', () => {
    render(<Card item={makeItem({ citationCount: 1 })} onSelect={jest.fn()} />);
    expect(screen.getByText('1 citation')).toBeTruthy();
  });

  it('pluralizes multiple citations', () => {
    render(<Card item={makeItem({ citationCount: 2 })} onSelect={jest.fn()} />);
    expect(screen.getByText('2 citations')).toBeTruthy();
  });

  it('truncates a long note', () => {
    render(<Card item={makeItem({ latestNote: 'x'.repeat(200) })} onSelect={jest.fn()} />);
    expect(screen.getByText(/x+…$/)).toBeTruthy();
  });

  it('shows a fallback for an empty note', () => {
    render(<Card item={makeItem({ latestNote: '' })} onSelect={jest.fn()} />);
    expect(screen.getByText('no note yet')).toBeTruthy();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<Card item={makeItem()} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('JIRA-1'));
    expect(onSelect).toHaveBeenCalledWith('JIRA-1');
  });

  it('calls onSelect on Enter keydown', () => {
    const onSelect = jest.fn();
    render(<Card item={makeItem()} onSelect={onSelect} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('JIRA-1');
  });

  it('ignores non-Enter keydowns', () => {
    const onSelect = jest.fn();
    render(<Card item={makeItem()} onSelect={onSelect} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
    expect(onSelect).not.toHaveBeenCalled();
  });
});
