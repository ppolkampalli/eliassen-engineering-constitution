/**
 * @jest-environment node
 */
// Default import (not `import * as fs`) — TS's namespace-import helper
// wraps properties as non-configurable getters, which breaks jest.spyOn.
// eslint-disable-next-line import/no-named-as-default
import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join } from 'node:path';

import { createEventsHandler } from './create-events-handler';

const FIXTURES_DIR = join(__dirname, '../fixtures');

interface FakeResponse {
  writeHead: jest.Mock<void, [number, Record<string, string>]>;
  end: jest.Mock<void, [string]>;
}

function fakeReqRes(url = '/api/events'): { req: IncomingMessage; res: ServerResponse & FakeResponse } {
  const req = { url, method: 'GET' } as unknown as IncomingMessage;
  const res = { writeHead: jest.fn(), end: jest.fn() } as unknown as ServerResponse & FakeResponse;
  return { req, res };
}

function jsonBody(res: FakeResponse): unknown {
  const raw = res.end.mock.calls[0]?.[0] ?? '{}';
  return JSON.parse(raw);
}

describe('createEventsHandler against fixtures', () => {
  it.each([
    ['events.sample.jsonl', 16, 0],
    ['events.empty.jsonl', 0, 0],
    ['events.malformed-mixed.jsonl', 3, 2],
    ['events.schema-invalid.jsonl', 2, 3],
    ['events.deviation-latest.jsonl', 3, 0],
  ])('returns the expected shape for %s', (fixture, eventCount, skippedCount) => {
    const handler = createEventsHandler(join(FIXTURES_DIR, fixture));
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'content-type': 'application/json; charset=utf-8' });
    const body = jsonBody(res) as { events: unknown[]; skippedCount: number; mtimeMs: number | null };
    expect(body.events).toHaveLength(eventCount);
    expect(body.skippedCount).toBe(skippedCount);
    expect(typeof body.mtimeMs).toBe('number');
  });
});

describe('createEventsHandler error handling', () => {
  it('returns an empty, mtimeMs:null payload when the file does not exist', () => {
    const handler = createEventsHandler(join(FIXTURES_DIR, 'events.does-not-exist.jsonl'));
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'content-type': 'application/json; charset=utf-8' });
    expect(jsonBody(res)).toEqual({ events: [], skippedCount: 0, mtimeMs: null });
  });

  it('returns a 500 for a non-ENOENT read error', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      const error = new Error('permission denied') as NodeJS.ErrnoException;
      error.code = 'EACCES';
      throw error;
    });
    const handler = createEventsHandler(join(FIXTURES_DIR, 'events.sample.jsonl'));
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(500, { 'content-type': 'application/json; charset=utf-8' });
    expect(jsonBody(res)).toEqual({ error: 'permission denied' });
  });

  it('returns a 500 with a generic message for a thrown non-Error value', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 'not an Error instance';
    });
    const handler = createEventsHandler(join(FIXTURES_DIR, 'events.sample.jsonl'));
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(jsonBody(res)).toEqual({ error: 'unknown error' });
  });
});

describe('createEventsHandler ignores request contents (LAW-5.1)', () => {
  it('serves the same fixed path regardless of req.url', () => {
    const handler = createEventsHandler(join(FIXTURES_DIR, 'events.sample.jsonl'));
    const { req: reqA, res: resA } = fakeReqRes('/api/events');
    const { req: reqB, res: resB } = fakeReqRes('/api/events?path=/etc/passwd');

    handler(reqA, resA);
    handler(reqB, resB);

    expect(jsonBody(resA)).toEqual(jsonBody(resB));
  });
});
