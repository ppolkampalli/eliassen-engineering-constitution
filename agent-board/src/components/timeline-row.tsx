import type { BoardEvent } from '../lib/types';

interface TimelineRowProps {
  event: BoardEvent;
}

function TimelineBody({ event }: TimelineRowProps): JSX.Element | null {
  if (event.eventType === 'deviation') {
    return (
      <div className="timeline-deviation">
        Deviation <strong>{event.deviationStatus}</strong> at stage <code>{event.stageId}</code>: {event.reason}
        {event.approvedBy ? ` (approved by ${event.approvedBy})` : ''}
      </div>
    );
  }
  if (event.eventType === 'stageEvent') {
    return (
      <div className="timeline-stage">
        <code>{event.stageId}</code> · {event.persona} — <strong>{event.status}</strong> (checkpoint:{' '}
        {event.humanCheckpoint}){event.hard && <span className="badge-hard">hard</span>}
      </div>
    );
  }
  if (event.eventType === 'workflowSelected') {
    return (
      <div className="timeline-selected">
        Workflow selected: <strong>{event.workflowId}</strong>
        {event.workflowVersion ? ` v${event.workflowVersion}` : ''}
      </div>
    );
  }
  return (
    <div className="timeline-completed">
      Workflow completed{event.outcome ? `: ${event.outcome}` : ''}
      {event.deviationCount !== undefined
        ? ` (${event.deviationCount} deviation${event.deviationCount === 1 ? '' : 's'})`
        : ''}
    </div>
  );
}

export function TimelineRow({ event }: TimelineRowProps): JSX.Element {
  return (
    <li className="timeline-row">
      <div className="timeline-time">{event.timestamp}</div>
      <TimelineBody event={event} />
      {event.note && <div className="timeline-note">{event.note}</div>}
      {Array.isArray(event.lawCitations) && event.lawCitations.length > 0 && (
        <span className="pills">
          {event.lawCitations.map((citation) => (
            <span className="pill" key={citation}>
              {citation}
            </span>
          ))}
        </span>
      )}
    </li>
  );
}
