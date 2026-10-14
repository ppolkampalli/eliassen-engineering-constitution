export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'italic'; text: string }
  | { type: 'link'; href: string; text: string };

export type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'codeBlock'; language: string | null; text: string };

const HEADING_PATTERN = /^(#{1,6})\s+(.*)$/;
const FENCE_OPEN_PATTERN = /^```(\w*)\s*$/;
const FENCE_CLOSE_PATTERN = /^```\s*$/;
const LIST_ITEM_PATTERN = /^\s*([-*]|\d+\.)\s+(.*)$/;
const ORDERED_MARKER_PATTERN = /^\d+\.$/;

/**
 * Matches exactly one of: inline code, bold (** or __), italic (* or _), or
 * a link — in that order, so `**bold**` is never mistaken for two italics.
 * Not recursive: a link's text or a bold/italic span's text is plain, never
 * further inline-parsed — ADR content observed in this repo never nests
 * emphasis, and keeping this a single pass keeps it simple to verify.
 */
const INLINE_PATTERN = /`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|\[([^\]]+)\]\(([^)]+)\)/g;

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let consumedTo = 0;
  for (const match of text.matchAll(INLINE_PATTERN)) {
    // matchAll's results always carry an index; TS only widens it to
    // `number | undefined` because .exec()-style results theoretically could lack one.
    const index = match.index as number;
    if (index > consumedTo) nodes.push({ type: 'text', text: text.slice(consumedTo, index) });
    if (match[1] !== undefined) nodes.push({ type: 'code', text: match[1] });
    else if (match[2] !== undefined) nodes.push({ type: 'bold', text: match[2] });
    else if (match[3] !== undefined) nodes.push({ type: 'bold', text: match[3] });
    else if (match[4] !== undefined) nodes.push({ type: 'italic', text: match[4] });
    else if (match[5] !== undefined) nodes.push({ type: 'italic', text: match[5] });
    // Every other alternative is undefined, so the link alternative is the one that matched —
    // meaning groups 6/7 are necessarily defined here, not just possibly.
    else nodes.push({ type: 'link', href: match[7] as string, text: match[6] as string });
    consumedTo = index + match[0].length;
  }
  if (consumedTo < text.length) nodes.push({ type: 'text', text: text.slice(consumedTo) });
  return nodes;
}

interface ParserState {
  blocks: MarkdownBlock[];
  paragraphLines: string[];
  list: { ordered: boolean; items: string[] } | null;
}

function flushParagraph(state: ParserState): void {
  if (state.paragraphLines.length === 0) return;
  state.blocks.push({ type: 'paragraph', children: parseInline(state.paragraphLines.join(' ')) });
  state.paragraphLines = [];
}

function flushList(state: ParserState): void {
  if (!state.list) return;
  state.blocks.push({ type: 'list', ordered: state.list.ordered, items: state.list.items.map(parseInline) });
  state.list = null;
}

function consumeFence(lines: string[], startIndex: number, language: string | null, state: ParserState): number {
  const codeLines: string[] = [];
  let index = startIndex;
  // The loop condition already bounds `index`, so each access below is in range.
  while (index < lines.length && !FENCE_CLOSE_PATTERN.test(lines[index] as string)) {
    codeLines.push(lines[index] as string);
    index += 1;
  }
  state.blocks.push({ type: 'codeBlock', language, text: codeLines.join('\n') });
  return index + 1; // skip the closing fence line (or just stop, if the file ended unclosed)
}

/**
 * Parses the bounded markdown subset this project's ADRs actually use:
 * headings, paragraphs, unordered/ordered lists, fenced code blocks, and
 * inline bold/italic/code/links. Anything outside that (tables, images,
 * blockquotes, nested emphasis) passes through as literal paragraph text
 * rather than being silently mishandled.
 */
export function parseMarkdown(text: string): MarkdownBlock[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const state: ParserState = { blocks: [], paragraphLines: [], list: null };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] as string; // bounded by the loop condition above
    const fence = FENCE_OPEN_PATTERN.exec(line);
    const heading = HEADING_PATTERN.exec(line);
    const listItem = LIST_ITEM_PATTERN.exec(line);

    if (fence) {
      flushParagraph(state);
      flushList(state);
      i = consumeFence(lines, i + 1, fence[1] || null, state);
      continue;
    }
    if (heading) {
      flushParagraph(state);
      flushList(state);
      // Both groups are mandatory (not inside an optional quantifier), so a
      // successful match always populates them.
      const level = (heading[1] as string).length as 1 | 2 | 3 | 4 | 5 | 6;
      state.blocks.push({ type: 'heading', level, children: parseInline((heading[2] as string).trim()) });
      i += 1;
      continue;
    }
    if (listItem) {
      flushParagraph(state);
      const isOrdered = ORDERED_MARKER_PATTERN.test(listItem[1] as string);
      if (!state.list || state.list.ordered !== isOrdered) {
        flushList(state);
        state.list = { ordered: isOrdered, items: [] };
      }
      state.list.items.push(listItem[2] as string);
      i += 1;
      continue;
    }
    if (line.trim() === '') {
      flushParagraph(state);
      flushList(state);
      i += 1;
      continue;
    }
    flushList(state);
    state.paragraphLines.push(line.trim());
    i += 1;
  }
  flushParagraph(state);
  flushList(state);
  return state.blocks;
}

/** Pulls the first `# Heading` line's text as a display title; falls back when none is found. */
export function extractMarkdownTitle(text: string, fallback: string): string {
  for (const line of text.split('\n')) {
    const match = /^#\s+(.*)$/.exec(line.trim());
    if (match) return (match[1] as string).trim(); // mandatory group, always populated on a successful match
  }
  return fallback;
}
