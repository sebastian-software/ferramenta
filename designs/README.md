# Ferramenta design studies

Current entry: [design overview](index.html).

## Current visual exploration

[Round 08: Ferramenta family homepage](round-08-ferramenta/index.html) brings all seven engines together in one warm editorial entrance. It includes a [complete Imagegen page comp](round-08-ferramenta/concept.html), an original seven-position tool register, an [F-shaped family logo and favicon kit](round-08-ferramenta/identity.html), and a linked HTML preview with real text and the existing engine icons.

[Round 07: five-engine family expansion](round-07-family-expansion/index.html) adds a meaningful instrument graphic, rendered icon/favicon kit and complete homepage for Ferriki, Ferrolex, Ferrocat, Ferralk and Ferrugo. [Compare the icons at their actual sizes](round-07-family-expansion/icons.html). [Design coverage](family-coverage.json) maps the current assets and pages for all seven registered engines.

[Round 06: warm editorial specimen](round-06-warm-specimen/index.html) contains the eight coordinated core pages: Overview, Start with Rust, the core function and Benchmarks for each product. The approved narrow-left-introduction homepage layout and warm Paper & pewter direction extend across the suite.

The folder includes a shared design brief, exact Imagegen prompts, source-copy snapshots, frozen benchmark evidence, a reusable review generator and the complete supporting asset kit: texture masters, transparent instruments, logos and favicons.

The layout authority is [Working specimen, images 31 and 32](round-04-design-directions/index.html#b). The material authority is [warm Paper & pewter, images 35 and 36](round-05-material-directions/index.html#a). Round five used a different layout and remains a material reference.

## HTML baseline and logo kit

- [Ferromark homepage](homepages/ferromark.html)
- [Ferroni homepage](homepages/ferroni.html)
- [Shared spacing and implementation notes](homepages/DESIGN-NOTES.md)
- [Product logos and favicons](logos/index.html), with [usage notes](logos/README.md) and [Imagegen prompts](logos/prompts.md)
- [All eight core pages](round-03-core-pages/index.html), including the six preserved subpages

The two current homepages are semantic HTML compositions sharing one stylesheet and common primitives. The metal instruments remain generated image assets. Logos use original built-in Imagegen masters with reproducible raster exports. Tables, charts, source copy and measurement caveats are real text. Decorative section backgrounds, material bands and wave/diagonal treatments have now been removed from the HTML baseline. There are no horizontal rules between homepage sections.

## Archive

The complete studies from October 18, 2026 are preserved in round 01 (light mechanics), round 02 (precision Rust), and round 03 (core pages). Generated homepage v2 and v3 images remain available for comparison. The earlier `design/explorations/2026-10-18` directory is retained as the original archive; `designs/` is the current review location.

## Local preview and rebuild

Serve this directory with any local static server, or open its HTML files directly. To regenerate the current pages and export logos from their masters:

```sh
node designs/homepages/build-pages.mjs
node designs/logos/build-logos.mjs
```

Use the repository's `oxfmt` for formatting the generated HTML after rebuilding. The logo exporter needs ImageMagick and macOS Helvetica Neue for the optional raster wordmark. Runtime HTML has no build or network dependency.

The selected direction is versioned design preparation. Start with [the current native HTML suite](current/index.html) and the [shared editorial kit](../packages/family/EDITORIAL.md). Live site adoption is deferred until the upcoming Ardo release. Older rounds retain the original review context: references to local or uncommitted work describe their state when created.
