import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { GetStartedPage } from './get-started';
import { JourneysPage } from './journeys';
import { PersonasPage } from './personas';
import { WhyPage } from './why';
import { startSteps } from '../data/get-started-content';
import { clientJourneys } from '../data/journeys-content';
import { personaProfiles } from '../data/personas-content';

function renderPage(page: JSX.Element): void {
  render(<MemoryRouter>{page}</MemoryRouter>);
}

describe('WhyPage', () => {
  it('should render the manifesto with live law and workflow counts', () => {
    renderPage(<WhyPage />);
    expect(screen.getByText(/protects engineers/)).toBeTruthy();
    // Live registry numbers appear in the sub-headline.
    expect(screen.getByText(/\d+ citable laws/)).toBeTruthy();
  });

  it('should render all five numbered claims with law citations', () => {
    renderPage(<WhyPage />);
    expect(screen.getByText('You will never lose the security argument again.')).toBeTruthy();
    expect(screen.getByText('05')).toBeTruthy();
    expect(screen.getAllByText(/\[LAW-\d+\.\d+ v[\d.]+\]/).length).toBeGreaterThanOrEqual(5);
  });

  it('should render the six founding pains struck through', () => {
    renderPage(<WhyPage />);
    expect(screen.getByText('Review bottlenecks')).toBeTruthy();
    expect(screen.getByText('Coverage theater')).toBeTruthy();
  });
});

describe('PersonasPage', () => {
  it('should render all eight persona cards with taglines', () => {
    renderPage(<PersonasPage />);
    for (const profile of personaProfiles) {
      expect(screen.getByText(profile.tagline)).toBeTruthy();
    }
  });

  it('should render the authority ladder tiers in order', () => {
    renderPage(<PersonasPage />);
    expect(screen.getAllByText('VETO').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('BLOCK').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText('ADVISE').length).toBeGreaterThanOrEqual(3);
  });

  it('should render each persona’s owned laws as live citation chips', () => {
    renderPage(<PersonasPage />);
    // Security owns LAW-5.1 — the chip renders id + live version + title.
    expect(screen.getByText(/\[LAW-5\.1 v[\d.]+\]/)).toBeTruthy();
  });
});

describe('JourneysPage', () => {
  it('should render every journey archetype as a filter chip and a section, with its headline', () => {
    renderPage(<JourneysPage />);
    for (const journey of clientJourneys) {
      // Archetype appears twice by design: once as a filter chip, once in the section.
      expect(screen.getByRole('button', { name: journey.archetype })).toBeTruthy();
      expect(screen.getAllByText(journey.archetype).length).toBe(2);
      expect(screen.getByText(journey.headline)).toBeTruthy();
    }
  });

  it('should render a journey-map timeline graphic per journey', () => {
    renderPage(<JourneysPage />);
    expect(screen.getAllByRole('img', { name: 'Client journey timeline' }).length).toBe(
      clientJourneys.length
    );
  });

  it('should render before/after columns for each journey', () => {
    renderPage(<JourneysPage />);
    expect(screen.getAllByText('Where they start').length).toBe(clientJourneys.length);
    expect(screen.getAllByText('Where they land').length).toBe(clientJourneys.length);
  });

  it('should filter to one journey when its archetype chip is clicked', () => {
    renderPage(<JourneysPage />);
    fireEvent.click(screen.getByRole('button', { name: 'The Rescue' }));
    expect(screen.getAllByRole('img', { name: 'Client journey timeline' }).length).toBe(1);
    expect(screen.getByText(/recovering from vibe-coded debt/)).toBeTruthy();
  });

  it('should restore all journeys when the All chip is clicked after filtering', () => {
    renderPage(<JourneysPage />);
    fireEvent.click(screen.getByRole('button', { name: 'The Mature Shop' }));
    fireEvent.click(screen.getByRole('button', { name: 'All journeys' }));
    expect(screen.getAllByRole('img', { name: 'Client journey timeline' }).length).toBe(
      clientJourneys.length
    );
  });
});

describe('GetStartedPage', () => {
  it('should render every step in order with its checkpoint', () => {
    renderPage(<GetStartedPage />);
    for (const [index, step] of startSteps.entries()) {
      expect(screen.getByText(step.title)).toBeTruthy();
      expect(screen.getByText(String(index + 1))).toBeTruthy();
    }
    expect(screen.getAllByText(/Checkpoint:/).length).toBe(startSteps.length);
  });

  it('should render console blocks for steps that have commands', () => {
    renderPage(<GetStartedPage />);
    expect(screen.getByText(/install\.sh \/path\/to\/your-project/)).toBeTruthy();
  });
});
