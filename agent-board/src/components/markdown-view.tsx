import { Box, Link, Typography } from '@mui/material';
import { Fragment } from 'react';

import type { InlineNode, MarkdownBlock } from '../lib/markdown-model';

function InlineContent({ nodes }: { nodes: InlineNode[] }): JSX.Element {
  return (
    <>
      {nodes.map((node, index) => {
        const key = `${node.type}-${index}`;
        if (node.type === 'text') return <Fragment key={key}>{node.text}</Fragment>;
        if (node.type === 'bold') return <strong key={key}>{node.text}</strong>;
        if (node.type === 'italic') return <em key={key}>{node.text}</em>;
        if (node.type === 'code') return <code key={key}>{node.text}</code>;
        return (
          <Link key={key} href={node.href} target="_blank" rel="noreferrer">
            {node.text}
          </Link>
        );
      })}
    </>
  );
}

function BlockContent({ block }: { block: MarkdownBlock }): JSX.Element {
  if (block.type === 'heading') {
    return (
      <Typography variant={`h${block.level}`} gutterBottom>
        <InlineContent nodes={block.children} />
      </Typography>
    );
  }
  if (block.type === 'paragraph') {
    return (
      <Typography variant="body1" sx={{ marginBottom: 1.5 }}>
        <InlineContent nodes={block.children} />
      </Typography>
    );
  }
  if (block.type === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul';
    return (
      <Typography component={ListTag} sx={{ marginBottom: 1.5 }}>
        {block.items.map((item, index) => (
          <li key={index}>
            <InlineContent nodes={item} />
          </li>
        ))}
      </Typography>
    );
  }
  return (
    <Box component="pre" sx={{ backgroundColor: 'action.hover', padding: 1.5, borderRadius: 1, overflowX: 'auto' }}>
      <code>{block.text}</code>
    </Box>
  );
}

interface MarkdownViewProps {
  blocks: MarkdownBlock[];
}

/** Dumb renderer for an already-parsed MarkdownBlock[] — all parsing lives in src/lib/markdown-model.ts. */
export function MarkdownView({ blocks }: MarkdownViewProps): JSX.Element {
  return (
    <Box>
      {blocks.map((block, index) => (
        <BlockContent block={block} key={index} />
      ))}
    </Box>
  );
}
