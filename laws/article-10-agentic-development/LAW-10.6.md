---
id: LAW-10.6
title: Defined Workflows
article: 10
article_name: Agentic Development
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [product-owner, quality]
enforcement: persona
enforcement_mechanism: "workflow-orchestrator skill; deviation records checked in review; project overrides validated against the org catalog"
amendment_history:
  - amendment: AMD-2026-010
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-10.6: Defined Workflows

## Statement (quotable)

> Nontrivial work proceeds under a declared workflow: the work item names which
> workflow from the catalog (`workflows/`, installed at
> `docs/constitution/workflows/`) it follows, and that workflow's stages,
> personas, gates, and human checkpoints govern execution by agents and humans
> alike. Workflows are process, not law: definitions change by ordinary PR
> review. Conversational deviations are permitted for stages not marked hard —
> and every applied deviation is recorded on the work item with its rationale
> and approver. Stages marked hard, stages whose gating laws are inviolable,
> and the WF-AMENDMENT sequence itself may not be overridden conversationally
> or by project-level files; project overrides may replace or add workflows
> but never remove or soften an org-catalog hard stage (LAW-1.3 applied to
> process). When no workflow fits, the orchestrator says so and a sequence is
> agreed explicitly — governed work is never processed by silent improvisation.

## Rationale (the WHY — always citable alongside the statement)

Process that lives in memory fails exactly like undocumented architecture
(LAW-1.4) and unrecorded amendments: invisibly, then expensively — security
review happens when someone remembers, and "did QA see this?" is answered by
recollection. A declared workflow makes the sequence auditable (which stages
ran, which persona checked what, with what evidence), makes agent execution
safe (agents follow the same staged gates humans do — LAW-7.4's principle
applied to process), and makes deviation a recorded decision instead of an
accident (LAW-7.3's provenance principle: undisclosed deviation is the
violation, never deviation itself). Keeping the definitions PR-governed rather
than amendment-governed is deliberate: process must evolve at the speed of
practice, while the obligation to follow *some* declared process — and the
inviolability of hard gates — stays constitutional. Ratified per AMD-2026-010.

## Compliance Examples

VIOLATION:
```text
Agent receives "fix the rounding bug and while you're at it add CSV
export" — improvises: implements both, no workflow declared, security
review skipped silently, scope expansion unrecorded. Three laws violated
with no trail (LAW-8.4, LAW-1.5, this law).
```

COMPLIANT:
```text
WORKFLOW: WF-BUG v1.0 on JIRA-3411 (CSV export split to ticket → WF-FEATURE)
Stages: reproduce-and-fix ✓ (evidence: failing test red→green) →
verify ✓ (quality, fresh context). Deviations: none.

WORKFLOW DEVIATION (separate item, JIRA-3500 / WF-FEATURE):
Stage skipped: design — hard:false, LAW-4.5 not triggered
Reason: single-file copy change. Approved by: P. Polkampalli, 2026-06-11
```

## Related Laws
- LAW-10.1 (Spec-Driven Agent Work)
- LAW-7.3 (AI Audit Trail)
- LAW-1.3 (Consistency Enables Collaboration)

## Citation Format
[LAW-10.6 v1.0] "Nontrivial work proceeds under a declared workflow whose stages, personas, and gates govern agents and humans alike; deviations on non-hard stages are permitted but recorded, and hard stages are never overridable."
