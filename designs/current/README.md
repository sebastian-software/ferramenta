# Current family designs

[Open Ferramenta and its seven engines](index.html).

These are native HTML previews of the approved warm editorial direction.
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

The pages render the actual shared package, not screenshots of pages. All
engine source copy comes from the approved rounds 06–07; the family page keeps
round 08's authored layout. Measurements are the previously frozen snapshots,
with dates and conditions attached. The original image comps, prompts and
source evidence remain unchanged and are linked in each engine page's footer.

Rebuild from the repository root:

```sh
node design/editorial/build-assets.mjs
pnpm build:package
node designs/round-08-ferramenta/build-review.mjs
node design/editorial/build-previews.mjs
```

`assets/` and `preview.css` are generated copies of the package assets and the
canonical preview framing. Edit `design/editorial/` and package sources instead.
`manifest.json` records every source page and the selected typography. Serve
the `designs/` directory to keep all local evidence links reachable. These files are versioned design preparation. Live site adoption awaits the
upcoming Ardo release.
