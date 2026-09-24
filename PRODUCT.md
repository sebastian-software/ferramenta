# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers evaluating and adopting Rust-native infrastructure tools — typically maintainers of web tooling, build pipelines, i18n workflows, or documentation systems. They arrive from GitHub, crates.io, npm, or word of mouth, and decide quickly whether a tool is credible, compatible, and maintained. Secondary audience: contributors and the broader Rust/web-tooling community.

Second user of this repository: the maintainers of the sibling project sites — people and coding agents — who consume `ferramenta-family`. Their job is to build a project homepage and docs site that belongs to the family without copying its patterns: pin the package, compose the chrome and the landing kit, and write only the project's own content. For them the package's API stability, namespacing, and documentation are the product.

## Product Purpose

ferramenta.dev is the family site for the Ferramenta tools (Italian for "hardware store"): the overview page that presents every family member as one equal-ranked family, carries the shared philosophy, and links out to each project's own homepage. It is also the home of the shared package `ferramenta-family` that gives every project site an identical header, navigation, footer, visual language, and the landing kit its home page is built from.

## Positioning

A massive build-out of critical software infrastructure in Rust, aligned with the current ecosystem movement — oriented on open standards (CommonMark, PO files, ICU MessageFormat, Hunspell, TextMate grammars, SVGO, …). The family has two kinds of member. Successors match an established implementation functionally and aim to beat it on performance, proven differentially against that implementation (Oniguruma, Shiki, Hunspell and SVGO oracles), not claimed. New developments have no predecessor to match; they build directly on open standards and earn trust the same way, in the open.

## Operating Context

- Family registry (all named equally; subfamilies exist). Nine members as of 2026-09: eight engines and one application. The registry (`packages/family/src/family.ts`) is the source of truth for jobs, status, and links; versions and download counts are fetched live at build time (ADR-0006), so this file names no versions.
  - Content pipeline, in chain order: **ferroni** (Oniguruma, continued in Rust after the C project ended in April 2025) → **ferriki** (Shiki-compatible syntax highlighting) → **ferromark** (CommonMark/GFM Markdown to HTML).
  - Language: **ferrolex** (Hunspell-compatible spell checking), **ferrocat** (translation catalog engine: PO/ICU MessageFormat), and **palamedes** — the application: i18n for TypeScript apps, built on ferrocat, ferromark, and ferralk.
  - Workbench: **ferrovia** (SVGO-compatible SVG optimizer), **ferralk** (glob matching and parallel filesystem walking, checked against a frozen zlob reference), **ferrugo** (PDF previews for untrusted files) — early stage.
- Kind of member (ADR-0004, confirmed 2026-09-24): successors are ferroni (Oniguruma), ferriki (Shiki), ferrolex (Hunspell) and ferrovia (SVGO); new developments are ferrocat, ferralk, ferromark (v2 builds on ox-content; no non-Rust predecessor), ferrugo, and the application palamedes. The registry records it as `succeeds` or `buildsOn`.
- Maturity is the registry's hand-set `status`; the stamp legend says what each level means. Keep it in step with releases (ferromark is stable since v2).
- Membership rule (ADR-0001): a member is a family engine or a product built on family engines. Tools from the same workshop that share neither — dalo, agent-bridge — belong to the company line under oss.sebastian-software.com and are not listed on ferramenta.dev.
- Each project site lives in its own repo under `homepage/`, built on Ardo (in-house React-Router/SSG docs framework, v4.2), deployed to GitHub Pages. URLs: GitHub Pages now, own domains over time (ferramenta.dev and ferrocat.dev already live).
- This repo holds the family overview site plus the shared package `ferramenta-family`: design tokens, finished components (header with the family switcher and a project lockup, footer, project marks, family registry), the landing kit every home page is built from, custom logo SVGs, bundled display font.

## Capabilities and Constraints

- English only for now (i18n via Palamedes is a future follow-up; Ardo i18n still experimental).
- Static prerendered sites (Ardo: `ssr: false, prerender: true`); GitHub Pages hosting; no server.
- Rollout order after design approval: ferramenta.dev reference implementation → extract `ferramenta-family` → ferrocat → ferromark → ferroni → ferriki → ferrolex. Existing ferrocat.dev docs and ferromark homepage are reskinned, not rewritten.
- Streamline Sharp icons (Pro license) may accompany marketing content: shared chrome icons may live in the central package; page-specific icons stay in each project repo (< 100 per project, mandatory attribution + Streamline ownership carve-out in LICENSE; those SVGs are not MIT). Project logos are never built from Streamline. `lucide-react` is to be removed: the package's line icons (arrow, chevron, GitHub, crate, adapter, external, package) cover the family home pages.

## Brand Commitments

- Light & clean base with rust/terracotta accent; ember-glow gradient reserved for hero moments; full dark mode. (User-pinned.)
- Angular form language throughout ("sharp" aesthetic: hard corners, square caps, miter joins).
- Typography: system-ui for body and docs text; a bold, industrial display face for headlines — Big Shoulders, chosen in the direction drafts; system mono stack for code. Only the display face is bundled.
- One mark per member, metalwork metaphor, all derived from Streamline (Duotone set, Ultimate as motif source) under the license limits of ADR-0002: ferramenta = toolbox, ferroni = anvil and hammer, ferriki = flame, ferromark = stamp, ferrolex = corner ruler, ferrocat = drawer cabinet, ferrovia = carving chisel, ferrugo = welding helmet. Known defect: the ferralk (horseshoe magnet) and palamedes (type slugs in a composing stick) marks were drawn in-house and are to be replaced by Streamline-derived marks; sourcing needs the Streamline account.
- Logo lockup: project icon + lowercase wordmark in the brand display face, identical rules for every project.
- Shared header carries a family-wide project switcher on every site.
- Overview page: every member listed equally, grouped by subfamily; applications are marked as such, not ranked; the philosophy section carries the positioning above.

## Evidence on Hand

- Results are welcome on the family site, figures are not. Speed and rigor are part of why the family exists, so the site may say a tool is among the fastest, ahead of a named alternative, or backed by a larger test suite — whenever that is true. It never repeats a speed-up factor, timing, percentage or test count: that precision goes stale here and belongs to each tool's repository and site, next to its setup.
- Live registry figures: download counts render as shields.io badges on every view; versions and registry availability come from the build-time snapshot (`app/data/registry-stats.json`). No aggregate across tools is shown.
- Assets: the mark sprite (`packages/family/src/mark-defs.ts`), the bundled Big Shoulders font, the brand logos (`app/assets/brand/`), the Sebastian Software and Sebastian Consulting wordmarks (`app/assets/logos/`), the social card (`public/social.png`), and the approved comp (`design/comp/`).
- Absent, and never to be invented: stars, user counts, customer logos, testimonials, press. The family is young; there is no social proof.

## Product Principles

1. Prove, don't claim: a successor matches its original functionally and aims to beat it on performance, checked differentially; a new development holds itself to the standards it builds on. The proof lives with each tool.
2. Open standards over proprietary formats; keep the APIs the ecosystem already knows.
3. Every tool is named equally; subfamilies explain relationships, not hierarchy.
4. Design first, extraction second: the shared package ships finished components, not just tokens.
5. Content lives near the code: each site in its project's repo, updated with releases.

## Accessibility & Inclusion

WCAG-conscious defaults: contrast ≥ 4.5:1 for text in both themes, keyboard-reachable navigation, reduced-motion respected. No stricter formal requirement established.
