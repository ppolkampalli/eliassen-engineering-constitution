---
id: LAW-10.3
title: Agent Sandboxing and Permissions
article: 10
article_name: Agentic Development
status: ACTIVE
version: 1.0
effective_date: 2026-06-11
owner_personas: [security, devops]
enforcement: review
enforcement_mechanism: "Sandbox/allowlist configuration reviewed for autonomous and CI agent runs; security persona review for agent credential scopes"
amendment_history:
  - amendment: AMD-2026-002
    date: 2026-06-11
    change: "Initial ratification"
---

# LAW-10.3: Agent Sandboxing and Permissions

## Statement (quotable)

> Autonomous agent runs (unattended, CI, batch) operate inside a sandbox
> providing BOTH filesystem isolation (access limited to the project workspace)
> and network isolation (connections limited to approved endpoints) — one
> without the other is not sandboxing. Interactive sessions use scoped
> permission allowlists; unattended invocations declare an explicit tool/command
> allowlist. Agents never run with credentials or scopes beyond the task's
> needs; prompt injection is treated as the default threat model for any agent
> that reads untrusted content (LAW-5.1 applied to agents).

## Rationale (the WHY — always citable alongside the statement)

A coding agent is a code-execution surface whose instructions can arrive from
anything it reads — issues, web pages, dependency READMEs. Anthropic's verified
doctrine is categorical: "effective sandboxing requires *both* filesystem and
network isolation" — filesystem-only still lets a prompt-injected agent exfiltrate
what it can read; network-only still lets it tamper with what it can write (SSH
keys, hooks, CI config). OS-level enforcement of both boundaries contained the
threat while *reducing* friction (84% fewer permission prompts in Anthropic's
internal use): the sandbox replaces approval fatigue with structural limits.
Least-privilege credentials bound the blast radius the same way LAW-5.3 bounds
secret exposure.

## Compliance Examples

VIOLATION:
```bash
# Unattended batch run, full tool access, prod credentials in env
AWS_PROFILE=prod claude -p "migrate all 200 config files" # no allowlist
```

COMPLIANT:
```bash
# Scoped allowlist, sandboxed, no ambient credentials
claude -p "migrate $file per the plan. Return OK or FAIL." \
  --allowedTools "Edit,Bash(git commit *)"   # plus FS+network sandbox
```

## Related Laws
- LAW-5.1 (Universal Input Validation)
- LAW-5.3 (Secrets Never in Code)
- LAW-7.2 (IP and Data Protection)

## Citation Format
[LAW-10.3 v1.0] "Autonomous agent runs require BOTH filesystem and network isolation plus an explicit tool allowlist; agents never carry credentials beyond the task's needs, with prompt injection as the default threat model."
