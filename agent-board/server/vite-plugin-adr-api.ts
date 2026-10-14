import type { IncomingMessage, ServerResponse } from 'node:http';
import { resolve } from 'node:path';

import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

import { createAdrHandler } from './create-adr-handler';

type NextFunction = (error?: unknown) => void;
type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void;

function wireMiddleware(server: ViteDevServer | PreviewServer, handler: RequestHandler): void {
  server.middlewares.use('/api/adr', (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    if (req.method !== 'GET') {
      next();
      return;
    }
    handler(req, res);
  });
}

/**
 * Exposes GET /api/adr in both `vite` (dev) and `vite preview`, resolving
 * the ADR directory once at plugin-construction time from
 * AGENT_BOARD_ADR_DIR (default `docs/adr`, the constitution's own
 * convention) — never from the request itself (LAW-5.1).
 */
export function adrApiPlugin(): Plugin {
  const adrDir = resolve(process.cwd(), process.env.AGENT_BOARD_ADR_DIR ?? 'docs/adr');
  const handler = createAdrHandler(adrDir);
  return {
    name: 'agent-board-adr-api',
    configureServer(server) {
      wireMiddleware(server, handler);
    },
    configurePreviewServer(server) {
      wireMiddleware(server, handler);
    },
  };
}
