# Five-engine family expansion

[Open the combined graphic, icon and homepage review](index.html), or [compare icons at their actual sizes](icons.html).

The approved warm editorial direction now covers Ferriki, Ferrolex, Ferrocat, Ferralk and Ferrugo. Each gets a distinct instrument whose physical logic describes the library, a simpler rendered icon, and a complete homepage with the narrow left introductory margin.

| Engine   | Graphic meaning                            | Homepage                |
| -------- | ------------------------------------------ | ----------------------- |
| Ferriki  | Token groups pass through a theme register | [Design](ferriki.html)  |
| Ferrolex | A wordform fits a dictionary profile       | [Design](ferrolex.html) |
| Ferrocat | Catalog entries align by message identity  | [Design](ferrocat.html) |
| Ferralk  | A pattern gate prunes a branching path     | [Design](ferralk.html)  |
| Ferrugo  | A document becomes a bounded preview       | [Design](ferrugo.html)  |

Ferromark and Ferroni remain the approved [eight-page reference suite](../round-06-warm-specimen/index.html). Ferrovia and the independently branded applications are outside this expansion.

## Included

- Five complete homepage PNGs and individual HTML review views.
- Five transparent instrument masters and five transparent rendered icon masters.
- Per-product logo kits: 32/48/64/128/256/512px PNGs, 32/48/64px ICO favicons, typeset wordmarks and Apple touch icons.
- Shared paper and pewter texture masters, copied from the approved suite with provenance.
- [Source copy](content/), [frozen primary repository evidence](sources/manifest.json), the [design brief](BRIEF.md), [manifest](manifest.json) and [exact built-in Imagegen prompts](prompts.md).
- A shared review stylesheet and reproducible [asset](build-assets.mjs) and [review](build-review.mjs) generators.

The original image masters are unchanged. Exporting normalizes the transparent margin, resizes and typesets the real wordmark; it does not redraw the mark. The actual-size review shows the new symbols alongside Ferromark and Ferroni.

## Rebuild

From the repository root:

```sh
node designs/round-07-family-expansion/build-assets.mjs
node designs/round-07-family-expansion/build-review.mjs
```

The asset exporter uses ImageMagick and the macOS Helvetica Neue font. The review HTML has no runtime network or build dependency. Format generated files with the repository formatter, leaving the frozen source snapshots unchanged.

These are local visual concepts. Authored source copy and frozen repository evidence remain the authority for code, product scope and claims; small generated glyphs may differ. No new performance measurements are claimed. Production sites, shared packages, shipped icons and accepted design records are unchanged. Nothing is committed or staged.

## Selected typography and native previews

The current choice is IBM Plex Sans Semibold (600) for headings and system UI
for body text. [Open the current native HTML suite](../current/index.html) for
Ferramenta, all seven engines and the six core subpages. It uses the shared
package and the existing source copy and graphics. These original PNG studies
remain unchanged visual references; their embedded lettering cannot be changed
by CSS. The review chrome also uses the selected fonts.
