---
name: ai-transparency
description: Use when committing or opening a PR for AI-assisted work, or when questions arise about AI tool usage, disclosure, or data exposure. Enforces LAW-7.1–7.3 — produces the AI-assistance summary, the [Claude-assisted] commit tag, and the PR disclosure block.
---

# AI Transparency

Enforces the provenance half of Article 7: human accountability (LAW-7.1), data
protection (LAW-7.2), and the audit trail (LAW-7.3). The principle: **disclosure is
provenance, not confession** — undisclosed AI involvement is the violation, never AI
involvement itself.

## Commit Tagging (LAW-7.3)

Any commit containing AI-generated code carries the tag:

```text
feat: add reconciliation job [Claude-assisted]
```

- The tag goes in the subject line, after the conventional-commit summary.
- Threshold: AI produced code that survived into the commit (not mere
  autocomplete-level keystrokes; when in doubt, tag).
- Other approved tools use their equivalent tag (`[Copilot-assisted]`, etc.).

## PR Disclosure Block (LAW-7.3)

Fill the AI Assistance section of the PR template:

```markdown
## AI Assistance
- **Tool:** Claude Code (approved list ✓)
- **What the AI produced:** <components/files/logic generated or drafted>
- **What the human verified/modified:** <reviewed against docs, rewrote X,
  added tests for Y, validated against staging>
- **Human owner:** <name> — I can explain every line of this change (LAW-7.1)
```

The verified/modified line is the load-bearing one: it is the evidence that
LAW-7.4's verify-never-assume actually happened.

## AI-Assistance Summary (for releases/audits)

On request, produce a change-level or release-level summary from the git history:

```text
AI-ASSISTANCE SUMMARY: <release/branch>
Commits tagged [Claude-assisted]: <n> of <total>
Areas: <modules touched by assisted commits>
Disclosures: <PRs with completed AI sections / total assisted PRs>
Gaps: <assisted commits lacking tags or PR disclosure — each is a LAW-7.3
violation to remediate>
```

## Data Protection Check (LAW-7.2)

Before any content goes to an AI tool, screen for:
- PII (names, emails, SSNs, account numbers) → redact or synthesize
- Secrets/tokens/credentials → redact, and if already sent: **rotate now** (LAW-5.3)
- Payment/health data → approved tools with contractual protection only
- Client-confidential material and proprietary algorithms → approved tools only

When violations are found in prompts, logs, or fixtures:

```text
FINDING [CRITICAL]: <data class> sent to unapproved AI tool at <location>
CITATION: [LAW-7.2 v1.0] "No PII, secrets, payment/health data,
client-confidential material, or proprietary algorithms may be sent to AI
tools outside the approved list."
RATIONALE: A prompt is an outbound data transfer beyond the organization's
control.
REQUIRED FIX: <rotation/notification/redaction steps; route to Security persona>
```

## Accountability Reminders (LAW-7.1)

- "The AI wrote it" never appears in a commit, PR, review reply, or incident note
  as an explanation. The human owner explains the change or withdraws it.
- An engineer who cannot explain an AI-drafted change does not submit it — offer a
  walkthrough of the generated logic instead of a shrug.
