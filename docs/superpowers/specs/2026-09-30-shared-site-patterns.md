# Shared patterns across the engine sites

- Date: 2026-09-30
- Status: implemented in `ferramenta-family` (the components below); the sites
  adopt them when they migrate to 2.0

## Why

Each engine site built its home page and its benchmark pages by hand. Read side
by side, four sites solve the same dozen problems with their own markup and
CSS. This is the inventory behind the components added to the package: what
was found on each site's `main`, what it maps to, and what deliberately stays
with its site.

Sites read: ferroni (`docs/`), ferriki (`homepage/`), ferromark (`homepage/`),
ferrocat (`docs/`). ferrolex, ferralk and ferrugo have no site yet.

## Found on two or more sites

| Pattern                                    | Hand-built today                                                                                                                                                  | Shared piece                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| The project beside others, as a table      | ferriki `benchmark-tables.tsx` with `.ferriki-table`; ferromark `.native-benchmark-table` and `.feature-benchmark-table`; ferroni and ferrocat as Markdown tables | `ComparisonTable`                  |
| Feature or compatibility matrix            | ferromark `guide/feature-comparison` (47 rows); ferroni's capability table; ferriki's compatibility and migration tables                                          | `ComparisonTable` with marks       |
| One measure across the field, as bars      | ferrocat `.ferro-bars` (two charts); the factor figures on the other three say the same thing without the picture                                                 | `ComparisonBars`                   |
| Where and when it was measured             | ferriki `BenchmarkContext`; ferromark's platform heads; ferroni and ferrocat in a paragraph                                                                       | `Measured`                         |
| Headline figures                           | ferroni, ferriki, ferromark through `EvidenceFigures`; ferrocat `.ferro-proof-stats`                                                                              | `EvidenceFigures` (already shared) |
| What is covered, what is not               | ferroni, ferriki, ferromark through `Ledger`                                                                                                                      | `Ledger` (already shared)          |
| Where the member fits with the others      | "Where X sits" with `PipelineAssembly` on ferroni, ferriki, ferromark; ferrocat's Palamedes stack                                                                 | `Relations`                        |
| Two code panels side by side               | `.fr-code-grid`, `.ferriki-code-grid`, and the kit's own `.kit-code-grid`                                                                                         | the class `fam-code-grid`          |
| Section links in the bar, a menu on phones | `.ferroni-nav` / `.ferroni-sections`, `.ferriki-nav` / `.ferriki-menu`, `.ferromark-nav` / `.ferromark-guide-menu`                                                | `site-links`, `SiteMenu`           |
| Search in the bar, a second row on phones  | `.ferroni-search`, `.ferriki-search`, `.ferromark-search`, each with the same phone rules                                                                         | the class `site-search`            |
| Ardo documentation in the family chrome    | `.ferroni-shell`, `.ferriki-shell`, `.ferromark-shell`                                                                                                            | `docs.css`, `fam-docs-shell`       |
| The release beside the install line        | `.fr-release`, `.ferriki-release`, ferromark's version string                                                                                                     | `facts` on `ProjectHero`           |

Two findings came out of building them:

- Ardo letters a table's head in capitals, which turns `µs` into `MS`. Of
  Ferroni's 85 documentation tables, 27 carry a unit in their head. `docs.css`
  now keeps a table head in its own case and sets documentation tables in
  tabular figures.
- A table that scrolls in its own box still widened the page inside Ardo's
  layout, through the hidden text of its marks. The scroll box is positioned,
  and `pnpm review` checks every page for sideways scroll at eight widths.

## Stays with its site

One site only, so not shared. It moves into the package when a second site
needs it.

- ferromark: the Flavored Markdown examples (input beside output, per option),
  the runtime choice cards and the Rust / Node.js switch in its guides.
- ferriki: the class-highlighting demo.
- ferrocat: the five-step flow, the catalog modes, the before-and-after list,
  and the carousel of other projects.

## What the sites still have to do

Nothing here changes a site. Each one replaces its own markup when it migrates
to `ferramenta-family` 2.0; the package README's "Moving from 1.x" table lists
the replacements.
