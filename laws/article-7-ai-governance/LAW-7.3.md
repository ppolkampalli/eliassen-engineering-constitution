---
id: LAW-7.3
title: AI Audit Trail
article: 7
article_name: AI Governance
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [quality, devops]
enforcement: review
enforcement_mechanism: "Commit message tag check in review; PR template AI Assistance section; ai-transparency skill"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-7.3: AI Audit Trail

## Statement (quotable)

> AI involvement in a change is disclosed where the change is recorded:
> commits containing AI-generated code carry the `[Claude-assisted]` tag
> (or the approved tool's equivalent), and the pull request's AI
> Assistance section states what the AI produced, what the human
> verified or modified, and which tool was used. Disclosure is a
> statement of provenance, not of reduced quality — undisclosed AI
> involvement is the violation, not AI involvement itself.

## Rationale (the WHY — always citable alongside the statement)

Provenance enables every downstream safeguard. Reviewers calibrate
attention (AI output fails in characteristic ways — plausible-but-wrong
APIs, subtly inverted conditions — that human code doesn't, LAW-7.4);
incident responders know whether to question generated logic; the
organization can answer client and audit questions about AI use with
records instead of recollection; and policy can be tuned with real
adoption data. None of this works retroactively — provenance not
captured at commit time is gone. The explicit no-stigma clause exists so
disclosure stays honest: the moment tagging is treated as confession,
tagging stops.

## Compliance Examples

VIOLATION:
```text
commit -m "feat: add reconciliation job"
# 600 lines, largely generated; no tag, PR says nothing about AI use.
```

COMPLIANT:
```text
commit -m "feat: add reconciliation job [Claude-assisted]"
# PR — AI Assistance: "Claude generated the initial job skeleton and
# SQL; I rewrote the matching predicate, added idempotency, verified
# against staging data. Tool: Claude Code (approved list)."
```

## Related Laws
- LAW-7.1 (Human Accountability)
- LAW-7.4 (Identical Standards for AI Code)
- LAW-6.5 (Docs Travel With Code)

## Citation Format
[LAW-7.3 v1.0] "AI involvement is disclosed at the point of record: [Claude-assisted] commit tag and the PR's AI Assistance section describing what was generated and what was verified."
