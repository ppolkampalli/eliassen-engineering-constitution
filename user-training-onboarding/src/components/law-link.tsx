import { Link } from 'react-router-dom';

import { getLaw } from '../domain/registry';

interface LawLinkProps {
  lawId: string;
}

/**
 * A law citation chip: shows the live id+version+title from the registry and
 * links into the law browser. Renders the bare id if the law is unknown
 * (content-integrity tests should prevent that ever shipping).
 */
export function LawLink({ lawId }: LawLinkProps): JSX.Element {
  const law = getLaw(lawId);
  if (law === undefined) {
    return <span className="law-chip law-chip-unknown">{lawId}</span>;
  }
  return (
    <Link
      className="law-chip"
      to={`/laws?q=${encodeURIComponent(law.id)}`}
      title={law.statement}
    >
      [{law.id} v{law.version}] {law.title}
    </Link>
  );
}
