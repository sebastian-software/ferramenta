# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers evaluating Rust-native infrastructure and focused applications — maintainers of web tooling, build pipelines, i18n workflows, documentation systems, agent-skill catalogs, or local-first transcription. They arrive from GitHub, registries, a project site, or word of mouth, and decide quickly whether a tool is credible, useful, and maintained. Secondary audience: contributors and the broader Rust/web-tooling community.

Second user of this repository: the maintainers of sibling project sites — people and coding agents — who may consume `ferramenta-family`. Their job is to build a project homepage and docs site with its own identity and layout, optionally reusing the family's chrome or landing components. For them the package's API stability, namespacing, and documentation are the product.

## Product Purpose

ferramenta.dev is the family site for a curated set of Ferramenta tools (Italian for "hardware store"): the overview page that presents each member at equal rank, carries the shared philosophy, and links out to each project's own site or repository. Each project owns its identity, design, and layout. The shared package `ferramenta-family` offers optional chrome and landing components; it does not prescribe a common site design.

## Positioning

A curated workshop of Rust-native engines and focused applications, aligned with the current ecosystem movement — oriented on open standards (CommonMark, PO files, ICU MessageFormat, Hunspell, TextMate grammars, …). Engines include successors that match an established implementation functionally and aim to beat it on performance, proven differentially against that implementation (Oniguruma, Shiki and Hunspell oracles), and new developments that build directly on open standards. Selected standalone applications belong when their product approach fits the workshop; shared ownership alone is not enough. All earn trust in the open.

## Operating Context

- Family registry (all named equally; subfamilies exist). Ten members as of 2026-09-25: seven engines and three applications. The registry (`packages/family/src/family.ts`) is the source of truth for jobs, status, lineage, marks, and links; versions and download counts are fetched live at build time (ADR-0006), so this file names no versions.
  - Content pipeline, in chain order: **ferroni** (Oniguruma, continued in Rust after the C project ended in April 2025) → **ferriki** (Shiki-compatible syntax highlighting) → **ferromark** (CommonMark/GFM Markdown to HTML).
  - Language: **ferrolex** (Hunspell-compatible spell checking), **ferrocat** (translation catalog engine: PO/ICU MessageFormat), and **palamedes** — i18n for TypeScript apps, built on ferrocat, ferromark, and ferralk.
  - Workbench: **ferralk** (glob matching and parallel filesystem walking, checked against a frozen zlob reference), **ferrugo** (PDF previews for untrusted files), **dalo** (team agent skills, versioned and synced as code), and **cuttledoc** (local-first speech transcription).
- Kind of member (ADR-0004): successors are ferroni (Oniguruma), ferriki (Shiki) and ferrolex (Hunspell); new developments are ferrocat, ferralk, ferromark (v2 builds on ox-content; no non-Rust predecessor), and ferrugo. Palamedes runs on ferrocat, ferromark, and ferralk; Dalo and Cuttledoc are standalone applications with no family-engine dependency. The registry records lineage as `succeeds`, `buildsOn`, or `runsOn` (empty for a standalone app).
- Maturity is the registry's hand-set `status`; the stamp legend says what each level means. Keep it in step with releases (ferromark is stable since v2).
- Membership rule (ADR-0001): selected standalone Rust-native applications can join when their product approach fits the workshop; common ownership alone is insufficient. Dalo and Cuttledoc are listed for their focused jobs, with outbound links from the family overview.
- Project sites live with their projects and choose their own stack, visual system, and layout. ferramenta.dev and ferrocat.dev use their own domains; other project sites may use GitHub Pages.
- This repo holds the family overview site plus the shared package `ferramenta-family`: reusable tokens and components (header, switcher, footer, marks, family registry, and an optional landing kit), custom logo SVGs, and a bundled display font. Sibling sites opt into package parts as useful.

## Capabilities and Constraints

- The family site is English-only for now; Ardo site localization remains experimental.
- This family site is statically prerendered with Ardo (`ssr: false, prerender: true`) and hosted on GitHub Pages.
- Sibling sites remain independently maintained; adoption of shared package components is optional. The family page links to each member's own homepage or repository.
- Streamline Sharp icons (Pro license) may accompany marketing content: shared chrome icons may live in the central package; page-specific icons stay in each project repo (< 100 per project, mandatory attribution + Streamline ownership carve-out in LICENSE; those SVGs are not MIT). Project logos are never built from Streamline. `lucide-react` is to be removed: the package's line icons (arrow, chevron, GitHub, crate, adapter, external, package) cover the family home pages.

## Brand Commitments

- Light & clean base with rust/terracotta accent; ember-glow gradient reserved for hero moments; full dark mode. (User-pinned.)
- Angular form language throughout ("sharp" aesthetic: hard corners, square caps, miter joins).
- Typography: system-ui for body and docs text; a bold, industrial display face for headlines — Big Shoulders, chosen in the direction drafts; system mono stack for code. Only the display face is bundled.
- One mark per member, metalwork metaphor, all derived from Streamline (Duotone set, Ultimate as motif source) under the license limits of ADR-0002: ferramenta = toolbox, ferroni = anvil and hammer, ferriki = flame, ferromark = stamp, ferrolex = corner ruler, ferrocat = drawer cabinet, ferrugo = welding helmet. The ferralk (horseshoe magnet) and palamedes (type slugs in a composing stick) marks were drawn in-house and are to be replaced by Streamline-derived marks; sourcing needs the Streamline account. Dalo and Cuttledoc use the Ferramenta mark until individual marks are approved.
- The family overview uses project marks with lowercase names; individual sites own their logo and wordmark treatment.
- Shared header and project switcher are optional package components; each site decides whether they fit its design.
- Overview page: every member listed equally, grouped by subfamily; applications are marked as such, not ranked; the philosophy section carries the positioning above and links lead outward to project sites or repositories.

## Evidence on Hand

- Results are welcome on the family site, figures are not. Speed and rigor are part of why the family exists, so the site may say a tool is among the fastest, ahead of a named alternative, or backed by a larger test suite — whenever that is true. It never repeats a speed-up factor, timing, percentage or test count: that precision goes stale here and belongs to each tool's repository and site, next to its setup.
- Live registry figures: versions and download counts are fetched at every deploy (and nightly), then updated in the visitor's browser straight from crates.io and npm; the family-wide download total is summed live. Registry figures are not replicated results — they come from the registry at the moment they are shown.
- Assets: the mark sprite (`packages/family/src/mark-defs.ts`), the bundled Big Shoulders font, the brand logos (`app/assets/brand/`), the Sebastian Software and Sebastian Consulting wordmarks (`app/assets/logos/`), the social card (`public/social.png`), and the approved comp (`design/comp/`).
- Absent, and never to be invented: stars, user counts, customer logos, testimonials, press. The family is young; there is no social proof.

## Product Principles

1. Prove, don't claim: a successor matches its original functionally and aims to beat it on performance, checked differentially; a new development holds itself to the standards it builds on. The proof lives with each tool.
2. Open standards over proprietary formats; keep the APIs the ecosystem already knows.
3. Every member is named equally; subfamilies explain relationships, not hierarchy. Adoption follows each project's use case and dependencies, not a required family-wide chain.
4. Design first, extraction second: the shared package ships finished components, not just tokens.
5. Content lives near the code: each site in its project's repo, updated with releases.

## Accessibility & Inclusion

WCAG-conscious defaults: contrast ≥ 4.5:1 for text in both themes, keyboard-reachable navigation, reduced-motion respected. No stricter formal requirement established.
