import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';

import { ConstitutionCohort } from './constitution-cohort';
import { deriveWorkItems, parseLog } from '../lib/board-model';

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 280 });
});

const FIXTURES_DIR = join(__dirname, '../../fixtures');
const { events } = parseLog(readFileSync(join(FIXTURES_DIR, 'events.sample.jsonl'), 'utf8'));
const workItems = deriveWorkItems(events);

describe('ConstitutionCohort', () => {
  it('defaults to the workflow cohort view', () => {
    render(<ConstitutionCohort events={events} workItems={workItems} />);
    expect(screen.getByText('WF-BUG')).toBeTruthy();
    expect(screen.getByText('WF-FEATURE')).toBeTruthy();
    expect(screen.getByText('WF-REFACTOR')).toBeTruthy();
  });

  it('switches to the laws bar chart when Laws is selected', () => {
    render(<ConstitutionCohort events={events} workItems={workItems} />);
    fireEvent.click(screen.getByRole('button', { name: 'Laws' }));
    expect(screen.getByText('LAW-8.1')).toBeTruthy();
  });

  it('switches to the personas bar chart when Personas is selected', () => {
    render(<ConstitutionCohort events={events} workItems={workItems} />);
    fireEvent.click(screen.getByRole('button', { name: 'Personas' }));
    expect(screen.getByText('persona-quality')).toBeTruthy();
  });
});
