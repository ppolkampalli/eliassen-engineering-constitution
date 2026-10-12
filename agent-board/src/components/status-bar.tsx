interface StatusBarProps {
  message: string;
  error: string | null;
}

export function StatusBar({ message, error }: StatusBarProps): JSX.Element {
  return <div className="status-text">{error ? <span className="status-error">{error}</span> : message}</div>;
}
