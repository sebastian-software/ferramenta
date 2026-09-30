# ADR-0008: Design direction "Typenschild", one authored scheme, the plate as the one prop

- Status: accepted
- Date: 2026-09-30
- Deciders: Sebastian Werner
- Supersedes: ADR-0005 (and with it the direction of ADR-0003)

## Context

The "Schmiede" direction (ADR-0003, extended by ADR-0005) gave the family a
recognizable world, but the site built from it was judged to have too little
pull and to look less professional than the engines deserve. The challenge was
named at the start of the redesign: robust, rusty and hard, and at the same time
professional and trustworthy.

The brief kept the identity (iron, rust, metal, serious craft) and put
everything else up for change, including structure and copy. Three direction
comps were built for it (`design/comp/2026-10/`):

1. "Typenschild": every machine carries a data plate that says what it is.
2. "Corten": weathering steel as the ground, lettering cut into it.
3. "Schattenwand": a workshop shadow board.

None was accepted as drawn. The shadow board worked least; lettering on a rust
field was rejected outright; text directly on a bright steel texture was not
legible. The plate metaphor and the steel texture held. Two rounds of review
turned direction 1 into what this record decides: quieter, on a dark ground
instead of a bright one, with the structure of each page changed so that a
stranger first learns what a thing is.

The first build put the plates on black steel and used cool blue-grey neutrals
throughout. Reviewed beside the icons, that was two palettes: rust-orange
objects on a ground that had nothing to do with them. The greys were warmed and
the dark ground became wood, the bench a plate lies on.

## Decision

The family speaks direction **"Typenschild"** (German for a machine's data
plate; a proper name, like "Schmiede" before it).

**One authored scheme.** A family landing page is light, with deliberately dark
passages. It does not change with the visitor's theme and offers no theme
toggle. Documentation is different: long reading at night is a real need, so a
docs page follows the system or the host's explicit choice. The chrome is dark
iron in both: flat, without a texture.

**Two ramps.** Every color is a step of one of two ramps, named the way
Tailwind names them: `iron-50` to `iron-950`, the warm grey of blackened steel,
and `rust-100` to `rust-900`. A component takes a role (`--bg`, `--ink`,
`--rust`, `--steel`, `--inlay`, …), and every role is a step. The greys are
warm because the icons are.

**Three materials, each with one job.** Everything else is flat.

- _Brushed steel_ is the plate: a riveted sheet that says what a thing is and
  carries the action. It is the family's one prop. Small plates repeat it where
  a thing is named or measured: a catalog row, an evidence figure, the tiles
  under the icons in the chrome.
- _Dark oak_ is the bench the plates lie on: the ground of the first viewport
  and of a page's dark bands. It is smoked almost to black, so its grain is
  there at a second look and light text holds on it.
- _Rust_ appears once per page, as the band it closes on. It is dark and
  oxidized, never a saturated orange field, and carries no display lettering
  tricks: plain light type only.

**Legibility on material.** Text on steel is solid and dark. Small type never
sits on the texture itself: measured facts go on a dark inlay or on the tag that
hangs below the plate. One light moves across every plate with the pointer; it
stands still for a visitor who asked for reduced motion.

**Say what it is first.** This is a rule for structure, not only for copy. A
hero plate carries the name, what the thing is in one plain phrase, what it
does, and the action. Where it comes from and what it is checked against come
second: on the hanging tag, or last and quiet in a catalog row. The registry
follows the same order (`what`, `does`, `audience`, then `proof` and
`evidence`). ADR-0004's register still governs how lineage is worded.

**Type.** Barlow Condensed (SIL OFL 1.1, self-hosted) letters everything a
plate would carry: names, headings, labels. Reading text stays in the system
face, code in the system mono.

**Form.** Corners stay sharp. The only round things are the ones that are round
in the world: rivets and the links of the tag's chain.

**The family page's order.** Hero (what the family is) → the engine catalog →
the applications band → what every engine is held to → the personal note, with
the workshop's two names under it → "Work with us". The pipeline diagram, the
subfamily groups, the job index and the download tally are gone: the engines
are independent, and a diagram that draws them as a chain says the opposite.
Where two members fit together, the row says so in a sentence (`uses`,
`pairsWith`, `runsOn` in the registry). The engines carry no maturity stamp on
this page: the live release beside each one says how far it has come.

