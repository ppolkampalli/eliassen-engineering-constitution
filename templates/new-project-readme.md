# <Project Name>

<!-- One-paragraph project description: what it does, for whom. -->

> **Governance:** This project is governed by the
> [Eliassen Group Engineering Constitution](https://github.com/eliassen/engineering-constitution)
> v1.0.0. Laws are citable by ID — registry installed at
> [`docs/constitution/REGISTRY.md`](docs/constitution/REGISTRY.md). See
> [`CLAUDE.md`](CLAUDE.md) for the distilled rules and persona instructions.

## Quickstart

```bash
npm ci
npm run dev
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Run locally |
| `npm run lint` | ESLint (Article 2 laws) |
| `npm run type-check` | tsc strict pass (LAW-2.3/2.4) |
| `npm test` | Jest with coverage floors (LAW-3.2) |
| `npm run format` | Prettier write (LAW-2.2) |

All of `lint`, `type-check`, and `test` must pass before any work is "done" (LAW-6.2).

## Architecture

<!-- Layering per LAW-4.1: where Presentation / Application / Domain / Persistence
     live in this repo. Link ADRs: docs/adr/ (LAW-4.5). -->

## Configuration

<!-- Env vars table: name, purpose, example. Secrets come from the secret
     manager — never committed (LAW-5.3). -->

| Variable | Purpose | Example |
|---|---|---|
| | | |

## Testing

<!-- How to run unit/integration/E2E; what the coverage floors are (LAW-3.2);
     test conventions (LAW-3.3/3.4). -->

## Deployment

<!-- Pipeline link; rollback procedure (LAW-9.2); infrastructure code location
     (LAW-9.1). -->

## Compliance

<!-- If regulated (LAW-8.3): link the compliance map. Business rules catalog
     location (LAW-8.2). -->
