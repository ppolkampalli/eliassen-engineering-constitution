/**
 * Types for the training content. Every law/workflow mention in content is a
 * typed reference, validated by content-integrity.spec.ts against the live
 * registries (LAW-10.6: training stays consistent with the constitution).
 */

/** A law identifier, e.g. "LAW-2.3" — must exist in laws/registry.json. */
export type LawRef = `LAW-${number}.${number}`;

/** A workflow identifier, e.g. "WF-FEATURE" — must exist in workflows/registry.json. */
export type WorkflowRef = `WF-${string}`;

export interface Lesson {
  /** Unique within the whole catalog, kebab-case. */
  id: string;
  title: string;
  /**
   * Lesson body. Minimal formatting: blank-line-separated paragraphs;
   * lines starting with "- " render as list items.
   */
  body: string;
  /** Laws this lesson teaches — rendered as live links into the law browser. */
  lawRefs: LawRef[];
  workflowRefs?: WorkflowRef[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** Index into options. */
  correctIndex: number;
  /** Shown after answering — explains WHY, citing the law. */
  explanation: string;
  lawRef?: LawRef;
}

export interface TrainingModule {
  /** Kebab-case module id, used in routes and progress keys. */
  id: string;
  title: string;
  /** One-line description shown on the home page card. */
  summary: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}
