# Warm editorial specimen: eight core pages

[Open the complete paired review](index.html).

The approved warm homepage direction is archived here and extended to the six core subpages. Both products share warm beige paper, fine fibers, matte pewter, rust-brown oxide, grotesk typography, generous spacing, readable examples and clear evidence tables.

| Page            | Ferromark                                          | Ferroni                                     |
| --------------- | -------------------------------------------------- | ------------------------------------------- |
| Overview        | [Homepage](ferromark.html)                         | [Homepage](ferroni.html)                    |
| Getting started | [Start with Rust](ferromark-start.html)            | [Start with Rust](ferroni-start.html)       |
| Core function   | [Rendering and metadata](ferromark-rendering.html) | [The scanner](ferroni-scanner.html)         |
| Benchmarks      | [Parser benchmarks](ferromark-benchmarks.html)     | [Regex benchmarks](ferroni-benchmarks.html) |

## Design authority

The approved homepage layouts use a narrow left introductory column beside broad reading and evidence. Their layout references are Working specimen, images 31/32; their warm material references are Paper & pewter, images 35/36. The approved combined homepages are images 39/40.

The six new subpages use those combined homepages as the visual family authority. Useful documentation navigation and reading structures remain. Similar content receives matching treatments across both products. The [design brief](BRIEF.md) records the shared rules and the page-type adaptations.

## Files and assets

- Eight final full-page PNG studies and eight individual HTML review views.
- [Exact built-in Imagegen prompts](prompts.md), all reference roles and per-image provenance sidecars. Corrected variants retain their initial generations.
- [Source copy for all eight pages](content/) and [frozen benchmark evidence](evidence/).
- [Asset kit](assets/README.md): two transparent instrument masters, complete logo/favicon exports, and reusable warm-paper and matte-pewter texture masters.
- [Manifest](manifest.json) linking the selected final images, sources, reference inputs, assets and page roles.
- [Review generator](build-review.mjs) and a shared stylesheet for consistent local comparison views.

The document register explains Ferromark's source/HTML/metadata relationship. The pattern comparator explains Ferroni's pattern set, source ribbon and next-match position. Hero objects keep those meanings across the suite.

## Local preview

Serve this directory, or its designs parent, with a local static server. The review HTML also opens directly from disk. To rebuild the gallery, individual review views and prompt bundle:

```sh
node designs/round-06-warm-specimen/build-review.mjs
```

Run the repository's formatter on regenerated HTML and Markdown. No production build or network access is required for the review views.

These are raster visual studies. Source copy and frozen evidence remain the authority for API behavior, code, text and numbers; small generated glyphs may differ. The production site, shared production package, shipped icons and accepted design records are unchanged. All work is local and uncommitted.

## Selected typography and native previews

The current choice is IBM Plex Sans Semibold (600) for headings and system UI
for body text. [Open the current native HTML suite](../current/index.html) for
Ferramenta, all seven engines and the six core subpages. It uses the shared
package and the existing source copy and graphics. These original PNG studies
remain unchanged visual references; their embedded lettering cannot be changed
by CSS. The review chrome also uses the selected fonts.
