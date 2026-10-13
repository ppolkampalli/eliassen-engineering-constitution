import { Paper, Typography } from '@mui/material';

interface TokenCostStatTileProps {
  label: string;
  value: string;
}

export function TokenCostStatTile({ label, value }: TokenCostStatTileProps): JSX.Element {
  return (
    <Paper variant="outlined" sx={{ padding: 2, minWidth: 160 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5">{value}</Typography>
    </Paper>
  );
}
