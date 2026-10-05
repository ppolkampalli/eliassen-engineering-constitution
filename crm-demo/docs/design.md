# Design: CRM Reference Implementation

**Persona:** Architect · **Workflow:** WF-FEATURE v1.0, stage 2 (`design`)
**Entry:** `requirements.md` · **Gates:** LAW-4.1, LAW-4.4, LAW-4.5, LAW-10.1
**ADR:** `docs/adr/0003-crm-reference-implementation-scope.md` (ratifies the three
scope boundaries below, since each is a decision a future maintainer would ask
"why is it like this?" about — LAW-4.5)

## Domain Placement (LAW-4.1)

Two top-level domains, each with the layers that apply to this slice
(Application → Domain → Persistence; Presentation is explicitly out of scope
per `requirements.md`):

```
crm-demo/src/
  shared/
    caller.ts            # Caller { id, role } — the one cross-domain value type
    errors.ts            # NotAuthorizedError — generic, used identically by any domain
  users/
    domain/
      user.ts            # User entity, email/password validation rules
      errors.ts           # DuplicateEmailError, WeakPasswordError
    application/
      register-user.ts   # the one use-case this slice needs
    persistence/
      user-repository.ts            # interface (Repository pattern, LAW-4.4)
      in-memory-user-repository.ts  # swappable implementation
  customers/
    domain/
      customer.ts         # Customer entity, status enum, field validation
      errors.ts            # ValidationError, NotFoundError
    application/
      create-customer.ts
      list-customers.ts
      update-customer.ts
    persistence/
      customer-repository.ts
      in-memory-customer-repository.ts
```

**No import from `customers` into `users`, or vice versa.** The only
cross-domain-shaped dependency is `shared/caller.ts` — a plain value type, not
either domain's internals — because `customers`' application layer needs to
know a caller's role, and in a real system an auth layer (out of scope here)
would already have resolved that from the `users` domain and attached it to the
request context. This keeps both domains independently testable (LAW-3.4) and
means the explicitly-deferred auth/session work (AC2's scope note) can be added
later without touching `customers` at all.

## Entities

```typescript
// users/domain/user.ts
interface User {
  readonly id: string;
  readonly email: string;      // lowercased at creation — case-insensitive identity
  readonly passwordHash: string;
  readonly role: 'admin' | 'customer';
  readonly createdAt: Date;
}
// Never serialize passwordHash out of the domain — register-user's return
// type is a separate, narrower shape with no password field at all.

// customers/domain/customer.ts
type CustomerStatus = 'lead' | 'active' | 'inactive';
interface Customer {
  readonly id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: CustomerStatus;      // defaults to 'lead' at creation
  readonly createdAt: Date;
  updatedAt: Date;
}
```

## Patterns (LAW-4.4)

- **Repository** (sanctioned) for both domains' persistence — interface in
  `persistence/*-repository.ts`, in-memory implementation behind it. A real
  store is a second implementation of the same interface; nothing above the
  repository layer changes.
- **Dependency Injection** (sanctioned) — use-cases receive their repository
  (and, for `register-user`, a password-hashing function) as constructor/
  function parameters, never constructed internally. This is also what makes
  unit tests fast and isolated (LAW-3.4) — tests inject an in-memory repo
  directly, no process boundary.
- No new pattern category introduced; no ADR needed for pattern choice itself
  (only for the three scope decisions below).

## Authorization (AC2)

A single shared check, not duplicated per use-case:

```typescript
// shared/errors.ts
class NotAuthorizedError extends Error {}

// customers/application/*.ts — each admin-only use-case starts:
function requireAdmin(caller: Caller): void {
  if (caller.role !== 'admin') throw new NotAuthorizedError('admin role required');
}
```

## Validation (AC1, AC3 — LAW-5.1, allowlist-validate at the boundary)

- Email format: a single shared regex/check used by both `register-user` and
  `create-customer` (duplicated validation logic is exactly the drift LAW-7.6
  tracks — one function, imported by both domains' domain layer... but domains
  may not import each other. Resolution: the email-format check is a pure,
  stateless function with no domain dependencies, so it lives in `shared/` as
  a value-validation utility, not as domain logic — this is a utility, not a
  business rule either domain owns.)
- Password: minimum 8 characters, checked in `users/domain/user.ts` (a
  `users`-owned business rule, stays there).
- Required fields (`name`, `email` on `Customer`): checked in
  `customers/domain/customer.ts`.

## Error Model

Each domain owns its own domain errors (`DuplicateEmailError`,
`WeakPasswordError` in `users`; `ValidationError`, `NotFoundError` in
`customers`) — all extend `Error`, all thrown (not returned as result codes),
matching how the rest of this repository's reference code
(`memory-service`) already does error handling. `NotAuthorizedError` is the one
error type that's genuinely cross-domain-shaped (any domain's admin-only
use-case can throw it), so it lives in `shared/errors.ts`.

## Testing Approach (previews `test-definition`)

- Jest + ts-jest, ESM, mirroring `memory-service/jest.config.js` exactly
  (this repo's own established convention — LAW-1.3 applies to tooling even
  within a reference/demo package).
- 100% coverage target on `domain/` and `application/` (LAW-3.2's 100%
  utilities / business-logic floor — this whole slice *is* business logic);
  in-memory persistence implementations get full coverage too since they are
  the only persistence this slice has (no framework code to exclude).
- AAA structure, `"should <expectation> when <scenario>"` names (LAW-3.3).

## Consequences

- Three scope decisions (no auth/session stack, no presentation layer, no real
  database) are recorded in `docs/adr/0003-...` rather than left implicit —
  each is exactly the kind of thing LAW-4.5 exists to make a future maintainer
  not have to rediscover by reading commit history.
- Adding a presentation layer or real persistence later is additive: new files
  implementing the existing use-case/repository interfaces, zero changes to
  `domain/`.
