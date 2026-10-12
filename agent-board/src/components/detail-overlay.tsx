import { useEffect } from 'react';

import { TimelineRow } from './timeline-row';
import type { WorkItem } from '../lib/types';

interface DetailOverlayProps {
  item: WorkItem;
  onClose: () => void;
}

export function DetailOverlay({ item, onClose }: DetailOverlayProps): JSX.Element {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="detail-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="detail-panel">
        <button type="button" className="detail-close" aria-label="Close detail view" onClick={onClose}>
          &times;
        </button>
        <h2>
          {item.workItem} <span className="detail-workflow">{item.workflowId}</span>
        </h2>
        {item.chain && (
          <p className="detail-chain">
            <strong>Chain:</strong> {item.chain}
          </p>
        )}
        <ol className="timeline">
          {item.events.map((event, index) => (
            <TimelineRow event={event} key={`${event.timestamp}-${index}`} />
          ))}
        </ol>
      </div>
    </div>
  );
}
