---
id: LAW-5.1
title: Universal Input Validation
article: 5
article_name: Security
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [security]
enforcement: review
enforcement_mechanism: "Security persona review lens item 1; security-checker skill; CodeQL in CI security.yml"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-5.1: Universal Input Validation

## Statement (quotable)

> All external data — request bodies, query and path parameters, headers,
> webhook payloads, file uploads, message-queue messages, third-party API
> responses, environment configuration — is validated at the boundary
> before use, using allowlist validation (define what is permitted) never
> blocklist (enumerate what is forbidden). Data that fails validation is
> rejected with a safe error; it is never "sanitized" into acceptability
> and never partially processed.

## Rationale (the WHY — always citable alongside the statement)

Nearly every injection class — SQL, XSS, command, path traversal,
deserialization — begins as unvalidated external data reaching code that
trusts it. Blocklists fail by construction: attackers enumerate what the
defender forgot. Allowlists fail closed. Validating at the boundary, not
deep in the call stack, means interior code can rely on its inputs'
shape — which is also what makes typed code honest: a validated boundary
is what turns `unknown` into a trustworthy domain type (LAW-2.3).
Third-party responses are included because "trusted partner" describes a
contract, not their compromise status.

## Compliance Examples

VIOLATION:
```typescript
router.post('/users', async (req, res) => {
  // req.body used as-is; blocklist "sanitizing"
  const name = req.body.name.replace('<script>', '');
  await userService.create(req.body);
});
```

COMPLIANT:
```typescript
const CreateUserRequest = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  role: z.enum(['member', 'admin']),
}); // allowlist: shape, bounds, permitted values

router.post('/users', async (req, res) => {
  const parsed = CreateUserRequest.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(validationError(parsed.error));
  await userService.create(parsed.data);
});
```

## Related Laws
- LAW-5.2 (Parameterized Queries Only)
- LAW-2.3 (Prohibition of the `any` Type)
- LAW-1.5 (Security is Everybody's Responsibility)

## Citation Format
[LAW-5.1 v1.0] "All external data is validated at the boundary with allowlist validation before use; failing data is rejected, never sanitized into acceptability."
