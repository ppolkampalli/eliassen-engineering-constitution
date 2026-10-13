import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { App } from './app';
import { parseLog } from './lib/board-model';
import type { EventsResponse } from './lib/types';

const FIXTURES_DIR = join(__dirname, '../fixtures');

function loadFixtureResponse(name: string, mtimeMs: number | null = 1): EventsResponse {
  const text = readFileSync(join(FIXTURES_DIR, name), 'utf8');
  const { events, skippedCount } = parseLog(text);
  return { events, skippedCount, mtimeMs };
}

function mockFetchOnce(payload: EventsResponse, ok = true): void {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(payload),
  });
}

function laneOf(workItem: string): string | null {
  const card = screen.getByText(workItem).closest('.card');
  const laneSection = card?.parentElement?.parentElement ?? null;
  return laneSection?.getAttribute('data-lane') ?? null;
}

describe('App against real fixtures', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 280 });
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders the empty state when there are no events yet', async () => {
    mockFetchOnce(loadFixtureResponse('events.empty.jsonl', null));
    render(<App />);
    await waitFor(() => expect(screen.getByText(/no events yet/i)).toBeTruthy());
  });

  it('renders all three lanes correctly from the full sample lifecycle', async () => {
    mockFetchOnce(loadFixtureResponse('events.sample.jsonl'));
    render(<App />);

    await waitFor(() => expect(screen.getByText('JIRA-3411')).toBeTruthy());
    expect(laneOf('JIRA-3411')).toBe('done');
    expect(laneOf('JIRA-3500')).toBe('blocked');
    expect(laneOf('JIRA-3600')).toBe('inProgress');
    expect(screen.getByText(/16 events loaded/)).toBeTruthy();
  });

  it('shows the skipped-line count for the malformed-mixed fixture', async () => {
    mockFetchOnce(loadFixtureResponse('events.malformed-mixed.jsonl'));
    render(<App />);
    await waitFor(() => expect(screen.getByText(/3 events loaded \(2 malformed lines skipped\)/)).toBeTruthy());
  });

  it('shows the skipped-line count for the schema-invalid fixture', async () => {
    mockFetchOnce(loadFixtureResponse('events.schema-invalid.jsonl'));
    render(<App />);
    await waitFor(() => expect(screen.getByText(/2 events loaded \(3 malformed lines skipped\)/)).toBeTruthy());
  });

  it('keeps the deviation-latest work item in the blocked lane and shows its deviation note', async () => {
    mockFetchOnce(loadFixtureResponse('events.deviation-latest.jsonl'));
    render(<App />);

    await waitFor(() => expect(screen.getByText('JIRA-9200')).toBeTruthy());
    expect(laneOf('JIRA-9200')).toBe('blocked');
    const card = screen.getByText('JIRA-9200').closest('.card');
    expect(card?.textContent).toMatch(/Deviation \(applied\)/);
  });

  it('opens the detail overlay on click and closes on Escape', async () => {
    mockFetchOnce(loadFixtureResponse('events.sample.jsonl'));
    render(<App />);
    await waitFor(() => expect(screen.getByText('JIRA-3411')).toBeTruthy());

    fireEvent.click(screen.getByText('JIRA-3411'));
    expect(await screen.findByRole('button', { name: /close detail view/i })).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('button', { name: /close detail view/i })).toBeNull());
  });

  it('shows a request-failed message for a non-ok response, without crashing', async () => {
    mockFetchOnce({ events: [], skippedCount: 0, mtimeMs: null }, false);
    render(<App />);
    await waitFor(() => expect(screen.getByText(/request failed: 500/)).toBeTruthy());
  });

  it('switches to the Constitution Cohort tab and hides the Kanban board', async () => {
    mockFetchOnce(loadFixtureResponse('events.sample.jsonl'));
    render(<App />);
    await waitFor(() => expect(screen.getByText('JIRA-3411')).toBeTruthy());

    fireEvent.click(screen.getByRole('tab', { name: 'Constitution Cohort' }));
    expect(screen.queryByText('JIRA-3411')).toBeNull();
    expect(screen.getByRole('group', { name: 'Cohort type' })).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: 'Kanban Board' }));
    expect(screen.getByText('JIRA-3411')).toBeTruthy();
  });
});
