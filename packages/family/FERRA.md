# Ferra

Build the approved light family look with an additive entry and one stylesheet:

```tsx
import {
  FerraAction,
  FerraFooter,
  FerraHeader,
  FerraHero,
  FerraPage,
  FerraSection,
  FerraWorkshop,
} from "ferramenta-family/ferra";
import "ferramenta-family/ferra.css";

export default function Home() {
  return (
    <FerraPage>
      <FerraHeader product="ferroni" home="/" nav={<a href="#scope">Scope</a>} />
      <main id="content">
        <FerraHero
          product="ferroni"
          actions={<FerraAction href="/docs/">Read the guide</FerraAction>}
        >
          <p>Introduce the work this page helps the reader do.</p>
        </FerraHero>
        <FerraSection
          id="scope"
          label="Scope"
          intro="Known inputs and limits."
          title="A clear contract."
        >
          <p>Use the project's own documentation and evidence here.</p>
        </FerraSection>
        <FerraWorkshop />
      </main>
      <FerraFooter product="ferroni" home="/" />
    </FerraPage>
  );
}
```

Place chrome outside your host framework's main landmark. The wrapper pins one
light scheme and styles only its own descendants. No Ardo imports, old family
styles, Barlow font, theme toggle or application state are required. Add a skip
link to your main landmark as usual. The existing package root and styles remain
available for pages awaiting migration.

## Components

| Export                       | Job                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `FerraPage`                  | Scoped colors, typography and paper ground; accepts native div props                                              |
| `FerraWorkshop`              | Sebastian Software and Sebastian Consulting, with original logos and registry-owned links; place above the footer |
| `FerraHeader`, `FerraFooter` | Light shared chrome and registry-owned workshop links                                                             |
| `FerraLogo`, `FerraMark`     | Real typeset name and rendered mark; marks at 32/48/64/128 CSS px                                                 |
| `FerraInstrument`            | The distinct functional hero graphic for an engine or Ferramenta                                                  |
| `FerraHero`                  | Product name, plain-language role, introduction, actions and artwork                                              |
| `FerraDocsLayout`            | Compact reading-page hero between host-owned product navigation and outline, followed by full-width sections      |
| `FerraSection`               | Narrow left introduction and broad main story; paper, pewter or plain surface                                     |
| `FerraColumns`               | Two generous reading columns, stacked on narrow screens                                                           |
| `FerraAction`                | A native link styled as a primary or secondary action                                                             |
| `FerraApplications`          | Applications with their original logos on flat light surfaces, reading the shared registry                        |
| `FerraEngineCatalog`         | All registered engines with their actual roles, descriptions and destinations                                     |
| `FerraSoftCard`              | A rounded light reading surface with native div, article, aside or section semantics                              |
| `FerraEditorial`             | A contents column beside a continuous reading flow, inside the host's main landmark                               |
| `FerraEditorialRow`          | An article beside its related notes; the notes follow the article on narrow screens                               |
| `FerraContents`              | An ungrouped, scroll-aware list with icons and descriptions, disclosed on smaller screens                         |
| `FerraEngineArticle`         | An image-first product article, registry-owned overview copy, release facts and relations                         |
| `FerraReleaseFacts`          | Current version and explicitly labeled crates.io lifetime downloads; unavailable totals remain absent             |
| `FerraNotes`                 | Several sourced aspects in one complementary card beside an article                                               |
| `FerraNote`                  | A named complementary note with an optional source link                                                           |
| `FerraCode`                  | Captioned, escaped code with keyboard-reachable horizontal scrolling                                              |
| `FerraSpecimen`              | Captioned light reading surface for actual worked-example output                                                  |
| `FerraTable`                 | Captioned native table in a named, focusable scroll region                                                        |
| `FerraBenchmarkTable`        | A keyboard-scrollable comparison table retaining native row groups, platform columns, units and source links      |
| `FerraBars`                  | Relative bars with visible values and a slot for measurement conditions                                           |

Use native `thead`, `tbody`, `th` and `td` children in `FerraTable`. Keep row
and column headers explicit. `FerraBars` requires finite nonnegative values
and a `displayValue` with units; supply the hardware, revision, conditions and
reproduction link below the bars. The family overview keeps results qualitative.

Marks and instruments are decorative by default. Supply `label` when the image
adds information beyond nearby text. Override a hero's `art` with a meaningful
worked example when appropriate. Do not repeat large instruments throughout the
body. The catalog's optional `hrefFor(tool)` changes only navigation; all facts
still come from the registry. It retains each engine's evidence, lineage and
relations. Wrap the catalog in `RegistryFacts` from the package root to render
a build-time snapshot and refresh releases after hydration; without a provider,
the registry's fallback versions remain available.

