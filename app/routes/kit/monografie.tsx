import type { ArdoMetaFunction as MetaFunction } from "ardo/runtime";

import { useState } from "ardo/react";
import {
  MonoAction,
  MonoBarChart,
  type MonoBarRow,
  MonoCaption,
  MonoCard,
  MonoCards,
  MonoClosing,
  MonoColophon,
  MonoCredit,
  MonoEngraving,
  MonoFacing,
  MonoFooter,
  MonoHeader,
  MonoLeadIn,
  MonoOpening,
  MonoPage,
  MonoPassage,
  MonoProofs,
  MonoSection,
  MonoSegmented,
  MonoSheet,
  MonoTableView,
  MonoTerms,
  MonoVerdict,
  MonoWide,
} from "ferramenta-family/monografie";
import "ferramenta-family/monografie.css";

import { SAMPLE } from "../../kit/sample";

export const handle = { layout: "bare" };
export const meta: MetaFunction = () => [
  { title: "Monografie kit — Ferramenta" },
  {
    name: "description",
    content:
      "The Monografie page system for engine homepages, rendered from the package with an invented tool.",
  },
];

/* Invented figures for an invented tool: the kit never shows a real member's results. */
const SPEED: Record<string, MonoBarRow[]> = {
  convert: [
    { id: "sample", label: SAMPLE.title, sub: "Rust", value: 1, own: true },
    { id: "a", label: "Library A", sub: "Rust", value: 2.4 },
    { id: "b", label: "Library B", sub: "C", value: 0.8 },
    { id: "c", label: "Library C", sub: "Python", value: 14.2 },
  ],
  parse: [
    { id: "sample", label: SAMPLE.title, sub: "Rust", value: 1, own: true },
    { id: "a", label: "Library A", sub: "Rust", value: 1.3 },
    { id: "b", label: "Library B", sub: "C", value: 1.1 },
    { id: "c", label: "Library C", sub: "Python", value: 6.5 },
  ],
};

function describeRow(row: MonoBarRow, cut: boolean) {
  return `${row.label} takes ${row.value.toFixed(2)}× the time${cut ? ", past the end of the scale" : ""}.`;
}

function SpeedChart() {
  const [task, setTask] = useState("convert");
  const rows = SPEED[task];
  return (
    <MonoBarChart
      label={`Time for the same work, ${task}`}
      title="Time for the same work"
      description={`${SAMPLE.title} = 1×, the line through every row. Invented figures.`}
      toggles={
        <MonoSegmented
          label="Task"
          value={task}
          onChange={setTask}
          options={[
            { value: "convert", label: "Convert" },
            { value: "parse", label: "Parse" },
          ]}
        />
      }
      rows={rows}
      scale={4}
      ticks={[1, 2, 3, 4]}
      describe={describeRow}
      after={
        <>
          Every figure on this page is invented.
          <MonoTableView>
            <table className="mono-table">
              <thead>
                <tr>
                  <th scope="col">Library</th>
                  <th scope="col" className="mono-num">
                    Relative time
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.label}</td>
                    <td className="mono-num">{row.value.toFixed(2)}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </MonoTableView>
        </>
      }
      conditions={
        <>
          <h3>How this was measured</h3>
          <p>It was not: the kit shows the chart, not a result.</p>
        </>
      }
    />
  );
}

