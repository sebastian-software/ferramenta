# Ferramenta: the family homepage

[Open the linked family homepage](index.html), inspect the [complete Imagegen page comp](concept.html), or review the [logo and seven engine identities](identity.html).

[Compare heading and body fonts](typography.html) in the full homepage layout.
The selected typography is IBM Plex Sans Semibold for headings and `system-ui`
for body text. The study retains Helvetica and Instrument Sans as comparisons.
[Current native HTML designs](../current/index.html) carry the selection across
Ferramenta, all seven engines and six core subpages. Candidate webfonts and their
OFL licenses are self-hosted under `assets/type-study/`; its manifest records
pinned upstream revisions, source URLs and SHA-256 hashes.

The linked HTML homepage now closes with `EditorialWorkshop`, rendered from the
shared package: original Sebastian Software and Sebastian Consulting logos,
short descriptions and destinations from the live workshop registry. This
addition is present in HTML; the original raster comp remains unchanged.

Ferramenta now has its own entry in the approved warm editorial specimen direction: fine-fiber paper, matte pewter, warm oxide, an airy reading rhythm and the narrow left introductory margin. All seven registered engines appear with their existing identities and useful explanations. No applications or additional repositories are added.

The original hero is a seven-position precision tool register. Separate removable inserts share a mounting standard, representing related tools that can be adopted independently. The rendered F logo reduces that idea to a registration fixture with a single oxide insert. It remains distinct at favicon sizes.

## Included

- [Complete homepage comp](52-ferramenta-home.png), generated with built-in Imagegen, and an HTML implementation with real text, real engine icons and working navigation.
- Transparent [hero](assets/ferramenta/hero.png) and [mark](assets/ferramenta/mark-master.png) masters, preserved unchanged.
- A real typeset Ferramenta wordmark, 32/48/64/128/256/512px transparent PNGs, a 32/48/64px ICO and an Apple touch icon.
- Unchanged icons for all seven engines and the approved paper/pewter textures, copied into the local asset bundle with provenance.
- The [brief](BRIEF.md), [exact prompt set](prompts.md), [source copy](content/ferramenta-home.md), [manifest](manifest.json) and [frozen registry evidence](sources/manifest.json).
- Reproducible [asset export](build-assets.mjs) and [page generation](build-review.mjs) scripts.

The linked homepage opens each engine's existing local design through its primary action. A separate project-site or repository link goes to the registry destination. The navigation, selection table, source links and footer are real HTML; the full-page image is the visual concept reference.

## Rebuild

From the repository root:

```sh
node designs/round-08-ferramenta/build-assets.mjs
node design/editorial/build-assets.mjs
pnpm build:package
node designs/round-08-ferramenta/build-review.mjs
```

The logo exporter uses ImageMagick and macOS Helvetica Neue. The HTML preview needs only a static file server and has no runtime network dependency. The page generator applies the repository formatter. Preserve the frozen source files byte for byte when formatting other artifacts.

Authored source copy and frozen registry evidence remain authoritative for product facts. Small generated glyphs in the raster comp may differ. The family's reference table shows established inputs and evidence; it does not compare unrelated engines numerically.

This directory records versioned design preparation. The standalone preview
snapshots the shared editorial kit under `assets/shared/`, including its
stylesheet and original assets; rebuild through the package rather than editing
that snapshot. Production pages and consumer pins have not been migrated.
