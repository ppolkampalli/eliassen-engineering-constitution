import { join } from 'node:path';

import { listAdrFiles, readAdrFile } from './adr-source';

const FIXTURES_DIR = join(__dirname, '../fixtures/adr');

describe('listAdrFiles', () => {
  it('lists only .md files, sorted by filename, skipping non-.md files and directories named *.md', () => {
    const files = listAdrFiles(FIXTURES_DIR);
    expect(files.map((file) => file.filename)).toEqual([
      '0001-first-decision.md',
      '0002-second-decision.md',
      'no-heading.md',
    ]);
    expect(files.every((file) => typeof file.mtimeMs === 'number')).toBe(true);
  });

  it('returns an empty list when the ADR directory does not exist', () => {
    expect(listAdrFiles(join(FIXTURES_DIR, 'does-not-exist'))).toEqual([]);
  });
});

describe('readAdrFile', () => {
  it('reads a file\'s raw markdown content', () => {
    const content = readAdrFile(FIXTURES_DIR, '0001-first-decision.md');
    expect(content).toContain('# ADR-0001: First Decision');
  });

  it('returns null for a file that cannot be read', () => {
    expect(readAdrFile(FIXTURES_DIR, 'does-not-exist.md')).toBeNull();
  });
});
