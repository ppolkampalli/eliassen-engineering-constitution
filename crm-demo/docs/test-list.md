# Test List: CRM Reference Implementation

**Persona:** Quality · **Workflow:** WF-FEATURE v1.0, stage 3 (`test-definition`, hard)
**Entry:** `requirements.md` + `design.md` · **Gates:** LAW-3.1, LAW-10.2
**Runnable check (LAW-10.2):** `cd crm-demo && npm test -- --coverage` — green suite
+ coverage thresholds met is the definition of done for `implement`.

Canon TDD step 1 (LAW-3.1 v1.1): the list below, one item converted to a
failing test at a time, made to pass, before moving to the next. AAA
structure, `"should <expectation> when <scenario>"` names (LAW-3.3).

## `users` domain

### `user.ts` (domain)
1. should normalize email to lowercase when creating a user
2. should throw WeakPasswordError when password is under 8 characters
3. should hash the password when creating a user (never store plaintext)

### `register-user.ts` (application) — covers AC1
4. should create a user with role 'customer' when registering with valid unique email/password
5. should throw DuplicateEmailError when registering with an email already in use
6. should throw DuplicateEmailError when registering with an email differing only in case from an existing one
7. should throw WeakPasswordError when registering with a password under 8 characters, and create no user
8. should return a user shape with no password or passwordHash field

### `in-memory-user-repository.ts` (persistence)
9. should return undefined when finding by email with no match
10. should find a previously-saved user by email case-insensitively

## `customers` domain

### `customer.ts` (domain)
11. should default status to 'lead' when creating a customer
12. should throw ValidationError when name is missing
13. should throw ValidationError when email is missing
14. should throw ValidationError when email is malformed

### `create-customer.ts` (application) — covers AC2, AC3
15. should create a customer with valid admin caller and valid input
16. should throw NotAuthorizedError when caller role is 'customer', creating nothing
17. should throw ValidationError when required fields are missing, creating nothing

### `list-customers.ts` (application) — covers AC2, AC4
18. should return an empty list when no customers exist
19. should return all customers when called with an admin caller and no filter
20. should return only matching customers when filtered by status
21. should throw NotAuthorizedError when caller role is 'customer'

### `update-customer.ts` (application) — covers AC2, AC5
22. should update status/phone/company on an existing customer when called with an admin caller
23. should leave unspecified fields unchanged on a partial update
24. should throw NotFoundError when updating an unknown customer id
25. should throw NotAuthorizedError when caller role is 'customer', making no change
26. should leave name and email unchanged regardless of update payload

### `in-memory-customer-repository.ts` (persistence)
27. should return undefined when finding by id with no match
28. should return all saved customers when listing with no filter
29. should return only matching customers when listing with a status filter

## Coverage mapping back to Acceptance Criteria

AC1 → items 1–10 · AC2 → items 16, 21, 25 · AC3 → items 11–17 · AC4 → items
18–20, 28–29 · AC5 → items 22–26.

Every AC has at least one test; every test traces to an AC or a
design-mandated invariant (case-insensitive email, no-password-leak). No item
is speculative coverage for behavior the requirements didn't ask for.
