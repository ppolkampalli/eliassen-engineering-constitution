import { PASS_THRESHOLD_PCT, scoreQuiz } from './quiz';
import type { QuizQuestion } from '../data/content-types';


const QUESTIONS: QuizQuestion[] = [
  { id: 'q1', prompt: '', options: ['a', 'b'], correctIndex: 0, explanation: '' },
  { id: 'q2', prompt: '', options: ['a', 'b'], correctIndex: 1, explanation: '' },
  { id: 'q3', prompt: '', options: ['a', 'b'], correctIndex: 0, explanation: '' },
  { id: 'q4', prompt: '', options: ['a', 'b'], correctIndex: 1, explanation: '' },
];

describe('scoreQuiz', () => {
  it('should score 100 and pass when every answer is correct', () => {
    const result = scoreQuiz(QUESTIONS, [0, 1, 0, 1]);
    expect(result).toEqual({ correct: 4, total: 4, pct: 100, passed: true });
  });

  it('should fail when the score is below the pass threshold', () => {
    const result = scoreQuiz(QUESTIONS, [1, 0, 1, 0]);
    expect(result.correct).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('should pass when the score meets the threshold exactly', () => {
    // 3/4 = 75% ≥ PASS_THRESHOLD_PCT (70)
    const result = scoreQuiz(QUESTIONS, [0, 1, 0, 0]);
    expect(result.correct).toBe(3);
    expect(result.pct).toBe(75);
    expect(result.passed).toBe(PASS_THRESHOLD_PCT <= 75);
  });

  it('should treat unanswered questions as incorrect when answers are missing', () => {
    const result = scoreQuiz(QUESTIONS, [0]);
    expect(result.correct).toBe(1);
    expect(result.total).toBe(4);
  });

  it('should score 0 and fail when the quiz has no questions', () => {
    expect(scoreQuiz([], [])).toEqual({ correct: 0, total: 0, pct: 0, passed: false });
  });
});
