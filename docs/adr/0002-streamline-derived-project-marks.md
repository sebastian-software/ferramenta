# ADR-0002: Project marks derived from Streamline icons, under license constraints

- Status: accepted
- Date: 2026-08-14
- Deciders: Sebastian Werner

## Context

Every tool carries a metalwork-metaphor mark (toolbox, anvil, flame, stamp,
corner ruler, drawer cabinet, carving chisel, welding helmet). Fully custom
first drafts read bulky and imprecise. Streamline (Pro license available)
offers the desired quality; license research established: OSS use is allowed
with ≤100 icons per project, mandatory attribution, and an ownership carve-out
(assets stay Streamline property, cannot be MIT-licensed); use in logos is
explicitly allowed but non-exclusive; redistributing a general-purpose icon
library is not allowed.

## Decision

Project marks are derived from Streamline icons (Duotone set for the marks,
Ultimate as motif source), recolored to the brand ramp and sharpened
(square caps/miter joins). Where a motif is missing, we draw our own in the
same grammar. UI chrome icons are line-style (1.5/24). The marks live in the
shared package for family use only — never marketed as a reusable icon
library. Page-specific marketing icons stay in each project repo. Every repo
that embeds Streamline-derived SVGs stays under 100 icons and carries the
attribution and carve-out notice; the SVG assets are excluded from the MIT
license. `lucide-react` is not used in our own UI (it remains an internal Ardo
dependency).

## Decision drivers

- Duotone (filled) marks stay legible at favicon sizes where line icons fail.
- The Sharp/Ultimate craftsmanship level was unreachable in-house at draft
  quality ("zu dick, zu wenig Detail, zu bulkig").
- License terms permit exactly this shape of use and forbid the general-library
  shape.

## Considered options

### Chosen: Streamline-derived, adapted, constrained

Best quality per effort; legally cleared; adaptation keeps the family voice.

### Rejected: fully custom set

First attempts showed the quality gap; revisit only if exclusivity becomes a
requirement.

### Rejected: Lucide for marks

Rounded grammar clashes with the angular world; generic motifs.

## Consequences

- The shared package and every consuming repo are not 100% MIT — LICENSE
  communication must carry the exception (THIRD-PARTY-NOTICES.md pattern).
- Marks are not exclusive; other Streamline customers may use the same base
  icons. Trademark ambitions would reopen this decision.
- Sourcing Pro assets requires the Streamline account (manual download or an
  instructed agent).

## Validation and review triggers

Reopen if Streamline changes license terms, if any repo approaches the 100-icon
limit, or if a mark shall be registered as a trademark.

## References

- [THIRD-PARTY-NOTICES.md](../../THIRD-PARTY-NOTICES.md)
- [DESIGN.md](../../DESIGN.md) — iconography rules
- License sources: streamlinehq.com premium license and license-tl;dr help pages
