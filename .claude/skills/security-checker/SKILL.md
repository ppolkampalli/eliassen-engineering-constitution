---
name: security-checker
description: Use for a focused security pass over code, a diff, or a dependency change — SQL/XSS/injection surfaces, secrets, auth implementations, dependency risk, encryption. Delegates to and aligns with the Security persona; outputs cited findings with severities.
---

# Security Checker

A focused Article 5 pass. This skill applies the Security persona's review lens
(`.claude/skills/personas/security/SKILL.md`); for sustained security work, design
questions, or veto decisions, **assume the Security persona itself** — this checker
is the quick-scan instrument, the persona is the authority.

## Scan Order (the Security persona's lens)

1. **Input validation (LAW-5.1)** — every external data path: bodies, params,
   headers, webhooks, uploads, queue messages, third-party responses, env config.
   Allowlist schemas at the boundary; rejected ≠ sanitized.
2. **Query construction (LAW-5.2)** — any string building near SQL/NoSQL/LDAP/shell:
   interpolation, concatenation, dynamic column/table names. Parameterized only.
3. **Secrets (LAW-5.3)** — keys/tokens/passwords in source, committed config,
   images, or **logs** (the most-missed path). Committed once = rotate now.
4. **Auth & crypto (LAW-5.4)** — custom session/token schemes, hand-rolled hashing,
   deprecated algorithms (MD5/SHA-1 for passwords, ECB mode). Established
   frameworks only; argon2id/bcrypt for passwords.
5. **Dependencies (LAW-5.5)** — new/changed packages: known CVEs, maintenance
   health, transitive surface, typosquats; lockfile committed and exact.
6. **Transport & storage (LAW-5.6)** — plaintext HTTP beyond localhost (including
   "internal" traffic), unencrypted sensitive data at rest, TLS minimums in config.
7. **AI-tool exposure (LAW-7.2)** — protected data in prompts, logs, or fixtures
   destined for unapproved tools.

## Output — cited findings, Security persona format

```text
FINDING [CRITICAL|HIGH|MEDIUM|LOW]: <issue> at <location>
CITATION: [LAW-5.2 v1.0] "<quoted statement>"
RATIONALE: <law's rationale, applied to this case>
REQUIRED FIX: <concrete code-level remedy>
```

Severity per
[violation-severity.md](../constitution-enforcer/reference/violation-severity.md):
secrets in code, query concatenation, unvalidated input reaching execution, custom
crypto → **CRITICAL** (merge blocked, Security persona VETO; only a named human
security lead may override, recorded in the PR — LAW-1.5).

## Closing Report

```text
SECURITY SCAN: <target>
Surfaces checked: input ▸ queries ▸ secrets ▸ auth ▸ deps ▸ crypto ▸ AI-exposure
Findings: <n CRITICAL / n HIGH / n MEDIUM / n LOW>
VERDICT: [CLEAR | FINDINGS — see above | VETO per Security persona]
```

No findings ≠ secure: state what was *not* covered (e.g., runtime config, infra)
so absence of findings is never read as absence of risk.
