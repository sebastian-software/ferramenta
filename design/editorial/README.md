# Warm editorial assets and tokens

The canonical sources for the shared warm editorial kit. The approved originals
come from the design studies in rounds 06–08. Masters are copied unchanged with
their prompts and provenance. This folder is the rebuild source; package users
consume the optimized files under `packages/family/editorial/`.

Run from the repository root:

```sh
node design/editorial/build-assets.mjs
pnpm build:package
```

The exporter requires ImageMagick. It normalizes transparent mark padding and
exports PNGs, lossless mark WebPs, 32/48/64px ICOs and Apple touch icons. It copies
the approved typeset wordmarks and optimizes hero graphics and material textures.
It neither generates new imagery nor modifies a master. No font installation
or network access is needed.

`fonts/` holds the selected IBM Plex Sans Semibold WOFF2 and its SIL Open Font
License, copied unchanged from the official upstream at the revision recorded
in the manifest. The exporter verifies their hashes before copying them into
the package and generating `editorial-fonts.css`. Headings use this local face;
body text uses system UI and code uses system monospace.

Build the current native HTML preview suite after building the package and the
Ferramenta page:

```sh
node designs/round-08-ferramenta/build-review.mjs
node design/editorial/build-previews.mjs
```

The 14 pages under `designs/current/` use the real shared components, approved
source copy, existing instruments and recorded evidence. Original image comps
in rounds 06–08 are retained; changing CSS cannot change lettering baked into
those images. `preview.css` contains only preview framing and documentation
navigation; the shared package supplies typography and content surfaces.

The workshop's two SVG logos are copied unchanged from `app/assets/logos/`.
Their package sidecars record the source path and hash; they are original brand
artwork, not generated family identities. Their ownership is recorded in the
package notice, and their shared closing section always uses a flat light ground.

`tokens.json` is the value source. It generates the scoped CSS custom properties
and the exported JSON. Components use semantic roles; the raw palette, type and
spacing scales remain available to consumers. `manifest.json` records the eight
identities, the physical meaning of each instrument and the approved references.

To update an asset, replace its master and provenance together, review it at its
intended sizes, run the exporter and inspect the real component in
`/kit/editorial/`. Every exported raster carries the original prompt and source
and output hashes. Do not edit generated package assets or generated token CSS.

See [ADR-0010](../../docs/adr/0010-warm-editorial-family-kit.md) and the
[consumer guide](../../packages/family/EDITORIAL.md).
