import type { TrainingModule } from '../data/content-types';

/** Learner progress: lesson ids completed and module ids whose quiz was passed. */
export interface ProgressState {
  completedLessons: string[];
  passedQuizzes: string[];
}

const STORAGE_KEY = 'constitution-training-progress';

function emptyState(): ProgressState {
  return { completedLessons: [], passedQuizzes: [] };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/** Narrow unknown parsed JSON into ProgressState (LAW-5.1's allowlist posture). */
function isProgressState(value: unknown): value is ProgressState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return isStringArray(candidate.completedLessons) && isStringArray(candidate.passedQuizzes);
}

/**
 * Loads progress from storage. Corrupt or missing state yields empty progress —
 * a learner never loses the app to a bad localStorage value.
 *
 * @param storage - Injected Storage (window.localStorage in the app, a fake in tests per LAW-3.4).
 * @returns The saved progress, or empty progress when absent/invalid.
 */
export function loadProgress(storage: Storage): ProgressState {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return emptyState();
  try {
    const parsed: unknown = JSON.parse(raw);
    return isProgressState(parsed) ? parsed : emptyState();
  } catch {
    return emptyState();
  }
}

function save(storage: Storage, state: ProgressState): ProgressState {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

/**
 * Records a lesson as completed (idempotent).
 *
 * @returns The updated progress state.
 */
export function completeLesson(storage: Storage, lessonId: string): ProgressState {
  const state = loadProgress(storage);
  if (state.completedLessons.includes(lessonId)) return state;
  return save(storage, { ...state, completedLessons: [...state.completedLessons, lessonId] });
}

/**
 * Records a module's quiz as passed (idempotent).
 *
 * @returns The updated progress state.
 */
export function passQuiz(storage: Storage, moduleId: string): ProgressState {
  const state = loadProgress(storage);
  if (state.passedQuizzes.includes(moduleId)) return state;
  return save(storage, { ...state, passedQuizzes: [...state.passedQuizzes, moduleId] });
}

/** True when the given lesson is recorded complete. */
export function isLessonComplete(state: ProgressState, lessonId: string): boolean {
  return state.completedLessons.includes(lessonId);
}

/** True when the given module's quiz is recorded passed. */
export function isQuizPassed(state: ProgressState, moduleId: string): boolean {
  return state.passedQuizzes.includes(moduleId);
}

function completedUnits(state: ProgressState, module: TrainingModule): number {
  const lessonsDone = module.lessons.filter((lesson) =>
    state.completedLessons.includes(lesson.id)
  ).length;
  const quizDone = state.passedQuizzes.includes(module.id) ? 1 : 0;
  return lessonsDone + quizDone;
}

function totalUnits(module: TrainingModule): number {
  // Each lesson is one unit; the quiz is one unit.
  return module.lessons.length + 1;
}

/**
 * Percent complete for one module: lessons plus the quiz, each one unit.
 *
 * @returns Whole-number percent, 0–100.
 */
export function moduleProgressPct(state: ProgressState, module: TrainingModule): number {
  return Math.round((completedUnits(state, module) / totalUnits(module)) * 100);
}

/**
 * Percent complete across all modules, weighted by each module's unit count.
 *
 * @returns Whole-number percent, 0–100; 0 for an empty module list.
 */
export function overallProgressPct(state: ProgressState, modules: TrainingModule[]): number {
  const total = modules.reduce((sum, module) => sum + totalUnits(module), 0);
  if (total === 0) return 0;
  const done = modules.reduce((sum, module) => sum + completedUnits(state, module), 0);
  return Math.round((done / total) * 100);
}
