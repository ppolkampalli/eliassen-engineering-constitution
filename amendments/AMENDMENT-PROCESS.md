# The Amendment Process

**This is the ONLY way laws change.** A law file edited outside this process is a
constitutional violation: the `law-integrity` CI workflow fails any pull request that
modifies a `laws/` file without an accompanying amendment record, and the law-clerk
skill refuses to make such edits.

Every change to the constitution — creation, modification, or repeal of a law — moves
through five stages:

---

## 1. PROPOSAL

Anyone — human engineer, persona, or agent — may propose an amendment.

- Draft a record from [`AMENDMENT-TEMPLATE.md`](AMENDMENT-TEMPLATE.md) into
  `amendments/records/AMD-YYYY-NNN-<slug>.md` with status **PROPOSED**.
- IDs are sequential per year: `AMD-2026-001`, `AMD-2026-002`, …
- A proposal MUST include:
  - **Laws affected** (by ID),
  - **Exact text changes** — the current statement and the proposed statement,
    before/after, verbatim,
  - **Motivation** — the problem, incident, or learning that prompted it,
  - **Impact analysis** — which projects, personas, configs, and CI workflows are
    affected and what migration is required,
  - **Proposer** — name (and persona, if agent-proposed).

## 2. REVIEW

- The **owner persona(s)** of each affected law must review and record a verdict in
  the amendment's Review Record table.
- Amendments touching **Article 5 (Security)** additionally require Security persona
  review even when Security is not the owner.
- **Cross-cutting amendments** (multiple articles, or impacts spanning cost +
  security + architecture) go to the **persona-council** skill, which produces a
  consolidated, citation-backed review.
- Reviews cite laws: an objection states which law or principle the proposal
  conflicts with and why.

## 3. DECISION

- **Approval authority:** VP Engineering / Tech Lead. The decision records the
  approver's **name** and **date** in the amendment record.
- **Approved** → status `APPROVED`, proceed to enactment.
- **Rejected** → status `REJECTED`, with the rejection rationale recorded. Rejected
  amendments **stay in `records/` permanently** — rejections are part of the audit
  trail; a future proposer must be able to learn why an idea was declined.

## 4. ENACTMENT

On approval, **one commit** performs all of the following:

1. **(a)** The affected law file(s) updated: new text, `version` bumped per the
   versioning rules below, and an `amendment_history` entry added referencing the
   amendment ID.
2. **(b)** `laws/registry.json` and `laws/REGISTRY.md` updated to match.
3. **(c)** The amendment record's status set to **ENACTED**.
4. **(d)** A `CHANGELOG.md` entry added.
5. **(e)** Commit message format:
   `law: amend LAW-X.Y via AMD-YYYY-NNN — <summary>`

The `law-integrity` workflow verifies (a)–(c) are consistent on every PR.

## 5. PROPAGATION

Consuming projects pull constitution updates with `scripts/update.sh`, which — before
applying — prints a human-readable diff of every changed law **with the amendment ID
and motivation** read from the amendment records. Auditability travels with the
update: a project always sees *why* a law changed before accepting it.

---

## Versioning Rules

| Change type | Version bump | Example |
|---|---|---|
| Text clarification — wording only, meaning unchanged | **Patch** | 1.0 → 1.0.1 |
| Meaning change — scope, threshold, or obligation changes | **Minor** | 1.0 → 1.1 |
| Repeal-and-replace | **New law ID**; old law marked `REPEALED` | hypothetical: LAW-X.Y → REPEALED, replacement ratified under the article's next free ID |

**Repealed laws are never deleted.** They remain in the repository, marked
`REPEALED`, so historical decisions that cited them remain auditable. A repealed
law's file gains a notice pointing to its replacement (if any) and the repealing
amendment.

## Status Lifecycle

```
PROPOSED ──review──▶ APPROVED ──enactment──▶ ENACTED
    │
    └──review──▶ REJECTED  (retained permanently with rationale)
```

## Invariants (enforced by law-integrity CI and the law-clerk skill)

1. Every law's `amendment_history` references only amendment records that exist.
2. Every ACTIVE law's `version` matches `registry.json`.
3. Any diff touching `laws/` is accompanied by an amendment record referencing the
   changed law's ID — otherwise the build fails.
4. A law without an enacted amendment record does not exist.
