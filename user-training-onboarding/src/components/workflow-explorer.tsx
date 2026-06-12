import type { Workflow } from '../domain/registry';
import { getAllWorkflows } from '../domain/registry';

interface Stage {
  persona: string;
  action: string;
  isHard: boolean;
  isConditional: boolean;
  hasHumanCheckpoint: boolean;
}

/**
 * Parses a registry chain string like
 * "product-owner(requirements*) -> architect(design)" into displayable stages.
 */
export function parseChain(chain: string): Stage[] {
  const matches = [...chain.matchAll(/([\w-]+|HUMAN)\(([^)]+)\)/g)];
  return matches.map(([, persona, body]) => ({
    persona: persona ?? '',
    action: (body ?? '').replace(/[*^]|\+human/g, ''),
    isHard: (body ?? '').includes('*'),
    isConditional: (body ?? '').includes('^'),
    hasHumanCheckpoint: (body ?? '').includes('+human') || persona === 'HUMAN',
  }));
}

function WorkflowCard({ workflow }: { workflow: Workflow }): JSX.Element {
  const stages = parseChain(workflow.chain);
  return (
    <article className="workflow-card">
      <header>
        <h3>
          {workflow.id} <span className="law-version">v{workflow.version}</span>
        </h3>
      </header>
      <h4>{workflow.title}</h4>
      <p className="workflow-trigger">When: {workflow.trigger}</p>
      <ol className="workflow-stages">
        {stages.map((stage, index) => (
          <li
            key={`${workflow.id}-${stage.action}-${String(index)}`}
            className={stage.isHard ? 'stage stage-hard' : 'stage'}
          >
            <span className="stage-persona">{stage.persona}</span>
            <span className="stage-action">{stage.action}</span>
            {stage.isHard && <span className="stage-flag" title="Hard stage — not overridable">hard</span>}
            {stage.isConditional && (
              <span className="stage-flag stage-flag-cond" title="Escalates to hard when its gating laws are triggered">
                conditional
              </span>
            )}
            {stage.hasHumanCheckpoint && (
              <span className="stage-flag stage-flag-human" title="Required human checkpoint">
                human
              </span>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}

/** All six workflow chains, rendered live from workflows/registry.json. */
export function WorkflowExplorer(): JSX.Element {
  return (
    <div className="workflow-explorer">
      <p className="explorer-legend">
        <strong>hard</strong> = never skippable · <strong>conditional</strong> = hard when its laws
        are triggered · <strong>human</strong> = required human checkpoint
      </p>
      {getAllWorkflows().map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
