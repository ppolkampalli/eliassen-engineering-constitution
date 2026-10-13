import { readFileSync, statSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { errorMessage, isErrnoException } from './http-errors';
import { parseLog } from '../src/lib/board-model';

/**
 * Builds the GET /api/events request handler for a single, fixed log path.
 * The path is captured once by the caller (see vite-plugin-board-api.ts) —
 * this function and the handler it returns never read a path from the
 * request itself, by design (LAW-5.1: no client-controlled file path).
 */
export function createEventsHandler(logPath: string): (req: IncomingMessage, res: ServerResponse) => void {
  return function eventsHandler(_req: IncomingMessage, res: ServerResponse): void {
    let text: string;
    let mtimeMs: number | null;
    try {
      text = readFileSync(logPath, 'utf8');
      mtimeMs = statSync(logPath).mtimeMs;
    } catch (error) {
      if (isErrnoException(error) && error.code === 'ENOENT') {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ events: [], skippedCount: 0, mtimeMs: null }));
        return;
      }
      res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: errorMessage(error) }));
      return;
    }
    const { events, skippedCount } = parseLog(text);
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ events, skippedCount, mtimeMs }));
  };
}
