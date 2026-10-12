import { useNowTick } from '../hooks/use-now-tick';
import { formatElapsed, stageSummary, statusDotClass, truncate } from '../lib/board-model';
import type { WorkItem } from '../lib/types';

interface CardProps {
  item: WorkItem;
  onSelect: (workItem: string) => void;
}

export function Card({ item, onSelect }: CardProps): JSX.Element {
  useNowTick(30000);

  const isHard = item.latest?.eventType === 'stageEvent' && item.latest.hard === true;
  const note = truncate(item.latestNote, 120);
  const citationLabel = `${item.citationCount} citation${item.citationCount === 1 ? '' : 's'}`;

  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.workItem)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onSelect(item.workItem);
      }}
    >
      <div className="card-head">
        <span className={`status-dot ${statusDotClass(item.latest)}`} />
        <strong>{item.workItem}</strong>
        {isHard && (
          <span className="badge-hard" title="Hard stage — cannot be overridden">
            hard
          </span>
        )}
        <span className="card-workflow">{item.workflowId}</span>
      </div>
      <div className="card-stage">{stageSummary(item.latest)}</div>
      <div className="card-note">{note || <em>no note yet</em>}</div>
      <div className="card-meta">
        <span title="Time since the first event for this work item">started {formatElapsed(item.firstTimestamp)} ago</span>
        <span title="Time since the most recent event">updated {formatElapsed(item.lastTimestamp)} ago</span>
        <span title="Law citations across all events so far">{citationLabel}</span>
      </div>
    </div>
  );
}
