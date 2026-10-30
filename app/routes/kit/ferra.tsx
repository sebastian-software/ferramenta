import type { ArdoMetaFunction as MetaFunction } from "ardo/runtime";

import {
  FERRA_PRODUCTS,
  FerraAction,
  FerraApplications,
  FerraBars,
  FerraBenchmarkTable,
  FerraCode,
  FerraColumns,
  FerraDocsLayout,
  FerraEngineCatalog,
  FerraFooter,
  FerraHeader,
  FerraHero,
  FerraInstrument,
  FerraMark,
  FerraPage,
  FerraSection,
  FerraSpecimen,
  FerraTable,
  FerraWorkshop,
} from "ferramenta-family/ferra";
import favicon from "ferramenta-family/ferra-assets/ferramenta/favicon.ico?url";
import assets from "ferramenta-family/ferra-assets/manifest.json?url";
import tokens from "ferramenta-family/ferra-assets/tokens.json?url";
import { displayName } from "ferramenta-family/registry";
import "ferramenta-family/ferra.css";

import "../../styles/ferra-kit.css";
import {
  ProductPageSpecimen,
  ProductStorySpecimen,
  ReadingSpecimen,
} from "../../kit/ferra-reading";
import { FerraEditorialSpecimen } from "../../kit/FerraEditorialSpecimen";

export const handle = { layout: "bare" };
export const meta: MetaFunction = () => [
  { title: "Ferra kit — Ferramenta" },
  {
    name: "description",
    content: "The shared Ferra tokens, original identities, textures and React layout components.",
  },
];

const colors = ["paper", "reading", "pewter", "ink", "muted", "oxide"];
const example = `import { FerraPage, FerraHero } from "ferramenta-family/ferra";
import "ferramenta-family/ferra.css";

<FerraPage>
  <FerraHero product="ferroni" />
</FerraPage>`;

