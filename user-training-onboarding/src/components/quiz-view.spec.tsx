import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { QuizView } from './quiz-view';
import type { QuizQuestion } from '../data/content-types';


const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Which law prohibits the any type?',
    options: ['LAW-2.3', 'LAW-5.1'],
    correctIndex: 0,
    explanation: 'LAW-2.3 prohibits any.',
    lawRef: 'LAW-2.3',
  },
  {
    id: 'q2',
    prompt: 'Who holds the veto?',
    options: ['FinOps', 'Security'],
    correctIndex: 1,
    explanation: 'Security holds the CRITICAL veto.',
  },
];

function renderQuiz(onPass: () => void, isPassed = false): void {
  render(
    <MemoryRouter>
      <QuizView questions={QUESTIONS} isPassed={isPassed} onPass={onPass} />
    </MemoryRouter>
  );
}

describe('QuizView', () => {
  it('should call onPass and show PASSED when all answers are correct', () => {
    const onPass = jest.fn();
    renderQuiz(onPass);
    fireEvent.click(screen.getByLabelText('LAW-2.3'));
    fireEvent.click(screen.getByLabelText('Security'));
    fireEvent.click(screen.getByText('Submit answers'));
    expect(screen.getByText(/2\/2 \(100%\) — PASSED/)).toBeTruthy();
    expect(onPass).toHaveBeenCalledTimes(1);
  });

  it('should show feedback with explanations and offer retry when failing', () => {
    const onPass = jest.fn();
    renderQuiz(onPass);
    fireEvent.click(screen.getByLabelText('LAW-5.1'));
    fireEvent.click(screen.getByLabelText('FinOps'));
    fireEvent.click(screen.getByText('Submit answers'));
    expect(screen.getByText(/0\/2 \(0%\) — not yet/)).toBeTruthy();
    expect(screen.getAllByText(/✗ Not quite/).length).toBe(2);
    expect(onPass).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Try again'));
    expect(screen.getByText('Submit answers')).toBeTruthy();
  });

  it('should show the passed badge when the quiz was already passed', () => {
    renderQuiz(jest.fn(), true);
    expect(screen.getByText('✓ passed')).toBeTruthy();
  });
});
