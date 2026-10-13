import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;

interface TokenCostTimeSeriesProps {
  data: { bucketStart: string; costUsd: number }[];
}

/** Exported so it can be unit-tested directly — recharts only invokes this on hover, which is impractical to simulate in jsdom. */
export function formatHourLabel(value: unknown): string {
  return new Date(String(value)).toLocaleString();
}

/** Exported so it can be unit-tested directly — recharts only invokes this on hover, which is impractical to simulate in jsdom. */
export function formatTooltipCost(value: unknown): string {
  return `$${Number(value).toFixed(4)}`;
}

/** Fixed-size, not ResponsiveContainer — same reasoning as BarCohortChart: sidesteps recharts' ResizeObserver-based measurement, which never resolves to a usable width in jsdom tests. */
export function TokenCostTimeSeries({ data }: TokenCostTimeSeriesProps): JSX.Element {
  if (data.length === 0) {
    return (
      <div className="cohort-chart-empty">
        <p>No token usage found in the current log.</p>
      </div>
    );
  }

  return (
    <AreaChart width={CHART_WIDTH} height={CHART_HEIGHT} data={data} margin={{ left: 16, right: 16 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="bucketStart" tickFormatter={formatHourLabel} />
      <YAxis allowDecimals tickFormatter={(value: unknown) => `$${Number(value).toFixed(2)}`} />
      <Tooltip labelFormatter={formatHourLabel} formatter={formatTooltipCost} />
      <Area type="monotone" dataKey="costUsd" stroke="#0052cc" fill="#0052cc" fillOpacity={0.2} />
    </AreaChart>
  );
}
