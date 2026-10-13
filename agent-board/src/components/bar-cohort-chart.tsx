import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import type { CohortBucket } from '../lib/types';

const CHART_WIDTH = 640;
const ROW_HEIGHT_PX = 32;
const MIN_CHART_HEIGHT_PX = 160;

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
  if (data.length === 0) {
    return (
      <div className="cohort-chart-empty">
        <h3>{title}</h3>
        <p>No {title.toLowerCase()} activity in the current log.</p>
      </div>
    );
  }

  return (
    <div className="cohort-chart">
      <h3>{title}</h3>
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
        <Bar dataKey="count" fill="#0052cc" />
      </BarChart>
    </div>
  );
}
