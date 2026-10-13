import { Paper, Typography, useTheme } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import type { CohortBucket } from '../lib/types';

const CHART_WIDTH = 640;
const ROW_HEIGHT_PX = 32;
const MIN_CHART_HEIGHT_PX = 160;
const BAR_RADIUS: [number, number, number, number] = [0, 4, 4, 0];

interface BarCohortChartProps {
  title: string;
  data: CohortBucket[];
}

/**
 * Fixed-size (not ResponsiveContainer) on purpose: this is an internal tool
 * with a fixed-width layout already, and a fixed size sidesteps recharts'
 * ResizeObserver-based measurement, which never resolves to a usable width
 * in jsdom tests.
 */
export function BarCohortChart({ title, data }: BarCohortChartProps): JSX.Element {
  const theme = useTheme();

  if (data.length === 0) {
    return (
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          No {title.toLowerCase()} activity in the current log.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <BarChart
        width={CHART_WIDTH}
        height={Math.max(MIN_CHART_HEIGHT_PX, data.length * ROW_HEIGHT_PX)}
        data={data}
        layout="vertical"
        margin={{ left: 32, right: 16 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false} />
        <YAxis type="category" dataKey="key" width={140} />
        <Tooltip />
        <Bar dataKey="count" fill={theme.palette.primary.main} radius={BAR_RADIUS} />
      </BarChart>
    </Paper>
  );
}
