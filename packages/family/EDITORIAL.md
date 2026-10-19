# Warm editorial kit

Build the approved light family look with an additive entry and one stylesheet:

```tsx
import {
  EditorialAction,
  EditorialFooter,
  EditorialHeader,
  EditorialHero,
  EditorialPage,
  EditorialSection,
  EditorialWorkshop,
} from "ferramenta-family/editorial";
import "ferramenta-family/editorial.css";

export default function Home() {
  return (
    <EditorialPage>
      <EditorialHeader product="ferroni" home="/" nav={<a href="#scope">Scope</a>} />
      <main id="content">
        <EditorialHero
          product="ferroni"
          actions={<EditorialAction href="/docs/">Read the guide</EditorialAction>}
        >
          <p>Introduce the work this page helps the reader do.</p>
        </EditorialHero>
        <EditorialSection
          id="scope"
          label="Scope"
          intro="Known inputs and limits."
          title="A clear contract."
        >
          <p>Use the project's own documentation and evidence here.</p>
        </EditorialSection>
        <EditorialWorkshop />
      </main>
      <EditorialFooter product="ferroni" home="/" />
    </EditorialPage>
  );
}
```

Place chrome outside your host framework's main landmark. The wrapper pins one
light scheme and styles only its own descendants. No Ardo imports, old family
styles, Barlow font, theme toggle or application state are required. Add a skip
link to your main landmark as usual. The existing package root and styles remain
available for pages awaiting migration.

## Components

| Export                               | Job                                                                                                               |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `EditorialPage`                      | Scoped colors, typography and paper ground; accepts native div props                                              |
| `EditorialWorkshop`                  | Sebastian Software and Sebastian Consulting, with original logos and registry-owned links; place above the footer |
| `EditorialHeader`, `EditorialFooter` | Light shared chrome and registry-owned workshop links                                                             |
| `EditorialLogo`, `EditorialMark`     | Real typeset name and rendered mark; marks at 32/48/64/128 CSS px                                                 |
| `EditorialInstrument`                | The distinct functional hero graphic for an engine or Ferramenta                                                  |
| `EditorialHero`                      | Product name, plain-language role, introduction, actions and artwork                                              |
| `EditorialSection`                   | Narrow left introduction and broad main story; paper, pewter or plain surface                                     |
| `EditorialColumns`                   | Two generous reading columns, stacked on narrow screens                                                           |
| `EditorialAction`                    | A native link styled as a primary or secondary action                                                             |
| `EditorialEngineCatalog`             | All registered engines with their actual roles, descriptions and destinations                                     |
| `EditorialCode`                      | Captioned, escaped code with keyboard-reachable horizontal scrolling                                              |
| `EditorialSpecimen`                  | Captioned light reading surface for actual worked-example output                                                  |
| `EditorialTable`                     | Captioned native table in a named, focusable scroll region                                                        |
| `EditorialBars`                      | Relative bars with visible values and a slot for measurement conditions                                           |

Use native `thead`, `tbody`, `th` and `td` children in `EditorialTable`. Keep row
and column headers explicit. `EditorialBars` requires finite nonnegative values
and a `displayValue` with units; supply the hardware, revision, conditions and
reproduction link below the bars. The family overview keeps results qualitative.

Marks and instruments are decorative by default. Supply `label` when the image
adds information beyond nearby text. Override a hero's `art` with a meaningful
worked example when appropriate. Do not repeat large instruments throughout the
body. The catalog's optional `hrefFor(tool)` changes only navigation; all facts
still come from the registry.

## Tokens and materials

`editorial.css` includes the generated tokens and asset rules. Import
`ferramenta-family/editorial-tokens.css` alone for a custom composition inside
`.fe-tokens`. The exported `editorial-assets/tokens.json` has the same values.

Use semantic roles such as `--fe-background`, `--fe-surface`, `--fe-text`,
`--fe-text-secondary`, `--fe-accent`, `--fe-on-accent` and `--fe-border` in
components. Layout roles include `--fe-section-gap`, `--fe-column-gap`,
`--fe-margin-width`, `--fe-gutter`, `--fe-width` and `--fe-measure`. Type roles
and a spacing scale are available in the same file. Override tokens on the page
wrapper, keeping contrast and the approved rhythm intact.

Headings use **IBM Plex Sans Semibold (600)** through `--fe-font-display`.
Body text uses **system UI** through `--fe-font-sans`; code keeps
`--fe-font-mono`. The one WOFF2 file and its SIL Open Font License ship locally
under `editorial-assets/fonts/`. `editorial.css` loads the face automatically
with `font-display: swap`; there is no third-party font request or separate
font installation. The font manifest records the pinned upstream revision and
hashes. System body fonts vary by operating system.

For custom compositions, import `ferramenta-family/editorial-fonts.css` alongside
the token stylesheet. The optional comparison in
`designs/round-08-ferramenta/typography.html` retains the previous Helvetica
stack and Instrument Sans as alternatives. Current native HTML designs for
Ferramenta, all seven engines and six core subpages live in `designs/current/`.

`EditorialWorkshop` is the shared closing section for product and family pages.
Its two names, descriptions and destinations come from `WORKSHOP_REFERENCES` in
the registry. Their unchanged SVG logos sit on a flat light reading surface,
with no material texture, recoloring or external image request. The component
accepts optional `id` and `className` props.

The paper and pewter textures are included and resolved by the stylesheet.
Cover a single material field rather than tiling the bitmap; a visible repeat
edge breaks the surface. Materials stay light. Small technical details and code
sit on the calm reading surface.

## Standalone assets and favicons

Every identity has transparent PNG marks at 32/48/64/128/256/512px, a lossless
WebP mark, an instrument WebP, a horizontal typeset lockup, a 32/48/64px ICO and
an Apple touch icon. There is no 16px favicon. No proprietary font is bundled.

Import assets through the package exports. With Vite, for example:

```ts
import favicon from "ferramenta-family/editorial-assets/ferroni/favicon.ico?url";
import mark64 from "ferramenta-family/editorial-assets/ferroni/mark-64.png?url";
import touch from "ferramenta-family/editorial-assets/ferroni/apple-touch-icon.png?url";
```

Use your framework's head API to emit the icon links. Other bundlers may use
their own asset-import syntax or copy the exported files to public URLs. The
exported `editorial-assets/manifest.json` lists the eight identities, instrument
meanings, ratios and file paths. Each raster has a provenance sidecar. Original
masters and the reproducible exporter live in `design/editorial/` in the repository.

The new entry is additive. Existing icons, documentation themes, Markdown frames
and package-root components are unchanged. Import the new stylesheet once and
adopt the new wrapper and layout on a page deliberately; loading it does not
restyle an old page. See [ADR-0010](https://github.com/sebastian-software/ferramenta/blob/main/docs/adr/0010-warm-editorial-family-kit.md).
