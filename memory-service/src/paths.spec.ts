import { resolvePaths } from './paths.js';

describe('resolvePaths', () => {
  it('should default to the parent repo for registries when env is empty', () => {
    const paths = resolvePaths({});
    expect(paths.lawRegistry.replace(/\\/g, '/')).toContain('../laws/registry.json');
    expect(paths.workflowRegistry.replace(/\\/g, '/')).toContain('../workflows/registry.json');
    expect(paths.decisionLog).toContain('decisions.local.jsonl');
  });

  it('should honor CONSTITUTION_ROOT for registry locations', () => {
    const paths = resolvePaths({ CONSTITUTION_ROOT: '/srv/constitution' });
    expect(paths.lawRegistry.replace(/\\/g, '/')).toBe('/srv/constitution/laws/registry.json');
  });

  it('should honor MEMORY_LOG_PATH for the decision log', () => {
    const paths = resolvePaths({ MEMORY_LOG_PATH: '/var/memory/decisions.jsonl' });
    expect(paths.decisionLog).toBe('/var/memory/decisions.jsonl');
  });
});
