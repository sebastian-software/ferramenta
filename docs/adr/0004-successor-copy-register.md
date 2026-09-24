# ADR-0004: The successor register for family copy

- Status: accepted
- Date: 2026-08-14
- Updated: 2026-09-11
- Amended: 2026-09-24 — successors and new developments, see
  [Amendment 2026-09-24](#amendment-2026-09-24)
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

## Amendment 2026-09-24

The register assumed every member succeeds an established implementation. That
is too narrow: some members are new developments with no non-Rust predecessor.

**Two kinds of member.** A _successor_ succeeds an established implementation
and stays compatible with it: ferroni (Oniguruma), ferriki (Shiki), ferrolex
(Hunspell), ferrovia (SVGO). A _new development_ builds directly on open
standards: ferrocat, ferralk, ferromark (its v2 builds on ox-content, with no
non-Rust predecessor), ferrugo, and the application palamedes. The registry
records this as `succeeds` or `buildsOn`; the overview renders it as a
"Succeeds" or "Builds on" fact.

Successor copy keeps the register above: honor the original → state the
succession → give the why. New-development copy honors the standard or the
model it builds on → states what it does differently → gives the why. Shared
copy — the lede, the principles, the stamp legend — speaks for both and never
implies that every tool replaces something.

**No replicated results.** The family site never repeats a project's
benchmarks, test counts, rankings or other results: they cannot be kept
current from here. Evidence names the _kind_ of proof (an oracle, a conformance
suite, a design property); the numbers live in each project's repository and
site. Live registry figures render from the registries themselves (see
ADR-0006).

This supersedes the consequence that every new tool needs a named original to
honor.

## References

- [packages/family/src/family.ts](../../packages/family/src/family.ts) — the proof texts under this register
- [PRODUCT.md](../../PRODUCT.md) — positioning and evidence inventory
