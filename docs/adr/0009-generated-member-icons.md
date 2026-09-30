# ADR-0009: Member icons are generated objects, in a rendered and a flat form

- Status: accepted
- Date: 2026-09-30
- Deciders: Sebastian Werner
- Supersedes: ADR-0002

## Context

The family's marks were duotone icons derived from Streamline (ADR-0002). They
were drawn for 24 pixels. The "Typenschild" direction (ADR-0008) shows each
member's mark large, on its plate, and at that size the duotone icons did not
carry enough detail. Making them smaller would have taken the plate's center
away.

Two treatments were tried and set aside before the chosen one: the motif as a
relief stamped into steel (too little color, and unreadable as a header icon or
a favicon), and an enamel badge. What held was the object itself, rendered.

## Decision

Each member has **one object in two forms**, both made for this family:

- The **rendered** form is a realistic miniature of the object in forged
  blackened steel, with a single rust-orange or glowing element. It goes on a
  plate: the hero, a catalog row.
- The **flat** form is the same object in the same view and position, in a few
  solid colors without gradients or textures. It takes every small place: the
  header, the switcher, a list, a favicon, a README. A traced SVG ships beside
  a small raster of it.

Every flat icon is drawn from one shared palette of sixteen colors
(`packages/family/icons/palette.json`). Its greys take their hue from the
rendered steel, so the flat icons keep its warmth.

The objects: ferramenta, a toolbox · ferroni, an anvil with a hammer · ferriki,
a flame in a fire pot · ferromark, a hand stamp · ferrolex, letterpress type ·
ferrocat, a drawer cabinet · ferralk, a sieve · ferrugo, a welding helmet. The
applications keep their own logos (ADR-0001).

The icons are generated with an image model from written prompts, the first one
from text alone and the others with it attached as the style reference. None was
made from a Streamline file. The masters, the prompts and the scripts that turn
masters into the shipped files live in `design/icons/`.

The flat form holds from 24 pixels up. Nothing in the family shows a member's
icon smaller; at 16 pixels every one of these objects is a smudge.

## Decision drivers

- A plate needs an object with presence; a line icon enlarged is an empty
  plate.
- The same motif has to work at 24 pixels and at 300, which one drawing cannot
  do. Two forms of one object can.
- One palette keeps eight flat icons a set and makes a ninth one fit.
- The icons are the family's own, with no third-party terms attached.

## Consequences

- The package no longer ships Streamline-derived assets. Its `NOTICE.md` covers
  the font only. The repository still holds Streamline material in the
  historical comps (`design/comp/entwurf-*.html`) and the archived shortlist
  (`design/archive/icon-candidates/`); `THIRD-PARTY-NOTICES.md` keeps the terms
  for those paths.
- Icons are files (`icons/<name>.webp`, `-256.webp`, `-flat.webp`, `-flat.svg`)
  placed by `chrome.css` as background images; the `Icon` component renders
  them. The sprite (`mark-defs.ts`) keeps only the chrome's own line icons.
- A new member needs a rendered master and a flat master before it can join the
  catalog; `design/icons/README.md` has the procedure.
- The masters add about ten megabytes to the repository. They are the only
  source the shipped files can be rebuilt from.
- The site's brand mark (`app/assets/brand/`) is the family's flat toolbox; the
  path stays, because every sibling README loads it from `main`.

## Validation and review triggers

Reopen if a mark shall be registered as a trademark (generated imagery and
trademark registration need their own look), if the family needs an icon below
24 pixels, or if the set has to be redrawn by hand for consistency.

## References

- [design/icons/README.md](../../design/icons/README.md) — masters, prompts, pipeline
- [ADR-0008](0008-design-direction-typenschild.md) — the direction that needed them
- [ADR-0002](0002-streamline-derived-project-marks.md) — the marks these replace
