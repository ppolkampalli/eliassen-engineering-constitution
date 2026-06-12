// Single source of truth (LAW-10.6): the app imports the live registries from
// the repo root at build time — amendments propagate on the next build with no
// content copying.
import lawRegistry from '../../../laws/registry.json';
import workflowRegistry from '../../../workflows/registry.json';

export interface Law {
  id: string;
  title: string;
  article: number;
  status: string;
  version: string;
  // The two snake_case keys mirror the external registry.json schema, which this
  // app must consume verbatim (single source of truth) — approved LAW-2.1
  // exception for external data shape.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  owner_personas: string[];
  enforcement: string;
  statement: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rationale_summary: string;
  file: string;
  amendments: string[];
}

export interface Workflow {
  id: string;
  title: string;
  version: string;
  status: string;
  trigger: string;
  chain: string;
  file: string;
}

const LAWS: Law[] = lawRegistry.laws;
const WORKFLOWS: Workflow[] = workflowRegistry.workflows;

/** The constitution version the app was built against. */
export const CONSTITUTION_VERSION: string = lawRegistry.constitution_version;

/** All laws, registry order (by article, then number). */
export function getAllLaws(): Law[] {
  return LAWS;
}

/** One law by exact id, or undefined. */
export function getLaw(id: string): Law | undefined {
  return LAWS.find((law) => law.id === id);
}

/**
 * Case-insensitive search over id, title, and statement.
 *
 * @returns All laws for an empty query; matching laws otherwise.
 */
export function searchLaws(query: string): Law[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed === '') return LAWS;
  return LAWS.filter(
    (law) =>
      law.id.toLowerCase().includes(trimmed) ||
      law.title.toLowerCase().includes(trimmed) ||
      law.statement.toLowerCase().includes(trimmed)
  );
}

/** Distinct article numbers present in the registry, ascending. */
export function getArticleNumbers(): number[] {
  return [...new Set(LAWS.map((law) => law.article))].sort((a, b) => a - b);
}

/** All workflows from the catalog registry. */
export function getAllWorkflows(): Workflow[] {
  return WORKFLOWS;
}

/** One workflow by exact id, or undefined. */
export function getWorkflow(id: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.id === id);
}
