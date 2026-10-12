import { render, screen } from '@testing-library/react';

import { TimelineRow } from './timeline-row';
import type { BoardEvent } from '../lib/types';

function renderRow(event: BoardEvent): void {
  render(
    <ol>
      <TimelineRow event={event} />
    </ol>
  );
}

describe('TimelineRow', () => {
  it('renders a stageEvent with a hard badge', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'stageEvent',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      stageId: 'fix',
      persona: 'persona-software-engineer',
      status: 'entered',
      humanCheckpoint: 'none',
      hard: true,
    });
    expect(screen.getByText('fix')).toBeTruthy();
    expect(screen.getByText('hard')).toBeTruthy();
  });

  it('renders a stageEvent without a hard badge', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'stageEvent',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      stageId: 'fix',
      persona: 'persona-software-engineer',
      status: 'entered',
      humanCheckpoint: 'none',
    });
    expect(screen.queryByText('hard')).toBeNull();
  });

  it('renders a deviation with an approvedBy', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'deviation',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      stageId: 'design',
      deviationStatus: 'applied',
      reason: 'small change',
      approvedBy: 'A. Reviewer',
    });
    expect(screen.getByText(/approved by A\. Reviewer/)).toBeTruthy();
  });

  it('renders a deviation without an approvedBy', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'deviation',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      stageId: 'design',
      deviationStatus: 'refused',
      reason: 'hard stage',
    });
    expect(screen.queryByText(/approved by/)).toBeNull();
  });

  it('renders a workflowSelected event with a version', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'workflowSelected',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      workflowVersion: '1.0',
    });
    expect(screen.getByText(/v1\.0/)).toBeTruthy();
  });

  it('renders a workflowSelected event without a version', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'workflowSelected',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
    });
    expect(screen.getByText(/Workflow selected/)).toBeTruthy();
  });

  it('renders a workflowCompleted event with outcome and deviation count', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'workflowCompleted',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      outcome: 'Shipped',
      deviationCount: 1,
    });
    expect(screen.getByText(/Shipped/)).toBeTruthy();
    expect(screen.getByText(/1 deviation\)/)).toBeTruthy();
  });

  it('renders a workflowCompleted event with multiple deviations and no outcome', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'workflowCompleted',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      deviationCount: 2,
    });
    expect(screen.getByText(/2 deviations\)/)).toBeTruthy();
  });

  it('renders a note and law citation pills when present', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'workflowCompleted',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
      note: 'wrapping up',
      lawCitations: ['LAW-3.1', 'LAW-3.2'],
    });
    expect(screen.getByText('wrapping up')).toBeTruthy();
    expect(screen.getByText('LAW-3.1')).toBeTruthy();
    expect(screen.getByText('LAW-3.2')).toBeTruthy();
  });

  it('omits the note and pills blocks when absent', () => {
    renderRow({
      schemaVersion: '1.0',
      timestamp: 't',
      eventType: 'workflowCompleted',
      workItem: 'JIRA-1',
      workflowId: 'WF-BUG',
    });
    expect(screen.queryByText('wrapping up')).toBeNull();
  });
});
