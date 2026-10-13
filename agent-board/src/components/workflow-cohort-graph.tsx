import { ReactFlow, ReactFlowProvider } from '@xyflow/react';

import { WorkflowStageNode } from './workflow-stage-node';
import { buildFlowElements } from '../lib/cohort-model';
import type { WorkflowGraph } from '../lib/types';

const NODE_TYPES = { stage: WorkflowStageNode };

interface WorkflowCohortGraphProps {
  graphs: WorkflowGraph[];
}

export function WorkflowCohortGraph({ graphs }: WorkflowCohortGraphProps): JSX.Element {
  if (graphs.length === 0) {
    return (
      <div className="cohort-chart-empty">
        <p>No workflow activity in the current log.</p>
      </div>
    );
  }

  return (
    <div className="workflow-graph-list">
      {graphs.map((graph) => {
        const { nodes, edges } = buildFlowElements(graph);
        return (
          <div className="workflow-graph-panel" key={graph.workflowId}>
            <h3>{graph.workflowId}</h3>
            <div className="workflow-graph-canvas">
              <ReactFlowProvider>
                <ReactFlow nodes={nodes} edges={edges} nodeTypes={NODE_TYPES} fitView proOptions={{ hideAttribution: true }} />
              </ReactFlowProvider>
            </div>
          </div>
        );
      })}
    </div>
  );
}
