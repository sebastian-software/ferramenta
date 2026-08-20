# ADR-0006: Registry facts are fetched at build time, not embedded as badges

- Status: accepted
- Date: 2026-08-20

## Context

Versions were hand-maintained in the family registry and went stale immediately:
ferralk shipped 0.1.2 and was at 0.5.2 on crates.io a day later, while the site
still advertised the old number. Download counts were missing entirely, although
they are the most concrete adoption signal a young family has (11,002 crates.io
downloads across the published crates at the time of writing). The site is
statically prerendered on GitHub Pages, so there is no server to ask at runtime.

## Decision

Published versions and download counts are fetched from crates.io and npm **at
build time** by `scripts/refresh-registry-stats.mjs`, written to the committed
file `app/data/registry-stats.json`, and baked into the prerendered page. A
nightly GitHub Actions job (`refresh-stats.yml`) re-runs the fetch and commits
only when a number actually moved; that push triggers the normal Pages deploy.

- The registry keeps a `version` field as a **fallback only**, so an offline or
  rate-limited build still renders a plausible page.
- Registry availability is derived, not declared: a crate on crates.io means a
  Rust core, an npm package means a TypeScript/Node adapter. Both are shown as
  icon-plus-label pairs (crate, adapter) in the page's own icon language; a tool
  with neither reads "git only".
- A reserved npm name is not an adapter. The fetch treats a package whose
  description matches `/reserved/i` as a placeholder (ferrugo today).
- Per-tool downloads appear as one more verifiable fact next to the evidence;
  the family total appears once in the closing section.

## Considered options

### Chosen: build-time fetch plus nightly refresh

Keeps the page static and private (no third-party requests for visitors), keeps
the numbers inside the site's own typography, and bounds staleness to one day.

### Rejected: shields.io badges

Zero code, but every visitor would load images from a third party, the badge
look breaks the stamp language the whole page is built on, and an outage would
leave holes in the ledger.

### Rejected: client-side fetch

Always current, but adds layout shift and a loading state to the page's core
credibility signal, fails without JavaScript, and exposes visitors to registry
endpoints.

## Consequences

- Numbers are at most ~24h old; a release is visible the next morning without
  anyone editing the registry.
- The repository gains one bot commit per day *at most*, and only when a number
  changed.
- Evidence strings must not repeat a version — the version is live now, the
  evidence text is not (fixed for ferrocat when this landed).
- Sibling project sites should run the same script rather than importing a
  frozen JSON from the shared package.

## Validation and review triggers

Revisit if the nightly commits become noise, if crates.io rate limits the job,
or when the first sibling site consumes the shared package and needs its own
fetch step.

## References

- [scripts/refresh-registry-stats.mjs](../../scripts/refresh-registry-stats.mjs)
- [.github/workflows/refresh-stats.yml](../../.github/workflows/refresh-stats.yml)
- [ADR-0004](0004-successor-copy-register.md) — only verifiable claims
