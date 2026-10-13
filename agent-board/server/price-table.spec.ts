import { join } from 'node:path';

import { loadPriceTable } from './price-table';

const FIXTURES_DIR = join(__dirname, '../fixtures');

describe('loadPriceTable', () => {
  it('loads every valid rate entry from the real model-pricing.json, skipping the _comment key', () => {
    const table = loadPriceTable(join(__dirname, '../model-pricing.json'));
    expect(table['claude-sonnet-5']).toEqual({ input: 2, cacheWrite5m: 2.5, cacheWrite1h: 4, cacheRead: 0.2, output: 10 });
    expect(table).not.toHaveProperty('_comment');
  });

  it('skips an entry missing a required field and one that is not an object', () => {
    const table = loadPriceTable(join(FIXTURES_DIR, 'price-table-invalid-entry.json'));
    expect(Object.keys(table)).toEqual(['claude-sonnet-5']);
  });

  it('returns an empty table for malformed JSON', () => {
    expect(loadPriceTable(join(FIXTURES_DIR, 'price-table-malformed.json'))).toEqual({});
  });

  it('returns an empty table when the parsed JSON is not an object', () => {
    expect(loadPriceTable(join(FIXTURES_DIR, 'price-table-not-an-object.json'))).toEqual({});
  });

  it('returns an empty table for a missing file', () => {
    expect(loadPriceTable(join(FIXTURES_DIR, 'does-not-exist.json'))).toEqual({});
  });
});
