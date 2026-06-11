# Pre-Commit Checklist

Self-check before every commit — the human half of what `hooks/pre-commit` enforces
mechanically. Every item annotated with its law.

## Mechanical (the hook runs these — verify they ran)

- [ ] `eslint --fix` + `prettier --write` on staged files passed (LAW-2.2, Article 2)
- [ ] `npm run type-check` passed — no new `any`, strict flags intact (LAW-2.3, LAW-2.4)

## Tests

- [ ] The failing test came first; red→green→refactor evidence will be visible in
      history (LAW-3.1)
- [ ] `npm test` green locally; coverage floors hold (LAW-3.2)
- [ ] No `.skip` added without a ticket reference (LAW-3.5)

## Content

- [ ] No secrets, tokens, keys, or connection strings in the diff — check config
      files and test fixtures too (LAW-5.3)
- [ ] No debug logging left behind; no `console.log` of payloads that may carry
      PII (LAW-5.3, LAW-7.2)
- [ ] No TODO without ticket+context (LAW-1.2)
- [ ] New literals with meaning are named constants (LAW-2.6)
- [ ] Comments added are WHY, not WHAT (LAW-6.4)

## Commit Message

- [ ] Conventional Commits format per
      [commit-message-guide.md](../templates/commit-message-guide.md)
- [ ] `[Claude-assisted]` tag if AI generated any surviving code (LAW-7.3)
- [ ] Body explains WHY when the change isn't self-evident (LAW-6.4)
- [ ] `law:` prefix NOT used (reserved for amendment enactments)

## Scope

- [ ] Everything in this commit belongs to the work item; "while I'm here" changes
      are ticketed instead (LAW-8.4, LAW-1.2)
- [ ] Docs affected by this change are in this same change (LAW-6.5)
