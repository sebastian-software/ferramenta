# ADR-0004: The successor register for family copy

- Status: accepted
- Date: 2026-08-14
- Updated: 2026-09-11
- Deciders: Sebastian Werner

## Context

Early homepage copy was spec-sheet-flavored ("codeToHtml, codeToTokens,
codeToHast…", stat dumps) and was judged hacker-speak, thin, and in places
wrongly framed (claiming the native-tooling movement as ours; describing the
tools as ports). The family site is a Persuade surface: overview pages must
convince, project sites may go deep.

## Decision

Family copy speaks as an **experienced peer**, in English, and follows the
**successor register** for every tool description: honor the original →
state the succession → give the why. ("Shiki brought editor-grade highlighting
to everyone. ferriki keeps the API Shiki got right and swaps the engine…")

- Overview pages carry no API method names or spec dumps; that depth belongs on
  project sites and docs.
- Humility about the movement: essential tooling going native (Rust, sometimes
  Go) is credited to its pioneers — Vite, SWC, OXC, esbuild; we stand on their
  shoulders.
- The tools are described as re-engineered for Rust (memory-layout-conscious,
  SIMD/NEON where it pays), never as mechanical ports.
- Claims and evidence: only verifiable statements; benchmarks named openly with
  their competitors; no invented social proof (stars, testimonials); general
  engineering claims (SIMD/NEON) stay in general sections until a specific tool
  documents them.
- The personal layer is part of the brand: origin story (qooxdoo heritage,
  giving back), goals, and a signed note appear on the family site.
- Density: overview = concise but narrative; project sites = explanatory and
  exact; UI chrome = terse.

## Family theme wording

Use **“Ferramenta — A family of Rust tools”** as the family description and
**“More from Ferramenta”** as the heading for related-tool links in Markdown
and React. These phrases were approved on 2026-09-11. The voice is natural,
clear US English: approachable without weakening Ferramenta as a brand.

Use “family” rather than “suite” to express shared identity while preserving
each tool's independence. Do not use “More tools from the workshop” for the
related-tool section; the workshop metaphor makes the wording less direct.
This copy decision does not change the established visual design or family
membership rules.

Theme branding and related-tool sections remain visually subordinate to the
project's own content. Each related-tool link includes a visible short
description, and the current project is omitted from the related links.

The shared React navigation and generated Markdown frames use this wording.
Consumers adopt it by updating their selected theme revision or family package.

## Considered options

### Chosen: successor register

Respect for the originals converts their users instead of antagonizing them,
and it forces every claim to carry a why.

### Rejected: spec-sheet copy

Accurate but unpersuasive; reads as documentation misplaced on a marketing
surface.

## Consequences

- Tool proofs in the family registry must be written (and reviewed) in this
  register; the registry text is what all sites render.
- New tools joining the family need a named original to honor — or an explicit
  exception here.

## Validation and review triggers

Reopen when localization via Palamedes introduces non-English channels, or when
a tool has no meaningful predecessor to honor.

## References

- [packages/family/src/family.ts](../../packages/family/src/family.ts) — the proof texts under this register
- [PRODUCT.md](../../PRODUCT.md) — positioning and evidence inventory
