import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';

import { WorkflowStageNode } from './workflow-stage-node';
import { buildFlowElements } from '../lib/cohort-model';
import type { WorkflowGraph } from '../lib/types';

const NODE_TYPES = { stage: WorkflowStageNode };

interface WorkflowCohortGraphProps {
  graphs: WorkflowGraph[];
}

function usageLabel(usageCount: number): string {
  return usageCount === 1 ? 'Used 1 time' : `Used ${usageCount} times`;
}

export function WorkflowCohortGraph({ graphs }: WorkflowCohortGraphProps): JSX.Element {
  if (graphs.length === 0) {
    return (
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No workflow activity in the current log.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {graphs.map((graph) => {
        const { nodes, edges } = buildFlowElements(graph);
        return (
          <Paper variant="outlined" sx={{ padding: 2 }} key={graph.workflowId}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', marginBottom: 1 }}>
              <Typography variant="h6">{graph.workflowId}</Typography>
              <Chip label={usageLabel(graph.usageCount)} color="primary" size="small" />
            </Stack>
            <Box className="workflow-graph-canvas">
              <ReactFlowProvider>
                <ReactFlow nodes={nodes} edges={edges} nodeTypes={NODE_TYPES} fitView proOptions={{ hideAttribution: true }} />
              </ReactFlowProvider>
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
}
