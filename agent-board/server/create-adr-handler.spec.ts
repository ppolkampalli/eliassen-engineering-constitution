/**
 * @jest-environment node
 */
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createAdrHandler } from './create-adr-handler';
import type { AdrResponse } from '../src/lib/types';

const FIXTURES_DIR = join(__dirname, '../fixtures/adr');

interface FakeResponse {
  writeHead: jest.Mock<void, [number, Record<string, string>]>;
  end: jest.Mock<void, [string]>;
}

function fakeReqRes(): { req: IncomingMessage; res: ServerResponse & FakeResponse } {
  const req = { url: '/api/adr', method: 'GET' } as unknown as IncomingMessage;
  const res = { writeHead: jest.fn(), end: jest.fn() } as unknown as ServerResponse & FakeResponse;
  return { req, res };
}

function jsonBody(res: FakeResponse): AdrResponse {
  const raw = res.end.mock.calls[0]?.[0] ?? '{}';
  return JSON.parse(raw) as AdrResponse;
}

describe('createAdrHandler', () => {
  it('returns every .md file\'s filename, derived title, and full content, sorted by filename', () => {
    const handler = createAdrHandler(FIXTURES_DIR);
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'content-type': 'application/json; charset=utf-8' });
    const body = jsonBody(res);
    expect(body.records.map((record) => record.filename)).toEqual([
      '0001-first-decision.md',
      '0002-second-decision.md',
      'no-heading.md',
    ]);
    expect(body.records[0]?.title).toBe('ADR-0001: First Decision');
    expect(body.records[0]?.content).toContain('## Context');
    expect(typeof body.mtimeMs).toBe('number');
  });

  it('falls back to the filename (without extension) as the title when a file has no H1 heading', () => {
    const handler = createAdrHandler(FIXTURES_DIR);
    const { req, res } = fakeReqRes();
    handler(req, res);

    const body = jsonBody(res);
    const noHeading = body.records.find((record) => record.filename === 'no-heading.md');
    expect(noHeading?.title).toBe('no-heading');
  });

  it('returns an empty record list and null mtimeMs when the ADR directory does not exist', () => {
    const handler = createAdrHandler(join(FIXTURES_DIR, 'does-not-exist'));
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(jsonBody(res)).toEqual({ records: [], mtimeMs: null });
  });

  it('skips a listed file that cannot actually be read (e.g. no read permission)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'agent-board-adr-'));
    const readableFile = join(dir, '0001-readable.md');
    const unreadableFile = join(dir, '0002-unreadable.md');
    writeFileSync(readableFile, '# ADR-0001: Readable\n');
    writeFileSync(unreadableFile, '# ADR-0002: Unreadable\n');
    chmodSync(unreadableFile, 0o000);
    try {
      const handler = createAdrHandler(dir);
      const { req, res } = fakeReqRes();
      handler(req, res);

      const body = jsonBody(res);
      expect(body.records.map((record) => record.filename)).toEqual(['0001-readable.md']);
    } finally {
      chmodSync(unreadableFile, 0o644);
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
