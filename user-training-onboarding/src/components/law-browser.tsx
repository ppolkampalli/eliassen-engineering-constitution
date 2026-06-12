import { useState } from 'react';

import type { Law } from '../domain/registry';
import { getArticleNumbers, searchLaws } from '../domain/registry';

const ALL_ARTICLES = 0;

function LawCard({ law }: { law: Law }): JSX.Element {
  return (
    <article className="law-card">
      <header>
        <h3>
          {law.id} <span className="law-version">v{law.version}</span>
        </h3>
        <span className={`law-status law-status-${law.status.toLowerCase()}`}>{law.status}</span>
      </header>
      <h4>{law.title}</h4>
      <blockquote>{law.statement}</blockquote>
      <p className="law-rationale">{law.rationale_summary}</p>
      <footer>
        Article {law.article} · Owners: {law.owner_personas.join(', ')} · Enforcement:{' '}
        {law.enforcement} · {law.amendments.join(', ')}
      </footer>
    </article>
  );
}

interface LawBrowserProps {
  initialQuery?: string;
}

/**
 * Searchable browser over every law, rendered live from laws/registry.json —
 * amendments propagate here automatically on the next build.
 */
export function LawBrowser({ initialQuery = '' }: LawBrowserProps): JSX.Element {
  const [query, setQuery] = useState(initialQuery);
  const [article, setArticle] = useState(ALL_ARTICLES);

  const matches = searchLaws(query).filter(
    (law) => article === ALL_ARTICLES || law.article === article
  );

  return (
    <div className="law-browser">
      <div className="law-controls">
        <input
          type="search"
          placeholder="Search by id, title, or statement (e.g. 2.3, mutation, secrets)"
          value={query}
          onChange={(event): void => setQuery(event.target.value)}
          aria-label="Search laws"
        />
        <select
          value={article}
          onChange={(event): void => setArticle(Number(event.target.value))}
          aria-label="Filter by article"
        >
          <option value={ALL_ARTICLES}>All articles</option>
          {getArticleNumbers().map((articleNumber) => (
            <option key={articleNumber} value={articleNumber}>
              Article {articleNumber}
            </option>
          ))}
        </select>
      </div>
      <p className="law-count">
        {matches.length} law{matches.length === 1 ? '' : 's'}
      </p>
      {matches.map((law) => (
        <LawCard key={law.id} law={law} />
      ))}
    </div>
  );
}
