import { Link, useParams } from 'react-router-dom';

import { ArticleView } from '../components/article-view';
import { articles } from '../data/articles-content';

function ArticleCard({ id }: { id: string }): JSX.Element | null {
  const article = articles.find((candidate) => candidate.id === id);
  if (article === undefined) return null;
  return (
    <Link to={`/articles/${article.id}`} className="article-card">
      <p className="article-card-kicker">Perspective</p>
      <h2>{article.title}</h2>
      <p className="article-card-deck">{article.deck}</p>
      <p className="article-meta">
        {article.author} · {article.readingMinutes} min read
      </p>
    </Link>
  );
}

/** Articles index: the practice's thought-leadership pieces. */
export function ArticlesPage(): JSX.Element {
  return (
    <div className="articles-page">
      <section className="personas-hero">
        <p className="kicker">Articles</p>
        <h1>Question the process before you inherit it.</h1>
        <p className="manifesto-sub">
          Every process was invented to fit a human limitation — a problem somebody faced, a mistake
          somebody refused to repeat. Tools mature, realities shift, and what was true then may not
          be true now. These essays apply first principles to the rituals we’ve stopped questioning.
        </p>
      </section>
      <div className="article-grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} id={article.id} />
        ))}
      </div>
    </div>
  );
}

/** Single-article reader at /articles/:articleId. */
export function ArticleReaderPage(): JSX.Element {
  const { articleId } = useParams();
  const article = articles.find((candidate) => candidate.id === articleId);
  if (article === undefined) {
    return (
      <div className="not-found">
        <h1>Article not found</h1>
        <Link to="/articles">Back to articles</Link>
      </div>
    );
  }
  return (
    <div className="article-reader">
      <Link to="/articles" className="article-back">
        ← All articles
      </Link>
      <ArticleView article={article} />
    </div>
  );
}
