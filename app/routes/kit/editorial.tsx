import type { MetaFunction } from "react-router";

import {
  EDITORIAL_PRODUCTS,
  EditorialAction,
  EditorialBars,
  EditorialCode,
  EditorialColumns,
  EditorialEngineCatalog,
  EditorialFooter,
  EditorialHeader,
  EditorialHero,
  EditorialInstrument,
  EditorialMark,
  EditorialPage,
  EditorialSection,
  EditorialSpecimen,
  EditorialTable,
  EditorialWorkshop,
} from "ferramenta-family/editorial";
import favicon from "ferramenta-family/editorial-assets/ferramenta/favicon.ico?url";
import assets from "ferramenta-family/editorial-assets/manifest.json?url";
import tokens from "ferramenta-family/editorial-assets/tokens.json?url";
import { displayName } from "ferramenta-family/registry";
import "ferramenta-family/editorial.css";

import "../../styles/editorial-kit.css";

export const handle = { layout: "bare" };
export const meta: MetaFunction = () => [
  { title: "Warm editorial kit — Ferramenta" },
  {
    name: "description",
    content:
      "The shared warm editorial tokens, original identities, textures and React layout components.",
  },
];

const colors = ["paper", "reading", "pewter", "ink", "muted", "oxide"];
const example = `import { EditorialPage, EditorialHero } from "ferramenta-family/editorial";
import "ferramenta-family/editorial.css";

<EditorialPage>
  <EditorialHero product="ferroni" />
</EditorialPage>`;

