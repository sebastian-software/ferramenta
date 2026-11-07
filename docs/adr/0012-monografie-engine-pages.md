# ADR-0012: Monografie is the page system for engine homepages

- Status: accepted
- Date: 2026-11-07
- Amends: ADR-0010 for engine homepages

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
- The family homepage stays on Ferra until a separate decision.
- Surface masters and their construction live in `design/ferra/`;
  `design/ferra/build-monografie.mjs` exports them with provenance and checks
  the font hashes. A test verifies every file the stylesheet points at.
