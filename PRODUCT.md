# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers evaluating and adopting Rust-native infrastructure tools — typically maintainers of web tooling, build pipelines, i18n workflows, or documentation systems. They arrive from GitHub, crates.io, npm, or word of mouth, and decide quickly whether a tool is credible, compatible, and maintained. Secondary audience: contributors and the broader Rust/web-tooling community.

## Product Purpose

ferramenta.dev is the family site for the Ferramenta tools (Italian for "hardware store"): the overview page that presents all Ferr* projects as one equal-ranked family, carries the shared philosophy, and links out to each project's own homepage. It is also the home of the shared visual assets (`@ferramenta/family`) that give every project site an identical header, navigation, footer, and visual language.

## Positioning

A massive build-out of critical software infrastructure in Rust, aligned with the current ecosystem movement — oriented on open standards (CommonMark, PO files, ICU MessageFormat, Hunspell, TextMate grammars, SVGO, …). The ideal: match the originals functionally and beat them on performance — proven by differential testing against the original implementations (Hunspell oracle, Shiki test suite, svgo oracle, C-parity suites), not claimed.

## Operating Context

- Family registry (all named equally; subfamilies exist):
  - Content pipeline: **ferroni** (Oniguruma-compatible regex engine, v1.3.0, crates.io, most stable) → **ferriki** (Shiki-compatible syntax highlighting, v0.2.0, alpha) → **ferromark** (CommonMark/GFM Markdown→HTML, v0.7.0, crates.io + npm, beta)
  - Language: **ferrolex** (spell-checking engine, Hunspell-compatible, v0.2.0, alpha, very active) + **ferrocat** (translation catalog engine: PO/FCL/ICU, v3.4.2, crates.io, most mature)
  - Workbench (solo tools): **ferralk** (byte-first glob matching + parallel filesystem walking, v0.1.2, git-pinned, checked against a frozen zlob reference), **ferrovia** (SVGO-compatible SVG optimizer, 0.1.0, WIP) and **ferrugo** (PDF preview engine, v0.5.0, crates.io) — all early stage, sites deferred.
- Each project site lives in its own repo under `homepage/`, built on Ardo (in-house React-Router/SSG docs framework, v4.2), deployed to GitHub Pages. URLs: GitHub Pages now, own domains over time (ferramenta.dev and ferrocat.dev already live).
- This repo holds the family overview site plus the shared package `@ferramenta/family` (rename of `@ferramenta/ardo-config`): design tokens, finished components (header with project switcher, footer, ProjectLogo, family registry), custom logo SVGs, bundled display font.

## Capabilities and Constraints

- English only for now (i18n via Palamedes is a future follow-up; Ardo i18n still experimental).
- Static prerendered sites (Ardo: `ssr: false, prerender: true`); GitHub Pages hosting; no server.
- Rollout order after design approval: ferramenta.dev reference implementation → extract `@ferramenta/family` → ferrocat → ferromark → ferroni → ferriki → ferrolex. Existing ferrocat.dev docs and ferromark homepage are reskinned, not rewritten.
- Streamline Sharp icons (Pro license) may accompany marketing content: shared chrome icons may live in the central package; page-specific icons stay in each project repo (< 100 per project, mandatory attribution + Streamline ownership carve-out in LICENSE; those SVGs are not MIT). Project logos are never built from Streamline. `lucide-react` is to be removed.

## Brand Commitments

- Light & clean base with rust/terracotta accent; ember-glow gradient reserved for hero moments; full dark mode. (User-pinned.)
- Angular form language throughout ("sharp" aesthetic: hard corners, square caps, miter joins).
- Typography: system-ui for body and docs text; a bold, industrial display face for headlines (Space Grotesk is the user-named lead candidate; final pick via direction drafts); system mono stack for code. Only the display font is bundled.
- Custom project symbols (one per tool, metalwork metaphor, MIT-clean, drawn in-house): ferramenta = pegboard, ferroni = anvil, ferriki = welding torch, ferromark = metal punch, ferrolex = caliper, ferrocat = parts-drawer cabinet, ferrovia = file, ferrugo = welding mask, ferralk = horseshoe magnet (drawn in-house, MIT-clean).
- Logo lockup: project icon + lowercase wordmark in the brand display face, identical rules for every project.
- Shared header carries a family-wide project switcher on every site.
- Overview page: all 7 tools listed equally, grouped by subfamily; philosophy section carries the positioning above.

## Evidence on Hand

- Real, citable facts: ferromark benchmarks (~260–280 MiB/s; faster than pulldown-cmark and md4c), ferroni 2,083 tests / "100% C parity", ferrocat v3.4.2 on crates.io, differential-testing infrastructure across the family. Use these; do not invent stars, users, or testimonials (the family is young, max 5 stars — no social proof available).
- No image/icon/font assets exist yet anywhere in the repo (no favicon, logo, og:image). Everything visual starts from zero.

## Product Principles

1. Match the originals functionally, beat them on performance — and prove it differentially rather than claim it.
2. Open standards over proprietary formats; keep the APIs the ecosystem already knows.
3. Every tool is named equally; subfamilies explain relationships, not hierarchy.
4. Design first, extraction second: the shared package ships finished components, not just tokens.
5. Content lives near the code: each site in its project's repo, updated with releases.

## Accessibility & Inclusion

WCAG-conscious defaults: contrast ≥ 4.5:1 for text in both themes, keyboard-reachable navigation, reduced-motion respected. No stricter formal requirement established.
