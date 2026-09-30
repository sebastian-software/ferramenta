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

The shared package `ferramenta-family` gives every engine's site the same look: chrome, landing kit, icons, tokens, textures and the display face. The applications keep a brand of their own.

## Positioning

A workshop's family of Rust-native engines, each built to the standard its field already agreed on (CommonMark, PO files, ICU MessageFormat, Hunspell dictionaries, TextMate grammars, ISO 32000). Much of this infrastructure was written decades ago, in C or across several languages; most of the family is its next generation. Successors match an established implementation and are proven against it differentially (Oniguruma, Shiki and Hunspell oracles); new developments hold themselves to the standards they build on. All earn trust in the open.

## Operating Context

- The registry (`packages/family/src/family.ts`) is the source of truth for names, jobs, what each member is and does, lineage, status, relations, and links. Versions and download counts are fetched live (ADR-0006), so this file names no versions.
- Two tiers (ADR-0001, amendment of 2026-09-30). Nine members as of 2026-09-30.
  - **Engines**, seven: **ferroni** (a regex engine; continues Oniguruma, whose C project ended in April 2025), **ferriki** (a syntax highlighter; Shiki-compatible), **ferromark** (a Markdown renderer; CommonMark and GFM), **ferrolex** (a spell checker; reads Hunspell dictionaries), **ferrocat** (a translation catalog engine; PO and ICU MessageFormat), **ferralk** (a glob matcher and file walker; checked against a frozen zlob reference), **ferrugo** (a PDF preview renderer for untrusted files).
  - **Applications**, two: **palamedes** (i18n for TypeScript apps; runs on ferrocat, ferromark and ferralk) and **dalo** (team agent skills, versioned and synced as code; standalone). They carry their own brand; the family shows them in one band, each on a light card under its own logo.
- The engines are independent. Relations are facts in the registry: ferriki uses ferroni; ferriki and ferromark pair (no dependency either way); palamedes runs on three engines. No surface shows the members as a chain.
- Kind of member (ADR-0004): successors are ferroni (Oniguruma), ferriki (Shiki) and ferrolex (Hunspell); new developments are ferrocat, ferralk, ferromark (v2 builds on ox-content; no non-Rust predecessor), and ferrugo. The registry records lineage as `succeeds`, `buildsOn`, or `runsOn` (empty for a standalone application).
- Maturity is the registry's hand-set `status`. The family page does not stamp it on the engines: the live release beside each one already says how far it has come. A project's own site may show it (`Stamp`, `StampKey`). Keep it in step with releases.
- The workshop's two names, Sebastian Software and Sebastian Consulting, appear on the family page with their own logos: recognition matters more than a seamless surface. Every foreign logo (theirs, and the applications') stands on a light ground, never on steel, black steel or rust.
- Project sites live with their projects. The engines' sites take the family look from the package, one by one, Ferroni first; until a site has migrated it runs the 1.x package. Each application's site is its own.
- This repo holds the family site, the kit (`/kit`), and the shared package.

## Capabilities and Constraints

- The family site is English-only for now; Ardo site localization remains experimental.
- The site is statically prerendered with Ardo and hosted on GitHub Pages. Documentation on sibling sites keeps Ardo's layout; the family adds its colors and chrome, nothing more.
- A landing page has one authored color scheme and no theme toggle (ADR-0008). Documentation follows the system scheme.
- Member icons are generated for this family and are its own (ADR-0009). A new member needs a rendered and a flat master before it joins the catalog. Icons are never shown below 24 pixels.
- The kit is public and `noindex`. Its sample pages are about an invented tool, so they repeat no real member's facts or figures.
- `lucide-react` is not used in our own UI (it remains an internal Ardo dependency); the package's line icons (arrow, chevron, GitHub, crate, adapter, external, package) cover the family's pages.

## Brand Commitments

- Iron, rust, metal, serious craft: robust and hard, and at the same time professional and trustworthy. Restraint carries the second half. Nothing is "in your face".
- A light, cool ground with deliberately dark passages in black steel. Rust is the one color, dark and oxidized, never a saturated orange field. (User-pinned.)
- Three materials, each with one job: brushed steel for the plate, black steel for the first viewport and the chrome, rust for the closing band. Everything else is flat.
- The plate is the one prop: a riveted steel sheet that says what a thing is. Its measured facts hang below it on a small tag.
- Sharp form throughout: hard corners, square caps, miter joins. Only rivets and chain links are round.
- Typography: system-ui for body and docs text; Barlow Condensed, the lettering of a data plate, for names, headings and labels; system mono for code. Only the display face is bundled.
- One object per member, in forged steel with a single rust-orange or glowing element: ferramenta = toolbox, ferroni = anvil and hammer, ferriki = flame in a fire pot, ferromark = hand stamp, ferrolex = letterpress type, ferrocat = drawer cabinet, ferralk = sieve, ferrugo = welding helmet. Each has a rendered form for plates and a flat twin for small places.
- Say what it is first. Every surface names the thing in plain words before its lineage.
- Members are independent. Copy never implies an entry point or a required chain.

## Evidence on Hand

- Results are welcome on the family site, figures are not. The site may say a tool is among the fastest, ahead of a named alternative, or backed by a larger test suite — whenever that is true. It never repeats a speed-up factor, timing, percentage or test count: that precision goes stale here and belongs to each tool's repository and site, next to its setup.
- Live registry figures: versions are fetched at every deploy (and nightly), then updated in the visitor's browser. They come from the registry at the moment they are shown.
- Assets: the member icons and their masters (`packages/family/icons/`, `design/icons/`), the textures (`packages/family/textures/`), the bundled Barlow Condensed weights, the brand mark (`app/assets/brand/`), the social card (`public/social.png`), and the approved comps (`design/comp/2026-10/`).
- The personal layer: the origin story (qooxdoo heritage, giving back) and a signed note are on the family site.
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

WCAG-conscious defaults: contrast ≥ 4.5:1 for text on every surface, including steel, black steel and rust; small type never on a texture; keyboard-reachable navigation; reduced motion respected (the plate's light and the tag's sway stand still). No stricter formal requirement established.
