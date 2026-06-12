import { WorkflowExplorer } from '../components/workflow-explorer';
import { getAllWorkflows } from '../domain/registry';

/** The workflow explorer page: every catalog chain with personas and gates. */
export function WorkflowsPage(): JSX.Element {
  return (
    <div className="workflows-page">
      <h1>Workflow Explorer</h1>
      <p>
        The {getAllWorkflows().length} defined workflows (LAW-10.6): how work moves between
        personas, stage by stage. Hard stages guard inviolable laws and can never be skipped;
        everything else can be reshaped conversationally — with the deviation recorded.
      </p>
      <WorkflowExplorer />
    </div>
  );
}
