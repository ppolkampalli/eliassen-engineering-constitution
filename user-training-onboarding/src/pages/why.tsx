import { Link } from 'react-router-dom';

import { LawLink } from '../components/law-link';
import { CONSTITUTION_VERSION, getAllLaws, getAllWorkflows } from '../domain/registry';

interface Claim {
  number: string;
  headline: string;
  body: string;
  lawId: string;
}

const CLAIMS: Claim[] = [
  {
    number: '01',
    headline: 'You will never lose the security argument again.',
    body: 'Because there is no argument. A CRITICAL finding blocks merge no matter whose deadline is burning — and only a named human security lead can override it, in writing. The fight you used to have at 5pm on release day was settled in advance, in your favor.',
    lawId: 'LAW-1.5',
  },
  {
    number: '02',
    headline: 'Reviews argue about ideas, not semicolons.',
    body: 'Formatting is a machine’s job. Naming is a table. "Is this tested enough" has floors. When the mechanical questions are pre-answered, the twenty minutes of review you get goes to the part only humans can do: is this the right change?',
    lawId: 'LAW-2.2',
  },
  {
    number: '03',
    headline: 'Your AI agent follows the same rules you do.',
    body: 'Agents here declare a workflow, plan before they touch code, prove completion with test output, and physically cannot delete a failing test to get to green. The productivity is real — and so are the guardrails that keep it from becoming a 4am incident.',
    lawId: 'LAW-10.6',
  },
  {
    number: '04',
    headline: 'Every rule comes with its receipts.',
    body: 'No rule here is "because we said so." Every law carries its rationale, its version, and the recorded decision that created it — and any engineer can propose an amendment. Disagree? Don’t grumble. File. The process that changed 12 laws last quarter is waiting for your proposal.',
    lawId: 'LAW-10.6',
  },
  {
    number: '05',
    headline: 'Green means safe. Actually.',
    body: 'Coverage floors that never move down. Mutation testing that catches suites which execute everything and detect nothing. Skipped tests need tickets. The result is the thing every team claims and few have: a build status you can bet a Friday deploy on.',
    lawId: 'LAW-3.6',
  },
];

const PAIN_POINTS: { pain: string; answer: string }[] = [
  { pain: 'Review bottlenecks', answer: 'Mechanical checks automated; reviews focus on design' },
  { pain: 'Every repo its own dialect', answer: 'One toolchain, zero exceptions, installed in one command' },
  { pain: 'Coverage theater', answer: 'Floors + mutation scores — green you can trust' },
  { pain: 'Vulnerabilities reaching prod', answer: 'A veto above every deadline' },
  { pain: 'Docs in people’s heads', answer: 'Laws, ADRs, and rules you can cite by ID' },
  { pain: '“Later” never coming', answer: 'Deferred quality requires a ticket — or a no' },
];

function ClaimBlock({ claim }: { claim: Claim }): JSX.Element {
  return (
    <article className="claim">
      <span className="claim-number">{claim.number}</span>
      <div>
        <h3>{claim.headline}</h3>
        <p>{claim.body}</p>
        <LawLink lawId={claim.lawId} />
      </div>
    </article>
  );
}

function ManifestoHero(): JSX.Element {
  return (
    <section className="manifesto-hero">
      <p className="kicker">Eliassen Group Engineering Constitution v{CONSTITUTION_VERSION}</p>
      <h1>
        Most process protects the org <em>from</em> engineers.
        <br />
        This one protects engineers <em>from everything else.</em>
      </h1>
      <p className="manifesto-sub">
        {getAllLaws().length} citable laws. 8 personas with real authority. {getAllWorkflows().length}{' '}
        declared workflows. One install command. Built for teams where humans and AI agents ship
        together — and built so the 2am pages, the deadline-vs-security standoffs, and the
        “why is it like this?” archaeology stop happening to you.
      </p>
      <div className="hero-actions">
        <Link className="btn btn-hero" to="/start">
          Start in 10 minutes →
        </Link>
        <Link className="btn btn-ghost" to="/personas">
          Meet the council
        </Link>
      </div>
    </section>
  );
}

function PainGrid(): JSX.Element {
  return (
    <section className="pain-grid-section">
      <h2>Born from six pains you already know</h2>
      <div className="pain-grid">
        {PAIN_POINTS.map((item) => (
          <div key={item.pain} className="pain-card">
            <span className="pain-name">{item.pain}</span>
            <span className="pain-answer">{item.answer}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClosingCta(): JSX.Element {
  return (
    <section className="closing-cta">
      <h2>Laws you can read. Personas you can summon. A process you can amend.</h2>
      <p>
        That’s the whole pitch: nothing here is hidden, nothing is arbitrary, and nothing is
        above the amendment process — not even the amendment process.
      </p>
      <div className="hero-actions">
        <Link className="btn btn-hero" to="/start">
          Get started →
        </Link>
        <Link className="btn btn-ghost" to="/laws">
          Read the laws
        </Link>
      </div>
    </section>
  );
}

/** The pitch: why a skeptical engineer should want to work governed. */
export function WhyPage(): JSX.Element {
  return (
    <div className="why-page">
      <ManifestoHero />
      <PainGrid />
      <section className="claims-section">
        <h2>What’s actually in it for you</h2>
        {CLAIMS.map((claim) => (
          <ClaimBlock key={claim.number} claim={claim} />
        ))}
      </section>
      <ClosingCta />
    </div>
  );
}
