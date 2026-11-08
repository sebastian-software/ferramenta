# ADR-0012: Monografie is the page system for engine homepages

- Status: accepted
- Date: 2026-11-07
- Updated: 2026-11-09 (documentation pages take Ardo's layout); 2026-11-07 (the family homepage adopts Monografie; documentation pages follow; the earlier entries are removed)
- Supersedes: ADR-0008, and ADR-0010 for the page system (its identity assets stay)

## Context

Two rounds of desktop comps for the Ferromark homepage explored ten
directions; only the chosen one is kept, in `design/comp/2026-11/monografie/`. The maintainer chose **Monografie**: the instrument centered
on open paper, one reading column that widens for specimens, notes in the
margins, and the navigation in the instrument's own steel. A second page,
Ferroni, was built on the same system to test whether it carries more than
one engine; it needed only its own specimens.

Monografie differs from the Ferra entry in three ways that ADR-0010 does not
cover: a serif face for headings, a rendered steel band as the navigation's
material, and small rust accents in the instruments' own patina.

## Decision

Add `ferramenta-family/monografie` and `ferramenta-family/monografie.css` as an
independent entry beside Ferra. Its `mono-` classes and `--mono-` tokens are
scoped to `.mono` (the page), `.mono-header` and `.mono-footer`, so the header
and footer can also stand on an engine's documentation pages. It reuses the
Ferra marks and instruments (`ferra-assets.css`) and nothing else from Ferra.

- **Type.** Reading text uses the visitor's system UI font. The brand speaks
  through Source Serif 4 Subhead, bundled unmodified under the SIL Open Font
  License (Semibold for headings and the product name, Italic for the second
  headline line and the colophon). Code uses the system monospace stack. No
  third-party font service is contacted.
- **Measure.** One reading column of 600px at 19px, under 80 characters a
  line, widening to 1040px for specimens and 1240px for full-width drawings.
  Margin notes stand beside their passage on wide screens and move into the
  text below 1181px.
- **Materials.** The navigation is a band of the hero instruments' brushed
  steel, rendered in Blender by `design/ferra/blender/surfaces.py`. Rust is an
  accent only: the same script renders a band of the instruments' iron-oxide
  patina, laid over the oxide color on the primary action and on the engine's
  own bar in a comparison chart. Nothing else is textured.
- **Evidence.** Every demo shows real output of the published package, and a
  comparison names the two to four best-known alternatives with a link to the
  full field. No annotation arrows, numbered balloons or invented mappings.
- **Responsiveness.** The links fold into a menu below 961px; paired
  specimens stack; on phones the chart puts each name above its bar.

The package owns the page structure (header, opening, sections, passages with
notes, facing sheets, terms, proofs, cards, the comparison chart, closing and
footer) and its assets. Engine sites own their specimens and the scripts that
produce the real output they show. The kit shows every part at `/kit/monografie/`
with the invented sample tool.

## Consequences

- Engine sites adopt Monografie in their own repositories, homepage first;
  their documentation pages may keep the Ferra reading layout under the
  Monografie header.
- The family homepage adopts Monografie too (amendment below).
- Surface masters and their construction live in `design/ferra/`;
  `design/ferra/build-monografie.mjs` exports them with provenance and checks
  the font hashes. A test verifies every file the stylesheet points at.

## Amendment 2026-11-07: the family homepage

ferramenta.dev moves to Monografie as well, so the family and its members share
one look. It is an overview, not an engine page, so it uses three parts the
package adds for it: `MonoEngineCatalog` (every engine on its own plate, in
editorial order, with live release facts, relations and the registry's notes),
`MonoApplications` (each application on a light card under its own logo, in its
own colors) and `MonoWorkshop` (the workshop's two brands, unchanged). All three
read the registry. The family site's header leaves out the link back to the
family (`familyHref={null}`), and its footer says what the family is instead of
"part of Ferramenta". The family site keeps its rules: results stay qualitative,
members stay independent, foreign logos stay on a light ground. The kits
(`/kit`, `/kit/ferra/`) keep their own looks.

## Amendment 2026-11-07: documentation pages

The engines' documentation pages move to Monografie too, so a visitor reads one
system from the homepage into the guides; Monografie's header already stood on
them over the Ferra reading layout. The entry adds a reading layout (the host's
section rail and page list on the left, one prose column of 680px at 18px in
the system UI font with serif headings, the page outline on the right; the
sticky panels clear the 60px header) and a Monografie counterpart for every
Ferra component the sites' documentation uses, with the same props, so a site
moves by renaming. Two stylesheets carry it: `monografie-docs.css` for the
layout and its parts, and `monografie-ardo.css` for Ardo (its tokens, its
highlighted code on the light sheet, outline, search and mobile menu, and the
shell fixes every site repeated). Code, examples and diagrams stand on light
sheets; the rail and the page list are quiet lists held by hairlines; rust stays
on the primary action and the engine's own bar. The kit shows a sample page at
`/kit/monografie/docs/`.

This supersedes the consequence above that documentation pages may keep the
Ferra reading layout. Once no site uses them, the Ferra entry
(`ferramenta-family/ferra`, `ferra.css`, `ferra-ardo.css`) and the original
entry (the landing kit, the chrome, `docs.css`) are to be removed, with their
kit pages; this change keeps them.

## Amendment 2026-11-07: the earlier entries are removed

All nine engine sites and ferramenta.dev render only Monografie, and they pin
the package by commit, so the two earlier visual systems go, as the amendment
above announced. Package 3.0 removes:

- **The original entry** (ADR-0008, ADR-0009): the chrome (`SiteHeader`,
  `SiteFooter`, `ToolSwitcher`, `SiteMenu`), the landing kit (`ProjectHero`,
  `Plate`, `EngineCatalog`, `ApplicationsBand`, `Principles`,
  `ComparisonTable`, `ComparisonBars`, `Measured`, `Relations`, `Voices`,
  `Ledger`, `WorkWithUs` and the rest), `Icon`, the stylesheets `tokens.css`,
  `fonts.css`, `theme.css`, `landing.css`, `chrome.css` and `docs.css`, the
  Barlow Condensed faces, the member icons and the steel, oak and rust
  textures, with their pipelines in `design/icons/` and `design/textures/`.
- **The Ferra entry** (ADR-0010): `ferramenta-family/ferra`, `ferra.css`,
  `ferra-ardo.css`, `ferra-tokens.css`, `ferra-fonts.css`, every `Ferra*`
  component, the IBM Plex face, the paper and pewter textures, the exported
  token file, and the native page designs in `designs/` with their generator.

What stays: the registry and its live facts (`RegistryFacts`, `useToolFacts`),
the line-icon sprite (`Mark`, `MarkDefs`), the README frames, and the identity
assets Monografie shows — every member's mark, instrument and favicon, the
workshop's logos, the applications' logos, the steel and rust bands and Source
Serif 4 Subhead — with `ferra-assets.css` and the `design/ferra/` pipeline that
makes them. Their class names (`ferra-mark`, `ferra-instrument`,
`ferra-workshop-logo`) and the `ferra-assets/*` export keep their names, so no
site's favicon import changes.

`ferramenta-family/monografie` now also exports `Mark`, `MarkDefs`,
`RegistryFacts`, `useToolFacts`, the members with an identity and the
comparison types, so a site imports from one entry; the root entry keeps
exporting the registry, its facts, the sprite and those types. The kit at
`/kit/` is the Monografie kit: the homepage parts, and a documentation sample
at `/kit/docs/` in an engine site's shell. The Typenschild comps are in Git
history.

## Amendment 2026-11-09: documentation pages take Ardo's layout

The engines are documented with Ardo, and Ardo already has a documentation
layout that readers of other Ardo sites know: the sidebar on the window's left
edge with one tab per section turned along its outer edge, the outline on the
right edge, and the article centered between them. `MonoArdoSite`
(`ferramenta-family/ardo`) now renders that layout on documentation pages
instead of Monografie's centered reading layout, and the header spans the
window above it. Monografie keeps the look: its tokens, the prose at 18px in a
680px measure with serif headings, code on light sheets, the steel header and
the footer. Homepages are unchanged; they have no sidebar or outline, and their
free, magazine-like layout already has no hard frame for the full width to
break.

Below 1025px, where Ardo folds its sidebar away, Ardo's menu carries the
header's links, the section tabs (lying flat) and the pages; the Monografie
menu steps aside so the header keeps one row.

This supersedes the reading layout and section rail in the amendment on
documentation pages above for the engine sites. `MonoReadingLayout`,
`MonoSectionRail` and `MonoGuideNavigation` stay exported for now.
