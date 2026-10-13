import { render, screen } from '@testing-library/react';

import { WorkflowCohortGraph } from './workflow-cohort-graph';
import type { WorkflowGraph } from '../lib/types';

// ReactFlow measures its container's box to lay out nodes; jsdom reports 0 for
// both, so every node/edge collapses to the same point unless we stub real
// dimensions. The values below are arbitrary — only "non-zero" matters here.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 280 });
});

function makeGraph(overrides: Partial<WorkflowGraph> = {}): WorkflowGraph {
  return {
    workflowId: 'WF-BUG',
    stages: [
      { persona: 'software-engineer', stageId: 'fix', hard: true, conditional: false, humanRequired: false },
      { persona: 'quality', stageId: 'verify', hard: true, conditional: false, humanRequired: true },
    ],
    stageEventCounts: { fix: 2, verify: 1 },
    stageActiveCounts: { verify: 1 },
    ...overrides,
  };
}

describe('WorkflowCohortGraph', () => {
  it('renders a panel per workflowId with its stage node labels and counts', () => {
    render(<WorkflowCohortGraph graphs={[makeGraph()]} />);
    expect(screen.getByText('WF-BUG')).toBeTruthy();
    expect(screen.getByText('fix')).toBeTruthy();
    expect(screen.getByText('verify')).toBeTruthy();
    expect(screen.getByText('human')).toBeTruthy();
    expect(screen.getByText('1 active now')).toBeTruthy();
    expect(screen.getByText('2 events total')).toBeTruthy();
  });

  it('renders one panel per distinct workflowId', () => {
    render(<WorkflowCohortGraph graphs={[makeGraph(), makeGraph({ workflowId: 'WF-FEATURE', stages: [] })]} />);
    expect(screen.getByText('WF-BUG')).toBeTruthy();
    expect(screen.getByText('WF-FEATURE')).toBeTruthy();
  });

  it('shows an empty-state message when there are no workflow graphs', () => {
    render(<WorkflowCohortGraph graphs={[]} />);
    expect(screen.getByText(/no workflow activity/i)).toBeTruthy();
  });
});
