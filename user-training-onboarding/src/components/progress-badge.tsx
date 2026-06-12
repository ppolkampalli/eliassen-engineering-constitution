interface ProgressBadgeProps {
  pct: number;
  label?: string;
}

/** A small progress bar with percent label. */
export function ProgressBadge({ pct, label }: ProgressBadgeProps): JSX.Element {
  return (
    <div className="progress-badge" aria-label={label ?? `${pct}% complete`}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-pct">{pct}%</span>
    </div>
  );
}
