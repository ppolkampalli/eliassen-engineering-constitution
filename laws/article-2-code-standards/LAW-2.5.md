---
id: LAW-2.5
title: Import Ordering
article: 2
article_name: Code Standards
status: ACTIVE
version: 1.0
effective_date: 2026-06-01
owner_personas: [software-engineer, quality]
enforcement: automated
enforcement_mechanism: "ESLint rule import/order with newlines-between groups and alphabetical sorting"
amendment_history:
  - amendment: AMD-2026-001
    date: 2026-06-01
    change: "Initial ratification"
---

# LAW-2.5: Import Ordering

## Statement (quotable)

> Imports appear in three groups separated by a blank line, each group
> alphabetized: (1) Node.js standard library, (2) third-party packages,
> (3) local modules. Ordering is enforced by ESLint and applied by
> `--fix`; it is never maintained by hand.

## Rationale (the WHY — always citable alongside the statement)

A file's imports are its dependency manifest. A fixed order makes that
manifest scannable at a glance — readers see immediately what external
surface area a module touches — and eliminates merge conflicts and diff
noise from import shuffling. Grouping stdlib/third-party/local also makes
unwanted coupling visible: a domain module importing from `express` is
caught by eye in review long before it becomes a layering violation
(LAW-4.1).

## Compliance Examples

VIOLATION:
```typescript
import { OrderService } from './order-service';
import express from 'express';
import fs from 'node:fs';
import { z } from 'zod';
```

COMPLIANT:
```typescript
import fs from 'node:fs';

import express from 'express';
import { z } from 'zod';

import { OrderService } from './order-service';
```

## Related Laws
- LAW-2.2 (Formatting via Prettier)
- LAW-4.1 (Layered Architecture)
- LAW-4.3 (No Circular Dependencies)

## Citation Format
[LAW-2.5 v1.0] "Imports are grouped stdlib → third-party → local, alphabetized within groups, enforced by ESLint — never maintained by hand."
