import { Lane } from './lane';
import type { Lane as LaneKey, WorkItem } from '../lib/types';

interface BoardProps {
  workItems: Map<string, WorkItem>;
  onSelect: (workItem: string) => void;
}

const LANES: { key: LaneKey; title: string }[] = [
  { key: 'inProgress', title: 'In Progress' },
  { key: 'blocked', title: 'Blocked' },
  { key: 'done', title: 'Done' },
];

export function Board({ workItems, onSelect }: BoardProps): JSX.Element {
  const buckets: Record<LaneKey, WorkItem[]> = { inProgress: [], blocked: [], done: [] };
  for (const item of workItems.values()) {
    buckets[item.lane].push(item);
  }
  for (const key of Object.keys(buckets) as LaneKey[]) {
    buckets[key].sort((a, b) => (a.lastTimestamp < b.lastTimestamp ? 1 : -1));
  }

  return (
    <div className="lanes">
      {LANES.map(({ key, title }) => (
        <Lane laneKey={key} title={title} items={buckets[key]} onSelect={onSelect} key={key} />
      ))}
    </div>
  );
}
