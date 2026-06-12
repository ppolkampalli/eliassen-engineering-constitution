import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { App, AppRoutes } from './app';

function renderAt(path: string): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

describe('App', () => {
  it('should render the catalog when mounted with its own browser router', () => {
    window.localStorage.clear();
    render(<App />);
    expect(screen.getByText('Learn the Engineering Constitution')).toBeTruthy();
  });

  it('should render the Eliassen Agentic SDLC brand in the header', () => {
    window.localStorage.clear();
    render(<App />);
    expect(screen.getAllByText(/Eliassen Group/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Agentic SDLC/).length).toBeGreaterThan(0);
    expect(screen.getByText('Training & Onboarding for the Engineering Constitution')).toBeTruthy();
  });
});

describe('AppRoutes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should render the catalog with all training modules when visiting home', () => {
    renderAt('/');
    expect(screen.getByText('Learn the Engineering Constitution')).toBeTruthy();
    expect(screen.getByText(/Orientation: How the Constitution Works/)).toBeTruthy();
    expect(screen.getByText(/Greenfield: Starting a New Application/)).toBeTruthy();
    expect(screen.getByText(/Rewriting an Existing Application/)).toBeTruthy();
    expect(screen.getByText(/Enhancing an Existing Application/)).toBeTruthy();
  });

  it('should render a learning path with its lessons and quiz when visiting a module', () => {
    renderAt('/path/orientation');
    expect(screen.getByText(/Lesson 1:/)).toBeTruthy();
    expect(screen.getByText(/Knowledge check/)).toBeTruthy();
  });

  it('should render a not-found message when the module id is unknown', () => {
    renderAt('/path/nonexistent');
    expect(screen.getByText('Unknown learning path')).toBeTruthy();
  });

  it('should render the law browser with the live law count when visiting /laws', () => {
    renderAt('/laws');
    expect(screen.getByRole('heading', { name: 'Law Browser' })).toBeTruthy();
    // The live registry currently holds 57 laws; the count renders from it.
    expect(screen.getByText(/All \d+ laws of constitution v/)).toBeTruthy();
  });

  it('should render all six workflow chains when visiting /workflows', () => {
    renderAt('/workflows');
    expect(screen.getByText('Workflow Explorer')).toBeTruthy();
    for (const id of ['WF-FEATURE', 'WF-RESEARCH', 'WF-BUG', 'WF-SECBUG', 'WF-REFACTOR', 'WF-AMENDMENT']) {
      expect(screen.getByRole('heading', { name: new RegExp(`^${id}`) })).toBeTruthy();
    }
  });
});
