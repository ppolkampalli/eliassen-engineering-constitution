import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

import type { DecisionRecord } from './types.js';

const LAW_ID_PATTERN = /^LAW-\d+\.\d+$/;

export interface DecisionQuery {
  workItem?: string;
  persona?: string;
  lawId?: string;
}

/**
 * Appends a cited decision to the append-only decision log (one JSON object per
 * line). Validates the citation contract: a decision must cite at least one law,
 * and every citation must be a well-formed LAW-X.Y id (LAW-10.6 / LAW-7.3 — the
 * memory stays trustworthy because every entry is grounded and never overwritten).
 *
 * @param logPath - Path to the decisions JSONL file (created if absent).
 * @param record - The decision to append, including its timestamp.
 * @returns The appended record.
 * @throws {Error} If the decision cites no laws or any citation is malformed.
 */
export function appendDecision(logPath: string, record: DecisionRecord): DecisionRecord {
  if (record.lawCitations.length === 0) {
    throw new Error('A decision must include at least one law citation (LAW-X.Y).');
  }
  for (const citation of record.lawCitations) {
    if (!LAW_ID_PATTERN.test(citation)) {
      throw new Error(`Malformed law citation "${citation}" — expected the form LAW-X.Y.`);
    }
  }
  mkdirSync(dirname(logPath), { recursive: true });
  appendFileSync(logPath, `${JSON.stringify(record)}\n`, 'utf8');
  return record;
}

/**
 * Reads all decisions from the log. Blank lines are skipped and unparseable
 * lines are ignored, so a partially-corrupt log never throws.
 *
 * @returns The decisions in append order; empty if the log does not exist.
 */
export function readDecisions(logPath: string): DecisionRecord[] {
  if (!existsSync(logPath)) return [];
  const records: DecisionRecord[] = [];
  for (const line of readFileSync(logPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    try {
      records.push(JSON.parse(trimmed) as DecisionRecord);
    } catch {
      // Skip a corrupt line rather than failing the whole read.
    }
  }
  return records;
}

/**
 * Queries the decision log by work item, persona, and/or cited law id (all
 * optional; case-insensitive on the law id). Returns every decision when no
 * filter is supplied.
 */
export function queryDecisions(logPath: string, query: DecisionQuery): DecisionRecord[] {
  const lawId = query.lawId?.trim().toLowerCase();
  return readDecisions(logPath).filter((record) => {
    if (query.workItem !== undefined && record.workItem !== query.workItem) return false;
    if (query.persona !== undefined && record.persona !== query.persona) return false;
    if (lawId !== undefined && !record.lawCitations.some((c) => c.toLowerCase() === lawId)) {
      return false;
    }
    return true;
  });
}
