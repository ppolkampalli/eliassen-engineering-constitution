import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';

import { ItemFlowChart } from './item-flow-chart';
import type { WorkItem } from '../lib/types';

const MAXIMIZED_CANVAS_HEIGHT_PX = 480;

interface DetailOverlayProps {
  item: WorkItem;
  onClose: () => void;
}

export function DetailOverlay({ item, onClose }: DetailOverlayProps): JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={`detail-overlay${isMaximized ? ' detail-overlay-maximized' : ''}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`detail-panel${isMaximized ? ' detail-panel-maximized' : ''}`}>
        <IconButton
          aria-label={isMaximized ? 'Restore detail view' : 'Maximize detail view'}
          onClick={() => setIsMaximized((previous) => !previous)}
          sx={{ position: 'absolute', top: 12, right: 52 }}
        >
          {isMaximized ? '⤡' : '⤢'}
        </IconButton>
        <IconButton aria-label="Close detail view" onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12 }}>
          &times;
        </IconButton>
        <h2>
          {item.workItem} <span className="detail-workflow">{item.workflowId}</span>
        </h2>
        {item.chain && (
          <p className="detail-chain">
            <strong>Chain:</strong> {item.chain}
          </p>
        )}
        <ItemFlowChart item={item} canvasHeight={isMaximized ? MAXIMIZED_CANVAS_HEIGHT_PX : undefined} />
      </div>
    </div>
  );
}
