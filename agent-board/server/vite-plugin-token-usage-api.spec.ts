/**
 * @jest-environment node
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join } from 'node:path';

import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

import { tokenUsageApiPlugin } from './vite-plugin-token-usage-api';

type Middleware = (req: IncomingMessage, res: ServerResponse, next: (error?: unknown) => void) => void;
type UseMock = jest.Mock<void, [string, Middleware]>;

const FIXTURES_DIR = join(__dirname, '../fixtures');

function fakeServer(): { middlewares: { use: UseMock } } {
  return { middlewares: { use: jest.fn() as UseMock } };
}

function invokeConfigureServer(plugin: Plugin, server: unknown): void {
  const hook = plugin.configureServer as unknown as (s: ViteDevServer) => void;
  hook(server as ViteDevServer);
}

function invokeConfigurePreviewServer(plugin: Plugin, server: unknown): void {
  const hook = plugin.configurePreviewServer as unknown as (s: PreviewServer) => void;
  hook(server as PreviewServer);
}

function fetchReport(plugin: Plugin): { totalCostUsd: number } {
  const server = fakeServer();
  const configureServer = plugin.configureServer as unknown as (s: ViteDevServer) => void;
  configureServer(server as unknown as ViteDevServer);
  const middleware = server.middlewares.use.mock.calls[0]?.[1];
  const end = jest.fn<void, [string]>();
  middleware?.({ method: 'GET' } as IncomingMessage, { writeHead: jest.fn(), end } as unknown as ServerResponse, jest.fn());
  return JSON.parse(end.mock.calls[0]?.[0] ?? '{}') as { totalCostUsd: number };
}

describe('tokenUsageApiPlugin', () => {
  const originalEnv = {
    AGENT_BOARD_LOG: process.env.AGENT_BOARD_LOG,
    AGENT_BOARD_TRANSCRIPTS_ROOT: process.env.AGENT_BOARD_TRANSCRIPTS_ROOT,
    AGENT_BOARD_PRICE_TABLE: process.env.AGENT_BOARD_PRICE_TABLE,
    AGENT_BOARD_PROJECT_CWD: process.env.AGENT_BOARD_PROJECT_CWD,
  };

  afterEach(() => {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it('registers a GET /api/token-usage middleware on configureServer and configurePreviewServer', () => {
    const plugin = tokenUsageApiPlugin();
    const serverA = fakeServer();
    const serverB = fakeServer();
    invokeConfigureServer(plugin, serverA);
    invokeConfigurePreviewServer(plugin, serverB);
    expect(serverA.middlewares.use).toHaveBeenCalledWith('/api/token-usage', expect.any(Function));
    expect(serverB.middlewares.use).toHaveBeenCalledWith('/api/token-usage', expect.any(Function));
  });

  it('passes non-GET requests to next() instead of the handler', () => {
    const plugin = tokenUsageApiPlugin();
    const server = fakeServer();
    invokeConfigureServer(plugin, server);
    const middleware = server.middlewares.use.mock.calls[0]?.[1];
    const next = jest.fn();
    const writeHead = jest.fn();
    middleware?.({ method: 'POST' } as IncomingMessage, { writeHead, end: jest.fn() } as unknown as ServerResponse, next);

    expect(next).toHaveBeenCalled();
    expect(writeHead).not.toHaveBeenCalled();
  });

  it('resolves AGENT_BOARD_TRANSCRIPTS_ROOT once at construction — a later env change has no effect', () => {
    jest.spyOn(process, 'cwd').mockReturnValue('/fake/project-a');
    process.env.AGENT_BOARD_TRANSCRIPTS_ROOT = join(FIXTURES_DIR, 'transcripts');
    process.env.AGENT_BOARD_LOG = join(FIXTURES_DIR, 'events.token-usage.jsonl');
    process.env.AGENT_BOARD_PRICE_TABLE = join(__dirname, '../model-pricing.json');
    const plugin = tokenUsageApiPlugin();
    const server = fakeServer();
    invokeConfigureServer(plugin, server);
    const middleware = server.middlewares.use.mock.calls[0]?.[1];

    process.env.AGENT_BOARD_TRANSCRIPTS_ROOT = join(FIXTURES_DIR, 'does-not-exist');

    const end = jest.fn<void, [string]>();
    middleware?.({ method: 'GET' } as IncomingMessage, { writeHead: jest.fn(), end } as unknown as ServerResponse, jest.fn());

    const body = JSON.parse(end.mock.calls[0]?.[0] ?? '{}') as { totalCostUsd: number };
    // Had the post-construction env change taken effect, no transcript
    // files would be found at all and totalCostUsd would be 0.
    expect(body.totalCostUsd).toBeGreaterThan(0);
  });

  it('defaults the project cwd to the parent directory when running from inside an agent-board directory', () => {
    jest.spyOn(process, 'cwd').mockReturnValue('/fake/project-a/agent-board');
    process.env.AGENT_BOARD_TRANSCRIPTS_ROOT = join(FIXTURES_DIR, 'transcripts');
    process.env.AGENT_BOARD_LOG = join(FIXTURES_DIR, 'events.token-usage.jsonl');
    process.env.AGENT_BOARD_PRICE_TABLE = join(__dirname, '../model-pricing.json');

    // project-a's transcript fixtures are tagged cwd:"/fake/project-a" — the
    // parent of "/fake/project-a/agent-board" — so a match here proves the
    // auto-correction, not just that matching works at all.
    expect(fetchReport(tokenUsageApiPlugin()).totalCostUsd).toBeGreaterThan(0);
  });

  it('AGENT_BOARD_PROJECT_CWD overrides the default project cwd', () => {
    jest.spyOn(process, 'cwd').mockReturnValue('/fake/unrelated/agent-board');
    process.env.AGENT_BOARD_PROJECT_CWD = '/fake/project-a';
    process.env.AGENT_BOARD_TRANSCRIPTS_ROOT = join(FIXTURES_DIR, 'transcripts');
    process.env.AGENT_BOARD_LOG = join(FIXTURES_DIR, 'events.token-usage.jsonl');
    process.env.AGENT_BOARD_PRICE_TABLE = join(__dirname, '../model-pricing.json');

    // Without the override, the default would resolve to "/fake/unrelated"
    // (the auto-corrected parent), which has no matching fixtures at all —
    // only the explicit override points at project-a's fixtures.
    expect(fetchReport(tokenUsageApiPlugin()).totalCostUsd).toBeGreaterThan(0);
  });
});
