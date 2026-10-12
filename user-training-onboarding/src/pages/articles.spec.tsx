import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ArticleReaderPage, ArticlesPage } from './articles';
import { articleFigures } from '../components/article-figures';
import { articles } from '../data/articles-content';

function renderReaderAt(path: string): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="articles/:articleId" element={<ArticleReaderPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('articles content', () => {
  it('should publish the commissioned articles with substantial bodies', () => {
    expect(articles.length).toBe(6);
    for (const article of articles) {
      expect(article.body.length).toBeGreaterThan(4000);
      expect(article.deck.length).toBeGreaterThan(40);
      expect(article.readingMinutes).toBeGreaterThan(0);
      // Body format contract: headings exist for the renderer.
      expect(article.body).toContain('## ');
    }
  });

  it('should reference only registered figures (every @@figure:id@@ resolves)', () => {
    const tokenPattern = /@@figure:([\w-]+)@@/g;
    for (const article of articles) {
      for (const match of article.body.matchAll(tokenPattern)) {
        expect(articleFigures[match[1] ?? '']).toBeDefined();
      }
    }
  });

  it('should author every article as Pramod Polkampalli', () => {
    for (const article of articles) {
      expect(article.author).toBe('Pramod Polkampalli');
    }
  });
});

describe('ArticlesPage', () => {
  it('should render a card per article with title and deck', () => {
    render(
      <MemoryRouter>
        <ArticlesPage />
      </MemoryRouter>
    );
    for (const article of articles) {
      expect(screen.getByText(article.title)).toBeTruthy();
    }
    expect(screen.getByText('Question the process before you inherit it.')).toBeTruthy();
  });
});

describe('ArticleReaderPage', () => {
  it('should render the full article with headings and pull quotes when the slug exists', () => {
    renderReaderAt('/articles/what-is-your-sprint-protecting-now');
    expect(
      screen.getByRole('heading', { name: 'What Is Your Sprint Protecting Now?' })
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'The Problems Were Real' })).toBeTruthy();
    expect(
      screen.getByText(/bottleneck moved from typing to judging/)
    ).toBeTruthy();
  });

  it('should render the Product Owner article with its sections when visited', () => {
    renderReaderAt('/articles/the-engineer-of-intent');
    expect(screen.getByRole('heading', { name: 'The Engineer of Intent' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'The Job Nobody Tooled' })).toBeTruthy();
    expect(screen.getByText(/tolerance for ambiguity collapsed/)).toBeTruthy();
  });

  it('should render the multi-agent article with its embedded diagrams', () => {
    renderReaderAt('/articles/many-agents-one-source-of-truth');
    expect(screen.getByRole('heading', { name: 'Many Agents, One Source of Truth' })).toBeTruthy();
    // Figures rendered, not shown as raw @@figure@@ tokens.
    expect(screen.getByText(/Figure 1 ·/)).toBeTruthy();
    expect(screen.getByText(/Figure 2 ·/)).toBeTruthy();
    expect(screen.getByText(/Figure 3 ·/)).toBeTruthy();
    expect(screen.getByText('Orchestrator Agent')).toBeTruthy();
    expect(screen.getByText('Central Memory Service')).toBeTruthy();
    expect(screen.queryByText(/@@figure:/)).toBeNull();
  });

  it('should render the agent board article with its embedded mockup', () => {
    renderReaderAt('/articles/watching-agentic-work-the-agent-board');
    expect(screen.getByRole('heading', { name: 'Watch It Run: A Window Into Agentic Work' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Reading the lanes' })).toBeTruthy();
    expect(screen.getByText(/Figure 5 ·/)).toBeTruthy();
    expect(screen.getByText('JIRA-3411')).toBeTruthy();
    expect(screen.queryByText(/@@figure:/)).toBeNull();
  });

  it('should render not-found for an unknown article slug', () => {
    renderReaderAt('/articles/does-not-exist');
    expect(screen.getByText('Article not found')).toBeTruthy();
  });
});