export default function FerraKit() {
  return (
    <FerraPage className="ferra-kit">
      <FerraHeader
        home="/kit/ferra/"
        nav={
          <>
            <a href="#foundations">Foundations</a>
            <a href="#identities">Identities</a>
            <a href="#layouts">Layouts</a>
            <a href="#editorial">Soft cards</a>
            <a href="/kit/ferra/instruments/">Instrument comparison</a>
            <a href="/kit/">Original kit</a>
          </>
        }
      />
      <div id="ferra-main">
        <FerraHero
          product="ferramenta"
          title="Ferra."
          what="One shared kit. A lighter family."
          actions={
            <>
              <FerraAction href="#layouts">Explore the components</FerraAction>
              <FerraAction
                href={assets}
                variant="secondary"
                download="ferramenta-ferra-assets.json"
              >
                Asset manifest
              </FerraAction>
            </>
          }
        >
          <p>
            Warm paper, matte pewter and precise mechanical objects. Real components from{" "}
            <code>ferramenta-family/ferra</code>, ready for a family overview, a product homepage or
            a reading page.
          </p>
        </FerraHero>
        <FerraSection
          id="foundations"
          label="Foundations"
          intro="A small shared vocabulary for color, type and space."
          title="Materials with room to breathe."
        >
          <p>
            The approved palette and layout scale are exported as CSS custom properties and JSON.
            This page uses the package files directly.
          </p>
          <ul className="ferra-kit-swatches">
            {colors.map((color) => (
              <li key={color}>
                <span
                  className="ferra-kit-swatch"
                  style={{ background: `var(--ferra-${color})` }}
                />
                <code>--ferra-{color}</code>
              </li>
            ))}
          </ul>
          <FerraTable caption="The tokens a page composes with">
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">CSS token</th>
                <th scope="col">Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Reading</th>
                <td>
                  <code>--ferra-text / --ferra-surface</code>
                </td>
                <td>Calm text and code surfaces</td>
              </tr>
              <tr>
                <th scope="row">Action</th>
                <td>
                  <code>--ferra-accent / --ferra-on-accent</code>
                </td>
                <td>Oxide links and primary actions</td>
              </tr>
              <tr>
                <th scope="row">Rhythm</th>
                <td>
                  <code>--ferra-section-gap</code>
                </td>
                <td>Space between ferra stories</td>
              </tr>
              <tr>
                <th scope="row">Columns</th>
                <td>
                  <code>--ferra-column-gap</code>
                </td>
                <td>Space between reading columns</td>
              </tr>
              <tr>
                <th scope="row">Measure</th>
                <td>
                  <code>--ferra-measure</code>
                </td>
                <td>Readable paragraph length</td>
              </tr>
            </tbody>
          </FerraTable>
          <p>
            <a href={tokens} download="ferramenta-ferra-tokens.json">
              Download the token JSON
            </a>
            . Headings use the locally bundled IBM Plex Sans Semibold. Body text uses the visitor's
            system UI font; code keeps the system monospace stack. No third-party font service is
            contacted.
          </p>
        </FerraSection>
        <FerraSection
          id="identities"
          label="Identities"
          intro="One family, a distinct rendered mark for every engine."
          title="A clear mark for every tool."
          surface="pewter"
        >
          <p>
            Real original assets, with separate simplified marks for small uses and meaningful
            instrument graphics for heroes. The icon kit includes PNGs and 32/48/64px ICO favicons.
          </p>
          <div className="ferra-kit-sizes">
            {([32, 48, 64, 128] as const).map((size) => (
              <figure key={size}>
                <FerraMark
                  product="ferramenta"
                  size={size}
                  label={`Ferramenta mark at ${size}px`}
                />
                <figcaption>{size} px</figcaption>
              </figure>
            ))}
          </div>
          <ul className="ferra-kit-identities">
            {FERRA_PRODUCTS.map((product) => (
              <li key={product}>
                <span>{displayName(product)}</span>
                <div className="ferra-kit-mark-scales">
                  {([32, 48, 64] as const).map((size) => (
                    <figure key={size}>
                      <FerraMark
                        product={product}
                        size={size}
                        label={`${displayName(product)} mark at ${size}px`}
                      />
                      <figcaption>{size} px</figcaption>
                    </figure>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <details className="ferra-kit-instruments">
            <summary>See all instrument graphics</summary>
            <div className="ferra-kit-instrument-grid">
              {FERRA_PRODUCTS.map((product) => (
                <figure key={product}>
                  <FerraInstrument
                    product={product}
                    label={`${displayName(product)} instrument graphic`}
                  />
                  <figcaption>{displayName(product)}</figcaption>
                </figure>
              ))}
            </div>
          </details>
          <p>
            <a href="/kit/ferra/instruments/">Compare the original and rebuilt hero instruments</a>.
          </p>
          <p>
            <a href={favicon} download>
              Download the Ferramenta favicon
            </a>
            . The asset manifest lists each product's matching files and the physical meaning of its
            graphic.
          </p>
        </FerraSection>
        <FerraSection
          id="layouts"
          label="Layouts"
          intro="The narrow introductory margin, broad reading column and generous gutters."
          title="Compose a page from shared parts."
        >
          <p>
            <code>FerraPage</code> pins the light scheme. Header, hero, sections, columns and footer
            share the same spacing tokens. The introductory margin moves above the story on a narrow
            screen.
          </p>
          <FerraCode caption="A minimal consumer" file="page.tsx">
            {example}
          </FerraCode>
          <FerraColumns>
            <div>
              <h3>Use text for the story.</h3>
              <p>
                Keep the large instrument in the hero. Lower sections can combine prose, examples,
                comparisons and notes without becoming a wall of pictures.
              </p>
            </div>
            <div>
              <h3>Keep the purpose visible.</h3>
              <p>
                A section keeps its heading and introduction together. Surfaces may change from
                paper to light pewter while the reading rhythm stays consistent.
              </p>
            </div>
          </FerraColumns>
          <FerraColumns>
            <FerraCode caption="Source example" file="example.ts">
              const answer = 42;
            </FerraCode>
            <FerraCode caption="Rendered result" file="output.txt">
              The answer is 42.
            </FerraCode>
          </FerraColumns>
        </FerraSection>
        <FerraEditorialSpecimen />
        <ProductStorySpecimen />
        <ProductPageSpecimen />
        <ReadingSpecimen />
        <FerraDocsLayout
          aria-labelledby="docs-specimen-title"
          hero={
            <header>
              <h2 id="docs-specimen-title">A Ferrometro guide.</h2>
              <p>A fictional reading page, composed with host-owned navigation and an outline.</p>
            </header>
          }
          navigation={
            <nav aria-label="Sample documentation">
              <p>Ferrometro</p>
              <a href="#sample-input" aria-current="page">
                Getting started
              </a>
            </nav>
          }
          outline={
            <nav aria-label="Sample page outline">
              <p>On this page</p>
              <a href="#sample-input-title">Choose an input.</a>
            </nav>
          }
        >
          <FerraSection
            id="sample-input"
            label="Documentation"
            intro="An invented tool, showing the shared reading layout."
            title="Choose an input."
            surface="pewter"
          >
            <p>
              The host supplies the hero, navigation and outline. The package keeps their responsive
              arrangement and leaves the main landmark to the host.
            </p>
          </FerraSection>
        </FerraDocsLayout>
        <FerraSection
          id="evidence"
          label="Evidence"
          intro="Tables and charts that keep their conditions attached."
          title="Explain the result, then show it."
          surface="plain"
        >
          <p>
            These are fictional measurements for the invented sample tool Ferrometro. They
            demonstrate the components and make no claim about any engine.
          </p>
          <FerraBenchmarkTable caption="Illustrative time per document; lower is faster">
            <thead>
              <tr>
                <th scope="col">Workload</th>
                <th scope="col">Ferrometro</th>
                <th scope="col">Reference</th>
                <th scope="col">Conditions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Short document</th>
                <td>2 ms</td>
                <td>3 ms</td>
                <td>Warm run, one document</td>
              </tr>
              <tr>
                <th scope="row">Long document</th>
                <td>9 ms</td>
                <td>8 ms</td>
                <td>Warm run, one document</td>
              </tr>
            </tbody>
          </FerraBenchmarkTable>
          <FerraBars
            caption="Illustrative throughput, relative units; higher is faster"
            items={[
              {
                id: "sample",
                label: "Ferrometro",
                value: 100,
                displayValue: "100 units",
                highlight: true,
              },
              { id: "reference", label: "Reference", value: 80, displayValue: "80 units" },
              { id: "baseline", label: "Baseline", value: 60, displayValue: "60 units" },
            ]}
          >
            <p>
              Fictional sample data. A real product supplies the measured values, units, hardware,
              revision and reproduction link.
            </p>
          </FerraBars>
        </FerraSection>
        <FerraSection
          id="catalog"
          label="Family catalog"
          intro="Names, roles and destinations come from the shared registry."
          title="Every engine, one source of facts."
        >
          <p>
            <code>FerraEngineCatalog</code> reads the registry directly. The applications keep their
            own brands and are not rendered as engines.
          </p>
          <FerraEngineCatalog />
          <FerraSpecimen caption="The shared typography contract">
            <h3>IBM Plex Sans, for headings.</h3>
            <p>
              System UI for reading, system monospace for code. One local webfont at weight 600.
            </p>
          </FerraSpecimen>
        </FerraSection>
        <FerraSection
          id="applications"
          label="Applications"
          intro="Independent brands on light reading surfaces."
          title="The applications keep their identity."
        >
          <FerraApplications />
        </FerraSection>
        <FerraWorkshop id="workshop-links" />
      </div>
      <FerraFooter home="/kit/ferra/">
        <a href="/kit/">Original kit</a>
      </FerraFooter>
    </FerraPage>
  );
}
