import { readFileSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { errorMessage, isErrnoException } from './http-errors';
import { loadPriceTable } from './price-table';
import { findTranscriptFiles, readAllLines } from './transcript-source';
import { deriveWorkItems, parseLog } from '../src/lib/board-model';
import { aggregateCostReport, attributeUsageToWorkItems, parseUsageRecords, priceRecord } from '../src/lib/token-cost-model';

export interface TokenUsageHandlerOptions {
  boardLogPath: string;
  projectsRoot: string;
  cwd: string;
  priceTablePath: string;
}

/**
 * Builds the GET /api/token-usage handler. Every path (board log,
 * transcript projects root, price table) is captured once by the caller
 * (see vite-plugin-token-usage-api.ts) — never read from the request
 * itself (LAW-5.1). Only numeric usage/model/timestamp fields extracted by
 * `parseUsageRecords` ever leave this process; raw transcript message
 * content is never included in the response (LAW-7.2).
 */
export function createTokenUsageHandler(
  options: TokenUsageHandlerOptions
): (req: IncomingMessage, res: ServerResponse) => void {
  return function tokenUsageHandler(_req: IncomingMessage, res: ServerResponse): void {
    let boardLogText: string;
    try {
      boardLogText = readFileSync(options.boardLogPath, 'utf8');
    } catch (error) {
      if (isErrnoException(error) && error.code === 'ENOENT') {
        boardLogText = '';
      } else {
        res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: errorMessage(error) }));
        return;
      }
    }

    const { events } = parseLog(boardLogText);
    const workItems = deriveWorkItems(events);
    const priceTable = loadPriceTable(options.priceTablePath);
    const transcriptFiles = findTranscriptFiles(options.projectsRoot, options.cwd);
    const lines = readAllLines(transcriptFiles);
    const usageRecords = parseUsageRecords(lines);
    const attributed = attributeUsageToWorkItems(usageRecords, workItems);
    const priced = attributed.map((record) => priceRecord(record, priceTable));
    const report = aggregateCostReport(priced);

    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(report));
  };
}
