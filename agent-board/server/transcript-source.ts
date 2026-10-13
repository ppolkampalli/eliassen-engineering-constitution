import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * A real transcript's first lines are session metadata (`mode`,
 * `permission-mode`, file-history snapshots, …) that carry no `cwd` field
 * at all — only actual conversation-turn lines do. Scans every line (not
 * just the first) for the first one that carries a `cwd` field, since
 * that field is stable for the whole file once a turn has recorded it.
 */
function fileCwd(filePath: string): string | null {
  let text: string;
  try {
    text = readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (isRecord(parsed) && typeof parsed.cwd === 'string') return parsed.cwd;
  }
  return null;
}

/**
 * Finds every transcript JSONL file for a given project by content, not by
 * reverse-engineering Claude Code's project-directory name encoding — a
 * real project directory was found whose name encodes a space as `-20`
 * (its hex code), proving the scheme isn't a simple `/`-to-`-` replace.
 * Matching each file's own recorded `cwd` field is robust to whatever the
 * encoding is. `projectsRoot` and `cwd` are parameters (not `os.homedir()`
 * calls) so tests can point this at a fixture directory tree.
 */
export function findTranscriptFiles(projectsRoot: string, cwd: string): string[] {
  let projectDirs: string[];
  try {
    projectDirs = readdirSync(projectsRoot);
  } catch {
    return [];
  }

  const matches: string[] = [];
  for (const dir of projectDirs) {
    const dirPath = join(projectsRoot, dir);
    let fileNames: string[];
    try {
      fileNames = readdirSync(dirPath).filter((name) => name.endsWith('.jsonl'));
    } catch {
      continue;
    }
    for (const fileName of fileNames) {
      const filePath = join(dirPath, fileName);
      if (fileCwd(filePath) === cwd) matches.push(filePath);
    }
  }
  return matches;
}

/** Reads every line of every given file into one flat array, skipping a file that can't be read. */
export function readAllLines(filePaths: string[]): string[] {
  const lines: string[] = [];
  for (const filePath of filePaths) {
    let text: string;
    try {
      text = readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }
    lines.push(...text.split('\n'));
  }
  return lines;
}
