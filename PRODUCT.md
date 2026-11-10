# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers evaluating Rust-native infrastructure: maintainers of web tooling, build pipelines, i18n workflows, and documentation systems. Most arrive from one tool's own site, its repository, or a registry, and want the overview: what else is here, and who makes it. Many do not know the history of the field a tool works in. They decide quickly whether a tool is credible, useful, and maintained. Secondary audience: contributors and the broader Rust and web-tooling community.

Second user of this repository: the maintainers of sibling project sites — people and coding agents — who consume `ferramenta-family`. Their job is to build a project's home page and documentation in the family's look from the package's components. For them the package's API stability, namespacing, documentation, and the kit at `/kit` are the product.

## Product Purpose

ferramenta.dev is the family site for the Ferramenta engines (Italian for "hardware store"). It says what the family is, presents each engine as what it is, what it does and for whom, shows the applications the engines carry, and offers the workshop's help. It links out to each project's own site or repository.

What the page should lead to, in this order: a visit to Palamedes, the product built on the engines, or an inquiry to Sebastian Consulting. There is one action to the consulting site and no form.

The shared package `ferramenta-family` gives every engine's site the same look: Monografie, its page system for homepages and documentation, with each member's mark and instrument and the heading face. The applications keep a brand of their own.

The family homepage, every engine homepage and the engines' documentation use
Monografie on Ardo 6 (ADR-0012). The kit at `/kit/` shows every part of it with
an invented tool.

The opening names Sebastian Software GmbH and links its open-source portfolio. It explains why the workshop chooses Rust, how compatibility is checked and why each engine can be adopted independently.

The family overview uses light soft cards, a single ungrouped engine contents
list, and image-first product articles with related workshop and architecture
notes. Each engine has one adjacent card with two sourced aspects; its version and downloads sit in an attached footer. The workshop introduction sits beside the opening paragraph, and applications have individual cards under an unframed section heading. The canonical registry owns editorial descriptions and source links as
well as tool facts. Releases and labeled crate-download totals remain live;
unpublished engines say so without showing a development version or downloads.
The sidebar becomes a keyboard-operable disclosure on small screens; related
notes follow their articles in reading order.

## Positioning

A workshop's family of Rust-native engines, each built to the standard its field already agreed on (CommonMark, PO files, ICU MessageFormat, Hunspell dictionaries, TextMate grammars, ISO 32000). Much of this infrastructure was written decades ago, in C or across several languages; most of the family is its next generation. Successors match an established implementation and are proven against it differentially (Oniguruma, Shiki and Hunspell oracles); new developments hold themselves to the standards they build on. All earn trust in the open.

## Operating Context

- The registry (`packages/family/src/family.ts`) is the source of truth for names, jobs, what each member is and does, lineage, status, relations, and links. Versions and download counts are fetched live (ADR-0006), so this file names no versions.
- Two tiers (ADR-0001, amendment of 2026-09-30). Thirteen members as of 2026-11-10.
  - **Engines**, ten: **ferroni** (a regex engine; continues Oniguruma, whose C project ended in April 2025), **ferriki** (a syntax highlighter; Shiki-compatible), **ferromark** (a Markdown renderer; CommonMark and GFM), **ferrolex** (a spell checker; reads Hunspell dictionaries), **ferrocat** (a translation catalog engine; PO and ICU MessageFormat), **ferralk** (a glob matcher and file walker; checked against a frozen zlob reference), **ferrugo** (a PDF preview renderer for untrusted files), **ferrolink** (a static-build link checker), **ferrigura** (a Mermaid-to-SVG diagram renderer without a browser), **ferrixel** (an experimental, unpublished SDR image pipeline and codec workspace).
  - **Applications**, three: **palamedes** (i18n for TypeScript apps; runs on ferrocat, ferromark and ferralk), **dalo** (team agent skills, versioned and synced as code; standalone), and **ardo** (React documentation sites; runs on ferromark, ferriki and ferrolink). They carry their own brand; the family shows them in one band, each on a light card under its own logo.
