import { render, screen } from '@testing-library/react';

import { parseChain, WorkflowExplorer } from './workflow-explorer';

describe('parseChain', () => {
  it('should parse personas, actions, and hard markers from a chain string', () => {
    const stages = parseChain('product-owner(requirements*) -> architect(design)');
    expect(stages).toEqual([
      {
        persona: 'product-owner',
        action: 'requirements',
        isHard: true,
        isConditional: false,
        hasHumanCheckpoint: false,
      },
      {
        persona: 'architect',
        action: 'design',
        isHard: false,
        isConditional: false,
        hasHumanCheckpoint: false,
      },
    ]);
  });

  it('should detect conditional and human-checkpoint markers when present', () => {
    const stages = parseChain('security(security-review^) -> quality(code-review*+human)');
    expect(stages[0]?.isConditional).toBe(true);
    expect(stages[1]?.hasHumanCheckpoint).toBe(true);
    expect(stages[1]?.isHard).toBe(true);
  });

  it('should treat HUMAN as a human checkpoint stage when parsing WF-AMENDMENT', () => {
    const stages = parseChain('HUMAN(decision*)');
    expect(stages[0]?.hasHumanCheckpoint).toBe(true);
  });
});

describe('WorkflowExplorer', () => {
  it('should render hard-stage flags for inviolable stages when displaying chains', () => {
    render(<WorkflowExplorer />);
    expect(screen.getAllByText('hard').length).toBeGreaterThan(10);
    expect(screen.getAllByTitle(/never overridable|not overridable/i).length).toBeGreaterThan(0);
  });
});
