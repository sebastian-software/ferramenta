import { useState } from "ardo/react";
import { Mark } from "ferramenta-family";
import {
  FerraArticle,
  FerraChoices,
  FerraColumns,
  FerraExample,
  FerraFeatureGrid,
  FerraGuideNavigation,
  FerraProductLead,
  FerraProductPage,
  FerraReadingLayout,
  FerraTabs,
  FerraToggle,
} from "ferramenta-family/ferra";

export function ReadingSpecimen() {
  return (
    <FerraReadingLayout
      id="reading-specimen"
      navigation={
        <FerraGuideNavigation aria-label="Fictional guide">
          <a href="#sample-reading" aria-current="page">
            Getting started
          </a>
          <p>Ferrometro guide</p>
          <a href="#sample-reading-code">Measure an input</a>
        </FerraGuideNavigation>
      }
      outline={
        <nav aria-label="Fictional outline">
          <p>On this page</p>
          <a href="#sample-reading-code">Measure an input</a>
        </nav>
      }
    >
      <header id="sample-reading">
        <p>Ferrometro / Guide</p>
        <h2>A calm reading surface.</h2>
      </header>
      <FerraTabs aria-label="Fictional runtimes">
        <a href="#sample-reading" aria-current="page">
          Rust
        </a>
        <a href="#sample-reading">Node.js</a>
      </FerraTabs>
      <p>
        This invented guide shows a bounded text column, consistent paragraph spacing and a clear
        relationship between headings, code and tables. Its navigation and outline belong to the
        host.
      </p>
      <h3 id="sample-reading-code">Measure an input</h3>
      <p>
        The fictional <code>measure()</code> function returns a result for the selected input. Long
        identifiers wrap in prose; source examples retain their own horizontal scrolling.
      </p>
      <pre tabIndex={0}>
        <code>let result = ferrometro::measure("sample")?;</code>
      </pre>
      <FerraChoices>
        <article>
          <h3>Read a document</h3>
          <p>Start with one input and inspect the result.</p>
          <a href="#sample-reading">Read the sample</a>
        </article>
        <article>
          <h3>Compare a collection</h3>
          <p>Keep the same conditions across inputs.</p>
          <a href="#sample-reading">Compare inputs</a>
        </article>
      </FerraChoices>
    </FerraReadingLayout>
  );
}

export function ProductStorySpecimen() {
  const [enabled, setEnabled] = useState(true);
  return (
    <FerraArticle
      id="product-story"
      title="A story with its evidence attached."
      introduction="Fictional Ferrometro content; no engine claims or measured results."
      meta={<p>Illustrative example, supplied by the host.</p>}
    >
      <FerraFeatureGrid
        items={[
          { heading: "A focused tool", text: "The project supplies facts and content." },
          {
            heading: "A shared presentation",
            text: "The package owns the typography and spacing.",
          },
        ]}
      />
      <FerraExample
        title="A controlled example"
        source="sample input"
        controls={
          <FerraToggle
            label="Include context"
            description="A fictional option, controlled by this specimen."
            pressed={enabled}
            onClick={() => {
              setEnabled(!enabled);
            }}
          />
        }
      >
        <p>{enabled ? "Sample output with context." : "Sample output."}</p>
      </FerraExample>
    </FerraArticle>
  );
}

export function ProductPageSpecimen() {
  return (
    <FerraProductPage id="product-page-specimen">
      <FerraProductLead
        headingLevel={2}
        title="A fictional instrument, ready to use."
        introduction="Ferrometro shows the shared product composition with sample content."
        art={<p>Host-owned illustration or worked example</p>}
        byline="A fictional project for the design kit."
        meta={<p>Sample release information belongs to the project.</p>}
      >
        <a href="#product-story">Explore the fictional example</a>
      </FerraProductLead>
      <FerraColumns>
        <FerraArticle title="A focused tool." icon={<Mark name="document" size={28} />}>
          <p>The project supplies the facts and the examples.</p>
        </FerraArticle>
        <FerraArticle title="A shared presentation." icon={<Mark name="pen" size={28} />}>
          <p>The package owns the surfaces, typography and generous section spacing.</p>
        </FerraArticle>
      </FerraColumns>
    </FerraProductPage>
  );
}
