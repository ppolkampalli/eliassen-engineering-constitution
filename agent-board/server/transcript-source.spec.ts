import { join } from 'node:path';

import { findTranscriptFiles, readAllLines } from './transcript-source';

const FIXTURES_ROOT = join(__dirname, '../fixtures/transcripts');

describe('findTranscriptFiles', () => {
  it('finds every .jsonl file across every project dir whose recorded cwd matches, ignoring non-matching ones', () => {
    const files = findTranscriptFiles(FIXTURES_ROOT, '/fake/project-a');
    expect(files.sort()).toEqual(
      [join(FIXTURES_ROOT, 'project-a/session1.jsonl'), join(FIXTURES_ROOT, 'project-a/session2.jsonl')].sort()
    );
    // project-a also contains empty.jsonl (no lines) and no-cwd.jsonl (valid JSON,
    // no cwd field) — neither should ever match any cwd.
    expect(files).not.toContain(join(FIXTURES_ROOT, 'project-a/empty.jsonl'));
    expect(files).not.toContain(join(FIXTURES_ROOT, 'project-a/no-cwd.jsonl'));
  });

  it('does not return files belonging to a different project', () => {
    const files = findTranscriptFiles(FIXTURES_ROOT, '/fake/project-b');
    expect(files).toEqual([join(FIXTURES_ROOT, 'project-b/session1.jsonl')]);
  });

  it('recovers from a malformed early line and still finds the cwd recorded on a later line', () => {
    const files = findTranscriptFiles(FIXTURES_ROOT, '/fake/project-malformed');
    expect(files).toEqual([join(FIXTURES_ROOT, 'malformed-first-line/bad.jsonl')]);
  });

  it('returns an empty list when nothing matches the given cwd', () => {
    expect(findTranscriptFiles(FIXTURES_ROOT, '/fake/no-such-project')).toEqual([]);
  });

  it('returns an empty list when the projects root does not exist', () => {
    expect(findTranscriptFiles(join(FIXTURES_ROOT, 'does-not-exist'), '/fake/project-a')).toEqual([]);
  });

  it('skips a .jsonl-named entry that cannot be read as a file (e.g. a directory)', () => {
    expect(findTranscriptFiles(FIXTURES_ROOT, '/fake/project-c')).toEqual([]);
  });

  it('returns an empty list for a project directory with no .jsonl files', () => {
    expect(findTranscriptFiles(FIXTURES_ROOT, '/fake/no-match-for-empty-dir')).toEqual([]);
  });
});

describe('readAllLines', () => {
  it('reads and concatenates lines from every given file in order', () => {
    const lines = readAllLines([
      join(FIXTURES_ROOT, 'project-b/session1.jsonl'),
      join(FIXTURES_ROOT, 'project-a/session1.jsonl'),
    ]);
    expect(lines.some((line) => line.includes('"sessionId":"s3"'))).toBe(true);
    expect(lines.some((line) => line.includes('"sessionId":"s1"'))).toBe(true);
  });

  it('skips a file that cannot be read', () => {
    expect(readAllLines([join(FIXTURES_ROOT, 'does-not-exist.jsonl')])).toEqual([]);
  });

  it('returns an empty list for no files', () => {
    expect(readAllLines([])).toEqual([]);
  });
});
