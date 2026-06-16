import { readFileSync } from 'node:fs';

import type { Law, LawRegistry, Workflow, WorkflowRegistry } from './types.js';

/** Loads and parses a law registry JSON file (the single source of truth). */
export function loadLawRegistry(path: string): LawRegistry {
  return JSON.parse(readFileSync(path, 'utf8')) as LawRegistry;
}

/** Loads and parses a workflow registry JSON file. */
export function loadWorkflowRegistry(path: string): WorkflowRegistry {
  return JSON.parse(readFileSync(path, 'utf8')) as WorkflowRegistry;
}

/** Returns the law with the given id (case-insensitive), or undefined. */
export function getLaw(registry: LawRegistry, id: string): Law | undefined {
  const target = id.trim().toLowerCase();
  return registry.laws.find((law) => law.id.toLowerCase() === target);
}

/**
 * Case-insensitive search over id, title, and statement.
 *
 * @returns All laws for an empty/whitespace query; matching laws otherwise.
 */
export function searchLaws(registry: LawRegistry, query: string): Law[] {
  const q = query.trim().toLowerCase();
  if (q === '') return registry.laws;
  return registry.laws.filter(
    (law) =>
      law.id.toLowerCase().includes(q) ||
      law.title.toLowerCase().includes(q) ||
      law.statement.toLowerCase().includes(q) ||
      law.rationale_summary.toLowerCase().includes(q)
  );
}

/** Lists laws, optionally filtered to a single article number. */
export function listLaws(registry: LawRegistry, article?: number): Law[] {
  if (article === undefined) return registry.laws;
  return registry.laws.filter((law) => law.article === article);
}

/** Returns the workflow with the given id (case-insensitive), or undefined. */
export function getWorkflow(registry: WorkflowRegistry, id: string): Workflow | undefined {
  const target = id.trim().toLowerCase();
  return registry.workflows.find((workflow) => workflow.id.toLowerCase() === target);
}

/** Returns the amendment ids recorded on a law (empty if the law is unknown). */
export function getAmendmentsForLaw(registry: LawRegistry, id: string): string[] {
  return getLaw(registry, id)?.amendments ?? [];
}
