---
id: WF-AMENDMENT
title: Constitution Amendment
version: 1.0
status: ACTIVE
trigger: "A law needs to be created, modified, or repealed — any change to the constitution's laws"
applies_to: [agent, human, mixed]
governed_by: [LAW-10.6]
stages:
  - id: proposal
    persona: law-clerk
    action: "Draft the amendment record: exact before/after text, motivation, impact analysis, reviewers required"
    entry: "A problem, incident, or learning motivating a law change"
    exit: "AMD-YYYY-NNN record in amendments/records/ with status PROPOSED, complete per AMENDMENT-TEMPLATE.md"
    gates: [LAW-10.6]
    hard: true
    human_checkpoint: none
  - id: review
    persona: persona-council
    action: "Owner personas of affected laws review; Security additionally for Article-5 amendments; council for cross-cutting"
    entry: "PROPOSED record"
    exit: "Review Record table completed with cited verdicts"
    gates: [LAW-1.5]
    hard: true
    human_checkpoint: recommended
  - id: decision
    persona: product-owner
    action: "HUMAN decision: VP Engineering / Tech Lead approves or rejects, with name and date recorded"
    entry: "Completed reviews"
    exit: "Status APPROVED (→ enactment) or REJECTED (record retained with rationale, workflow ends)"
    gates: [LAW-7.5]
    hard: true
    human_checkpoint: required
  - id: enactment
    persona: law-clerk
    action: "One commit: law file(s) + version bump + history entry, registry sync, record → ENACTED, CHANGELOG, 'law:' commit format"
    entry: "APPROVED record"
    exit: "law-integrity invariants verified; enactment commit on main"
    gates: [LAW-10.6]
    hard: true
    human_checkpoint: none
  - id: propagation
    persona: devops
    action: "Consuming projects update via scripts/update.sh (law diff with amendment motivations shown before applying)"
    entry: "Enacted amendment"
    exit: "Projects updated per their cadence; supporting docs/configs/personas propagated in follow-up commits"
    gates: [LAW-1.3, LAW-6.5]
    hard: false
    human_checkpoint: none
escalation: "Disagreement between reviewing personas → persona-council; council deadlock → the human decision stage settles it (it always does — stage 3 is the authority)"
---

# WF-AMENDMENT: Constitution Amendment

## When to Use

Any change to a law — creation, modification, repeal. This workflow IS the
[Amendment Process](../amendments/AMENDMENT-PROCESS.md), encoded as an
executable workflow: the constitution governing its own evolution through its
own machinery. (The v1.1 wave, AMD-2026-002…009, followed exactly this path.)

## Stages

### 1. proposal — Law Clerk *(hard)*
The clerk drafts but never edits laws directly: a law file change without an
enacted amendment record is the constitutional violation the law-integrity CI
exists to catch. Anyone — human or persona — may *initiate*; the clerk
ensures the record is procedurally complete.

### 2. review — Owner Personas / Council *(hard)*
The affected laws' owner personas review with citations; Article-5 amendments
always add Security; cross-cutting amendments convene the full council.

### 3. decision — HUMAN *(hard, the human checkpoint)*
No persona approves an amendment. The recorded name and date are the audit
trail's anchor. Rejections are retained forever with their rationale —
rejections are precedent, not failures.

### 4. enactment — Law Clerk *(hard)*
The five-part single commit (law files, registry, record status, CHANGELOG,
`law:` message format). The clerk runs the same integrity checks CI enforces
before pushing.

### 5. propagation — DevOps
`update.sh` shows consuming projects each changed law WITH its amendment
motivation before applying — auditability travels with the update. The
training app (`user-training-onboarding/`) is part of propagation: registries
render live (no action), but affected narrative lessons are updated in the
same pass, and its content-integrity test catches stale law references.

## Deviation Notes

- **Nothing in stages 1–4 is skippable or reorderable.** This workflow encodes
  constitutional procedure; its flexibility point is the *pace*, never the
  sequence. A project-level override of WF-AMENDMENT is itself a
  constitutional violation — this file is normative only in the org catalog.
- Batch amendments (like the v1.1 wave) run stages 1–2 per record, stage 3
  en bloc if the approver chooses, stage 4 per record (one `law:` commit each).

## Escalation

Reviewer deadlock → council → the stage-3 human. There is no path around the
human decision; that is the point.
