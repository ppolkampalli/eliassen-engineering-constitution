import type { QuizQuestion } from '../data/content-types';

/** Minimum percent to pass a module quiz. */
export const PASS_THRESHOLD_PCT = 70;

export interface QuizResult {
  correct: number;
  total: number;
  pct: number;
  passed: boolean;
}

/**
 * Scores a quiz attempt. Unanswered questions count as incorrect.
 *
 * @param questions - The module's quiz questions.
 * @param answers - Selected option index per question, aligned by position.
 * @returns Correct count, total, whole-number percent, and pass/fail at PASS_THRESHOLD_PCT.
 */
export function scoreQuiz(questions: QuizQuestion[], answers: number[]): QuizResult {
  const correct = questions.filter(
    (question, index) => answers[index] === question.correctIndex
  ).length;
  const total = questions.length;
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, pct, passed: pct >= PASS_THRESHOLD_PCT };
}
