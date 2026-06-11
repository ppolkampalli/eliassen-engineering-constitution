---
id: LAW-5.4
title: Established Auth Frameworks Only
article: 5
article_name: Security
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [security]
enforcement: review
enforcement_mechanism: "Security persona review lens item 4; dependency review for auth libraries"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-5.4: Established Auth Frameworks Only

## Statement (quotable)

> Authentication and authorization use established, actively-maintained
> frameworks and standards — OAuth 2.0 / OIDC, JWT via vetted libraries,
> SAML for enterprise SSO. Writing custom cryptography, password hashing,
> session management, or token schemes is prohibited. Password storage,
> where unavoidable, uses a current memory-hard algorithm (argon2id or
> bcrypt) via its maintained library — never a hand-rolled construction.

## Rationale (the WHY — always citable alongside the statement)

Cryptographic and auth code fails silently: it works perfectly in every
demo and falls only to an adversary — timing side channels, padding
oracles, token confusion, session fixation — failure modes that don't
appear in tests (so LAW-3.2 coverage cannot save you) and that took the
field decades to discover. Established frameworks embody those decades
of patched mistakes and are continuously attacked and audited by
thousands of parties; bespoke schemes are audited by their author, once,
optimistically. "Roll your own crypto" is the only engineering decision
this constitution prohibits categorically rather than conditionally.

## Compliance Examples

VIOLATION:
```typescript
// home-grown token scheme
const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
const passwordHash = crypto.createHash('md5').update(password).digest('hex');
```

COMPLIANT:
```typescript
import { hash, verify } from '@node-rs/argon2';
// Sessions/tokens issued by the OIDC provider (Auth0/Entra/Keycloak);
// service verifies via the provider's vetted JWKS library:
const claims = await jwtVerify(token, jwks, { issuer, audience });
```

## Related Laws
- LAW-5.6 (Encryption Standards)
- LAW-5.5 (Dependency Hygiene)
- LAW-1.5 (Security is Everybody's Responsibility)

## Citation Format
[LAW-5.4 v1.0] "Auth uses established frameworks (OAuth2/OIDC, vetted JWT, SAML) exclusively; custom cryptography, session, or token schemes are categorically prohibited."
