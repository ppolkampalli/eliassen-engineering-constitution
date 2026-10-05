import { Link } from 'react-router-dom';

import { LawLink } from '../components/law-link';
import { startSteps } from '../data/get-started-content';
import type { StartStep } from '../data/get-started-content';

function ConsoleBlock({ commands }: { commands: string[] }): JSX.Element | null {
  if (commands.length === 0) return null;
  return (
    <pre className="console-block">
      {commands.map((command) => (
        <code key={command}>
          {command.startsWith('#') || command.startsWith('“') ? '' : '$ '}
          {command}
          {'\n'}
        </code>
      ))}
    </pre>
  );
}

function StepCard({ step, index }: { step: StartStep; index: number }): JSX.Element {
  return (
    <article className="step-card">
      <div className="step-rail">
        <span className="step-number">{index + 1}</span>
        {index < startSteps.length - 1 && <span className="step-line" />}
      </div>
      <div className="step-body">
        <h3>{step.title}</h3>
        <p>{step.narrative}</p>
        <ConsoleBlock commands={step.commands} />
        <p className="step-checkpoint">
          <strong>Checkpoint:</strong> {step.checkpoint}
        </p>
        <div className="step-laws">
          {step.lawRefs.map((lawRef) => (
            <LawLink key={lawRef} lawId={lawRef} />
          ))}
        </div>
      </div>
    </article>
  );
}

/** Start Here: zero to governed first ship, step by step. */
export function GetStartedPage(): JSX.Element {
  return (
    <div className="start-page">
      <section className="start-hero">
        <p className="kicker">Start Here</p>
        <h1>From empty repo to governed first ship.</h1>
        <p className="manifesto-sub">
          Eight steps. The first three take about ten minutes and are mostly one command each.
          By the last one, you’ll have shipped a feature through a declared workflow, with an AI
          agent that cited its laws and showed its receipts.
        </p>
      </section>

      <section className="steps">
        {startSteps.map((step, index) => (
          <StepCard key={step.id} step={step} index={index} />
        ))}
      </section>

      <section className="closing-cta">
        <h2>Then go deeper, at your own pace.</h2>
        <p>
          Keep the <Link to="/learn#skill-catalog">Skill Command Catalog</Link> handy — every
          persona, orchestration, and enforcement skill with its exact command and example
          invocations. The self-study paths cover greenfield, rewrites, and day-to-day enhancement
          work in detail, with knowledge checks that cite the law behind every answer.
        </p>
        <p>
          Wondering how this holds up past one team? Read{' '}
          <Link to="/articles/two-teams-one-constitution">
            Two Teams, One Constitution
          </Link>{' '}
          — the same eight steps above, run by two scrum teams building a shared CRM, with the
          real test output and a real fresh-context review finding along the way.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-hero" to="/learn">
            Browse the learning paths →
          </Link>
          <Link className="btn btn-ghost" to="/learn#skill-catalog">
            See the skill catalog
          </Link>
        </div>
      </section>
    </div>
  );
}
