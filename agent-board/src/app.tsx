import { useMemo, useState } from 'react';

import { Board } from './components/board';
import { DetailOverlay } from './components/detail-overlay';
import { EmptyState } from './components/empty-state';
import { StatusBar } from './components/status-bar';
import { useBoardEvents } from './hooks/use-board-events';
import { deriveWorkItems, statusMessage } from './lib/board-model';

export function App(): JSX.Element {
  const { events, skippedCount, error } = useBoardEvents();
  const [selectedWorkItem, setSelectedWorkItem] = useState<string | null>(null);
  const workItems = useMemo(() => deriveWorkItems(events), [events]);
  const selectedItem = selectedWorkItem ? (workItems.get(selectedWorkItem) ?? null) : null;

  return (
    <div>
      <header className="board-header">
        <h1>Agent Board</h1>
        <StatusBar message={statusMessage(events.length, skippedCount)} error={error} />
      </header>
      <main className="board-root">
        {workItems.size === 0 ? (
          <EmptyState />
        ) : (
          <Board workItems={workItems} onSelect={setSelectedWorkItem} />
        )}
      </main>
      {selectedItem && <DetailOverlay item={selectedItem} onClose={() => setSelectedWorkItem(null)} />}
    </div>
  );
}
