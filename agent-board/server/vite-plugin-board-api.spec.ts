/**
 * @jest-environment node
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

import { boardApiPlugin } from './vite-plugin-board-api';

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

describe('boardApiPlugin', () => {
  const originalEnv = process.env.AGENT_BOARD_LOG;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.AGENT_BOARD_LOG;
    } else {
      process.env.AGENT_BOARD_LOG = originalEnv;
    }
  });

  it('registers a GET /api/events middleware on configureServer', () => {
    const plugin = boardApiPlugin();
    const server = fakeServer();
    invokeConfigureServer(plugin, server);
    expect(server.middlewares.use).toHaveBeenCalledWith('/api/events', expect.any(Function));
  });

  it('registers the same route on configurePreviewServer', () => {
    const plugin = boardApiPlugin();
    const server = fakeServer();
    invokeConfigurePreviewServer(plugin, server);
    expect(server.middlewares.use).toHaveBeenCalledWith('/api/events', expect.any(Function));
  });

  it('passes non-GET requests to next() instead of the handler', () => {
    process.env.AGENT_BOARD_LOG = 'fixtures/events.sample.jsonl';
    const plugin = boardApiPlugin();
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

  it('resolves AGENT_BOARD_LOG once at construction — a later env change has no effect', () => {
    process.env.AGENT_BOARD_LOG = 'fixtures/events.sample.jsonl';
    const plugin = boardApiPlugin();
    const server = fakeServer();
    invokeConfigureServer(plugin, server);
    const middleware = server.middlewares.use.mock.calls[0]?.[1];

    process.env.AGENT_BOARD_LOG = 'fixtures/events.empty.jsonl';

    const end = jest.fn<void, [string]>();
    const res = { writeHead: jest.fn(), end } as unknown as ServerResponse;
    middleware?.({ method: 'GET' } as IncomingMessage, res, jest.fn());

    const firstCallArgs = end.mock.calls[0];
    const body = JSON.parse(firstCallArgs?.[0] ?? '{}') as { events: unknown[] };
    // events.sample.jsonl (resolved at construction time) has 16 lines,
    // not the 0 that events.empty.jsonl (the post-construction env value) would give.
    expect(body.events).toHaveLength(16);
  });
});
