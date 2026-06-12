import { getLaw, getWorkflow } from './registry';
import type { Lesson, QuizQuestion, TrainingModule } from '../data/content-types';

function lessonErrors(lesson: Lesson, seenLessonIds: Set<string>): string[] {
  const errors: string[] = [];
  if (seenLessonIds.has(lesson.id)) errors.push(`duplicate lesson id: ${lesson.id}`);
  seenLessonIds.add(lesson.id);

  const missingLaws = lesson.lawRefs.filter((lawRef) => getLaw(lawRef) === undefined);
  const missingWorkflows = (lesson.workflowRefs ?? []).filter(
    (workflowRef) => getWorkflow(workflowRef) === undefined
  );
  return [
    ...errors,
    ...missingLaws.map((lawRef) => `lesson ${lesson.id}: references nonexistent ${lawRef}`),
    ...missingWorkflows.map((ref) => `lesson ${lesson.id}: references nonexistent ${ref}`),
  ];
}

function questionErrors(question: QuizQuestion): string[] {
  const errors: string[] = [];
  const hasValidIndex =
    question.correctIndex >= 0 && question.correctIndex < question.options.length;
  if (!hasValidIndex) {
    errors.push(`quiz ${question.id}: correctIndex ${question.correctIndex} is out of range`);
  }
  if (question.lawRef !== undefined && getLaw(question.lawRef) === undefined) {
    errors.push(`quiz ${question.id}: references nonexistent ${question.lawRef}`);
  }
  return errors;
}

function moduleErrors(module: TrainingModule, seenLessonIds: Set<string>): string[] {
  const shape: string[] = [];
  if (module.lessons.length === 0) shape.push(`module ${module.id}: no lessons`);
  if (module.quiz.length === 0) shape.push(`module ${module.id}: no quiz`);
  return [
    ...shape,
    ...module.lessons.flatMap((lesson) => lessonErrors(lesson, seenLessonIds)),
    ...module.quiz.flatMap(questionErrors),
  ];
}

/**
 * Validates training content against the live registries — the mechanical
 * guarantee that this app cannot silently drift from the constitution
 * (LAW-10.6's consistency obligation, applied to training material).
 *
 * @param modules - The training catalog to validate.
 * @returns Human-readable error messages; empty when the content is consistent.
 */
export function validateContent(modules: TrainingModule[]): string[] {
  const seenLessonIds = new Set<string>();
  return modules.flatMap((module) => moduleErrors(module, seenLessonIds));
}
