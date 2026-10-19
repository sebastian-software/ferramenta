# ADR-0010: The warm editorial direction is a shared, opt-in family kit

- Status: accepted
- Date: 2026-10-19
- Amends: ADR-0008 and ADR-0009 for the new editorial entry

## Context

The approved design studies replace the heavy plate-and-oak treatment with a
lighter mechanical language: warm paper, matte pewter, restrained oxide,
generous gutters and a narrow introductory margin beside the main story.
Rounds 06–08 establish coordinated pages and identities for Ferramenta and all
seven engines. The shared library must make those assets and page structures
available to sibling sites.

Existing sites consume the current package exports. Changing their tokens,
icons or chrome as part of preparation would also change pages that have not
been adapted to the new layouts.

## Decision

Add `ferramenta-family/editorial` and `ferramenta-family/editorial.css` as a
complete, independently importable kit. Its `fe-` classes and `--fe-` tokens
are scoped to its page wrapper. Existing entries retain their current behavior;
sites adopt the new kit explicitly. No automatic production-page migration or
package publication is part of this preparation.

Adoption on the live family and engine sites is deferred until the upcoming
Ardo release. This change prepares the shared library, kit and local designs;
it does not upgrade Ardo or migrate the existing production pages.

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
seven-position register represents independently selectable tools, never a
required processing chain. Original masters and prompts live in
`design/editorial/`; package exports are reproducible optimized derivatives.

The package owns tokens, textures, identities and shared React page structures:
chrome, hero, margin sections, columns, engine catalog, actions, code, tables and
bars. The catalog reads the existing registry. Product pages supply their own
examples and evidence; the kit uses fictional sample measurements. Applications
retain their separate brands.

## Consequences

- Sibling sites import one stylesheet and the editorial components, with no
  dependency on Ardo or the older styles.
- Existing consumers can adopt the new layout in a deliberate page change.
  Both visual entries remain maintained during that transition.
- The canonical JSON token source generates the CSS contract and machine-readable
  export. Asset sidecars preserve prompts and source/output hashes.
- `/kit/editorial/` renders the actual exported components and assets. Package
  tests cover SSR, semantics and shipped files; browser review covers responsive
  layouts, keyboard access and the original kit's continued behavior.
- `designs/current/` renders Ferramenta, all seven engine homepages and the six
  previously designed core subpages as native HTML with the selected fonts.
  Original raster studies remain visual references, with their provenance intact.
- The generated package build output stays beside the source, as required by
  ADR-0007. Versioning this preparation does not publish the package or change any consumer pin.

## References

- [Warm editorial reference suite](../../designs/round-06-warm-specimen/README.md)
- [Five-engine expansion](../../designs/round-07-family-expansion/README.md)
- [Ferramenta family entrance](../../designs/round-08-ferramenta/README.md)
- [Canonical assets and token source](../../design/editorial/README.md)
- [Consumer guide](../../packages/family/EDITORIAL.md)
