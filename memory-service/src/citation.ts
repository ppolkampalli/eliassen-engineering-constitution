import type { Law } from './types.js';

/**
 * Renders a law's quotable citation line: `[LAW-X.Y vN] "statement"`.
 *
 * @param law - The law record.
 * @returns The citation string agents paste into decisions.
 */
export function formatCitation(law: Law): string {
  return `[${law.id} v${law.version}] "${law.statement}"`;
}

/**
 * Renders a full, human-readable law record for an agent's lookup result.
 *
 * @param law - The law record.
 * @returns A multi-line summary with statement, rationale, owners, and citation.
 */
export function formatLawRecord(law: Law): string {
  return [
    `${law.id} (v${law.version}, ${law.status}) — ${law.title}`,
    `Article ${law.article} · Owners: ${law.owner_personas.join(', ')} · Enforcement: ${law.enforcement}`,
    '',
    `Statement: ${law.statement}`,
    `Rationale: ${law.rationale_summary}`,
    '',
    `Amendments: ${law.amendments.join(', ')}`,
    `File: ${law.file}`,
    '',
    `Citation: ${formatCitation(law)}`,
  ].join('\n');
}
