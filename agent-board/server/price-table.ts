import { readFileSync } from 'node:fs';

import type { ModelRate, PriceTable } from '../src/lib/token-cost-model';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidRate(value: unknown): value is ModelRate {
  if (!isRecord(value)) return false;
  const fields: (keyof ModelRate)[] = ['input', 'cacheWrite5m', 'cacheWrite1h', 'cacheRead', 'output'];
  return fields.every((field) => typeof value[field] === 'number');
}

/**
 * Loads the user-editable model-pricing.json. Missing file, unreadable
 * JSON, or an entry that doesn't match the rate shape is skipped rather
 * than fatal — the dashboard still works, just reports those models'
 * usage as unpriced (never silently priced at 0) rather than crashing.
 */
export function loadPriceTable(filePath: string): PriceTable {
  let text: string;
  try {
    text = readFileSync(filePath, 'utf8');
  } catch {
    return {};
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {};
  }
  if (!isRecord(parsed)) return {};

  const table: PriceTable = {};
  for (const [model, rate] of Object.entries(parsed)) {
    if (model === '_comment') continue;
    if (isValidRate(rate)) table[model] = rate;
  }
  return table;
}
