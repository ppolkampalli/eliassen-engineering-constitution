import { Box, Button } from '@mui/material';

import { BarCohortChart } from './bar-cohort-chart';
import { TokenCostStatTile } from './token-cost-stat-tile';
import { TokenCostTimeSeries } from './token-cost-time-series';
import { useTokenUsage } from '../hooks/use-token-usage';
import { formatUsd } from '../lib/token-cost-model';

const ROW_SX = { display: 'flex', gap: 2, flexWrap: 'wrap' } as const;

export function TokenCostDashboard(): JSX.Element {
  const { report, error, loading: isLoading, refresh } = useTokenUsage();

  return (
    <div className="cohort-panel">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <span>{isLoading ? 'Loading…' : error ? `Error: ${error}` : 'Up to date'}</span>
        <Button variant="outlined" size="small" onClick={refresh} disabled={isLoading}>
          Refresh
        </Button>
      </Box>

      {report && (
        <>
          <Box sx={{ ...ROW_SX, marginBottom: 2 }}>
            <TokenCostStatTile label="Total cost" value={formatUsd(report.totalCostUsd)} />
            <TokenCostStatTile label="Unattributed records" value={String(report.unattributedRecordCount)} />
            <TokenCostStatTile label="Unpriced records" value={String(report.unpricedRecordCount)} />
          </Box>

          <TokenCostTimeSeries data={report.timeSeries} />

          <Box sx={{ ...ROW_SX, marginTop: 2 }}>
            <BarCohortChart title="Cost by workflow" data={report.byWorkflow} />
            <BarCohortChart title="Cost by stage" data={report.byStage} />
            <BarCohortChart title="Cost by persona" data={report.byPersona} />
            <BarCohortChart title="Cost by model" data={report.byModel} />
          </Box>
        </>
      )}
    </div>
  );
}
