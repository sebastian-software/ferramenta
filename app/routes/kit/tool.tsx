import type { MetaFunction } from "react-router";

import {
  ClosingAction,
  CodePanel,
  EvidenceFigures,
  Ledger,
  Mark,
  Principles,
  ProjectHero,
  Section,
  WORKSHOP,
  WorkWithUs,
} from "ferramenta-family";
import { Link } from "react-router";

import { SAMPLE } from "../../kit/sample";
import { SampleNote } from "../../kit/SampleNote";

/** A landing page: Ardo lays it out bare, without the docs sidebar. */
export const handle = { layout: "bare" };

export const meta: MetaFunction = () => [
  { title: `${SAMPLE.title} — a sample page of the Ferramenta kit` },
  {
    name: "description",
    content: "A sample home page for an invented family member, built from the Ferramenta kit.",
  },
];

const pillars = [
  {
    heading: "Units are part of the value",
    text: "A quantity keeps its unit from the moment it is parsed. Adding meters to seconds is an error, not a number.",
  },
  {
    heading: "One code system",
    text: "Units are written the way UCUM writes them, so a value means the same thing in every system that reads it.",
  },
  {
    heading: "Exact where it can be",
    text: "Conversions between exact units stay rational. Floating point enters only where a unit's definition needs it.",
  },
  {
    heading: "No surprises at runtime",
    text: "Dimension errors surface when an expression is parsed, before any value is computed.",
  },
];

const coverage = [
  {
    name: "SI and metric units",
    status: "Covered",
    settled: true,
    detail: "Base units, derived units, and every prefix.",
  },
  {
    name: "Customary units",
    status: "Covered",
    settled: true,
    detail: "International and US customary units, with their exact definitions.",
  },
  {
    name: "Temperature scales",
    status: "Partial",
    detail: "Differences convert; absolute values on offset scales need an explicit call.",
  },
  {
    name: "Currency",
    status: "Not a target",
    detail: "A rate is data that changes, not a unit definition.",
  },
];

/** A comment line of the sample, as a string: bare `//` in JSX text reads as a stray comment. */
const CODE_COMMENT = "// Meters and seconds do not add.";

function Sample() {
  return (
    <Section
      id="sample"
      title="A quantity, parsed"
      intro="Parse a quantity, convert it, and let the engine refuse what does not add up."
    >
      <div className="kit-code-grid">
        <CodePanel caption="main.rs">
          <span className="kw">use</span> <span className="ty">ferrometro</span>::
          <span className="ty">Quantity</span>;{"\n\n"}
          <span className="kw">fn</span> <span className="fn">main</span>() -&gt;{" "}
          <span className="ty">Result</span>&lt;(), <span className="ty">ferrometro</span>::
          <span className="ty">Error</span>&gt; {"{"}
          {"\n    "}
          <span className="kw">let</span> torque: <span className="ty">Quantity</span> ={" "}
          <span className="str">&quot;5 kN.m&quot;</span>.<span className="fn">parse</span>()?;
          {"\n    "}
          <span className="mc">println!</span>(<span className="str">&quot;{"{}"}&quot;</span>,
          torque.<span className="fn">to</span>(
          <span className="str">&quot;[lbf_av].[ft_i]&quot;</span>
          )?);{"\n\n    "}
          <span className="cm">{CODE_COMMENT}</span>
          {"\n    "}
          <span className="kw">let</span> wrong = <span className="str">&quot;3 m + 2 s&quot;</span>
          .<span className="fn">parse</span>::&lt;
          <span className="ty">Quantity</span>&gt;();{"\n    "}
          <span className="mc">assert!</span>(wrong.<span className="fn">is_err</span>());
          {"\n    "}
          <span className="ty">Ok</span>(()){"\n"}
          {"}"}
        </CodePanel>
        <CodePanel caption="stdout">3687.81 [lbf_av].[ft_i]</CodePanel>
      </div>
    </Section>
  );
}

export default function SampleToolPage() {
  return (
    <div className="fam-page">
      <SampleNote />
      <ProjectHero
        title={<span translate="no">{SAMPLE.title}</span>}
        what={SAMPLE.what}
        lede="It parses quantities like 5 kN·m or 72 °F, checks that their dimensions agree, and converts between units. It follows UCUM, the code system scientific and clinical data already use for units."
        actions={
          <>
            <Link className="fam-btn fam-btn-primary" to={SAMPLE.docs}>
              Get started <Mark name="arrow" size={18} />
            </Link>
            <a className="fam-btn fam-btn-ghost" href={WORKSHOP.source}>
              <Mark name="github" size={18} /> GitHub
            </a>
          </>
        }
        install={<code translate="no">{SAMPLE.install}</code>}
        icon={SAMPLE.name}
        facts={[
          { label: "Built to", value: "UCUM" },
          { label: "Checked against", value: "UCUM functional tests" },
          { label: "Rating", value: "Alpha" },
          { label: "Release", value: "v0.0.0" },
        ]}
      />

      <Section
        title="A number without its unit is half a value."
        intro="Most software drops the unit at the first parse and hopes the next function remembers it. This engine keeps the two together."
      >
        <Principles items={pillars} />
      </Section>

      <Section
        id="evidence"
        layout="split"
        title="Measured, where it matters"
        intro="A member's page states its own figures, next to how they were measured."
        note="Sample figures. A real page names the machine, the input, and the date of the run."
        tone="dim"
      >
        <EvidenceFigures
          figures={[
            { label: "Parsing", value: "n×", detail: "A corpus of unit expressions" },
            { label: "Conversion", value: "n×", detail: "Between exact units", measure: "a vs b" },
            { label: "Allocations", value: "n", detail: "Per parsed quantity" },
            { label: "Dependencies", value: "n", detail: "Beyond the standard library" },
          ]}
        />
      </Section>

      <Sample />

      <Section
        id="coverage"
        title="What it covers"
        intro="What is covered, and as plainly what is not."
      >
        <Ledger entries={coverage} />
      </Section>

      <ClosingAction
        title="Start with one quantity"
        actions={
          <Link className="fam-btn fam-btn-primary" to={SAMPLE.docs}>
            Read the guide <Mark name="arrow" size={18} />
          </Link>
        }
        links={
          <>
            <a href={WORKSHOP.source}>
              <Mark name="github" size={14} /> Source
            </a>
            <a href={WORKSHOP.source}>
              <Mark name="crate" size={14} /> crates.io
            </a>
            <a href={WORKSHOP.source}>
              <Mark name="external" size={14} /> API reference
            </a>
          </>
        }
      >
        <p>One dependency, no build script. The guide goes from install to a checked conversion.</p>
      </ClosingAction>

      <WorkWithUs />
    </div>
  );
}