export default function MonografieKit() {
  return (
    <MonoPage>
      <MonoHeader
        product="ferramenta"
        home="/kit/monografie/"
        release="0.0.0"
        links={[
          <a key="kit" href="/kit/">
            Kit
          </a>,
          <a key="ferra" href="/kit/ferra/">
            Ferra
          </a>,
          <a key="speed" href="#speed">
            Chart
          </a>,
        ]}
      />
      <main id="mono-main">
        <MonoOpening
          product="ferramenta"
          instrumentLabel="Ferramenta's instrument: a precision register holding independent tool inserts."
          caption="The opening plate shows the member's own instrument, centered on open paper."
          kicker={`${SAMPLE.title} 0.0, an invented engine for the kit`}
          title="One reading column."
          subtitle="Specimens that widen, notes in the margin."
          standfirst={`Monografie is the page system for engine homepages. This page shows every part with ${SAMPLE.title}, a tool that does not exist, so no figure here is real.`}
          actions={
            <>
              <MonoAction href="#speed" primary detail={SAMPLE.install}>
                The primary action
              </MonoAction>
              <MonoAction href="/kit/" detail="Back to the kit">
                A second action
              </MonoAction>
            </>
          }
          facts={[
            {
              value: (
                <>
                  <em>12</em> of 12
                </>
              ),
              label: "invented checks passed",
            },
            { value: "1.0×", label: "the engine's own time" },
            { value: "Rust 1.0+", label: "an invented requirement" },
            { value: "MIT", label: "a sample license line" },
          ]}
        />
        <MonoEngraving seed={1} />
        <MonoSection
          title="A passage with a note."
          standfirst="The standfirst sets up the section in one or two sentences."
        >
          <MonoPassage
            note={{
              term: "Margin note",
              children: "Explains a term beside the passage that uses it.",
            }}
          >
            <p>
              <MonoLeadIn>Reading text</MonoLeadIn> stays in the visitor&rsquo;s system font on a
              column narrow enough for comfortable lines. Notes sit in the margins on wide screens
              and move into the text on narrow ones.
            </p>
          </MonoPassage>
          <MonoPassage
            note={{ side: "right", figure: "57", children: "a figure set large in a note" }}
          >
            <p>Figures in notes use the monospace face, so they read as measurements.</p>
          </MonoPassage>
          <MonoWide>
            <MonoFacing>
              <MonoSheet label="As typed" meta="input.txt">
                <pre>{"3 ft 4 in\n12 km/h"}</pre>
              </MonoSheet>
              <MonoSheet label="As converted" meta="convert()">
                <p>1.016 m</p>
                <p>3.333 m/s</p>
              </MonoSheet>
            </MonoFacing>
            <MonoCaption>
              Facing pages hold real output on a member&rsquo;s page; here it is a sample.
            </MonoCaption>
          </MonoWide>
        </MonoSection>
        <MonoEngraving seed={2} />
        <section id="speed" aria-label="Chart">
          <div className="mono-axis">
            <MonoWide>
              <SpeedChart />
            </MonoWide>
          </div>
        </section>
        <MonoEngraving seed={3} />
        <MonoSection title="Terms, proofs and cards.">
          <MonoWide>
            <MonoTerms
              items={[
                { term: "parser", description: "Reads the input" },
                { term: "units", description: "The unit tables" },
                { term: "convert", description: "Converts between units" },
                { term: "format", description: "Writes the result" },
              ]}
            />
            <MonoTerms
              prose
              columns={3}
              items={[
                { term: "At build time", description: "A prose term list, three columns." },
                { term: "In your release", description: "Terms in the reading face." },
                { term: "On each start", description: "Each with one line." },
              ]}
            />
          </MonoWide>
          <MonoProofs
            items={[
              { label: "invented_suite.rs", value: "120 / 120" },
              { label: "another_suite.rs", value: "48 / 48" },
            ]}
          />
          <MonoWide>
            <MonoCards>
              <MonoCard title="A card" api="convert()">
                <pre>convert("3 ft", "m")</pre>
                <MonoVerdict>A verdict line under the code.</MonoVerdict>
              </MonoCard>
              <MonoCard title="Another card" api="parse()">
                <pre>parse("12 km/h")</pre>
              </MonoCard>
              <MonoCard title="A third card">
                <MonoVerdict>Cards hold short, real examples on a member&rsquo;s page.</MonoVerdict>
              </MonoCard>
            </MonoCards>
            <MonoCredit>Credits and footnotes sit under a specimen.</MonoCredit>
          </MonoWide>
        </MonoSection>
        <MonoEngraving seed={4} />
        <MonoColophon>
          The colophon names the work a member continues and the workshop that makes it.
        </MonoColophon>
        <MonoClosing
          title="The closing repeats the actions."
          standfirst="One sentence on where to start."
          actions={
            <MonoAction href="#mono-main" primary detail={SAMPLE.install}>
              Start here
            </MonoAction>
          }
          links={
            <>
              <a href="/kit/">The kit</a> <a href="/kit/ferra/">The Ferra kit</a>
            </>
          }
        />
      </main>
      <MonoFooter product="ferramenta" home="/kit/monografie/" />
    </MonoPage>
  );
}
