# Ferra design sources

Ferra is the warm, light design system for Ferramenta and its seven engines.
This directory holds only the final design inputs: assets, typography, tokens,
page copy and the generators for the shared package and HTML previews.

## Build

Run from the repository root with ImageMagick available:

```sh
node design/ferra/build-assets.mjs
pnpm build:package
node design/ferra/build-previews.mjs
```

Open the [final pages](../../designs/README.md). The previews resolve styles and
assets directly from the shared package. They do not copy the package or depend
on earlier studies. `preview.css` contains document navigation and specimen
framing; `family-preview.css` preserves the family's authored composition.

## Sources

- `tokens.json` generates the scoped CSS contract and exported JSON. Components
  use semantic roles; palette, type and spacing scales remain available.
- `masters/` holds eight compact marks, eight functional hero instruments and
  two material textures. PNG bytes are unchanged. Adjacent sidecars preserve the
  exact generation prompts, hashes and original creation context. Historical
  reference filenames in those records are provenance, not build dependencies.
- `manifest.json` records the meaning of each instrument. Instruments explain
  the work of their engine; Ferramenta's register represents independent tools.
- `fonts/` holds IBM Plex Sans Semibold WOFF2 and its SIL Open Font License,
  copied unchanged from the official upstream revision pinned in the manifest.
  The exporter verifies both hashes. Body text uses system UI; code uses the
  system monospace stack. No network or font installation is required.
- `content/` and `pages.json` hold the final authored copy and page inventory.
  Engine names, roles, descriptions and destinations come from the shared
  registry. The two files in `evidence/` retain the benchmark snapshots cited by
  the product pages, with dates and conditions attached.

The exporter normalizes transparent mark padding, produces PNG and lossless
WebP marks, 32/48/64px ICOs and Apple touch icons, and optimizes instruments and
textures. `FerraLogo` uses a rendered mark beside live type. There is no retained
alternate typography or baked-in wordmark. Each exported raster records its
original prompt and source/output hashes. Never edit a generated package asset.

The workshop SVGs are copied byte for byte from `app/assets/logos/`. Their
sidecars identify the originals; their colors and flat light ground are part of
the component contract. Update a master and its provenance together, rebuild,
and inspect the actual component at `/kit/ferra/`.

See [ADR-0010](../../docs/adr/0010-ferra-design-system.md) and the
[consumer guide](../../packages/family/FERRA.md).