## Editorial homepages

The family homepage follows the [preferred soft-cell reference](../../design/ferra/concepts/ferramenta/soft-cell-refinement-2026-10-30/preferred-reference.png): light surfaces, restrained headings, generous inner space, image-first product stories and contextual margin notes. The contents lists independent engines without thematic categories. The earlier narrow label margin and `FerraHero` remain available for other compositions.

```tsx
import { MarkDefs, RegistryFacts } from "ferramenta-family";
import {
  FerraContents,
  FerraEditorial,
  FerraEditorialRow,
  FerraEngineArticle,
  FerraNotes,
} from "ferramenta-family/ferra";

<RegistryFacts snapshot={snapshot} snapshotGeneratedAt={generatedAt}>
  <MarkDefs />
  <FerraEditorial navigation={<FerraContents items={contents} />}>
    <header className="ferra-editorial-intro">
      <h1>The purpose of this workshop.</h1>
      <p>Introduce the work and the people behind it.</p>
    </header>
    <FerraEditorialRow
      notes={<FerraNotes label={`About ${tool.name}`} notes={tool.editorial.notes} />}
    >
      <FerraEngineArticle tool={tool} />
    </FerraEditorialRow>
  </FerraEditorial>
</RegistryFacts>;
```

`FerraSoftCard` accepts native div attributes and an optional `as` of `article`, `aside`, `section` or `div`. Supply the matching heading and accessible name when choosing a landmark. It adds a surface, padding and radius, without inventing interaction. `FerraNote` provides its own named heading. `FerraNotes` collects several sourced sections inside one named complementary card. Set `--ferra-card-padding` on a host region for narrower notes; the component owns its internal spacing while the host owns placement. All surfaces stay light. Editorial cards use a warm off-white surface against a pale pewter ground. The opening explains the choice of Rust, compatibility work and independent adoption, and links the legal workshop name to its open-source portfolio. The reduced article padding is separate from the wider margin-note padding; its attached metadata footer spans the full card width with a subtle downward tint.

Contents items have `href`, `label`, `description` and an optional `product` for a decorative family mark. Same-page entries track document position independently of their list order. At narrow widths a native button controls the single list; Enter or Space toggles it, Escape closes it and returns focus, and choosing an anchor closes the list and focuses the article. Desktop contents remain available in a sticky, vertically scrollable column. The layout supplies no second main landmark.

Each engine's optional `editorial` registry entry owns its short navigation description, subtitle, introduction, presentation order and source-backed `notes` array. The homepage shows two short aspects per engine in one adjacent card. The order is a reading choice, never a required processing chain. `FerraEngineArticle` shows the instrument before the name, subtitle and introduction; `art` can supply a host-owned worked example. The workshop note belongs beside the introduction. Applications have a standalone section heading and individual soft cards, without a surrounding card. The host mounts `MarkDefs` once for the shared line icons. `FerraHeader mark={false}` selects wordmark-only chrome without changing other consumers.

The release facts use the existing `RegistryFacts` provider and OSS Metrics merge policy. Crate downloads are lifetime totals, not people or active installations. Do not freeze versions or download counts in authored copy. A member without a verified crate does not show a fabricated zero.

The fictional specimen at `/kit/ferra/#editorial` uses these exact exports with sample copy and release data. Build shared source and its committed `dist` together before shipping a consumer update.

## Product stories and documentation

Use `FerraProductPage` for a sibling project's homepage. Its bounded reading
flow has no contents rail: stories can occupy the full width or use
`FerraEditorialRow` for an article and related margin notes. The family catalog
keeps its separate `FerraEditorial` contents column; documentation keeps its
own navigation.

`FerraProductLead` places a moderately sized instrument or worked example above
the centered title, introduction, runtime entry points, and optional byline.
Its optional `meta` footer holds release facts without a divider. Use it once,
for the page's H1. This reading order also holds at narrow widths. The product
composition uses generous section spacing instead of horizontal divider rules.

Use `FerraArticle` for a product story with an optional illustration and attached
`meta` footer. Its optional decorative `icon` supplies a small line symbol for
a feature card. `FerraFeatureGrid`, `FerraMedia`, `FerraChoices`, and
`FerraTabs` keep common content and runtime choices inside the system.

`FerraExample` combines source, host-owned controls, and actual rendered output.
`FerraToggle` is a controlled button: the host owns its pressed state and output.
No processing logic or project data lives in these presentation components.

