import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { useEffect, useState } from 'react';

import { ItemStageNode } from './item-stage-node';
import { buildItemFlowElements, defaultSelectedNodeId, type ItemFlowNode } from '../lib/item-flow-model';
import type { WorkItem } from '../lib/types';

const NODE_TYPES = { itemStage: ItemStageNode };
const DEFAULT_CANVAS_HEIGHT_PX = 220;

interface ItemFlowChartProps {
  item: WorkItem;
  /** Lets the maximized detail overlay give the canvas more room; defaults to the normal fixed height otherwise. */
  canvasHeight?: number;
}

function titleFor(data: ItemFlowNode['data']): string {
  if (data.kind === 'start') return 'Workflow selected';
  if (data.kind === 'end') return 'Workflow completed';
  return data.stageId ?? '';
}

function DetailPanel({ node }: { node: ItemFlowNode | undefined }): JSX.Element {
  if (!node) {
    return (
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Select a step above to see its detail.
        </Typography>
      </Paper>
    );
  }

  const { data } = node;
  return (
    <Paper variant="outlined" sx={{ padding: 2 }}>
      <Typography variant="subtitle1">{titleFor(data)}</Typography>
      {data.persona && (
        <Typography variant="body2" color="text.secondary">
          {data.persona}
        </Typography>
      )}
      {data.chain && (
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          <strong>Chain:</strong> {data.chain}
        </Typography>
      )}
      {data.outcome && (
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          {data.outcome}
        </Typography>
      )}
      {data.note && (
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          {data.note}
        </Typography>
      )}
      {data.detail && (
        <Typography
          variant="body2"
          component="pre"
          sx={{ marginTop: 1, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
        >
          {data.detail}
        </Typography>
      )}
      {data.deviation && (
        <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
          Deviation ({data.deviation.status}): {data.deviation.reason}
          {data.deviation.approvedBy ? ` — approved by ${data.deviation.approvedBy}` : ''}
        </Typography>
      )}
      {data.lawCitations.length > 0 && (
        <Stack direction="row" spacing={0.5} sx={{ marginTop: 1, flexWrap: 'wrap' }}>
          {data.lawCitations.map((citation) => (
            <Chip key={citation} label={citation} size="small" />
          ))}
        </Stack>
      )}
      {data.history.length > 0 && (
        <>
          <Divider sx={{ marginTop: 1.5, marginBottom: 1 }} />
          <Stack spacing={0.5}>
            {data.history.map((entry, index) => (
              <Typography variant="caption" color="text.secondary" key={`${entry.timestamp}-${index}`}>
                {entry.timestamp} — {entry.status}
                {entry.note ? `: ${entry.note}` : ''}
              </Typography>
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}

/** Renders a work item's actual event history as a left-to-right process flowchart; clicking a step shows its full decision detail below the canvas. */
export function ItemFlowChart({ item, canvasHeight = DEFAULT_CANVAS_HEIGHT_PX }: ItemFlowChartProps): JSX.Element {
  const { nodes, edges } = buildItemFlowElements(item);
  const [selectedId, setSelectedId] = useState<string | null>(() => defaultSelectedNodeId(nodes));

  useEffect(() => {
    setSelectedId(defaultSelectedNodeId(nodes));
  }, [item]);

  if (nodes.length === 0) {
    return (
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No steps recorded for this work item yet.
        </Typography>
      </Paper>
    );
  }

  const flowNodes = nodes.map((node) => ({ ...node, selected: node.id === selectedId }));
  const selectedNode = nodes.find((node) => node.id === selectedId);

  return (
    <Stack spacing={2}>
      <Box className="item-flow-canvas" sx={{ height: canvasHeight }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={flowNodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            onNodeClick={(_event, node) => setSelectedId(node.id)}
            fitView
            proOptions={{ hideAttribution: true }}
          />
        </ReactFlowProvider>
      </Box>
      <DetailPanel node={selectedNode} />
    </Stack>
  );
}