export default function EditorialKit() {
  return (
    <EditorialPage className="fe-kit">
      <EditorialHeader
        home="/kit/editorial/"
        nav={
          <>
            <a href="#foundations">Foundations</a>
            <a href="#identities">Identities</a>
            <a href="#layouts">Layouts</a>
            <a href="/kit/">Original kit</a>
          </>
        }
      />
      <div id="editorial-main">
        <EditorialHero
          product="ferramenta"
          title="Warm editorial."
          what="One shared kit. A lighter family."
          actions={
            <>
              <EditorialAction href="#layouts">Explore the components</EditorialAction>
              <EditorialAction
                href={assets}
                variant="secondary"
                download="ferramenta-editorial-assets.json"
              >
                Asset manifest
              </EditorialAction>
            </>
          }
        >
          <p>
            Warm paper, matte pewter and precise mechanical objects. Real components from{" "}
            <code>ferramenta-family/editorial</code>, ready for a family overview, a product
            homepage or a reading page.
          </p>
        </EditorialHero>
        <EditorialSection
          id="foundations"
          label="Foundations"
          intro="A small shared vocabulary for color, type and space."
          title="Materials with room to breathe."
        >
          <p>
            The approved palette and layout scale are exported as CSS custom properties and JSON.
            This page uses the package files directly.
          </p>
          <ul className="fe-kit-swatches">
            {colors.map((color) => (
              <li key={color}>
                <span className="fe-kit-swatch" style={{ background: `var(--fe-${color})` }} />
                <code>--fe-{color}</code>
              </li>
            ))}
          </ul>
          <EditorialTable caption="The tokens a page composes with">
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
                  <code>--fe-text / --fe-surface</code>
                </td>
                <td>Calm text and code surfaces</td>
              </tr>
              <tr>
                <th scope="row">Action</th>
                <td>
                  <code>--fe-accent / --fe-on-accent</code>
                </td>
                <td>Oxide links and primary actions</td>
              </tr>
              <tr>
                <th scope="row">Rhythm</th>
                <td>
                  <code>--fe-section-gap</code>
                </td>
                <td>Space between editorial stories</td>
              </tr>
              <tr>
                <th scope="row">Columns</th>
                <td>
                  <code>--fe-column-gap</code>
                </td>
                <td>Space between reading columns</td>
              </tr>
              <tr>
                <th scope="row">Measure</th>
                <td>
                  <code>--fe-measure</code>
                </td>
                <td>Readable paragraph length</td>
              </tr>
            </tbody>
          </EditorialTable>
          <p>
            <a href={tokens} download="ferramenta-editorial-tokens.json">
              Download the token JSON
            </a>
            . Headings use the locally bundled IBM Plex Sans Semibold. Body text uses the visitor's
            system UI font; code keeps the system monospace stack. No third-party font service is
            contacted.
          </p>
        </EditorialSection>
        <EditorialSection
          id="identities"
          label="Identities"
          intro="One family, eight distinct rendered marks."
          title="A clear mark for every tool."
          surface="pewter"
        >
          <p>
            Real original assets, with separate simplified marks for small uses and meaningful
            instrument graphics for heroes. The icon kit includes PNGs and 32/48/64px ICO favicons.
          </p>
          <div className="fe-kit-sizes">
            {([32, 48, 64, 128] as const).map((size) => (
              <figure key={size}>
                <EditorialMark
                  product="ferramenta"
                  size={size}
                  label={`Ferramenta mark at ${size}px`}
                />
                <figcaption>{size} px</figcaption>
              </figure>
            ))}
          </div>
          <ul className="fe-kit-identities">
            {EDITORIAL_PRODUCTS.map((product) => (
              <li key={product}>
                <EditorialMark product={product} size={64} />
                <span>{displayName(product)}</span>
              </li>
            ))}
          </ul>
          <details className="fe-kit-instruments">
            <summary>See all eight instrument graphics</summary>
            <div className="fe-kit-instrument-grid">
              {EDITORIAL_PRODUCTS.map((product) => (
                <figure key={product}>
                  <EditorialInstrument
                    product={product}
                    label={`${displayName(product)} instrument graphic`}
                  />
                  <figcaption>{displayName(product)}</figcaption>
                </figure>
              ))}
            </div>
          </details>
          <p>
            <a href={favicon} download>
              Download the Ferramenta favicon
            </a>
            . The asset manifest lists each product's matching files and the physical meaning of its
            graphic.
          </p>
        </EditorialSection>
        <EditorialSection
          id="layouts"
          label="Layouts"
          intro="The narrow introductory margin, broad reading column and generous gutters."
          title="Compose a page from shared parts."
        >
          <p>
            <code>EditorialPage</code> pins the light scheme. Header, hero, sections, columns and
            footer share the same spacing tokens. The introductory margin moves above the story on a
            narrow screen.
          </p>
          <EditorialCode caption="A minimal consumer" file="page.tsx">
            {example}
          </EditorialCode>
          <EditorialColumns>
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
          </EditorialColumns>
          <EditorialColumns>
            <EditorialCode caption="Source example" file="example.ts">
              const answer = 42;
            </EditorialCode>
            <EditorialCode caption="Rendered result" file="output.txt">
              The answer is 42.
            </EditorialCode>
          </EditorialColumns>
        </EditorialSection>
        <EditorialSection
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
          <EditorialTable caption="Illustrative time per document; lower is faster">
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
          </EditorialTable>
          <EditorialBars
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
          </EditorialBars>
        </EditorialSection>
        <EditorialSection
          id="catalog"
          label="Family catalog"
          intro="Names, roles and destinations come from the shared registry."
          title="Seven engines, one source of facts."
        >
          <p>
            <code>EditorialEngineCatalog</code> reads the registry directly. The applications keep
            their own brands and are not rendered as engines.
          </p>
          <EditorialEngineCatalog />
          <EditorialSpecimen caption="The shared typography contract">
            <h3>IBM Plex Sans, for headings.</h3>
            <p>
              System UI for reading, system monospace for code. One local webfont at weight 600.
            </p>
          </EditorialSpecimen>
        </EditorialSection>
        <EditorialWorkshop id="workshop-links" />
      </div>
      <EditorialFooter home="/kit/editorial/">
        <a href="/kit/">Original kit</a>
      </EditorialFooter>
    </EditorialPage>
  );
}
