import { Chip, Paper, Stack, Typography, useTheme } from '@mui/material';
import { Handle, Position, type NodeProps } from '@xyflow/react';

import type { ItemFlowNode } from '../lib/item-flow-model';

const NODE_WIDTH_PX = 220;

function titleFor(data: ItemFlowNode['data']): string {
  if (data.kind === 'start') return 'Start';
  if (data.kind === 'end') return 'Completed';
  return data.stageId ?? '';
}

function StatusChip({ data }: { data: ItemFlowNode['data'] }): JSX.Element | null {
  const theme = useTheme();
  if (data.kind === 'start') {
    return <Chip label={data.workflowVersion ? `v${data.workflowVersion}` : 'Workflow selected'} size="small" color="primary" variant="outlined" />;
  }
  if (data.kind === 'end') return <Chip label="Done" size="small" color="success" />;
  if (data.kind === 'deviationOnly') {
    return (
      <Chip
        label={data.deviation?.status === 'applied' ? 'Skipped' : 'Override refused'}
        size="small"
        sx={{ backgroundColor: theme.palette.grey[300] }}
      />
    );
  }
  const colorByStatus = { entered: 'primary', complete: 'success', blocked: 'error' } as const;
  const color = data.status ? colorByStatus[data.status] : 'default';
  return <Chip label={data.status ?? 'unknown'} size="small" color={color} />;
}

export function ItemStageNode({ data, selected }: NodeProps<ItemFlowNode>): JSX.Element {
  return (
    <Paper
      variant="outlined"
      sx={{
        padding: 1.5,
        width: NODE_WIDTH_PX,
        borderStyle: data.kind === 'deviationOnly' ? 'dashed' : 'solid',
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" noWrap>
          {titleFor(data)}
        </Typography>
        {data.persona && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {data.persona}
          </Typography>
        )}
        <StatusChip data={data} />
        <Stack direction="row" spacing={0.5}>
          {data.hard && <Chip label="hard" size="small" variant="outlined" />}
          {data.humanCheckpoint === 'required' && <Chip label="human" size="small" variant="outlined" color="warning" />}
          {data.detail && <Chip label="has detail" size="small" variant="outlined" color="info" />}
        </Stack>
      </Stack>
      <Handle type="source" position={Position.Right} />
    </Paper>
  );
}
