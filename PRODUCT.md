# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers and technical teams evaluating Rust-native tools and focused applications — from web infrastructure and i18n workflows to team agent-skill management and local-first transcription. They arrive from GitHub, crates.io, npm, or word of mouth, and decide quickly whether a tool is credible, useful, and maintained. Secondary audience: contributors and the broader Rust community.

## Product Purpose

ferramenta.dev is the family site for a curated set of Rust-native engines and applications by Sebastian Software. It presents the projects as one equal-ranked family and links out to each project's own site or repository. Family membership does not require a shared site layout or visual identity; `ferramenta-family` provides optional shared chrome for projects that choose to use it.

## Positioning

A family of Rust-native engines and focused applications built for practical work and user control. Some projects rework standards-led infrastructure and prove compatibility against established predecessors; others manage team workflows or keep transcription local by default. Claims stay tied to verifiable behavior.

## Operating Context

- Family registry (all named equally; subfamilies exist):
  - Content pipeline: **ferroni** (Oniguruma-compatible regex engine, v1.3.0, crates.io, most stable) → **ferriki** (Shiki-compatible syntax highlighting, v0.2.0, alpha) → **ferromark** (CommonMark/GFM Markdown→HTML, v0.7.0, crates.io + npm, beta)
  - Language: **ferrolex** (spell-checking engine, Hunspell-compatible, v0.2.0, alpha, very active) + **ferrocat** (translation catalog engine: PO/FCL/ICU, v3.4.2, crates.io, most mature)
  - Workbench: **ferralk**, **ferrovia**, and **ferrugo** are focused engines; **dalo** manages team agent skills and **cuttledoc** provides local-first speech transcription as standalone applications.
- Each project owns its own site and visual identity. The family site is the shared overview and outbound directory; membership does not require adopting its layout.
- This repo holds the family overview site plus the optional shared package `ferramenta-family`: design tokens, header, footer, project marks, family registry, and bundled display font.

## Capabilities and Constraints

- English only for now (i18n via Palamedes is a future follow-up; Ardo i18n still experimental).
- Static prerendered sites (Ardo: `ssr: false, prerender: true`); GitHub Pages hosting; no server.
- Rollout order after design approval: ferramenta.dev reference implementation → extract `ferramenta-family` → ferrocat → ferromark → ferroni → ferriki → ferrolex. Existing ferrocat.dev docs and ferromark homepage are reskinned, not rewritten.
- Streamline Sharp icons (Pro license) may accompany marketing content: shared chrome icons may live in the central package; page-specific icons stay in each project repo (< 100 per project, mandatory attribution + Streamline ownership carve-out in LICENSE; those SVGs are not MIT). Project logos are never built from Streamline. `lucide-react` is to be removed.

## Brand Commitments

- Light & clean base with rust/terracotta accent; ember-glow gradient reserved for hero moments; full dark mode. (User-pinned.)
- Angular form language throughout ("sharp" aesthetic: hard corners, square caps, miter joins).
- Typography: system-ui for body and docs text; a bold, industrial display face for headlines (Space Grotesk is the user-named lead candidate; final pick via direction drafts); system mono stack for code. Only the display font is bundled.
- Custom project symbols follow the metalwork metaphor and are drawn in-house. Standalone applications without an approved individual mark use the family mark in the overview.
- Every project keeps its own visual identity and layout; shared chrome is available for consumers that choose it.
- The overview links all family members equally and groups them by the work they do.

## Evidence on Hand

- Real, citable facts: ferromark benchmarks (~260–280 MiB/s; faster than pulldown-cmark and md4c), ferroni 2,083 tests / "100% C parity", ferrocat v3.4.2 on crates.io, differential-testing infrastructure across the family. Use these; do not invent stars, users, or testimonials (the family is young, max 5 stars — no social proof available).
- Dalo's README documents Git-backed team skill sources, approval, deterministic security preflight, and sync into agent directories. Cuttledoc's README describes a reusable Rust library and native CLI, with on-device transcription first and hosted backends explicitly selected.
- No image/icon/font assets exist yet anywhere in the repo (no favicon, logo, og:image). Everything visual starts from zero.

## Product Principles

1. Match the originals functionally, beat them on performance — and prove it differentially rather than claim it.
2. Open standards over proprietary formats; keep the APIs the ecosystem already knows.
3. Every tool is named equally; subfamilies explain relationships, not hierarchy.
4. Design first, extraction second: the shared package ships finished components, not just tokens.
5. Content lives near the code: each site in its project's repo, updated with releases.

## Accessibility & Inclusion

WCAG-conscious defaults: contrast ≥ 4.5:1 for text in both themes, keyboard-reachable navigation, reduced-motion respected. No stricter formal requirement established.
