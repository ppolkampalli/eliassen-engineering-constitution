import { articleFigures } from './article-figures';
import type { Article } from '../data/articles-types';


const FIGURE_PATTERN = /^@@figure:([\w-]+)@@$/;

/** Renders an embedded diagram figure, or nothing if the id is unknown. */
function ArticleFigure({ id }: { id: string }): JSX.Element | null {
  const figure = articleFigures[id];
  if (figure === undefined) return null;
  return (
    <figure className="article-figure">
      {figure.render()}
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}

/** Renders one block of article body: figure, heading, pull quote, bullets, or paragraph. */
function ArticleBlock({ block }: { block: string }): JSX.Element {
  const figureMatch = block.match(FIGURE_PATTERN);
  if (figureMatch !== null) {
    return <ArticleFigure id={figureMatch[1] ?? ''} />;
  }
  if (block.startsWith('## ')) {
    return <h2>{block.slice(3)}</h2>;
  }
  if (block.startsWith('> ')) {
    return <blockquote className="pull-quote">{block.slice(2)}</blockquote>;
  }
  const lines = block.split('\n');
  if (lines.every((line) => line.startsWith('- '))) {
    return (
      <ul>
        {lines.map((line) => (
          <li key={line}>{line.slice(2)}</li>
        ))}
      </ul>
    );
  }
  return <p>{block}</p>;
}

/** Editorial long-form article renderer. */
export function ArticleView({ article }: { article: Article }): JSX.Element {
  const blocks = article.body
    .split('\n\n')
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
  return (
    <article className="article">
      <header className="article-header">
        <h1>{article.title}</h1>
        <p className="article-deck">{article.deck}</p>
        <p className="article-meta">
          {article.author} · {article.published} · {article.readingMinutes} min read
        </p>
      </header>
      {blocks.map((block) => (
        <ArticleBlock key={block.slice(0, 48)} block={block} />
      ))}
    </article>
  );
}
