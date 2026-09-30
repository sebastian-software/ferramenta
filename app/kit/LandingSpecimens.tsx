import {
  ApplicationsBand,
  ClosingAction,
  CodePanel,
  EngineCatalog,
  EvidenceFigures,
  family,
  HangingTag,
  IronBand,
  Ledger,
  Mark,
  Plate,
  Principles,
  RunSample,
  Section,
  Stamp,
  StampKey,
  WorkWithUs,
} from "ferramenta-family";
import { Link } from "react-router";

import pipelineSample from "../data/pipeline-sample.json";
import { SAMPLE } from "./sample";
import { Caption, Chapter, Specimen } from "./Specimen";

const principles = [
  { heading: "One heading", text: "A principle is a heading and two sentences at most." },
  { heading: "Two to four", text: "Three read best side by side. Four still fit a wide screen." },
  { heading: "No icons", text: "The heavy rule above each one is all the ornament it gets." },
];

/** The first engine of the catalog, as the one row the kit shows. */
const sampleEngines = family.filter((tool) => tool.name === "ferroni");

function Buttons() {
  return (
    <>
      <Specimen
        name="fam-btn"
        rule="One primary action per view, in black steel. Beside it, an engraved outline in the surface's own ink."
      >
        <div className="kit-row">
          <a className="fam-btn fam-btn-primary" href="#landing">
            Get started <Mark name="arrow" size={18} />
          </a>
          <a className="fam-btn fam-btn-ghost" href="#landing">
            <Mark name="github" size={18} /> GitHub
          </a>
        </div>
      </Specimen>
      <div className="wrap">
        <div className="kit-stage fam-band on-iron">
          <div className="kit-row">
            <a className="fam-btn fam-btn-primary" href="#landing">
              Get started <Mark name="arrow" size={18} />
            </a>
            <a className="fam-btn fam-btn-ghost" href="#landing">
              <Mark name="github" size={18} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function Plates() {
  return (
    <>
      <Specimen
        name="<Plate /> · <HangingTag />"
        rule="The family's one prop. The plate says what a thing is; its measured facts hang below it on a tag, on a dark inlay."
      >
        <div className="kit-stage fam-band on-iron">
          <Plate className="kit-plate">
            <b>Ferroni</b>
            <span>A regex engine</span>
          </Plate>
          <HangingTag
            facts={[
              { label: "Succeeds", value: "Oniguruma" },
              { label: "Rating", value: "Stable" },
            ]}
          />
        </div>
      </Specimen>
      <Specimen
        name="<Stamp /> · <StampKey />"
        rule="A status, lettered like a plate: for a coverage ledger, or for a project that wants to show its maturity. Filled with rust once it is settled. The family page shows none."
      >
        <div className="kit-row">
          <Stamp solid>stable</Stamp>
          <Stamp>beta</Stamp>
          <Stamp>alpha</Stamp>
          <Stamp>early</Stamp>
        </div>
        <StampKey />
      </Specimen>
    </>
  );
}

/** A comment line of the sample, as a string: bare `//` in JSX text reads as a stray comment. */
const CODE_COMMENT = "// Sanitized by default.";

function Proof() {
  return (
    <>
      <Caption name={'<Section layout="split"> · <EvidenceFigures />'}>
        Measured figures, each on a small plate. A project&rsquo;s own site shows them, with where
        and when they were measured in the note. The family site never repeats a figure.
      </Caption>
      <Section
        layout="split"
        title="Evidence beside its claim"
        intro="The split layout puts the heading and its note beside the content."
        note="Sample figures. A real page states the machine, the input and the date."
      >
        <EvidenceFigures
          figures={[
            { label: "Sample input", value: "n×", detail: "What was measured" },
            { label: "Another input", value: "n×", detail: "On which data", measure: "a vs b" },
          ]}
        />
      </Section>

      <Caption name="<CodePanel /> · <RunSample />">
        Code sits on black steel in every scheme. A run sample shows a tool&rsquo;s real output
        beside its input; this one is the committed output of Ferromark with Ferriki on Ferroni.
      </Caption>
      <Section title="A tool, run for real" tone="dim">
        <RunSample
          input={pipelineSample.markdown}
          inputCaption="quick-start.md"
          inputKind="Markdown source"
          output={pipelineSample.html}
          outputCaption="Rendered by Ferromark with Ferriki on Ferroni, unedited"
        />
        <CodePanel caption="main.rs">
          <span className="kw">use</span> <span className="ty">ferromark</span>::to_html;{"\n\n"}
          <span className="kw">fn</span> <span className="fn">main</span>() {"{"}
          {"\n    "}
          <span className="cm">{CODE_COMMENT}</span>
          {"\n    "}
          <span className="kw">let</span> html = <span className="fn">to_html</span>(
          <span className="str">&quot;Hello, **world**!&quot;</span>);{"\n"}
          {"}"}
        </CodePanel>
      </Section>

      <Caption name="<Ledger />">
        A coverage ledger: what is covered, and as plainly what is not.
      </Caption>
      <Section title="What it covers">
        <Ledger
          entries={[
            { name: "The common case", status: "Covered", settled: true, detail: "In full." },
            { name: "The rare case", status: "Partial", detail: "What is missing, in a sentence." },
            { name: "The other thing", status: "Not a target", detail: "And why not." },
          ]}
        />
      </Section>
    </>
  );
}

function Closers() {
  return (
    <>
      <Caption name="<ClosingAction />">
        The flat, ruled return to the one action the page is for. No plate, no new material.
      </Caption>
      <ClosingAction
        title="Back to the one action"
        actions={
          <Link className="fam-btn fam-btn-primary" to={SAMPLE.home}>
            See the sample tool page <Mark name="arrow" size={18} />
          </Link>
        }
        links={
          <Link to={SAMPLE.docs}>
            The sample documentation <Mark name="arrow" size={14} />
          </Link>
        }
      >
        <p>Copy on the left, the action on the right, and a mono line of links under the copy.</p>
      </ClosingAction>

      <Caption name="<WorkWithUs />">
        The rust band a family page closes on. One action, to the workshop&rsquo;s consulting site.
      </Caption>
      <WorkWithUs id="kit-work" />
    </>
  );
}

/** The patterns a family home page is built from, each as a page shows it. */
export function LandingSpecimens() {
  return (
    <Chapter
      id="landing"
      title="Landing kit"
      intro={
        <>
          The patterns a member&rsquo;s home page is built from. The hero is on the{" "}
          <Link to={SAMPLE.home}>sample tool page</Link>, where it has a whole first viewport.
        </>
      }
    >
      <Buttons />
      <Plates />

      <Caption name="<EngineCatalog />">
        One row per engine: the plate says what it is, the copy what it does and for whom, and only
        then where it comes from. The facts are last and quiet.
      </Caption>
      <div className="wrap">
        <EngineCatalog tools={sampleEngines} />
      </div>

      <Caption name="<ApplicationsBand />">
        The applications on light cards: a foreign logo keeps its own colors only on a light ground,
        so the brand shows in the logo, the rule above the card and the action. One that runs on
        family engines leads and names them.
      </Caption>
      <ApplicationsBand id="kit-applications" title="What the engines carry" />

      <Caption name="<Principles /> · <IronBand />">
        What a project stands on, side by side under heavy rules. On the ground, or on black steel
        as a page&rsquo;s dark passage.
      </Caption>
      <div className="wrap kit-gap">
        <Principles items={principles} />
      </div>
      <IronBand title="The same, on black steel" rows={principles} />

      <Proof />
      <Closers />
    </Chapter>
  );
}
