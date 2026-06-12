/**
 * Long-form thought-leadership articles for the Articles section.
 * Body format: blank-line-separated blocks; "## " headings, "> " pull quotes,
 * "- " bullet items — rendered by article-view.tsx.
 */
export interface Article {
  /** Kebab-case slug used in the /articles/:id route. */
  id: string;
  title: string;
  /** One-sentence standfirst shown under the title and on the card. */
  deck: string;
  author: string;
  /** Publication date, ISO yyyy-mm-dd. */
  published: string;
  readingMinutes: number;
  body: string;
}
