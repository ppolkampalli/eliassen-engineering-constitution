import { Card } from './card';
import type { Lane as LaneKey, WorkItem } from '../lib/types';

interface LaneProps {
  laneKey: LaneKey;
  title: string;
  items: WorkItem[];
  onSelect: (workItem: string) => void;
}

export function Lane({ laneKey, title, items, onSelect }: LaneProps): JSX.Element {
  return (
    <section className="lane" data-lane={laneKey}>
      <h2>
        {title} <span className="lane-count">{items.length}</span>
      </h2>
      <div className="lane-cards">
        {items.map((item) => (
          <Card item={item} onSelect={onSelect} key={item.workItem} />
        ))}
      </div>
    </section>
  );
}
