import {
  CodePanel,
  ComparisonBars,
  ComparisonTable,
  Measured,
  Relations,
  Section,
  Voices,
} from "ferramenta-family";
import { Link } from "react-router";

import { SAMPLE } from "./sample";
import {
  SAMPLE_BARS,
  SAMPLE_CONTENDERS,
  SAMPLE_FEATURES,
  SAMPLE_MEASURED,
  SAMPLE_TIMINGS,
} from "./sample-comparison";
import { Caption, Specimen } from "./Specimen";

function Tables() {
  return (
    <>
      <Caption name="<ComparisonTable /> · <Measured />">
        A project beside the alternatives: one row per workload, its own column set apart, the
        factor last. A row where it is behind is marked, not left out. Under every measurement
        stands where and when it was taken.
      </Caption>
      <Section
        title="Measured against the alternatives"
        intro="Measurements stand flush right, in tabular figures, and the table scrolls in its own box on a narrow screen."
      >
        <ComparisonTable
          align="end"
          caption="Median time per operation; lower is faster. The factor is the quickest alternative's time over Ferrometro's."
          subject="Workload"
          contenders={SAMPLE_CONTENDERS}
          rows={SAMPLE_TIMINGS}
          verdictLabel="Factor"
        />
        <Measured {...SAMPLE_MEASURED}>
          <Link to={SAMPLE.benchmarks}>The full report, in the documentation</Link>
        </Measured>
      </Section>

      <Caption name="<ComparisonTable /> with marks">
        The same table for features: a check, a half, a cross, each with its meaning as text for a
        screen reader, and a few words wherever a plain yes or no would mislead.
      </Caption>
      <Section title="What each one covers" tone="dim">
        <ComparisonTable
          caption="Support as documented by each project."
          subject="Feature"
          contenders={SAMPLE_CONTENDERS}
          rows={SAMPLE_FEATURES}
        />
      </Section>
    </>
  );
}

/** Comparisons, relations and the code grid: the patterns several members' pages share. */
export function ComparisonSpecimens() {
  return (
    <>
      <Tables />

      <Caption name="<ComparisonBars />">
        One measure across the field, from a common baseline. Every bar carries its figure as text;
        the project&rsquo;s own bar is rust. One measure in one unit: anything wider is a table.
      </Caption>
      <Section title="One measure, as bars">
        <ComparisonBars
          caption="Parsing a corpus · thousand quantities per second · higher is faster"
          bars={SAMPLE_BARS}
        />
        <Measured {...SAMPLE_MEASURED} />
      </Section>

      <Specimen
        name="<Relations />"
        rule="Where a member fits with the others, from the registry: what it runs on, what it pairs with, what it carries. It names where two fit together and never draws a chain."
      >
        <Relations current="ferriki" />
      </Specimen>

      <Specimen
        name="<Voices />"
        rule="Outside voices on the material: verbatim, short, attributed, and linked to the source. They speak about Rust, never about the family."
      >
        <Voices
          title="The material, in other people's words"
          voices={[
            {
              quote: "A sample quote, short enough to check against its source.",
              who: "A named person",
              where: "where and when they said it",
              href: "#landing",
            },
            {
              quote: "A second voice, so the two stand side by side under their rules.",
              who: "Another named person",
              where: "the venue · the date",
            },
          ]}
        />
      </Specimen>

      <Specimen
        name="fam-code-grid"
        rule="Two code panels side by side: two APIs, or a call and what it prints. One column on a narrow screen."
      >
        <div className="fam-code-grid">
          <CodePanel caption="main.rs">
            <span className="kw">let</span> length: <span className="ty">Quantity</span> ={" "}
            <span className="str">&quot;3 m&quot;</span>.<span className="fn">parse</span>()?;
          </CodePanel>
          <CodePanel caption="stdout">3 m</CodePanel>
        </div>
      </Specimen>
    </>
  );
}
