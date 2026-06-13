import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ArticleReaderPage, ArticlesPage } from './articles';
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
    expect(articles.length).toBe(3);
    for (const article of articles) {
      expect(article.body.length).toBeGreaterThan(4000);
      expect(article.deck.length).toBeGreaterThan(40);
      expect(article.readingMinutes).toBeGreaterThan(0);
      // Body format contract: headings exist for the renderer.
      expect(article.body).toContain('## ');
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

  it('should render not-found for an unknown article slug', () => {
    renderReaderAt('/articles/does-not-exist');
    expect(screen.getByText('Article not found')).toBeTruthy();
  });
});
