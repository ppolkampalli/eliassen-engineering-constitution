# CRM Demo — Reference Implementation

A small, real, working CRM demonstrating the Engineering Constitution's
**Requirement → Architect → Design → Develop → Review** flow end-to-end
(WF-FEATURE). This is training material — the artifact *is* the demonstration.

- `docs/requirements.md` — Product Owner stage: acceptance criteria (LAW-8.1)
- `docs/design.md` — Architect stage: domain placement, patterns (LAW-4.1/4.4)
- `docs/test-list.md` — Quality stage: the Canon TDD test list (LAW-3.1)
- `src/` — Engineer stage: implementation, test-first

See `../docs/adr/0003-crm-reference-implementation-scope.md` for the three
scope decisions (no auth/session stack, no presentation layer, no real
database) and why each was made.

## What it does

- **`users` domain:** self-service registration (`registerUser`) — creates a
  `customer`-role user, rejects duplicate/case-variant emails and weak
  passwords, never exposes the password hash.
- **`customers` domain:** admin-only CRM operations — create, list (optionally
  filtered by status), and update a customer record. Every operation checks
  the caller's role via `shared/caller.ts`'s `Caller` type.

Both domains are Application → Domain → Persistence only; there is no HTTP or
CLI layer in this slice (see the ADR) — `src/*/application/*.ts` functions are
the public interface a future adapter would call directly.

## Run it

```bash
npm install
npm run type-check   # strict TypeScript, zero `any`
npm test             # 33 tests
npm run test:coverage  # LAW-3.2 floors: 100% lines/functions/statements, 90% branches
```

No build/start step is needed — this is a library of use-cases exercised by
its own test suite, not a running service (per the ADR's scope decisions).
