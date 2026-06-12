import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { LessonView } from '../components/lesson-view';
import { ProgressBadge } from '../components/progress-badge';
import { QuizView } from '../components/quiz-view';
import { trainingModules } from '../data/modules';
import {
  completeLesson,
  isLessonComplete,
  isQuizPassed,
  loadProgress,
  moduleProgressPct,
  passQuiz,
} from '../domain/progress';
import type { ProgressState } from '../domain/progress';

function UnknownPath(): JSX.Element {
  return (
    <div className="not-found">
      <h1>Unknown learning path</h1>
      <Link to="/">Back to the catalog</Link>
    </div>
  );
}

/** One training module: its lessons in sequence, then the knowledge check. */
export function LearningPathPage(): JSX.Element {
  const { moduleId } = useParams();
  const module = trainingModules.find((candidate) => candidate.id === moduleId);
  const [progress, setProgress] = useState<ProgressState>(() =>
    loadProgress(window.localStorage)
  );

  if (module === undefined) return <UnknownPath />;

  const markLessonComplete = (lessonId: string): void => {
    setProgress(completeLesson(window.localStorage, lessonId));
  };

  const markQuizPassed = (): void => {
    setProgress(passQuiz(window.localStorage, module.id));
  };

  return (
    <div className="learning-path">
      <header className="path-header">
        <h1>{module.title}</h1>
        <p>{module.summary}</p>
        <ProgressBadge pct={moduleProgressPct(progress, module)} />
      </header>
      {module.lessons.map((lesson, index) => (
        <details key={lesson.id} open={index === 0}>
          <summary>
            {isLessonComplete(progress, lesson.id) ? '✓ ' : ''}
            Lesson {index + 1}: {lesson.title}
          </summary>
          <LessonView
            lesson={lesson}
            isComplete={isLessonComplete(progress, lesson.id)}
            onComplete={(): void => markLessonComplete(lesson.id)}
          />
        </details>
      ))}
      <QuizView
        questions={module.quiz}
        isPassed={isQuizPassed(progress, module.id)}
        onPass={markQuizPassed}
      />
    </div>
  );
}