**Foreign brands.** The applications (Palamedes, Dalo) and the workshop's two
names (Sebastian Software, Sebastian Consulting) are not the family's, and
their logos are kept because recognition matters more than a seamless surface.
A foreign logo always stands on a light ground, in its own colors: it was drawn
for one, and on steel, oak or rust it either vanishes or fights the
material. An application's card is therefore a light card, with its brand color
only in the rule above it and in its action.

**What the page is for.** Most visitors arrive from a tool's site and want the
overview. The page should lead them to Palamedes, the product the engines carry,
or to the workshop's consulting. So the shared footer carries the applications
and a "Work with us" column onto every family site, and a family page closes on
one action to the consulting site. There is no form.

**The kit.** The design library is part of the site, at `/kit`: every token,
material, icon and component rendered from the package itself, plus a sample
tool page and sample documentation for an invented member. It is public and
marked `noindex`. There is no Storybook.

## Decision drivers

- More pull and more trust at once: material gives the pull, restraint and
  plain language give the trust.
- A stranger has to understand what a thing is before its pedigree means
  anything. The earlier pages led with succession ("Oniguruma, continued") and
  lost readers who did not know the original.
- Legibility beats texture every time the two meet.
- The family's sites have to look like one workshop without each page being
  built twice: the look lives in the package, and a page is its components
  stacked.

## Considered options

### Chosen: "Typenschild", quiet, its plates on a dark oak bench

### Rejected: black steel as the dark ground, cool neutrals

The first build. Blue-grey next to rust-orange icons read as two palettes. Warm
greys alone, without wood, and a pale oak as the light ground were shown beside
the chosen variant and set aside.

### Rejected: "Corten"

A rust ground is tiring at page size, and lettering cut into rust was judged
unacceptable.

### Rejected: "Schattenwand"

The shadow board read as decoration around the content, not as the content's
own form.

### Rejected: keeping a light and a dark theme for landing pages

Two schemes meant every material had to work twice, and neither was tuned. One
authored scheme can alternate light and dark on purpose instead.

### Rejected: Storybook for the component library

A second toolchain to maintain for a package with one kit. The kit page uses
the site's own stack and shows the components in their real surroundings.

## Consequences

- `ferramenta-family` 2.0 is a breaking release: the registry's groups, the
  pipeline constants, the pegboard, the tool ledger, the job index, the
  pipeline assembly and the fasteners are removed; the plate, the engine
  catalog, the applications band, the principles and the work-with-us band
  replace them; `ProjectHero` takes `what`, `icon` and `facts`. Sibling sites
  migrate one by one, Ferroni first.
- Icons are no longer symbols in the sprite (ADR-0009). The sprite keeps the
  line icons.
- The package ships `icons/` and `textures/` beside `fonts/`, and an optional
  `docs.css` for an Ardo documentation layout inside the family chrome.
- A new material, or a second prop, needs another decision record. A dark
  band directly under the hero is allowed but heavy; the kit parts the
  two with a hairline, and a page is better served by a light section there.
- The 28px board geometry of ADR-0003 is retired with the pegboard.

## Validation and review triggers

Reopen if the plate spreads to surfaces that name nothing (a plate as a generic
card), if a sibling's migration shows the kit cannot carry a real tool's page,
or if documentation in the dark scheme proves the chrome and the docs theme do
not sit together.

## References

- [DESIGN.md](../../DESIGN.md) — the system this direction produced
- [design/comp/2026-10/](../../design/comp/2026-10/) — the three direction comps;
  `typenschild-home.html` and `typenschild-tool.html` are the approved ones
- [ADR-0009](0009-generated-member-icons.md) — the icons
- [ADR-0001, amendment of 2026-09-30](0001-decentralized-homepages-with-shared-family-package.md#amendment-2026-09-30) — the two tiers
- [ADR-0003](0003-design-direction-schmiede.md), [ADR-0005](0005-functional-hardware-material-boundary.md) — the direction this one replaces
