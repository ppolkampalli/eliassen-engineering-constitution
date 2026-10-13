import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';

import { ItemFlowChart } from './item-flow-chart';
import { deriveWorkItems, parseLog } from '../lib/board-model';

const FIXTURES_DIR = join(__dirname, '../../fixtures');
const readFixture = (name: string): string => readFileSync(join(FIXTURES_DIR, name), 'utf8');
const sampleWorkItems = deriveWorkItems(parseLog(readFixture('events.sample.jsonl')).events);

// ReactFlow measures its container's box to lay out nodes; jsdom reports 0 for
// both, so every node/edge collapses to the same point unless we stub real
// dimensions. The values below are arbitrary — only "non-zero" matters here.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 280 });
});

describe('ItemFlowChart', () => {
  it('renders a node per step and defaults the detail panel to the latest/current step', () => {
    const item = sampleWorkItems.get('JIRA-3411');
    render(<ItemFlowChart item={item!} />);

    expect(screen.getByText('Start')).toBeTruthy();
    expect(screen.getByText('reproduce-and-fix')).toBeTruthy();
    expect(screen.getByText('verify')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
    // Defaults to the end node (the item's latest step).
    expect(screen.getByText('Workflow completed')).toBeTruthy();
    expect(screen.getByText('Fixed and verified; no escalation needed.')).toBeTruthy();
  });

  it('shows a stage step\'s full detail — note, detail text, citations, and per-event history — on click', () => {
    const item = sampleWorkItems.get('JIRA-3411');
    render(<ItemFlowChart item={item!} />);

    fireEvent.click(screen.getByText('reproduce-and-fix'));

    expect(screen.getByText('Fix applied: sortBy allowlisted against column enum.')).toBeTruthy();
    expect(screen.getByText('LAW-5.2')).toBeTruthy();
    // Both the "entered" and "complete" events for this stage show in the history.
    expect(screen.getByText(/2026-10-12T14:01:00Z — entered/)).toBeTruthy();
    expect(screen.getByText(/2026-10-12T14:20:00Z — complete/)).toBeTruthy();
  });

  it('shows the deviation reason for a stage that was skipped via override, with no stageEvent of its own', () => {
    const item = sampleWorkItems.get('JIRA-3500');
    render(<ItemFlowChart item={item!} />);

    fireEvent.click(screen.getByText('design'));
    expect(screen.getByText(/Single-file copy change; no structural impact\./)).toBeTruthy();
    expect(screen.getByText(/approved by P\. Polkampalli, 2026-10-12/)).toBeTruthy();
  });

  it('shows the announced chain on the start node', () => {
    const item = sampleWorkItems.get('JIRA-3500');
    render(<ItemFlowChart item={item!} />);

    fireEvent.click(screen.getByText('Start'));
    expect(screen.getByText(/Chain:/)).toBeTruthy();
  });

  it('shows an empty-state message for a work item with no events', () => {
    render(
      <ItemFlowChart
        item={{
          workItem: 'JIRA-EMPTY',
          workflowId: 'WF-BUG',
          chain: null,
          events: [],
          citationCount: 0,
          firstTimestamp: '',
          lastTimestamp: '',
          latest: null,
          lane: 'inProgress',
          latestNote: '',
        }}
      />
    );
    expect(screen.getByText(/no steps recorded/i)).toBeTruthy();
  });
});
