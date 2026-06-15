---
name: persona-council
description: Convene the Persona Council for cross-cutting changes (new service, major refactor, new dependency with cost+security+architecture implications) or when two or more personas conflict. Orchestrates sequential multi-persona review, consolidates cited findings, applies the authority ladder, and escalates unresolved conflicts to humans per LAW-7.5.
---

# Persona Council

## Purpose
Single-persona review fits single-domain work. When a change spans domains —
or when personas disagree — the council produces one consolidated,
citation-backed review instead of fragmentary opinions. The council **never
silently averages positions**: disagreements are surfaced verbatim, with their
citations, and either resolved by the authority ladder or escalated to humans.

## When to Convene
- A new service, application, or major module boundary
- A major refactor crossing layers or modules
- A new dependency with combined cost + security + architecture implications
- Any amendment proposal touching multiple articles (per AMENDMENT-PROCESS.md)
- Any case where two personas' guidance conflicts

## Procedure

1. **Identify affected articles.** Map the change to the articles it touches
   (e.g., new paid auth provider → Articles 4, 5, 9). The affected articles'
   owner personas are the council for this review (consult
   `docs/constitution/registry.json` or `laws/REGISTRY.md` for ownership).

2. **Sequentially assume each relevant persona.** One at a time — fully adopt
   the persona's skill, run its Review Lens against the change, and produce
   findings in its citation format. Do not blend perspectives; the Security
   pass knows nothing of cost, the FinOps pass nothing of elegance.

3. **Produce one consolidated report:**

   ```text
   PERSONA COUNCIL REVIEW: <change>
   Articles affected: <list> | Personas convened: <list>

   == Security ==
   <verbatim cited findings>
   == Architect ==
   <verbatim cited findings>
   == FinOps ==
   <verbatim cited findings>
   ...

   == CONFLICTS ==
   <each disagreement, quoted verbatim from both personas, with citations>

   == RESOLUTION ==
   <per conflict: ladder outcome, or ESCALATION>

   == COUNCIL VERDICT ==
   [PROCEED | PROCEED WITH REQUIRED FIXES | BLOCKED | ESCALATED]
   ```

4. **Apply the conflict rules — the authority ladder:**

   ```
   Security VETO  >  Architect VETO  >  Quality BLOCK  >  other personas' blocks  >  ADVISE
   ```

   - A Security CRITICAL veto ends the analysis: BLOCKED (only a named human
     security lead may override, recorded in the PR).
   - An Architect veto (layering, cycles) stands unless Security requires the
     violating path — then escalate.
   - Quality blocks (coverage, gates) stand against all advisory positions.
   - FinOps is explicitly subordinate to Security (LAW-9.3); advisory findings
     never outrank blocks.

5. **If conflict remains after the ladder** — or the ladder itself is
   ambiguous for this case — output an escalation summary for human decision
   per [LAW-7.5]:

   ```text
   ESCALATION per [LAW-7.5 v1.0]
   Conflict: <persona A position + citation> vs <persona B position + citation>
   Why the ladder does not resolve it: <reason>
   Options: <a, b, c with consequences>
   Needed from humans: <the specific decision>
   ```

## Hard Rules
- Every persona's findings appear in the report **verbatim with citations** —
  no summarizing away an objection, no softening a veto.
- The council reports disagreement honestly even when one side clearly wins
  the ladder: the losing position and its rationale are part of the record.
- The council does not invent authority: it applies the ladder and escalates;
  it never overrides a veto itself.
