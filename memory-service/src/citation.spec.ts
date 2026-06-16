import { formatCitation, formatLawRecord } from './citation.js';
import type { Law } from './types.js';

const LAW: Law = {
  id: 'LAW-5.2',
  title: 'Parameterized Queries Only',
  article: 5,
  status: 'ACTIVE',
  version: '1.0',
  owner_personas: ['security'],
  enforcement: 'review',
  statement: 'Queries are built exclusively with parameterized statements.',
  rationale_summary: 'SQL injection begins with one concatenated value.',
  file: 'laws/article-5-security/LAW-5.2.md',
  amendments: ['AMD-2026-001'],
};

describe('formatCitation', () => {
  it('should render the bracketed citation form when given a law', () => {
    expect(formatCitation(LAW)).toBe(
      '[LAW-5.2 v1.0] "Queries are built exclusively with parameterized statements."'
    );
  });
});

describe('formatLawRecord', () => {
  it('should include id, version, status, owners, statement, rationale, and citation', () => {
    const out = formatLawRecord(LAW);
    expect(out).toContain('LAW-5.2 (v1.0, ACTIVE) — Parameterized Queries Only');
    expect(out).toContain('Article 5');
    expect(out).toContain('Owners: security');
    expect(out).toContain('Queries are built exclusively');
    expect(out).toContain('Amendments: AMD-2026-001');
    expect(out).toContain('[LAW-5.2 v1.0]');
  });
});
