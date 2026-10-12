import type { IncomingMessage, ServerResponse } from 'node:http';
import { resolve } from 'node:path';

import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

import { createEventsHandler } from './create-events-handler';

type NextFunction = (error?: unknown) => void;
type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void;

function wireMiddleware(server: ViteDevServer | PreviewServer, handler: RequestHandler): void {
  server.middlewares.use('/api/events', (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    if (req.method !== 'GET') {
      next();
      return;
    }
    handler(req, res);
  });
}

/**
 * Exposes GET /api/events in both `vite` (dev) and `vite preview`
 * (production-style), resolving the log path once at plugin-construction
 * time from AGENT_BOARD_LOG — never from the request itself (LAW-5.1: no
 * client-controlled file path).
 */
export function boardApiPlugin(): Plugin {
  const logPath = resolve(process.cwd(), process.env.AGENT_BOARD_LOG ?? '.claude/board/events.local.jsonl');
  const handler = createEventsHandler(logPath);
  return {
    name: 'agent-board-api',
    configureServer(server) {
      wireMiddleware(server, handler);
    },
    configurePreviewServer(server) {
      wireMiddleware(server, handler);
    },
  };
}
