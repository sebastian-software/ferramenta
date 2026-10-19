# Ferromark and Ferroni logo kit

Open [the logo review](index.html) to inspect both symbols and their wordmarks, including true 32px, 48px and 64px previews. The same marks are installed as favicons in the current [Ferromark](../homepages/ferromark.html) and [Ferroni](../homepages/ferroni.html) local page studies.

Both symbols are original built-in Imagegen renders in satin steel, graphite and warm oxide. They share material and lighting, while their different silhouettes describe each library's work.

- **Ferromark:** two document leaves seated in a registration corner. Source and rendered output belong together; the sheets echo the homepage's document-register instrument.
- **Ferroni:** three parallel pattern tracks and one oxide scanning pointer. Many patterns feed one next match; the broad shape echoes the homepage's scanner.

The marks are deliberately simpler than the hero instruments. They have no lettering, fine screws or ruler ticks. Their functional minimum is 32px; there is no 16px export.

Each product directory contains an untouched transparent `mark-master.png`, transparent PNGs at 32/48/64/128/256/512px, `logo-lockup.png` with a real typeset wordmark, `favicon.ico` with 32/48/64px frames, and an opaque 180px Apple touch icon. Every raster has a provenance sidecar with its prompt, derivation and SHA-256.

## Use

Use the symbol at 40px beside a real text wordmark with a 12px gap, and at 32px in the footer. Leave at least one eighth of its width clear around it. The supplied transparent export includes optical padding. Keep the original metal and oxide colors on a light ground; do not tint or put copy into the symbol.

```html
<link rel="icon" type="image/png" sizes="32x32" href="mark-32.png" />
<link rel="icon" type="image/png" sizes="64x64" href="mark-64.png" />
<link rel="icon" href="favicon.ico" sizes="32x32 48x48 64x64" />
<link rel="apple-touch-icon" href="apple-touch-icon.png" />
```

## Rebuild

Run `node designs/logos/build-logos.mjs` from the repository root. It uses ImageMagick and the macOS Helvetica Neue font to make the horizontal lockup; the web pages use real HTML text. Exports only trim transparent margins, normalize the object footprint and downsample the master. They do not redraw or change materials.

The exact generation prompts are in [prompts.md](prompts.md) and beside each master. This is a local exploration. The production family's icons, package and accepted design records are unchanged.