- The engines are independent. Relations are facts in the registry: ferriki uses ferroni; ferriki and ferromark pair (no dependency either way); palamedes runs on three engines. Ferrolink uses Ferralk and Ferroni. Ardo runs on Ferromark, Ferriki and Ferrolink. No surface shows the members as a chain.
- Kind of member (ADR-0004): successors are ferroni (Oniguruma), ferriki (Shiki), ferrolex (Hunspell) and ferrigura (Mermaid); new developments are ferrocat, ferralk, ferromark (v2 builds on ox-content; no non-Rust predecessor), ferrugo, ferrolink and ferrixel. The registry records lineage as `succeeds`, `buildsOn`, or `runsOn` (empty for a standalone application).
- Maturity is the registry's hand-set `status`, shown beside each engine's name. Publication is separate: an engine with no verified public release carries `unpublished: true`, shows “Release: Unpublished” and skips registry metrics. Remove that flag only after verifying its first public release; a development version is not a release.
- The workshop's two names, Sebastian Software and Sebastian Consulting, appear on the family page with their own logos: recognition matters more than a seamless surface. Every foreign logo (theirs, and the applications') stands on a light ground in its own colors, never on steel or rust.
- The legal entity is Sebastian Software GmbH, Mainz, Germany. Every footer carries its copyright line and links the imprint and privacy policy on the company site; the family sites host neither page themselves.
- Project sites live with their projects. The engines' sites take the family look from the package, one by one, Ferroni first; until a site has migrated it runs the 1.x package. Each application's site is its own.
- This repo holds the family site, the kit (`/kit`), and the shared package.

## Capabilities and Constraints

- The family site is English-only for now; Ardo site localization remains experimental.
- The site is statically prerendered with Ardo and hosted on GitHub Pages. Documentation on sibling sites uses Monografie's reading layout inside Ardo; Ardo keeps routing, search, the outline and the highlighted code.
- Monografie has one authored light scheme and no theme toggle, on homepages and documentation alike (ADR-0012).
- Each member's mark and instrument are rendered for this family and are its own (ADR-0010). A new member needs its masters in `design/ferra/` before it joins the catalog.
- The kit is public and `noindex`. Its sample pages are about an invented tool, so they repeat no real member's facts or figures.
- Ardo 6 supplies its own Core icons; `lucide-react` is no longer a dependency. The package's line icons (arrow, chevron, GitHub, crate, adapter, external, package, document, pen) cover the family's pages and the documentation navigation.

## Brand Commitments

- Iron, rust, metal, serious craft: robust and hard, and at the same time professional and trustworthy. Restraint carries the second half. Nothing is "in your face".
- A light ground in warm greys with deliberately dark passages. The greys are those of blackened steel, warm enough to stand beside rust; a cool blue-grey is not the family's. Rust is the one color, dark and oxidized, never a saturated orange field. (User-pinned.)
- Open paper, one reading column and notes in the margins (ADR-0012). The navigation is a band of the instruments' own brushed steel; rust is an accent only, on the primary action and the engine's own bar in a comparison. Nothing else is textured.
- Typography: system-ui for reading text; Source Serif 4 Subhead for headings, the product name and the colophon; system mono for code. Only the heading face is bundled.
- One instrument per member, a machined steel object that shows the engine's work, with a compact mark for the header, the footer and the favicon. Each is a rendered picture.
- Say what it is first. Every surface names the thing in plain words before its lineage.
- Members are independent. Copy never implies an entry point or a required chain.

## Evidence on Hand

- Results are welcome on the family site, figures are not. The site may say a tool is among the fastest, ahead of a named alternative, or backed by a larger test suite — whenever that is true. It never repeats a speed-up factor, timing, percentage or test count: that precision goes stale here and belongs to each tool's repository and site, next to its setup.
- Live registry figures: versions are fetched at every deploy (and nightly), then updated in the visitor's browser. They come from the registry at the moment they are shown.
- Assets: the members' marks, instruments and surfaces with their masters (`packages/family/ferra/`, `design/ferra/`), the bundled Source Serif 4 Subhead faces, the brand mark (`app/assets/brand/`), the social card (`public/social.png`), and the Monografie comp (`design/comp/2026-11/monografie/`).
- The personal layer: the origin story (qooxdoo heritage, giving back) and a signed note are on the family site.
- Outside voices on the material, where a page quotes them: what people the field listens to have said about building with Rust, quoted verbatim, short, attributed and linked to the source. They speak about Rust, never about the family.
- Absent, and never to be invented: stars, user counts, customer logos, testimonials, press. The family is young; there is no social proof.

## Product Principles

1. Say what it is first: a stranger understands the thing before its pedigree.
2. Prove, don't claim: a successor matches its original and is checked against it differentially; a new development holds itself to the standards it builds on. The proof lives with each tool.
3. Open standards over proprietary formats; keep the APIs the ecosystem already knows.
4. Engines first, applications beside them: the family is about the engines; the applications show them at work and keep their own brand.
5. Every engine stands alone. Adoption follows each project's use case, not a required family-wide chain.
6. Design first, extraction second: the shared package ships finished components, not just tokens, and the kit shows every one of them.
7. Content lives near the code: each site in its project's repo, updated with releases.

## Accessibility & Inclusion

WCAG-conscious defaults: contrast ≥ 4.5:1 for text on every surface, highlighted code lines included; keyboard-reachable navigation and scrolling regions; reduced motion respected (the chart's bars are set at once). No stricter formal requirement established.
