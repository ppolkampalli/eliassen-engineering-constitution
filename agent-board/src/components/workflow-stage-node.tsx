import { Handle, Position, type NodeProps } from '@xyflow/react';

import type { StageNode } from '../lib/cohort-model';

export function WorkflowStageNode({ data }: NodeProps<StageNode>): JSX.Element {
  return (
    <div className="stage-node">
      <Handle type="target" position={Position.Left} />
      <div className="stage-node-head">
        <strong>{data.stageId}</strong>
        <span className="stage-node-persona">{data.persona}</span>
      </div>
      <div className="stage-node-badges">
        {data.hard && <span className="badge-hard">hard</span>}
        {data.conditional && <span className="badge-conditional">conditional</span>}
        {data.humanRequired && <span className="badge-human">human</span>}
      </div>
      <div className="stage-node-counts">
        <span>{data.activeCount} active now</span>
        <span>{data.eventCount} events total</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
