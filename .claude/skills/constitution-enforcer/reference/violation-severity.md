# Violation Severity Matrix

Maps violation severities to laws. Severity drives the response: CRITICAL stops the
line; LOW is fixed in passing with an inline citation.

| Severity | Meaning | Response |
|---|---|---|
| **CRITICAL** | Exploitable, data-exposing, or integrity-destroying. | Work stops. Merge blocked (Security VETO where applicable). Fix before anything else proceeds. |
| **HIGH** | Violates a blocking law; defect will propagate or recur if merged. | Merge blocked until fixed or formally accepted by the owning persona (fix-or-accept recorded). |
| **MEDIUM** | Standard violated; quality erodes but no immediate exposure. | Fix within the PR; reviewer verifies before approval. |
| **LOW** | Style/consistency deviation tooling can fix or reviewer notes. | Fix in passing with inline citation `(per [LAW-X.Y vN])`. |

## CRITICAL (canonical examples)

| Violation | Law |
|---|---|
| Hardcoded secrets, keys, tokens in code or logs | LAW-5.3 |
| SQL/query built by string concatenation/interpolation | LAW-5.2 |
| Disabled strict mode / suppressed type checking (`any` floods, `@ts-nocheck`, strict flags off) | LAW-2.3 |
| Unvalidated external input reaching queries, exec, or rendering | LAW-5.1 |
| Custom crypto, home-grown auth/session/token scheme | LAW-5.4 |
| Sensitive data sent to unapproved AI tool | LAW-7.2 |
| Quality gate bypassed, disabled, or given an override path | LAW-6.2 |
| Plaintext transport outside localhost; sensitive data stored unencrypted | LAW-5.6 |

## HIGH

| Violation | Law |
|---|---|
| Known-vulnerable dependency (CRITICAL CVE >24h, HIGH >1wk); unpinned/missing lockfile | LAW-5.5 |
| No failing test preceded the implementation | LAW-3.1 |
| Coverage threshold lowered to pass; floors not met | LAW-3.2 |
| Hollow tests (cannot fail); `.skip` without ticket | LAW-3.5 |
| Layer violation; circular dependency | LAW-4.1, LAW-4.3 |
| Significant structural change without ADR | LAW-4.5, LAW-1.4 |
| Deploy without rollback plan; console-built infrastructure | LAW-9.2, LAW-9.1 |
| Implementation begun without acceptance criteria | LAW-8.1 |
| AI-generated code merged unverified; undisclosed AI involvement | LAW-7.4, LAW-7.3, LAW-7.1 |
| Copyleft/unevaluated license adopted without sign-off | LAW-9.4 |
| Self-approval; missing domain-expert review | LAW-6.1 |

## MEDIUM

| Violation | Law |
|---|---|
| Function >30 lines / multiple responsibilities; magic numbers | LAW-2.6 |
| Missing explicit return type on exported function | LAW-2.4 |
| Missing/incomplete JSDoc on public API | LAW-6.3 |
| Stale docs not updated in the PR | LAW-6.5 |
| Test not AAA / vague name; inter-test dependence | LAW-3.3, LAW-3.4 |
| TODO without ticket+context | LAW-1.2 |
| Uncited business rule in domain code | LAW-8.2 |
| Out-of-scope additions without PO sign-off | LAW-8.4 |
| Untagged cloud resource; missing cost estimate on material change | LAW-9.3 |
| Compliance-mapped path changed without map update | LAW-8.3 |

## LOW

| Violation | Law |
|---|---|
| Naming convention deviation | LAW-2.1 |
| Manual formatting drift | LAW-2.2 |
| Import order violations | LAW-2.5 |
| WHAT-comments restating code | LAW-6.4 |
| 30-second readability friction (unclear but functional) | LAW-1.1 |

**Precedence note:** when a violation plausibly maps to two severities, take the
higher. Severity describes worst credible consequence, not author intent.
