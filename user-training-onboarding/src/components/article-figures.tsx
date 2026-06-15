/**
 * Diagram figures embeddable in articles. An article body line of the exact form
 * `@@figure:<id>@@` renders the matching figure here (see article-view.tsx).
 * Figures are brand-styled HTML/CSS (royal/coral/cream) — crisp, responsive, and
 * screenshot-ready for decks, matching the journey-map and authority-ladder style.
 */
interface FigureDef {
  caption: string;
  render: () => JSX.Element;
}

function PersonaMesh(): JSX.Element {
  const personas: { name: string; badge: string; tier: string }[] = [
    { name: 'Security', badge: 'VETO', tier: 'veto' },
    { name: 'Architect', badge: 'VETO', tier: 'veto' },
    { name: 'Quality', badge: 'BLOCK', tier: 'block' },
    { name: 'Software Engineer', badge: 'DEFAULT', tier: 'decide' },
    { name: 'Product Owner', badge: 'BLOCK', tier: 'block' },
    { name: 'DevOps', badge: 'BLOCK', tier: 'block' },
  ];
  return (
    <div className="fig fig-mesh">
      <div className="fig-orchestrator">
        <strong>Orchestrator Agent</strong>
        <span>runs the workflow · dispatches each task to the right persona</span>
      </div>
      <div className="fig-dispatch">dispatches ↓</div>
      <div className="fig-persona-grid">
        {personas.map((p) => (
          <div key={p.name} className="fig-persona">
            <span className="fig-persona-name">{p.name} Agent</span>
            <span className={`fig-badge fig-badge-${p.tier}`}>{p.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryService(): JSX.Element {
  const contents: string[] = [
    '57 Laws (registry)',
    '6 Workflow definitions',
    'ADRs / design decisions',
    'Decision & citation log',
    'Amendment history',
  ];
  return (
    <div className="fig fig-memory">
      <div className="fig-mem-row">
        <div className="fig-agents-col">
          <div className="fig-agent-chip">Persona agent</div>
          <div className="fig-agent-chip">Persona agent</div>
          <div className="fig-arrow-label">“What does LAW-5.2 require?” →</div>
          <div className="fig-arrow-label">“Has this been decided before?” →</div>
        </div>
        <div className="fig-mem-core">
          <strong>Central Memory Service</strong>
          <span>MemoryGraph</span>
          <ul>
            {contents.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="fig-agents-col">
          <div className="fig-arrow-label">← append: cited decision</div>
          <div className="fig-arrow-label">← append: ADR, deviation</div>
          <div className="fig-agent-chip fig-agent-write">Persona agent</div>
        </div>
      </div>
      <p className="fig-note">
        Laws are read-only to working agents — only the Law Clerk writes to them, and only
        through the amendment process. Everything else (decisions, ADRs, deviations) is
        append-only, so provenance never gets overwritten.
      </p>
    </div>
  );
}

function FeatureFlow(): JSX.Element {
  const stages: { persona: string; action: string }[] = [
    { persona: 'Product Owner', action: 'acceptance criteria' },
    { persona: 'Architect', action: 'design + ADR' },
    { persona: 'Quality', action: 'test list' },
    { persona: 'Engineer', action: 'implement (TDD)' },
    { persona: 'Security', action: 'review + gate' },
  ];
  return (
    <div className="fig fig-flow">
      <div className="fig-mem-bar">Central Memory Service — read laws &amp; prior decisions · write cited results</div>
      <div className="fig-flow-row">
        {stages.map((s, i) => (
          <div key={s.persona} className="fig-flow-stage">
            <div className="fig-flow-card">
              <span className="fig-flow-persona">{s.persona}</span>
              <span className="fig-flow-action">{s.action}</span>
              <span className="fig-flow-mem">↑ reads / writes memory</span>
            </div>
            {i < stages.length - 1 && <span className="fig-flow-arrow">→</span>}
          </div>
        ))}
      </div>
      <p className="fig-note">
        Each persona-agent reads the laws its stage is gated by, does its work, and appends a
        cited decision — so the merged result carries an auditable trail no single agent owns.
      </p>
    </div>
  );
}

export const articleFigures: Record<string, FigureDef> = {
  'persona-mesh': {
    caption: 'Figure 1 · One orchestrator, many persona-specialised agents',
    render: PersonaMesh,
  },
  'memory-service': {
    caption: 'Figure 2 · The constitution as a Central Memory Service agents query and append to',
    render: MemoryService,
  },
  'feature-flow': {
    caption: 'Figure 3 · A feature through the persona pipeline, memory at every stage',
    render: FeatureFlow,
  },
};
