<!-- Governed by the Engineering Constitution v1.0.0 — cite laws by ID. -->

## What

<!-- What changes, in one or two sentences. Link the work item. -->

## Why

<!-- The motivation: ticket, incident, business rule (cite per LAW-8.2 if domain logic). -->

## Testing

<!-- How this was verified. Test-first evidence per LAW-3.1: which failing test
     preceded the implementation? New/changed test names. -->

## Gates Checklist

- [ ] Failing test written before implementation (LAW-3.1)
- [ ] Coverage floors hold — no threshold edits (LAW-3.2)
- [ ] Lint clean, no suppressions added (Article 2, LAW-1.3)
- [ ] No `any`; exported return types explicit (LAW-2.3, LAW-2.4)
- [ ] Inputs validated / queries parameterized / no secrets (LAW-5.1, LAW-5.2, LAW-5.3)
- [ ] Public APIs documented; docs updated in this PR (LAW-6.3, LAW-6.5)
- [ ] ADR included if structurally significant (LAW-4.5)
- [ ] In scope, or PO sign-off recorded (LAW-8.4)
- [ ] Infra: IaC + rollback documented + cost estimate + tags (LAW-9.1–9.3, if applicable)

## AI Assistance (LAW-7.3)

- **Tool:** <!-- e.g., Claude Code (approved list ✓) / none -->
- **What the AI produced:** <!-- generated components/logic, or "n/a" -->
- **What the human verified/modified:** <!-- the LAW-7.4 evidence: checked against docs, rewrote X, tested Y -->
- **Commits tagged** `[Claude-assisted]`: <!-- yes / n/a -->

## Laws Touched

<!-- Law IDs most relevant to reviewing this change, e.g.: LAW-5.1, LAW-4.1.
     Tells reviewers where to focus; reviewers cite laws in findings. -->
