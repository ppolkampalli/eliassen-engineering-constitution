export function EmptyState(): JSX.Element {
  return (
    <div className="empty-state">
      <p>No events yet.</p>
      <p>
        Run a governed workflow with <code>workflow-orchestrator</code> — this board updates automatically once it
        starts writing to the log.
      </p>
    </div>
  );
}
