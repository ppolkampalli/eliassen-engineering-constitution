import { fireEvent, render, screen } from '@testing-library/react';

import { DetailOverlay } from './detail-overlay';
import type { WorkItem } from '../lib/types';

// ReactFlow (rendered inside ItemFlowChart) measures its container's box to
// lay out nodes; jsdom reports 0 for both, so stub real dimensions — the
// values are arbitrary, only "non-zero" matters here.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 280 });
});

function makeItem(): WorkItem {
  return {
    workItem: 'JIRA-1',
    workflowId: 'WF-BUG',
    chain: 'software-engineer(fix*) -> quality(verify*)',
    events: [
      {
        schemaVersion: '1.0',
        timestamp: '2026-10-13T00:00:00Z',
        eventType: 'stageEvent',
        workItem: 'JIRA-1',
        workflowId: 'WF-BUG',
        stageId: 'fix',
        persona: 'persona-software-engineer',
        status: 'entered',
        humanCheckpoint: 'none',
      },
    ],
    citationCount: 0,
    firstTimestamp: '2026-10-13T00:00:00Z',
    lastTimestamp: '2026-10-13T00:00:00Z',
    latest: null,
    lane: 'inProgress',
    latestNote: '',
  };
}

describe('DetailOverlay', () => {
  it('toggles into and out of its maximized layout without closing, and restores the canvas height', () => {
    const onClose = jest.fn();
    const { container } = render(<DetailOverlay item={makeItem()} onClose={onClose} />);

    expect(container.querySelector('.detail-panel-maximized')).toBeNull();

    fireEvent.click(screen.getByLabelText('Maximize detail view'));
    expect(container.querySelector('.detail-panel-maximized')).not.toBeNull();
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Restore detail view'));
    expect(container.querySelector('.detail-panel-maximized')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('still closes via the close button and via Escape, independent of the maximize toggle', () => {
    const onClose = jest.fn();
    render(<DetailOverlay item={makeItem()} onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Maximize detail view'));
    fireEvent.click(screen.getByLabelText('Close detail view'));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
