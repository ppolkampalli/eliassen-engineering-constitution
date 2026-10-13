/**
 * @jest-environment node
 */
// eslint-disable-next-line import/no-named-as-default
import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join } from 'node:path';

import { createTokenUsageHandler } from './create-token-usage-handler';
import type { CostReport } from '../src/lib/token-cost-model';

const FIXTURES_DIR = join(__dirname, '../fixtures');
const TRANSCRIPTS_ROOT = join(FIXTURES_DIR, 'transcripts');
const PRICE_TABLE_PATH = join(__dirname, '../model-pricing.json');

interface FakeResponse {
  writeHead: jest.Mock<void, [number, Record<string, string>]>;
  end: jest.Mock<void, [string]>;
}

function fakeReqRes(): { req: IncomingMessage; res: ServerResponse & FakeResponse } {
  const req = { url: '/api/token-usage', method: 'GET' } as unknown as IncomingMessage;
  const res = { writeHead: jest.fn(), end: jest.fn() } as unknown as ServerResponse & FakeResponse;
  return { req, res };
}

function jsonBody(res: FakeResponse): CostReport & { error?: string } {
  const raw = res.end.mock.calls[0]?.[0] ?? '{}';
  return JSON.parse(raw) as CostReport & { error?: string };
}

describe('createTokenUsageHandler', () => {
  it('attributes transcript usage to the open board-event window and prices it from the real price table', () => {
    const handler = createTokenUsageHandler({
      boardLogPath: join(FIXTURES_DIR, 'events.token-usage.jsonl'),
      projectsRoot: TRANSCRIPTS_ROOT,
      cwd: '/fake/project-a',
      priceTablePath: PRICE_TABLE_PATH,
    });
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'content-type': 'application/json; charset=utf-8' });
    const body = jsonBody(res);
    expect(body.totalCostUsd).toBeGreaterThan(0);
    expect(body.unpricedRecordCount).toBe(0);
    expect(body.unattributedRecordCount).toBe(0);
    expect(body.byWorkItem).toEqual([{ key: 'JIRA-TOK', count: body.totalCostUsd }]);
    expect(body.byStage).toEqual([{ key: 'fix', count: body.totalCostUsd }]);
  });

  it('still returns usage data (all unattributed) when the board log does not exist', () => {
    const handler = createTokenUsageHandler({
      boardLogPath: join(FIXTURES_DIR, 'events.does-not-exist.jsonl'),
      projectsRoot: TRANSCRIPTS_ROOT,
      cwd: '/fake/project-a',
      priceTablePath: PRICE_TABLE_PATH,
    });
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'content-type': 'application/json; charset=utf-8' });
    const body = jsonBody(res);
    expect(body.unattributedRecordCount).toBeGreaterThan(0);
    expect(body.byWorkItem).toEqual([{ key: 'unattributed', count: body.totalCostUsd }]);
  });

  it('returns an empty-ish report when there are no transcript files for this cwd', () => {
    const handler = createTokenUsageHandler({
      boardLogPath: join(FIXTURES_DIR, 'events.token-usage.jsonl'),
      projectsRoot: TRANSCRIPTS_ROOT,
      cwd: '/fake/no-such-project',
      priceTablePath: PRICE_TABLE_PATH,
    });
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(jsonBody(res)).toMatchObject({ totalCostUsd: 0, unpricedRecordCount: 0, unattributedRecordCount: 0 });
  });

  it('returns a 500 for a non-ENOENT board log read error', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      const error = new Error('permission denied') as NodeJS.ErrnoException;
      error.code = 'EACCES';
      throw error;
    });
    const handler = createTokenUsageHandler({
      boardLogPath: join(FIXTURES_DIR, 'events.token-usage.jsonl'),
      projectsRoot: TRANSCRIPTS_ROOT,
      cwd: '/fake/project-a',
      priceTablePath: PRICE_TABLE_PATH,
    });
    const { req, res } = fakeReqRes();
    handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(500, { 'content-type': 'application/json; charset=utf-8' });
    expect(jsonBody(res)).toEqual({ error: 'permission denied' });
  });
});
