import { readdirSync, readFileSync, statSync, type Dirent } from 'node:fs';
import { join } from 'node:path';

export interface AdrFileInfo {
  filename: string;
  mtimeMs: number;
}

/**
 * Lists every `.md` file directly inside `adrDir`, sorted by filename — the
 * `NNNN-<kebab-title>.md` convention from `templates/adr-template.md` sorts
 * correctly as a plain string sort. A missing directory is normal (no ADRs
 * written yet), not an error — same posture as `transcript-source.ts`.
 */
export function listAdrFiles(adrDir: string): AdrFileInfo[] {
  let entries: Dirent[];
  try {
    entries = readdirSync(adrDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: AdrFileInfo[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    files.push({ filename: entry.name, mtimeMs: statSync(join(adrDir, entry.name)).mtimeMs });
  }
  return files.sort((a, b) => a.filename.localeCompare(b.filename));
}

/** Reads one ADR file's raw markdown text. Returns null (not throws) when it can't be read. */
export function readAdrFile(adrDir: string, filename: string): string | null {
  try {
    return readFileSync(join(adrDir, filename), 'utf8');
  } catch {
    return null;
  }
}
