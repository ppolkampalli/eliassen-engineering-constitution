import { useState } from 'react';

import { LawLink } from './law-link';
import type { QuizQuestion } from '../data/content-types';
import { PASS_THRESHOLD_PCT, scoreQuiz } from '../domain/quiz';
import type { QuizResult } from '../domain/quiz';


interface QuizViewProps {
  questions: QuizQuestion[];
  isPassed: boolean;
  onPass: () => void;
}

const UNANSWERED = -1;

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  selected: number;
  isSubmitted: boolean;
  onSelect: (optionIndex: number) => void;
}

function QuestionCard({
  question,
  index,
  selected,
  isSubmitted,
  onSelect,
}: QuestionCardProps): JSX.Element {
  return (
    <fieldset className="quiz-question">
      <legend>
        {index + 1}. {question.prompt}
      </legend>
      {question.options.map((option, optionIndex) => (
        <label key={option} className="quiz-option">
          <input
            type="radio"
            name={question.id}
            checked={selected === optionIndex}
            disabled={isSubmitted}
            onChange={(): void => onSelect(optionIndex)}
          />
          {option}
        </label>
      ))}
      {isSubmitted && (
        <p className={selected === question.correctIndex ? 'quiz-right' : 'quiz-wrong'}>
          {selected === question.correctIndex ? '✓ Correct. ' : '✗ Not quite. '}
          {question.explanation}{' '}
          {question.lawRef !== undefined && <LawLink lawId={question.lawRef} />}
        </p>
      )}
    </fieldset>
  );
}

/** End-of-module knowledge check with instant feedback and a pass gate. */
export function QuizView({ questions, isPassed, onPass }: QuizViewProps): JSX.Element {
  const [answers, setAnswers] = useState<number[]>(questions.map(() => UNANSWERED));
  const [result, setResult] = useState<QuizResult | null>(null);

  const selectAnswer = (questionIndex: number, optionIndex: number): void => {
    setAnswers((current) =>
      current.map((answer, index) => (index === questionIndex ? optionIndex : answer))
    );
  };

  const submit = (): void => {
    const scored = scoreQuiz(questions, answers);
    setResult(scored);
    if (scored.passed) onPass();
  };

  const retry = (): void => {
    setAnswers(questions.map(() => UNANSWERED));
    setResult(null);
  };

  return (
    <section className="quiz">
      <h3>Knowledge check {isPassed && <span className="quiz-passed-badge">✓ passed</span>}</h3>
      <p className="quiz-hint">Pass mark: {PASS_THRESHOLD_PCT}%.</p>
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          selected={answers[index] ?? UNANSWERED}
          isSubmitted={result !== null}
          onSelect={(optionIndex): void => selectAnswer(index, optionIndex)}
        />
      ))}
      {result === null ? (
        <button type="button" className="btn btn-primary" onClick={submit}>
          Submit answers
        </button>
      ) : (
        <div className="quiz-result">
          <strong>
            {result.correct}/{result.total} ({result.pct}%) — {result.passed ? 'PASSED' : 'not yet'}
          </strong>
          {!result.passed && (
            <button type="button" className="btn" onClick={retry}>
              Try again
            </button>
          )}
        </div>
      )}
    </section>
  );
}
