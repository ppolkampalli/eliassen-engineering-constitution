# Requirements: CRM Reference Implementation

**Persona:** Product Owner · **Workflow:** WF-FEATURE v1.0, stage 1 (`requirements`, hard)
**Purpose:** a small, real, working application that demonstrates the constitution's
Requirement → Architect → Design → Develop → Review flow end-to-end, observed
through the visibility layer in `docs/proposals/agentic-visibility/`
(`docs/proposals/agentic-visibility/requirements.md` AC1–AC2). This is training
material: the artifact *is* the demonstration, not a product.

## Problem Statement

Teams adopting the constitution need to see it actually run on a real (if small)
codebase — not just read about workflows in the abstract. A simple CRM
(self-service user registration + admin customer-relationship-management
operations) is small enough to implement fully in one WF-FEATURE pass, yet real
enough to exercise every layer LAW-4.1 requires and every gate WF-FEATURE names.

## Scope

Two domains, per LAW-4.1 (domain-first, not technical-layer-first):

- **`users`** — registration and role identity (`customer` | `admin`).
- **`customers`** — CRM records an admin manages (lead/contact tracking).

### Explicitly out of scope (LAW-8.4 — scope changes need PO sign-off; stated up
front so none of this is quietly assumed later)

- **Login/session/HTTP auth stack.** Demonstrating LAW-5.4 ("OAuth2/OIDC/JWT/SAML
  via vetted libraries; never roll your own") would require pulling in a real
  auth framework — out of proportion for a reference demo. Authorization is
  checked against an already-authenticated caller's role, exactly as a real
  system's auth middleware would hand off to application code. A follow-on
  WF-FEATURE can add real session handling if this graduates past reference
  status.
- **Presentation layer (HTTP/CLI).** The four LAW-4.1 layers are demonstrated as
  Application (use-cases) → Domain (entities/rules) → Persistence (repository
  pattern); Presentation is represented only by the use-case function
  signatures a future HTTP/CLI adapter would call directly. No web framework
  dependency is introduced.
- **Real database.** Persistence is an in-memory `Repository` implementation
  behind an interface (LAW-4.4's sanctioned Repository pattern) — swappable for
  a real store later without touching domain logic. No IaC (LAW-9.1) needed for
  a reference app with no deployed infrastructure.
- **Customer deletion, search/pagination, email notifications** — none of these
  are needed to demonstrate the workflow; adding them is new scope, not this AC
  set.

## Acceptance Criteria

### AC1 — Self-service registration
A visitor can register with an email and password. The system creates a `User`
with role `customer` by default. Duplicate emails are rejected. Passwords under
8 characters are rejected. The returned user representation never includes the
password or its hash.
- **Verification:** registering with valid, unique email/password succeeds and
  the user is retrievable by email with role `customer`; registering a second
  time with the same email raises `DuplicateEmailError`; registering with a
  7-character password raises `WeakPasswordError`; the returned/stored-for-read
  shape has no password field.

### AC2 — Role-gated customer-management actions
Only a caller with role `admin` may create, list, or update customer records. A
`customer`-role caller attempting any of those raises `NotAuthorizedError`.
- **Verification:** each customer-management use-case, called with a
  `customer`-role caller, raises `NotAuthorizedError` and performs no mutation;
  called with an `admin`-role caller, succeeds.

### AC3 — Create a customer record (admin)
An admin can create a customer record: `name` (required), `email` (required,
validated format), `phone` (optional), `company` (optional). `status` defaults
to `lead`. Missing `name`/`email`, or a malformed `email`, raises
`ValidationError` and creates nothing (LAW-5.1 — validate at the boundary).
- **Verification:** valid input creates a retrievable record with `status:
  'lead'`; missing `name` or `email`, and a malformed email, each raise
  `ValidationError` with no record created.

### AC4 — List customer records, optionally filtered by status (admin)
An admin can list all customer records, or filter by `status`
(`lead`|`active`|`inactive`).
- **Verification:** with 3 seeded customers across 2+ statuses, an unfiltered
  list returns all 3; a filtered list returns only matching records.

### AC5 — Update a customer record (admin)
An admin can update an existing customer's `status`, `phone`, and `company`.
Updating a nonexistent id raises `NotFoundError`. `name`/`email` are immutable
through this operation (re-registration-style identity changes are out of
scope).
- **Verification:** updating an existing record's `status` persists the change
  and leaves `name`/`email` untouched; updating an unknown id raises
  `NotFoundError` with no side effect.

## Edge Cases (in scope)

- Registering with an email differing only in case (`A@x.com` vs `a@x.com`) is
  treated as a duplicate (case-insensitive email identity).
- Listing when zero customers exist returns an empty list, not an error.
- Partial update payloads (only `status` provided) leave other fields
  unchanged.

## Bearing Laws

LAW-8.1 (this document), LAW-4.1 (domain-first layering: `users` and `customers`
as top-level domains), LAW-5.1 (allowlist-validate external input — email
format, required fields), LAW-5.4 (noted and explicitly deferred — no
hand-rolled auth protocol is built; role-check only), LAW-3.1/3.2 (TDD,
coverage floors — enforced at `test-definition`/`implement`), LAW-2.1–2.6 (code
standards), LAW-10.1 (this document plus `design.md` together are the required
plan before implementation begins).

## Sign-off

Requirements stage is hard (LAW-8.1) with a `recommended` human checkpoint per
WF-FEATURE. Proceeding to `design` on the strength of this document and the
scope boundaries above; flag here if any AC or scope exclusion should change
before design starts.
