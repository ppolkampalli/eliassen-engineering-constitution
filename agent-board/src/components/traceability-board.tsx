import { Box, Chip, List, ListItemButton, ListItemText, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useBoardEvents } from '../hooks/use-board-events';
import { deriveWorkItems } from '../lib/board-model';
import { buildTraceabilityMatrix, mostRecentWorkItemId, type AcTestRow } from '../lib/traceability-model';
import type { TestStatus, TestType } from '../lib/types';

const TEST_TYPES: TestType[] = ['unit', 'integration', 'e2e'];

const STATUS_COLOR: Record<TestStatus, 'success' | 'error' | 'default'> = {
  pass: 'success',
  fail: 'error',
  pending: 'default',
};

function TestMatrixPane({ row }: { row: AcTestRow | undefined }): JSX.Element | null {
  if (!row) return null;
  if (row.results.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No test results reported yet for {row.ac.id}.
      </Typography>
    );
  }
  return (
    <Stack spacing={2}>
      {TEST_TYPES.map((testType) => {
        const resultsForType = row.results.filter((result) => result.testType === testType);
        if (resultsForType.length === 0) return null;
        return (
          <Box key={testType}>
            <Typography variant="overline" color="text.secondary">
              {testType} ({resultsForType.length})
            </Typography>
            <Stack spacing={1} sx={{ marginTop: 0.5 }}>
              {resultsForType.map((result) => (
                <Box key={result.testId}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Chip label={result.status} size="small" color={STATUS_COLOR[result.status]} />
                    <Typography variant="body2">{result.testId}</Typography>
                  </Stack>
                  {result.testFile && (
                    <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 1, fontFamily: 'monospace' }}>
                      {result.testFile}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}

/**
 * Product Requirement → Acceptance Criteria → Testing traceability, derived
 * entirely from `GET /api/events` (no new server route): a work-item
 * selector, an AC left-nav, and a per-AC unit/integration/e2e test matrix.
 */
export function TraceabilityBoard(): JSX.Element {
  const { events, error } = useBoardEvents();
  const workItems = deriveWorkItems(events);
  const workItemIds = [...workItems.keys()].sort();
  const [selectedWorkItem, setSelectedWorkItem] = useState<string | null>(null);
  const [selectedAcId, setSelectedAcId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedWorkItem || !workItems.has(selectedWorkItem)) {
      setSelectedWorkItem(mostRecentWorkItemId(workItems));
    }
  }, [events]);

  const activeWorkItem = selectedWorkItem ? workItems.get(selectedWorkItem) : undefined;
  const matrix = activeWorkItem ? buildTraceabilityMatrix(activeWorkItem.events) : [];
  // Derived, not a second effect: an effect here would need an extra render
  // to take effect, leaving a transient frame where the AC nav shows but the
  // matrix pane hasn't caught up — computing the fallback inline avoids that
  // render race entirely.
  const effectiveAcId = matrix.some((row) => row.ac.id === selectedAcId) ? selectedAcId : (matrix[0]?.ac.id ?? null);

  if (workItemIds.length === 0) {
    return (
      <Box className="cohort-panel">
        <Typography variant="body2" color={error ? 'error' : 'text.secondary'}>
          {error ? `Error: ${error}` : 'No work items yet.'}
        </Typography>
      </Box>
    );
  }

  const selectedRow = matrix.find((row) => row.ac.id === effectiveAcId);

  return (
    <Box className="cohort-panel">
      <ToggleButtonGroup
        value={selectedWorkItem}
        exclusive
        onChange={(_event, value: string | null) => {
          if (!value) return;
          setSelectedAcId(null);
          setSelectedWorkItem(value);
        }}
        aria-label="Work item"
        sx={{ marginBottom: 2 }}
      >
        {workItemIds.map((id) => (
          <ToggleButton key={id} value={id} aria-label={id}>
            {id}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {matrix.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No acceptance criteria reported yet for {selectedWorkItem}.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper variant="outlined" sx={{ width: 320, flexShrink: 0 }}>
            <List dense>
              {matrix.map((row) => (
                <ListItemButton
                  key={row.ac.id}
                  selected={row.ac.id === effectiveAcId}
                  onClick={() => setSelectedAcId(row.ac.id)}
                >
                  <ListItemText primary={row.ac.id} secondary={row.ac.text} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
          <Paper variant="outlined" sx={{ flexGrow: 1, padding: 2, overflowY: 'auto' }}>
            <TestMatrixPane row={selectedRow} />
          </Paper>
        </Box>
      )}
    </Box>
  );
}
