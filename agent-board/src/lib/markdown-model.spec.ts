import { extractMarkdownTitle, parseMarkdown } from './markdown-model';

describe('parseMarkdown', () => {
  it('parses headings of every level with their inline content', () => {
    expect(parseMarkdown('# ADR-0001: Adopt the Thing\n## Context\n### Sub-point')).toEqual([
      { type: 'heading', level: 1, children: [{ type: 'text', text: 'ADR-0001: Adopt the Thing' }] },
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'Context' }] },
      { type: 'heading', level: 3, children: [{ type: 'text', text: 'Sub-point' }] },
    ]);
  });

  it('joins consecutive non-blank lines into one paragraph, separated by blank lines', () => {
    expect(parseMarkdown('Line one\nline two still the same paragraph.\n\nA new paragraph.')).toEqual([
      { type: 'paragraph', children: [{ type: 'text', text: 'Line one line two still the same paragraph.' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'A new paragraph.' }] },
    ]);
  });

  it('parses inline bold, italic, code, and links in document order', () => {
    const [block] = parseMarkdown('A **bold** word, an _italic_ word, `inline code`, and a [link](https://example.com).');
    expect(block).toEqual({
      type: 'paragraph',
      children: [
        { type: 'text', text: 'A ' },
        { type: 'bold', text: 'bold' },
        { type: 'text', text: ' word, an ' },
        { type: 'italic', text: 'italic' },
        { type: 'text', text: ' word, ' },
        { type: 'code', text: 'inline code' },
        { type: 'text', text: ', and a ' },
        { type: 'link', href: 'https://example.com', text: 'link' },
        { type: 'text', text: '.' },
      ],
    });
  });

  it('supports the alternate bold (__) and italic (*) delimiters', () => {
    const [block] = parseMarkdown('__bold__ and *italic*');
    expect(block).toEqual({
      type: 'paragraph',
      children: [
        { type: 'bold', text: 'bold' },
        { type: 'text', text: ' and ' },
        { type: 'italic', text: 'italic' },
      ],
    });
  });

  it('groups consecutive unordered list items into one list block, inline-parsing each item', () => {
    expect(parseMarkdown('- First item\n- **Second** item\n* Still the same list (mixed marker)')).toEqual([
      {
        type: 'list',
        ordered: false,
        items: [
          [{ type: 'text', text: 'First item' }],
          [{ type: 'bold', text: 'Second' }, { type: 'text', text: ' item' }],
          [{ type: 'text', text: 'Still the same list (mixed marker)' }],
        ],
      },
    ]);
  });

  it('starts a new list block when the ordered-ness changes mid-stream', () => {
    const blocks = parseMarkdown('- unordered\n1. ordered');
    expect(blocks).toEqual([
      { type: 'list', ordered: false, items: [[{ type: 'text', text: 'unordered' }]] },
      { type: 'list', ordered: true, items: [[{ type: 'text', text: 'ordered' }]] },
    ]);
  });

  it('parses a fenced code block verbatim, with no inline parsing inside it', () => {
    expect(parseMarkdown('```ts\nconst x = 1; // *not* bold\n```')).toEqual([
      { type: 'codeBlock', language: 'ts', text: 'const x = 1; // *not* bold' },
    ]);
  });

  it('parses a fenced code block with no language tag', () => {
    expect(parseMarkdown('```\nplain text\n```')).toEqual([{ type: 'codeBlock', language: null, text: 'plain text' }]);
  });

  it('closes an unterminated fenced code block at end of input rather than losing its content', () => {
    expect(parseMarkdown('```\nunclosed')).toEqual([{ type: 'codeBlock', language: null, text: 'unclosed' }]);
  });

  it('flushes a list when a paragraph follows it directly, with no blank line between', () => {
    expect(parseMarkdown('- item one\nA following paragraph.')).toEqual([
      { type: 'list', ordered: false, items: [[{ type: 'text', text: 'item one' }]] },
      { type: 'paragraph', children: [{ type: 'text', text: 'A following paragraph.' }] },
    ]);
  });

  it('returns an empty list for empty input', () => {
    expect(parseMarkdown('')).toEqual([]);
  });

  it('normalizes CRLF line endings before parsing', () => {
    expect(parseMarkdown('# Title\r\n\r\nBody text.')).toEqual([
      { type: 'heading', level: 1, children: [{ type: 'text', text: 'Title' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Body text.' }] },
    ]);
  });
});

describe('extractMarkdownTitle', () => {
  it('returns the first H1 heading text', () => {
    expect(extractMarkdownTitle('# ADR-0001: Adopt the Thing\n\nContext here.', 'fallback.md')).toBe(
      'ADR-0001: Adopt the Thing'
    );
  });

  it('skips a non-H1 heading and keeps looking for an H1', () => {
    expect(extractMarkdownTitle('## Not a title\n# The Real Title', 'fallback.md')).toBe('The Real Title');
  });

  it('falls back when no H1 heading exists', () => {
    expect(extractMarkdownTitle('Just a paragraph, no heading.', 'fallback.md')).toBe('fallback.md');
  });
});
