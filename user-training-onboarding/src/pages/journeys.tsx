import { useState } from 'react';
import { Link } from 'react-router-dom';

import { JourneyMap } from '../components/journey-map';
import { LawLink } from '../components/law-link';
import { clientJourneys } from '../data/journeys-content';
import type { ClientJourney } from '../data/journeys-content';

const ALL_JOURNEYS = 'all';

interface JourneyFilterProps {
  selected: string;
  onSelect: (id: string) => void;
}

/** Sticky mini-nav: archetype chips that filter the journey list. */
function JourneyFilter({ selected, onSelect }: JourneyFilterProps): JSX.Element {
  const chips = [
    { id: ALL_JOURNEYS, label: 'All journeys' },
    ...clientJourneys.map((journey) => ({ id: journey.id, label: journey.archetype })),
  ];
  return (
    <nav className="journey-filter" aria-label="Filter journeys by client archetype">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          className={selected === chip.id ? 'filter-chip filter-chip-active' : 'filter-chip'}
          aria-pressed={selected === chip.id}
          onClick={(): void => onSelect(chip.id)}
        >
          {chip.label}
        </button>
      ))}
    </nav>
  );
}

function BeforeAfter({ journey }: { journey: ClientJourney }): JSX.Element {
  return (
    <div className="before-after">
      <div className="ba-col ba-before">
        <h4>Where they start</h4>
        <ul>
          {journey.before.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="ba-arrow" aria-hidden="true">
        →
      </div>
      <div className="ba-col ba-after">
        <h4>Where they land</h4>
        <ul>
          {journey.after.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function JourneySection({ journey }: { journey: ClientJourney }): JSX.Element {
  return (
    <section className="journey" id={journey.id}>
      <p className="journey-archetype">{journey.archetype}</p>
      <h2>{journey.headline}</h2>
      <p className="journey-profile">{journey.profile}</p>
      <JourneyMap stages={journey.stages} />
      <BeforeAfter journey={journey} />
      <div className="journey-laws">
        <span className="laws-label">Built on:</span>
        {journey.lawRefs.map((lawRef) => (
          <LawLink key={lawRef} lawId={lawRef} />
        ))}
        {journey.workflowRefs.map((workflowRef) => (
          <Link key={workflowRef} className="law-chip" to="/workflows">
            {workflowRef}
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Client Journeys: client archetypes mapped from pain to governed agentic delivery. */
export function JourneysPage(): JSX.Element {
  const [selected, setSelected] = useState<string>(ALL_JOURNEYS);
  const visibleJourneys =
    selected === ALL_JOURNEYS
      ? clientJourneys
      : clientJourneys.filter((journey) => journey.id === selected);

  return (
    <div className="journeys-page">
      <section className="personas-hero">
        <p className="kicker">Client Journeys</p>
        <h1>Wherever a client starts, there’s a mapped road to governed AI delivery.</h1>
        <p className="manifesto-sub">
          Seven journeys we see again and again: teams with no real SDLC who need one before agents
          amplify the chaos; mature shops adding the agentic layer to great process; federated
          organizations needing governance with flexibility; rescues from ungoverned AI debt;
          regulated clients turning audits into report runs; consultants landing day-one productive;
          and acquisitions becoming one engineering organization. Each map shows the road — phase by
          phase, pain to win.
        </p>
      </section>

      <JourneyFilter selected={selected} onSelect={setSelected} />

      {visibleJourneys.map((journey) => (
        <JourneySection key={journey.id} journey={journey} />
      ))}

      <section className="closing-cta">
        <h2>Every journey starts the same way: one install, ten minutes.</h2>
        <p>
          The phases differ by where you start — the destination is the same governed, agentic,
          auditable delivery.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-hero" to="/start">
            See the first ten minutes →
          </Link>
          <Link className="btn btn-ghost" to="/personas">
            Meet the council
          </Link>
        </div>
      </section>
    </div>
  );
}
