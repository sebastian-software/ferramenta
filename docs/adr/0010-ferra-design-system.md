# ADR-0010: Ferra is the shared, opt-in family design system

- Status: accepted
- Date: 2026-10-19
- Updated: 2026-10-30
- Amends: ADR-0008 and ADR-0009 for the Ferra entry

## Context

The approved design studies replace the heavy plate-and-oak treatment with a
lighter mechanical language: warm paper, matte pewter, restrained oxide,
generous gutters and a narrow introductory margin beside the main story.
Ferra coordinates pages and identities for Ferramenta and all engines.
The shared library must make those assets and page structures
available to sibling sites.

Existing sites consume the current package exports. Changing their tokens,
icons or chrome as part of preparation would also change pages that have not
been adapted to the new layouts.

## Decision

Add `ferramenta-family/ferra` and `ferramenta-family/ferra.css` as a
complete, independently importable kit. Its `ferra-` classes and `--ferra-` tokens
are scoped to its page wrapper. Existing entries retain their current behavior;
sites adopt the new kit explicitly. Consumers opt in explicitly; package publication and sibling-site migration remain separate actions.

The family homepage adopts Ferra with the published Ardo 6 release. Ardo owns
React, Vite, static rendering and its single main landmark; the root supplies
Ferra chrome, keeps the footer outside main, and opts out of the generated
sidebar. The shared package remains independent of Ardo. The original kit and
its fictional sample pages stay available for consumers awaiting migration.
Engine sites adopt Ferra separately in their own repositories.

The new direction uses one authored light scheme. Fine paper is the reading
ground; light pewter is an occasional material section; oxide marks actions
and selected evidence. Dark oak, heavy plates, rivets and glowing forge motifs
do not belong to this entry. Following the typography selection on October 19,
2026, headings use locally bundled IBM Plex Sans Semibold (600); body text uses
the visitor's system UI font, and code uses the system monospace stack. The
WOFF2 file and its SIL Open Font License ship with the package. Font loading
uses `swap` and does not contact a third-party font service. Canonical font
provenance pins the upstream revision and hashes.

Rendered logos and instrument graphics have different jobs. Each compact mark
holds at 32–64px. Each hero instrument describes the library's work. Ferramenta's
precision register represents independently selectable tools, never a
required processing chain. Original masters and prompts live in
`design/ferra/`; package exports are reproducible optimized derivatives.

Mechanical parts may be modeled and rendered in Blender, retaining their
editable scene and construction script beside the raster masters. Ferrolink
uses this path because its closed chain links require verifiable topology and
clearance. The source script checks that adjacent links are connected without
intersecting. This changes the asset authoring method, preserving the rendered
identity format, materials, and consumer contract.

The large instruments use low machined plates with rounded plan corners,
crisp edge breaks and recessed fasteners, substantial tool heads and varied solid
sections rather than uniformly thin plates. Their oxide accents may carry a
weathered dark red-brown corrosion: granular rust islands with broken edges,
pitted normal relief, and dull oxidized metal between the raised crusts. The
oxide is rough and matte against polished stainless steel. Recessed oxide
letter inlays preserve legibility. Ferriki's theme
output may use muted green and blue enamel, and Ferrugo's document faces may
use warm ivory, following their original functional color. These are authored
instrument materials; the page palette and compact marks keep their existing
contracts. The review page retains the original concepts, first Blender pass,
and refined Blender pass as three distinct comparison columns.

The package owns tokens, textures, identities and shared React page structures:
chrome, hero, margin sections, columns, engine catalog, actions, code, tables and
bars. The catalog reads the existing registry. Product pages supply their own
examples and evidence; the kit uses fictional sample measurements. Applications
retain their separate brands.

## Consequences

- Sibling sites import one stylesheet and the Ferra components, with no
  dependency on Ardo or the older styles.
- Existing consumers can adopt the new layout in a deliberate page change.
  Both visual entries remain maintained during that transition.
- The canonical JSON token source generates the CSS contract and machine-readable
  export. Asset sidecars preserve prompts and source/output hashes.
- `/kit/ferra/` renders the actual exported components and assets. Package
  tests cover SSR, semantics and shipped files; browser review covers responsive
  layouts, keyboard access and the original kit's continued behavior.
- `designs/` renders Ferramenta, all engine homepages and the six
  core subpages as native HTML with the selected fonts. Styles and assets resolve
  directly from the shared package. Only the final design is included; earlier
  studies and alternate typography are outside this kit.
- The generated package build output stays beside the source, as required by
  ADR-0007. Versioning this preparation does not publish the package or change any consumer pin.

## References

- [Final page designs](../../designs/README.md)
- [Canonical assets, tokens and source copy](../../design/ferra/README.md)
- [Consumer guide](../../packages/family/FERRA.md)
