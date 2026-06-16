import { join } from 'node:path';

/**
 * Resolves where the memory service reads the constitution and writes decisions.
 * Defaults assume this server runs from inside the constitution repo
 * (memory-service/), one level below the registries. Override for a consuming
 * project via environment variables.
 *
 * - CONSTITUTION_ROOT   — repo root holding laws/ and workflows/ (default: "..").
 * - MEMORY_LOG_PATH     — the append-only decision log (default: ./decisions.local.jsonl).
 */
export interface ServicePaths {
  lawRegistry: string;
  workflowRegistry: string;
  decisionLog: string;
}

export function resolvePaths(env: NodeJS.ProcessEnv): ServicePaths {
  const root = env.CONSTITUTION_ROOT ?? '..';
  return {
    lawRegistry: join(root, 'laws', 'registry.json'),
    workflowRegistry: join(root, 'workflows', 'registry.json'),
    decisionLog: env.MEMORY_LOG_PATH ?? join(process.cwd(), 'decisions.local.jsonl'),
  };
}
