# Ferra page designs

[Open Ferramenta and its engines](index.html).

These are native HTML previews of the Ferra direction.
Headings use IBM Plex Sans Semibold (600), body text uses system UI, and code
uses the system monospace stack. The font is self-hosted with its SIL Open Font
License; the pages make no external font requests.

| Product    | Homepage                   | Getting started               | Core function                         | Benchmarks                              |
| ---------- | -------------------------- | ----------------------------- | ------------------------------------- | --------------------------------------- |
| Ferramenta | [Family](index.html)       |                               |                                       |                                         |
| Ferromark  | [Overview](ferromark.html) | [Start](ferromark-start.html) | [Rendering](ferromark-rendering.html) | [Benchmarks](ferromark-benchmarks.html) |
| Ferroni    | [Overview](ferroni.html)   | [Start](ferroni-start.html)   | [Scanner](ferroni-scanner.html)       | [Benchmarks](ferroni-benchmarks.html)   |
| Ferriki    | [Overview](ferriki.html)   |                               |                                       |                                         |
| Ferrolex   | [Overview](ferrolex.html)  |                               |                                       |                                         |
| Ferrocat   | [Overview](ferrocat.html)  |                               |                                       |                                         |
| Ferralk    | [Overview](ferralk.html)   |                               |                                       |                                         |
| Ferrugo    | [Overview](ferrugo.html)   |                               |                                       |                                         |
| Ferrolink  | [Overview](ferrolink.html) |                               |                                       |                                         |
| Ferrigura  | [Overview](ferrigura.html) |                               |                                       |                                         |

The pages render the final shared components and assets as native HTML. The
family entrance keeps its authored composition, while engine and workshop facts
come from the shared registry. Product examples and dated benchmark evidence
are retained under `design/ferra/`; each engine page links to its source copy.

Rebuild from the repository root:

```sh
node design/ferra/build-assets.mjs
pnpm build:package
node design/ferra/build-previews.mjs
```

Serve the **repository root**, then open `/designs/index.html`, so the pages can
resolve their shared styles, assets and evidence without duplicate copies:

```sh
python3 -m http.server 48625 --bind 127.0.0.1
```

Edit `design/ferra/` and package sources instead of generated HTML.
`manifest.json` records every page source and the selected typography. The family homepage now adopts this direction on Ardo 6. Engine sites migrate separately.
