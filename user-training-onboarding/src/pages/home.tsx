import { Link } from 'react-router-dom';

import { ProgressBadge } from '../components/progress-badge';
import { SkillCatalog } from '../components/skill-catalog';
import { trainingModules } from '../data/modules';
import { skillCatalog } from '../data/skills-catalog';
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
          <Link to="/">why this exists</Link> first, or jump straight to the{' '}
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

      <section className="catalog-section" id="skill-catalog">
        <h2>Skill Command Catalog</h2>
        <p className="catalog-intro">
          The constitution installs as a Claude Code plugin that exposes{' '}
          {skillCatalog.length} skills — 8 personas, 3 orchestration skills, and 6 enforcement
          skills. Install it with <code>/plugin install engineering-constitution</code> (see the{' '}
          <Link to="/start">setup steps</Link>), then invoke any skill two ways:
        </p>
        <ul className="catalog-howto">
          <li>
            <strong>Explicitly</strong> — type the namespaced command, e.g.{' '}
            <code>/engineering-constitution:persona-security</code>.
          </li>
          <li>
            <strong>By describing the work</strong> — say “act as the Security persona and review
            this,” and the matching skill auto-activates from its description. The example phrases
            below all work as-is.
          </li>
        </ul>
        <SkillCatalog />
      </section>
    </div>
  );
}
