import { LawLink } from '../components/law-link';
import { personaProfiles } from '../data/personas-content';
import type { PersonaProfile } from '../data/personas-content';

const LADDER: { tier: string; holders: string; meaning: string }[] = [
  {
    tier: 'VETO',
    holders: 'Security · Architect',
    meaning:
      'A hard stop. Security’s veto (CRITICAL findings) outranks everything and yields only to a named human security lead; Architect’s veto covers layer violations and cycles.',
  },
  {
    tier: 'BLOCK',
    holders: 'Quality · DevOps · Product Owner',
    meaning:
      'Work waits until the condition is met: coverage floors, rollback plans, acceptance criteria. Not negotiable by schedule — by design.',
  },
  {
    tier: 'ADVISE',
    holders: 'Industry SME · FinOps',
    meaning:
      'Expert counsel with receipts — domain sources and cost estimates. FinOps is explicitly subordinate to Security: cost never argues against a CRITICAL fix.',
  },
];

function AuthorityBadge({ authority }: { authority: PersonaProfile['authority'] }): JSX.Element {
  return <span className={`authority-badge authority-${authority.toLowerCase()}`}>{authority}</span>;
}

function PersonaCard({ profile }: { profile: PersonaProfile }): JSX.Element {
  return (
    <article className="persona-card" id={profile.id}>
      <header>
        <h3>{profile.name}</h3>
        <AuthorityBadge authority={profile.authority} />
      </header>
      <p className="persona-tagline">{profile.tagline}</p>
      <p className="persona-pitch">{profile.pitch}</p>
      <div className="persona-detail">
        <h4>Authority</h4>
        <p>{profile.authorityDetail}</p>
      </div>
      <div className="persona-detail">
        <h4>Summon when…</h4>
        <ul>
          {profile.summonWhen.map((situation) => (
            <li key={situation}>{situation}</li>
          ))}
        </ul>
      </div>
      <div className="persona-detail">
        <h4>Owns</h4>
        <div className="persona-laws">
          {profile.ownedLaws.map((lawRef) => (
            <LawLink key={lawRef} lawId={lawRef} />
          ))}
        </div>
      </div>
      <p className="persona-invocation">{profile.invocation}</p>
    </article>
  );
}

/** Meet the Council: the eight personas, sold properly. */
export function PersonasPage(): JSX.Element {
  return (
    <div className="personas-page">
      <section className="personas-hero">
        <p className="kicker">The Persona System</p>
        <h1>Eight specialists. On call. In every session.</h1>
        <p className="manifesto-sub">
          A persona is not a label — it is a mandate, a set of owned laws, and real authority an AI
          agent or a human can assume on demand. Say the word and your session gains a security
          engineer who cannot be bullied by a deadline, an architect who writes the reasoning down,
          a product owner who refuses to build the undefined. Every decision they make cites the law
          it stands on.
        </p>
      </section>

      <section className="ladder-section">
        <h2>The authority ladder — who outranks whom, settled in advance</h2>
        <div className="ladder">
          {LADDER.map((rung, index) => (
            <div key={rung.tier} className="ladder-rung" style={{ marginLeft: `${index * 1.5}rem` }}>
              <span className={`authority-badge authority-${rung.tier.toLowerCase()}`}>{rung.tier}</span>
              <div>
                <strong>{rung.holders}</strong>
                <p>{rung.meaning}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="ladder-note">
          Conflicts between personas go to the persona-council, which surfaces every disagreement
          verbatim — and anything the ladder can’t settle goes to a human. Always.
        </p>
      </section>

      <section className="persona-grid">
        {personaProfiles.map((profile) => (
          <PersonaCard key={profile.id} profile={profile} />
        ))}
      </section>
    </div>
  );
}
