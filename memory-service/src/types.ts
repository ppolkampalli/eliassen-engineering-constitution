/** Shared types for the Central Memory Service. */

export interface Law {
  id: string;
  title: string;
  article: number;
  status: string;
  version: string;
  owner_personas: string[];
  enforcement: string;
  statement: string;
  rationale_summary: string;
  file: string;
  amendments: string[];
}

export interface LawRegistry {
  constitution_version: string;
  ratified: string;
  laws: Law[];
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

export interface WorkflowRegistry {
  workflow_catalog_version: string;
  workflows: Workflow[];
}

/** An append-only entry in the decision & citation log (the MemoryGraph’s write side). */
export interface DecisionRecord {
  /** ISO timestamp; supplied by the caller (tests inject, server stamps). */
  timestamp: string;
  /** Work item this decision belongs to (ticket id, PR, etc.). */
  workItem: string;
  /** The persona that made the decision, e.g. "persona-security". */
  persona: string;
  /** The decision, stated plainly. */
  decision: string;
  /** Law IDs cited, e.g. ["LAW-5.2"]. */
  lawCitations: string[];
  /** The rationale, applied to this case. */
  rationale: string;
}
