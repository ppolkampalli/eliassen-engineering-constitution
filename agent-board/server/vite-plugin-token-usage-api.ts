import type { IncomingMessage, ServerResponse } from 'node:http';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';

import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

import { createTokenUsageHandler } from './create-token-usage-handler';

type NextFunction = (error?: unknown) => void;
type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void;

function wireMiddleware(server: ViteDevServer | PreviewServer, handler: RequestHandler): void {
  server.middlewares.use('/api/token-usage', (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    if (req.method !== 'GET') {
      next();
      return;
    }
    handler(req, res);
  });
}

/**
 * The documented, standard way to run this tool is `cd your-project/agent-
 * board && npm run dev` — so `process.cwd()` is usually the `agent-board`
 * subdirectory itself, not the project root Claude Code actually recorded
 * as `cwd` in its session transcripts (Claude Code sessions are run from
 * the project root, not from inside a vendored tool subdirectory). Default
 * to the parent directory in exactly that case, so the dashboard isn't
 * silently empty for everyone following the README as written.
 * AGENT_BOARD_PROJECT_CWD overrides this for any other layout.
 */
function defaultProjectCwd(): string {
  const cwd = process.cwd();
  return basename(cwd) === 'agent-board' ? dirname(cwd) : cwd;
}

/**
 * Exposes GET /api/token-usage in both `vite` (dev) and `vite preview`,
 * resolving every input path once at plugin-construction time — the board
 * log (same AGENT_BOARD_LOG as the Kanban board), the transcripts root
 * (AGENT_BOARD_TRANSCRIPTS_ROOT, defaulting to ~/.claude/projects), the
 * project cwd used to match transcript files (see defaultProjectCwd), and
 * the price table path — never from the request itself (LAW-5.1).
 */
export function tokenUsageApiPlugin(): Plugin {
  const boardLogPath = resolve(process.cwd(), process.env.AGENT_BOARD_LOG ?? '.claude/board/events.local.jsonl');
  const projectsRoot = resolve(process.env.AGENT_BOARD_TRANSCRIPTS_ROOT ?? join(homedir(), '.claude', 'projects'));
  const priceTablePath = resolve(process.cwd(), process.env.AGENT_BOARD_PRICE_TABLE ?? 'model-pricing.json');
  const cwd = resolve(process.env.AGENT_BOARD_PROJECT_CWD ?? defaultProjectCwd());
  const handler = createTokenUsageHandler({ boardLogPath, projectsRoot, cwd, priceTablePath });
  return {
    name: 'agent-board-token-usage-api',
    configureServer(server) {
      wireMiddleware(server, handler);
    },
    configurePreviewServer(server) {
      wireMiddleware(server, handler);
    },
  };
}
