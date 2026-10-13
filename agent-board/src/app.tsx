import { useMemo, useState } from 'react';

import { Board } from './components/board';
import { ConstitutionCohort } from './components/constitution-cohort';
import { DetailOverlay } from './components/detail-overlay';
import { EmptyState } from './components/empty-state';
import { StatusBar } from './components/status-bar';
import { Tabs } from './components/tabs';
import { TokenCostDashboard } from './components/token-cost-dashboard';
import { useBoardEvents } from './hooks/use-board-events';
import { deriveWorkItems, statusMessage } from './lib/board-model';

const TAB_DEFS = [
  { id: 'kanban', label: 'Kanban Board' },
  { id: 'cohort', label: 'Constitution Cohort' },
  { id: 'tokenCost', label: 'Token & Cost' },
];

export function App(): JSX.Element {
  const { events, skippedCount, error } = useBoardEvents();
  const [selectedWorkItem, setSelectedWorkItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('kanban');
  const workItems = useMemo(() => deriveWorkItems(events), [events]);
  const selectedItem = selectedWorkItem ? (workItems.get(selectedWorkItem) ?? null) : null;

  return (
    <div>
      <header className="board-header">
        <h1>Agent Board</h1>
        <StatusBar message={statusMessage(events.length, skippedCount)} error={error} />
        <Tabs tabs={TAB_DEFS} active={activeTab} onChange={setActiveTab} />
      </header>
      <main className="board-root">
        {activeTab === 'cohort' && <ConstitutionCohort events={events} workItems={workItems} />}
        {activeTab === 'tokenCost' && <TokenCostDashboard />}
        {activeTab === 'kanban' &&
          (workItems.size === 0 ? <EmptyState /> : <Board workItems={workItems} onSelect={setSelectedWorkItem} />)}
      </main>
      {activeTab === 'kanban' && selectedItem && (
        <DetailOverlay item={selectedItem} onClose={() => setSelectedWorkItem(null)} />
      )}
    </div>
  );
}
