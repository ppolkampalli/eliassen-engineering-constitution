import type { IncomingMessage, ServerResponse } from 'node:http';

import { listAdrFiles, readAdrFile } from './adr-source';
import { extractMarkdownTitle } from '../src/lib/markdown-model';
import type { AdrRecord, AdrResponse } from '../src/lib/types';

function titleFallback(filename: string): string {
  return filename.replace(/\.md$/, '');
}

/**
 * Builds the GET /api/adr request handler for a single, fixed ADR
 * directory, returning every file's full content in one response rather
 * than a per-filename route — same LAW-5.1 posture as /api/events and
 * /api/token-usage: the request supplies no path or filename at all, so
 * there's nothing to validate against path traversal.
 */
export function createAdrHandler(adrDir: string): (req: IncomingMessage, res: ServerResponse) => void {
  return function adrHandler(_req: IncomingMessage, res: ServerResponse): void {
    const files = listAdrFiles(adrDir);
    const records: AdrRecord[] = [];
    let mtimeMs: number | null = null;

    for (const file of files) {
      const content = readAdrFile(adrDir, file.filename);
      if (content === null) continue;
      records.push({ filename: file.filename, title: extractMarkdownTitle(content, titleFallback(file.filename)), content });
      mtimeMs = mtimeMs === null ? file.mtimeMs : Math.max(mtimeMs, file.mtimeMs);
    }

    const body: AdrResponse = { records, mtimeMs };
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(body));
  };
}