For continuous documentation, use `FerraReadingLayout` with native content as
children and host-owned `navigation` and `outline` landmarks. It owns the bounded
reading measure, light surface, prose rhythm, source scrolling, and responsive
rails. `FerraGuideNavigation` styles the same navigation in the desktop rail or
a host's mobile panel. The host retains routing and the single main landmark.
The older `FerraDocsLayout` remains available for section-based pages.

Ardo consumers import `ferramenta-family/ferra-ardo.css` after `ferra.css`, use
`ferra-tokens ferra-ardo` on `ArdoRootLayout`, `ferra-site` on `FerraPage`, and
`ferra-ardo-shell` on `ArdoRoot`. This optional adapter owns token mapping,
header sizing, search and outline integration, and Ardo's shell spacing. It
adds no JavaScript dependency on Ardo. Consumers need no local stylesheet.
Project-specific styles are reserved for a visual requirement the library
does not support; add a reusable pattern to the package when a second site needs it.

The fictional reading and product specimens at `/kit/ferra/` use these exports.

## Ardo 6 adoption

Use `ardo dev`, `ardo build` and `ardo preview`. Extend `ardo/tsconfig`, import
React APIs from `ardo/react`, and use `ArdoLink`, `ArdoActiveLink` and
`useArdoPath` from `ardo/runtime`. Ardo owns React, React DOM and Vite; the family
package retains its React peer for consumers using other frameworks.

A landing route exports `handle = { layout: "bare" }`. In the root, place
`ArdoRoot` inside `FerraPage`, pass the Ferra header through `header`, set
`sidebar={false}` and `footer={false}`, and use `scrollMode="document"`.
Render `FerraFooter` after `ArdoRoot`, outside its main landmark. The built-in
skip link already targets that main landmark. The family homepage in `app/`
is the production example; the original `/kit/` remains available separately.
Set the favicon and touch icon through `ArdoRootLayout`'s `icon` and
`appleTouchIcon` props. Theme configuration belongs in JSX, outside
`ardo.config.ts`; Ferra's wrapper supplies its authored light scheme.

## Tokens and materials

`ferra.css` includes the generated tokens and asset rules. Import
`ferramenta-family/ferra-tokens.css` alone for a custom composition inside
`.ferra-tokens`. The exported `ferra-assets/tokens.json` has the same values.

Use semantic roles such as `--ferra-background`, `--ferra-surface`, `--ferra-text`,
`--ferra-text-secondary`, `--ferra-accent`, `--ferra-on-accent` and `--ferra-border` in
components. Layout roles include `--ferra-section-gap`, `--ferra-column-gap`,
`--ferra-margin-width`, `--ferra-gutter`, `--ferra-width` and `--ferra-measure`. Type roles
and a spacing scale are available in the same file. Override tokens on the page
wrapper, keeping contrast and the approved rhythm intact.

Headings use **IBM Plex Sans Semibold (600)** through `--ferra-font-display`.
Body text uses **system UI** through `--ferra-font-sans`; code keeps
`--ferra-font-mono`. The one WOFF2 file and its SIL Open Font License ship locally
under `ferra-assets/fonts/`. `ferra.css` loads the face automatically
with `font-display: swap`; there is no third-party font request or separate
font installation. The font manifest records the pinned upstream revision and
hashes. System body fonts vary by operating system.

For custom compositions, import `ferramenta-family/ferra-fonts.css` alongside
the token stylesheet. The final HTML designs for Ferramenta, all engines
and six core subpages live in `designs/` in the repository.

`FerraWorkshop` is the shared closing section for product and family pages.
Its two names, descriptions and destinations come from `WORKSHOP_REFERENCES` in
the registry. Their unchanged SVG logos sit on a flat light reading surface,
with no material texture, recoloring or external image request. The component
accepts optional `id` and `className` props.

The paper and pewter textures are included and resolved by the stylesheet.
Cover a single material field rather than tiling the bitmap; a visible repeat
edge breaks the surface. Materials stay light. Small technical details and code
sit on the calm reading surface.

## Standalone assets and favicons

`FerraLogo` pairs a mark with live text using the selected system UI stack.
Every identity has transparent PNG marks at 32/48/64/128/256/512px, a lossless
WebP mark, an instrument WebP, a 32/48/64px ICO and
an Apple touch icon. There is no 16px favicon. No proprietary font is bundled.

