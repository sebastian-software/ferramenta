# ADR-0001: Decentralized project homepages with one shared family package

- Status: accepted
- Date: 2026-08-14
- Deciders: Sebastian Werner

## Context

The Ferramenta family spans eight repositories (ferramenta plus seven tools).
Every tool needs a homepage with an identical header, navigation, footer, and
visual language. ferrocat already runs its own Ardo docs site on ferrocat.dev;
ferromark carries a `homepage/` folder. An earlier attempt started with a shared
config package before any visual language existed and was judged "built the
wrong way around".

## Decision

Each project site lives in its own repository under `homepage/`, built on Ardo,
deployed to GitHub Pages (GitHub Pages URLs now; own `<tool>.dev` domains grow
over time — ferramenta.dev and ferrocat.dev exist). The ferramenta repository
hosts the family overview site plus the shared workspace package (today
`@ferramenta/ardo-config`, to be renamed `@ferramenta/family`), which ships
**finished components** (header with family switcher, footer, project marks)
plus tokens — not tokens alone. Sites consume it as a versioned npm dependency.
The family registry (`packages/ardo-config/src/family.ts`) is the single source
of truth for tool names, jobs, proofs, versions, status, and links.

Design work precedes extraction: the reference implementation on ferramenta.dev
defines the system; the package is extracted from it, never the other way
around.

## Decision drivers

- Content (features, versions, examples) lives next to the code it describes
  and updates with releases.
- Versioned consumption avoids big-bang design rollouts across eight repos.
- Ardo's architecture treats custom header/footer components as a first-class
  extension point.
- The failed first attempt showed that extracting shared assets before the
  design exists produces the wrong abstractions.

## Considered options

### Chosen: per-repo sites + versioned shared package

Keeps repos autonomous, makes design updates explicit per repo, and matches the
existing precedent (ferrocat.dev, ferromark `homepage/`).

### Rejected: central monorepo hosting all homepages

Couples deployments, moves content away from the code it documents, and turns
every site change into a ferramenta-repo change.

## Consequences

- Design updates reach sibling repos only via version bumps — intentional, no
  silent drift, but rollout is manual per repo.
- Rollout order after extraction: ferrocat → ferromark → ferroni → ferriki →
  ferrolex; ferrovia and ferrugo follow when they leave early stage.
- Existing ferrocat.dev docs and the ferromark homepage are reskinned onto the
  shared base, not rewritten.

## Validation and review triggers

Revisit when a second, non-Ardo consumer of the shared assets appears (would
justify splitting brand assets from Ardo glue), or when per-repo version bumps
prove too costly in practice.

## References

- [PRODUCT.md](../../PRODUCT.md) — product truth including rollout plan
- [docs/superpowers/specs/2026-07-11-ardo-config-package-design.md](../superpowers/specs/2026-07-11-ardo-config-package-design.md) — earlier package rename decision
- [packages/ardo-config/src/family.ts](../../packages/ardo-config/src/family.ts) — the registry this ADR declares canonical
