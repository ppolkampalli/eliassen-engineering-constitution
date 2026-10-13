import { useMemo, useState } from 'react';

import { BarCohortChart } from './bar-cohort-chart';
import { CohortSelector, type CohortType } from './cohort-selector';
import { WorkflowCohortGraph } from './workflow-cohort-graph';
import { aggregateByLaw, aggregateByPersona, aggregateWorkflowGraph } from '../lib/cohort-model';
import type { BoardEvent, WorkItem } from '../lib/types';

interface ConstitutionCohortProps {
  events: BoardEvent[];
  workItems: Map<string, WorkItem>;
}

export function ConstitutionCohort({ events, workItems }: ConstitutionCohortProps): JSX.Element {
  const [cohortType, setCohortType] = useState<CohortType>('workflow');
  const lawBuckets = useMemo(() => aggregateByLaw(events), [events]);
  const personaBuckets = useMemo(() => aggregateByPersona(events), [events]);
  const workflowGraphs = useMemo(() => aggregateWorkflowGraph(events, workItems), [events, workItems]);

  return (
    <div className="cohort-panel">
      <CohortSelector active={cohortType} onChange={setCohortType} />
      {cohortType === 'workflow' && <WorkflowCohortGraph graphs={workflowGraphs} />}
      {cohortType === 'laws' && <BarCohortChart title="Laws" data={lawBuckets} />}
      {cohortType === 'personas' && <BarCohortChart title="Personas" data={personaBuckets} />}
    </div>
  );
}
