import { render, screen } from '@testing-library/react';

import { MarkdownView } from './markdown-view';
import type { MarkdownBlock } from '../lib/markdown-model';

describe('MarkdownView', () => {
  it('renders a heading at the right level, a paragraph, a list, and a code block', () => {
    const blocks: MarkdownBlock[] = [
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'Context' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Plain text.' }] },
      {
        type: 'list',
        ordered: false,
        items: [[{ type: 'text', text: 'First item' }], [{ type: 'text', text: 'Second item' }]],
      },
      { type: 'codeBlock', language: 'ts', text: 'const x = 1;' },
    ];
    render(<MarkdownView blocks={blocks} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Context' })).toBeTruthy();
    expect(screen.getByText('Plain text.')).toBeTruthy();
    expect(screen.getByText('First item')).toBeTruthy();
    expect(screen.getByText('Second item')).toBeTruthy();
    expect(screen.getByText('const x = 1;')).toBeTruthy();
  });

  it('renders an ordered list using an <ol>, not a <ul>', () => {
    const blocks: MarkdownBlock[] = [{ type: 'list', ordered: true, items: [[{ type: 'text', text: 'Step one' }]] }];
    const { container } = render(<MarkdownView blocks={blocks} />);
    expect(container.querySelector('ol')).not.toBeNull();
    expect(container.querySelector('ul')).toBeNull();
  });

  it('renders every inline node kind: bold, italic, code, and a link', () => {
    const blocks: MarkdownBlock[] = [
      {
        type: 'paragraph',
        children: [
          { type: 'bold', text: 'bold text' },
          { type: 'italic', text: 'italic text' },
          { type: 'code', text: 'inline code' },
          { type: 'link', href: 'https://example.com', text: 'a link' },
        ],
      },
    ];
    render(<MarkdownView blocks={blocks} />);

    const bold = screen.getByText('bold text');
    expect(bold.tagName).toBe('STRONG');
    const italic = screen.getByText('italic text');
    expect(italic.tagName).toBe('EM');
    const code = screen.getByText('inline code');
    expect(code.tagName).toBe('CODE');
    const link = screen.getByRole('link', { name: 'a link' });
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('renders nothing for an empty block list', () => {
    const { container } = render(<MarkdownView blocks={[]} />);
    expect(container.textContent).toBe('');
  });
});
