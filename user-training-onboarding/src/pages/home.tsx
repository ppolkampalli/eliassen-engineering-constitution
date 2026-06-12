import { Link } from 'react-router-dom';

import { ProgressBadge } from '../components/progress-badge';
import { trainingModules } from '../data/modules';
import { loadProgress, moduleProgressPct, overallProgressPct } from '../domain/progress';

/** Home: the self-study catalog with per-path and overall progress. */
export function HomePage(): JSX.Element {
  const progress = loadProgress(window.localStorage);
  const overallPct = overallProgressPct(progress, trainingModules);

  return (
    <div className="home">
      <section className="hero">
        <h1>Learn the Engineering Constitution</h1>
        <p>
          The deep-dive learning paths: pick the one that matches your situation — brand-new
          application, legacy rewrite, or enhancing a governed system. New here? Read{' '}
          <Link to="/why">why this exists</Link> first, or jump straight to the{' '}
          <Link to="/start">10-minute setup</Link>.
        </p>
        <ProgressBadge pct={overallPct} label="Overall progress" />
      </section>
      <section className="module-grid">
        {trainingModules.map((module) => (
          <Link key={module.id} to={`/path/${module.id}`} className="module-card">
            <h2>{module.title}</h2>
            <p>{module.summary}</p>
            <p className="module-meta">
              {module.lessons.length} lessons · 1 knowledge check
            </p>
            <ProgressBadge pct={moduleProgressPct(progress, module)} />
          </Link>
        ))}
      </section>
    </div>
  );
}