Compact marks carry their visual weight across a roughly square or circular
envelope. Equal bitmap dimensions alone are insufficient: a narrow diagonal
object can still look much smaller than its neighbors. Keep openings legible,
balance the filled silhouette, and inspect every mark at 32, 48, and 64px in
`/kit/ferra/`. Wide instruments remain separate hero assets.

All ten compact marks are authored in Blender and share the metal studio in
`design/ferra/blender/studio.py`: directional softbox reflections, fine linear
brushing, real bevels, graphite depth, restrained copper oxide, and AgX output
for the web. Reflections and self-shadowing reveal the construction; preserve
the readable silhouette instead of adding tiny mechanical detail. Every mark
has an editable `design/ferra/blender/<product>.blend` scene and a corresponding
Python entry script. The original motifs are retained as references; the shipped
marks are reproducible Cycles renders.

All ten large homepage instruments are also native Blender renders. Their
functional motifs remain separate from the compact marks. The nine Imagegen
concepts were reconstructed with detailed machined parts: keyed cassettes,
engraved scales and document marks, fitted guides, recessed hex sockets, knurled
adjusters, and a helical preview screw. Their editable scenes live in
`design/ferra/blender/heroes/`; Ferrolink keeps its existing continuity bench in
`design/ferra/blender/ferrolink.blend`. The kit's `/kit/ferra/instruments/` page
compares the retained original concepts with the current exported hero assets.

Large instruments favor low mounting plates with rounded plan corners, narrow
edge breaks and recessed fasteners, substantial tool heads, deep book-like
cassettes and housings, and visibly different solid sections. The oxide accents
use dark red-brown corrosion islands with broken edges, pitted relief and a dry
matte grain against polished steel. Recessed letterforms
have oxide inlays. Ferriki retains muted green and blue theme output; Ferrugo
uses warm ivory document faces and a visibly turned source assembly. Ferrigura's
spatial graph uses a slatted sorting conveyor: one input, a diamond-shaped switch,
and two output belts with square and round billets. The comparison page keeps
three columns: the original concept, first Blender reconstruction, and current
refined reconstruction.

Ferralk's compact symbol is a file folder with a large six-armed copper glob
wildcard. Ferrigura uses a one-to-two hierarchy: one large rectangular copper
parent above a square steel child and a circular steel child, joined by a
substantial orthogonal graphite bus. The two child silhouettes remain distinct
without letters. Their silhouettes distinguish file matching from diagram
rendering at small sizes.

Prefer a shallow three-quarter view, visible edge thickness, and small changes
of plane between simple parts. A diagram can have a few large nodes floating
at slightly different depths, joined by quiet connectors. Keep copper in the
warm oxide family: adjust part and light angles when a broad reflection makes
a face look pale or pink.

Diagram marks make their topology explicit and leave clear connector lengths
between substantial nodes. Ferrigura distinguishes its two children through
their square and circular outlines. Shape, size, material and position identify
the rectangular parent. Keep related steel faces in a similar tonal range.
Broad, controlled softbox reflections can cross the faces; preserve a visible
dark-to-light gradient instead of bleaching an entire node. Ferrigura's polished
bodies use gently crowned faces and rolling bevels. The initial supplied
hierarchy reference and Imagegen material concept are retained in
`design/ferra/concepts/ferrigura/`.

Import assets through the package exports. With Vite, for example:

```ts
import favicon from "ferramenta-family/ferra-assets/ferroni/favicon.ico?url";
import mark64 from "ferramenta-family/ferra-assets/ferroni/mark-64.png?url";
import touch from "ferramenta-family/ferra-assets/ferroni/apple-touch-icon.png?url";
```

Use your framework's head API to emit the icon links. Other bundlers may use
their own asset-import syntax or copy the exported files to public URLs. The
exported `ferra-assets/manifest.json` lists the family identities, instrument
meanings, ratios and file paths. Each raster has a provenance sidecar. Original
masters and the reproducible exporter live in `design/ferra/` in the repository.

The new entry is additive. Existing icons, documentation themes, Markdown frames
and package-root components are unchanged. Import the new stylesheet once and
adopt the new wrapper and layout on a page deliberately; loading it does not
restyle an old page. See [ADR-0010](https://github.com/sebastian-software/ferramenta/blob/main/docs/adr/0010-ferra-design-system.md).

### Benchmark comparisons

`FerraBenchmarkTable` uses `FerraTable` and accepts native table attributes, a React caption and native table children. Keep platform columns, row groups, source links, units, missing-result labels and interpretation in the consuming project. A named focusable region scrolls wide comparisons without widening the page. Values are never normalized or replaced with zero by the component. The kit uses fictional measurements.
