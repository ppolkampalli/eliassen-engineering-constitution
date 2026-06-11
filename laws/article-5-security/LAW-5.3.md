---
id: LAW-5.3
title: Secrets Never in Code
article: 5
article_name: Security
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [security]
enforcement: automated
enforcement_mechanism: "Secret scanning in CI security.yml; security persona review lens item 3"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-5.3: Secrets Never in Code

## Statement (quotable)

> Secrets — API keys, passwords, tokens, connection strings, private
> keys, signing certificates — never appear in source code, configuration
> files committed to version control, container images, or logs. Secrets
> are supplied at runtime from environment variables or a secret manager.
> A secret that has ever been committed is compromised: it is rotated
> immediately, not merely removed.

## Rationale (the WHY — always citable alongside the statement)

Version control never forgets: a secret committed once survives in
history through every clone, fork, and backup, beyond the reach of any
later deletion. Public and private leaked credentials are harvested by
automated scanners within minutes. Logs are the second-most-common leak
path — they flow to aggregators, dashboards, and third-party services
with far weaker access control than the secret store. The rotation rule
exists because removal creates the illusion of remediation while every
historical copy remains live ammunition.

## Compliance Examples

VIOLATION:
```typescript
const stripe = new Stripe('sk_live_51Hxxxxxxxxxxxxxxxxxxxx');
logger.info(`Connecting with ${process.env.DB_PASSWORD}`); // leaked to logs
```

COMPLIANT:
```typescript
const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'));
logger.info('Connecting to payment provider');  // no secret material logged
// Local development: .env file, listed in .gitignore, never committed.
```

## Related Laws
- LAW-5.6 (Encryption Standards)
- LAW-7.2 (IP and Data Protection)
- LAW-9.1 (Infrastructure as Code)

## Citation Format
[LAW-5.3 v1.0] "Secrets never appear in code, committed config, images, or logs — runtime env/secret manager only; a committed secret is rotated, not removed."
