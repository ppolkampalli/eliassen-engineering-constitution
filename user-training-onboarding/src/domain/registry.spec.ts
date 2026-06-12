import { getAllLaws, getAllWorkflows, getLaw, getWorkflow, searchLaws } from './registry';

describe('getAllLaws', () => {
  it('should expose every law from the live registry when loaded', () => {
    const laws = getAllLaws();
    // The constitution currently has 57 laws; assert a sane lower bound so the
    // test survives future amendments without becoming hollow (LAW-3.5).
    expect(laws.length).toBeGreaterThanOrEqual(57);
    expect(laws[0]?.id).toMatch(/^LAW-\d+\.\d+$/);
  });
});

describe('getLaw', () => {
  it('should return the law record when the id exists', () => {
    const law = getLaw('LAW-2.3');
    expect(law?.title).toContain('any');
    expect(law?.statement.length).toBeGreaterThan(0);
  });

  it('should return undefined when the id does not exist', () => {
    expect(getLaw('LAW-99.9')).toBeUndefined();
  });
});

describe('searchLaws', () => {
  it('should match by id when the query is a law id fragment', () => {
    const results = searchLaws('10.6');
    expect(results.some((law) => law.id === 'LAW-10.6')).toBe(true);
  });

  it('should match by title and statement text when the query is a word', () => {
    const results = searchLaws('mutation');
    expect(results.some((law) => law.id === 'LAW-3.6')).toBe(true);
  });

  it('should return all laws when the query is empty', () => {
    expect(searchLaws('').length).toBe(getAllLaws().length);
  });
});

describe('getAllWorkflows / getWorkflow', () => {
  it('should expose the six catalog workflows when loaded', () => {
    const workflows = getAllWorkflows();
    expect(workflows.length).toBeGreaterThanOrEqual(6);
    expect(getWorkflow('WF-FEATURE')?.chain).toContain('product-owner');
  });

  it('should return undefined when the workflow id does not exist', () => {
    expect(getWorkflow('WF-NOPE')).toBeUndefined();
  });
});
