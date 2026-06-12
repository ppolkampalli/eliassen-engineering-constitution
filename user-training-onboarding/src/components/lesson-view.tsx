import { LawLink } from './law-link';
import type { Lesson } from '../data/content-types';


interface LessonViewProps {
  lesson: Lesson;
  isComplete: boolean;
  onComplete: () => void;
}

/** Renders one paragraph or bullet-list block from a lesson body. */
function BodyBlock({ block }: { block: string }): JSX.Element {
  const lines = block.split('\n');
  const hasBullets = lines.every((line) => line.startsWith('- '));
  if (hasBullets) {
    return (
      <ul>
        {lines.map((line) => (
          <li key={line}>{line.slice(2)}</li>
        ))}
      </ul>
    );
  }
  return <p>{block}</p>;
}

/** A single self-study lesson: body, cited laws, and a mark-complete control. */
export function LessonView({ lesson, isComplete, onComplete }: LessonViewProps): JSX.Element {
  const blocks = lesson.body.split('\n\n').map((block) => block.trim());
  return (
    <article className="lesson">
      <h3>{lesson.title}</h3>
      {blocks.map((block) => (
        <BodyBlock key={block.slice(0, 40)} block={block} />
      ))}
      {lesson.lawRefs.length > 0 && (
        <div className="lesson-laws">
          <span className="laws-label">Laws in this lesson:</span>
          {lesson.lawRefs.map((lawRef) => (
            <LawLink key={lawRef} lawId={lawRef} />
          ))}
        </div>
      )}
      <button
        type="button"
        className={isComplete ? 'btn btn-done' : 'btn btn-primary'}
        onClick={onComplete}
        disabled={isComplete}
      >
        {isComplete ? '✓ Completed' : 'Mark lesson complete'}
      </button>
    </article>
  );
}
