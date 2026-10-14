import { Box, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { MarkdownView } from './markdown-view';
import { useAdrRecords } from '../hooks/use-adr-records';
import { parseMarkdown } from '../lib/markdown-model';

const NAV_WIDTH_PX = 280;

function statusMessage(loaded: boolean, error: string | null, recordCount: number): string {
  if (!loaded) return 'Loading…';
  if (error) return `Error: ${error}`;
  if (recordCount === 0) return 'No ADR documents found.';
  return `${recordCount} ADR document${recordCount === 1 ? '' : 's'}`;
}

/** Left-nav list of ADR files + a markdown preview pane, always defaulting to the first file in the list. */
export function AdrRecords(): JSX.Element {
  const { records, error, loaded: isLoaded } = useAdrRecords();
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);

  useEffect(() => {
    if (!records.some((record) => record.filename === selectedFilename)) {
      setSelectedFilename(records[0]?.filename ?? null);
    }
  }, [records]);

  const selected = records.find((record) => record.filename === selectedFilename);

  return (
    <Box className="cohort-panel">
      <Typography variant="body2" color={error ? 'error' : 'text.secondary'} sx={{ marginBottom: 2 }}>
        {statusMessage(isLoaded, error, records.length)}
      </Typography>
      {records.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper variant="outlined" sx={{ width: NAV_WIDTH_PX, flexShrink: 0 }}>
            <List dense>
              {records.map((record) => (
                <ListItemButton
                  key={record.filename}
                  selected={record.filename === selected?.filename}
                  onClick={() => setSelectedFilename(record.filename)}
                >
                  <ListItemText primary={record.title} secondary={record.filename} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
          <Paper variant="outlined" sx={{ flexGrow: 1, padding: 2, overflowY: 'auto' }}>
            {selected && <MarkdownView blocks={parseMarkdown(selected.content)} />}
          </Paper>
        </Box>
      )}
    </Box>
  );
}
