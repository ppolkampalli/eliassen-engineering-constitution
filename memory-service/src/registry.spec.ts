import { join } from 'node:path';

import {
  getAmendmentsForLaw,
  getLaw,
  getWorkflow,
  listLaws,
  loadLawRegistry,
  loadWorkflowRegistry,
  searchLaws,
} from './registry.js';
import type { LawRegistry, WorkflowRegistry } from './types.js';

const REGISTRY: LawRegistry = {
  constitution_version: '1.2.0',
  ratified: '2026-06-01',
  laws: [
    {
      id: 'LAW-2.3',
      title: 'Prohibition of the any Type',
      article: 2,
      status: 'ACTIVE',
      version: '1.1',
      owner_personas: ['software-engineer', 'quality'],
      enforcement: 'automated',
      statement: 'The any type is prohibited.',
      rationale_summary: 'any disables type checking.',
      file: 'laws/article-2-code-standards/LAW-2.3.md',
      amendments: ['AMD-2026-001'],
    },
    {
      id: 'LAW-5.2',
      title: 'Parameterized Queries Only',
      article: 5,
      status: 'ACTIVE',
      version: '1.0',
      owner_personas: ['security'],
      enforcement: 'review',
      statement: 'Queries are parameterized.',
      rationale_summary: 'Prevents SQL injection.',
      file: 'laws/article-5-security/LAW-5.2.md',
      amendments: ['AMD-2026-001', 'AMD-2026-009'],
    },
  ],
};

const WORKFLOWS: WorkflowRegistry = {
  workflow_catalog_version: '1.0.0',
  workflows: [
    {
      id: 'WF-FEATURE',
      title: 'New Feature Development',
      version: '1.0',
      status: 'ACTIVE',
      trigger: 'New feature',
      chain: 'product-owner -> architect',
      file: 'workflows/WF-FEATURE.md',
    },
  ],
};

describe('loaders against the live constitution (integration)', () => {
  // cwd is memory-service/ when jest runs; the registries live one level up.
  const lawsPath = join(process.cwd(), '..', 'laws', 'registry.json');
  const workflowsPath = join(process.cwd(), '..', 'workflows', 'registry.json');

  it('should load the real law registry with the full law set', () => {
    const reg = loadLawRegistry(lawsPath);
    expect(reg.laws.length).toBeGreaterThanOrEqual(57);
    expect(getLaw(reg, 'LAW-10.6')?.title).toContain('Defined Workflows');
  });

  it('should load the real workflow registry with the six workflows', () => {
    const reg = loadWorkflowRegistry(workflowsPath);
    expect(reg.workflows.length).toBeGreaterThanOrEqual(6);
    expect(getWorkflow(reg, 'WF-AMENDMENT')).toBeDefined();
  });
});

describe('getLaw', () => {
  it('should return the law when the id exists', () => {
    expect(getLaw(REGISTRY, 'LAW-2.3')?.title).toContain('any');
  });
  it('should be case-insensitive on the id', () => {
    expect(getLaw(REGISTRY, 'law-2.3')?.id).toBe('LAW-2.3');
  });
  it('should return undefined when the id does not exist', () => {
    expect(getLaw(REGISTRY, 'LAW-9.9')).toBeUndefined();
  });
});

describe('searchLaws', () => {
  it('should match by id fragment', () => {
    expect(searchLaws(REGISTRY, '5.2').map((l) => l.id)).toEqual(['LAW-5.2']);
  });
  it('should match by statement/title text, case-insensitively', () => {
    expect(searchLaws(REGISTRY, 'injection').map((l) => l.id)).toEqual(['LAW-5.2']);
  });
  it('should return all laws for an empty query', () => {
    expect(searchLaws(REGISTRY, '  ').length).toBe(2);
  });
});

describe('listLaws', () => {
  it('should list all laws when no article filter is given', () => {
    expect(listLaws(REGISTRY).length).toBe(2);
  });
  it('should filter by article when given', () => {
    expect(listLaws(REGISTRY, 5).map((l) => l.id)).toEqual(['LAW-5.2']);
  });
});

describe('getWorkflow', () => {
  it('should return the workflow when the id exists (case-insensitive)', () => {
    expect(getWorkflow(WORKFLOWS, 'wf-feature')?.title).toBe('New Feature Development');
  });
  it('should return undefined for an unknown id', () => {
    expect(getWorkflow(WORKFLOWS, 'WF-NOPE')).toBeUndefined();
  });
});

describe('getAmendmentsForLaw', () => {
  it('should return the amendment ids recorded on the law', () => {
    expect(getAmendmentsForLaw(REGISTRY, 'LAW-5.2')).toEqual(['AMD-2026-001', 'AMD-2026-009']);
  });
  it('should return an empty array when the law does not exist', () => {
    expect(getAmendmentsForLaw(REGISTRY, 'LAW-9.9')).toEqual([]);
  });
});
