import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { LearningPathPage } from './learning-path';
import { trainingModules } from '../data/modules';
import { loadProgress } from '../domain/progress';


function renderModule(moduleId: string): void {
  render(
    <MemoryRouter initialEntries={[`/path/${moduleId}`]}>
      <Routes>
        <Route path="path/:moduleId" element={<LearningPathPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LearningPathPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should persist lesson completion to localStorage when marking a lesson complete', () => {
    renderModule('orientation');
    const firstModule = trainingModules[0];
    const firstLessonId = firstModule?.lessons[0]?.id ?? '';
    fireEvent.click(screen.getAllByText('Mark lesson complete')[0] as HTMLElement);
    expect(screen.getByText('✓ Completed')).toBeTruthy();
    expect(loadProgress(window.localStorage).completedLessons).toContain(firstLessonId);
  });

  it('should render law citation chips with live registry text in lessons', () => {
    renderModule('orientation');
    // The orientation lessons cite LAW-6.2 — the chip shows id + live version.
    expect(screen.getAllByText(/\[LAW-6\.2 v[\d.]+\]/).length).toBeGreaterThan(0);
  });

  it('should show module progress advancing when units complete', () => {
    renderModule('greenfield');
    fireEvent.click(screen.getAllByText('Mark lesson complete')[0] as HTMLElement);
    // greenfield: 6 lessons + 1 quiz = 7 units; 1 done ≈ 14%
    expect(screen.getAllByText('14%').length).toBeGreaterThan(0);
  });
});
