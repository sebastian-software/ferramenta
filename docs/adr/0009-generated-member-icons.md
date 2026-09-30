# ADR-0009: Member icons are generated objects, shown as rendered pictures

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

Each member has **one object**, made for this family: a realistic miniature in
forged blackened steel, with a single rust-orange or glowing element. It is
shown as the rendered picture everywhere, at three sizes:

- 640 pixels for a hero plate,
- 256 pixels for a catalog plate,
- 96 pixels for every small place: the header, the switcher, a list, a chip. It
  is shown there at 24 to 48 pixels.

The small icon stands directly on the dark iron of the chrome. A steel tile
under it was tried and dropped: the frame made the object smaller and put a
bright patch in the dark bar. The objects were rendered for the plate's steel,
so on the iron their blackened bodies lose their edge; the small file is
therefore built lit for the iron: its shadows lifted a step and a hair of light
laid around its silhouette (`design/icons/build-icons.sh`). The same file reads
on a light ground, so there is one small file, not two. The applications'
logos are foreign brands drawn for a light ground, so the switcher's
applications tier is light.

The objects: ferramenta, a toolbox · ferroni, an anvil with a hammer · ferriki,
a flame in a fire pot · ferromark, a hand stamp · ferrolex, letterpress type ·
ferrocat, a drawer cabinet · ferralk, a sieve · ferrugo, a welding helmet. The
applications keep their own logos (ADR-0001).

The icons are generated with an image model from written prompts, the first one
from text alone and the others with it attached as the style reference. None was
made from a Streamline file. The masters, the prompts and the script that turns
masters into the shipped files live in `design/icons/`.

Nothing in the family shows a member's icon below 24 pixels; at 16 pixels every
one of these objects is a smudge.

**No vector form, for now.** A flat twin of each object was built: a second
generated master, redrawn as an SVG of under 5 KB on a shared palette of
sixteen colors. It was dropped. At that size the redraws were too crude to
stand beside the rendered objects, they were a second look to keep in step with
the first, and the rendered picture holds at 24 pixels on its own. What this leaves open is a mark that
scales cleanly: the brand mark (`app/assets/brand/logo-*.svg`, the favicon
source and the image every sibling README loads) is the rendered toolbox in an
SVG frame, a picture and not a drawing. A vector mark, if one is wanted, starts
from a new drawing, not from the dropped redraws.

## Decision drivers

- A plate needs an object with presence; a line icon enlarged is an empty
  plate.
- One look per member. Two forms of one object are two things to draw, check
  and keep alike.
- The icons are the family's own, with no third-party terms attached.

## Consequences

- The package no longer ships Streamline-derived assets. Its `NOTICE.md` covers
  the font only. The repository still holds Streamline material in the
  historical comps (`design/comp/entwurf-*.html`) and the archived shortlist
  (`design/archive/icon-candidates/`); `THIRD-PARTY-NOTICES.md` keeps the terms
  for those paths.
- Icons are files (`icons/<name>.webp`, `-256.webp`, `-96.webp`) placed by
  `chrome.css` as background images; the `Icon` component renders them. The
  sprite (`mark-defs.ts`) keeps only the chrome's own line icons.
- A new member needs a rendered master before it can join the catalog;
  `design/icons/README.md` has the procedure.
- The masters add several megabytes to the repository. They are the only
  source the shipped files can be rebuilt from.
- The brand mark's path stays, because every sibling README loads it from
  `main`. It is a raster in an SVG frame, so it does not sharpen beyond its
  144 pixels.

## Validation and review triggers

Reopen if a mark shall be registered as a trademark (generated imagery and
trademark registration need their own look), if the family needs an icon below
24 pixels or a favicon that scales, or if the set has to be redrawn by hand for
consistency.

## References

- [design/icons/README.md](../../design/icons/README.md) — masters, prompts, pipeline
- [ADR-0008](0008-design-direction-typenschild.md) — the direction that needed them
- [ADR-0002](0002-streamline-derived-project-marks.md) — the marks these replace
