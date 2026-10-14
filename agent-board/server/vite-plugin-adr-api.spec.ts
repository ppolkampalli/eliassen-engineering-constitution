/**
 * @jest-environment node
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

import { adrApiPlugin } from './vite-plugin-adr-api';

type Middleware = (req: IncomingMessage, res: ServerResponse, next: (error?: unknown) => void) => void;
type UseMock = jest.Mock<void, [string, Middleware]>;

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

describe('adrApiPlugin', () => {
  const originalEnv = process.env.AGENT_BOARD_ADR_DIR;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.AGENT_BOARD_ADR_DIR;
    } else {
      process.env.AGENT_BOARD_ADR_DIR = originalEnv;
    }
  });

  it('registers a GET /api/adr middleware on configureServer', () => {
    const plugin = adrApiPlugin();
    const server = fakeServer();
    invokeConfigureServer(plugin, server);
    expect(server.middlewares.use).toHaveBeenCalledWith('/api/adr', expect.any(Function));
  });

  it('registers the same route on configurePreviewServer', () => {
    const plugin = adrApiPlugin();
    const server = fakeServer();
    invokeConfigurePreviewServer(plugin, server);
    expect(server.middlewares.use).toHaveBeenCalledWith('/api/adr', expect.any(Function));
  });

  it('passes non-GET requests to next() instead of the handler', () => {
    process.env.AGENT_BOARD_ADR_DIR = 'fixtures/adr';
    const plugin = adrApiPlugin();
    const server = fakeServer();
    invokeConfigureServer(plugin, server);

    const middleware = server.middlewares.use.mock.calls[0]?.[1];
    const next = jest.fn();
    const writeHead = jest.fn();
    const res = { writeHead, end: jest.fn() } as unknown as ServerResponse;
    middleware?.({ method: 'POST' } as IncomingMessage, res, next);

    expect(next).toHaveBeenCalled();
    expect(writeHead).not.toHaveBeenCalled();
  });

  it('resolves AGENT_BOARD_ADR_DIR once at construction — a later env change has no effect', () => {
    process.env.AGENT_BOARD_ADR_DIR = 'fixtures/adr';
    const plugin = adrApiPlugin();
    const server = fakeServer();
    invokeConfigureServer(plugin, server);
    const middleware = server.middlewares.use.mock.calls[0]?.[1];

    process.env.AGENT_BOARD_ADR_DIR = 'fixtures/adr/does-not-exist';

    const end = jest.fn<void, [string]>();
    const res = { writeHead: jest.fn(), end } as unknown as ServerResponse;
    middleware?.({ method: 'GET' } as IncomingMessage, res, jest.fn());

    const firstCallArgs = end.mock.calls[0];
    const body = JSON.parse(firstCallArgs?.[0] ?? '{}') as { records: unknown[] };
    // fixtures/adr (resolved at construction time) has 3 real .md files, not
    // the 0 that fixtures/adr/does-not-exist (the post-construction value) would give.
    expect(body.records).toHaveLength(3);
  });
});
