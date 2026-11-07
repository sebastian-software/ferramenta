import { useState } from "ardo/react";
import { Mark } from "ferramenta-family";
import {
  MonoAction,
  MonoArticle,
  MonoBars,
  MonoBenchmarkTable,
  MonoChoices,
  MonoCode,
  MonoCodePair,
  MonoColumns,
  MonoComparisonTable,
  MonoDiagram,
  MonoExample,
  MonoFeatureGrid,
  MonoMeasured,
  MonoMedia,
  MonoRenderedCode,
  MonoSelect,
  MonoSteps,
  MonoTable,
  MonoTabs,
  MonoToggle,
} from "ferramenta-family/monografie";

import { SAMPLE } from "./sample";

/*
 * The parts of a Monografie documentation page, about the invented tool. Every
 * figure here is invented: the kit never shows a real member's results.
 */

const PAGE = "/kit/monografie/docs/";

export function RuntimeTabs() {
  return (
    <MonoTabs aria-label="Runtimes">
      <a href={PAGE} aria-current="page">
        Rust
      </a>
      <a href={`${PAGE}#install`}>Node.js</a>
      <a href={`${PAGE}#install`}>WebAssembly</a>
    </MonoTabs>
  );
}

const SAMPLES = {
  length: { source: 'convert("3 ft 4 in", "m")', plain: "1.016 m", exact: "1.016 m (exact)" },
  speed: { source: 'convert("12 km/h", "m/s")', plain: "3.333 m/s", exact: "10/3 m/s" },
  long: {
    source: 'convert("a deliberately long fictional quantity of 3 ft 4 in", "m")',
    plain: "1.016 m",
    exact: "1.016 m (exact)",
  },
} as const;
type SampleKey = keyof typeof SAMPLES;
const isSampleKey = (value: string): value is SampleKey => Object.hasOwn(SAMPLES, value);

/** A controlled worked example: the page owns the state and the output it shows. */
export function ConvertExample() {
  const [sample, setSample] = useState<SampleKey>("length");
  const [exact, setExact] = useState(false);
  const chosen = SAMPLES[sample];
  return (
    <>
      <MonoSelect
        label="Input"
        options={[
          { value: "length", label: "A length in feet and inches" },
          { value: "speed", label: "A speed in kilometers per hour" },
          {
            value: "long",
            label:
              "A deliberately long fictional input name that should fit even the narrowest column",
          },
        ]}
        value={sample}
        onChange={(event) => {
          const { value } = event.currentTarget;
          if (isSampleKey(value)) setSample(value);
        }}
        aria-controls="mono-convert-result"
      />
      <MonoExample
        title="Convert a quantity"
        introduction="The source on the left, the result on the right; the option changes how the result is written."
        source={chosen.source}
        controls={
          <MonoToggle
            label="Exact fractions"
            description="Keep a ratio instead of rounding it. An invented option."
            pressed={exact}
            onClick={() => {
              setExact(!exact);
            }}
          />
        }
        footer={<p>Invented output: {SAMPLE.title} does not exist.</p>}
      >
        <div id="mono-convert-result">
          <p>
            <mark>{exact ? chosen.exact : chosen.plain}</mark>
          </p>
          <table>
            <caption>Dimensions</caption>
            <thead>
              <tr>
                <th scope="col">Quantity</th>
                <th scope="col" align="right">
                  Exponent
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Length</td>
                <td align="right">1</td>
              </tr>
              <tr>
                <td>Time</td>
                <td align="right">{sample === "speed" ? "−1" : "0"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </MonoExample>
    </>
  );
}

const RENDERED_INPUT =
  '<pre class="shiki" style="background-color:#fbfaf7;color:#3a3631"><code><span class="line"><span style="color:#7a3a22">let</span> q = ferrometro::parse(<span style="color:#3f6b4f">"12 km/h"</span>)?;</span>\n<span class="line"><span style="color:#7a3a22">let</span> v = q.to(<span style="color:#3f6b4f">"m/s"</span>)?;</span></code></pre>';
const RENDERED_OUTPUT =
  '<pre class="shiki" style="background-color:#f4f6f8;color:#24323f"><code><span class="line">Quantity { value: <span style="color:#1d5e8c">3.333</span>, unit: <span style="color:#7a3a22">"m/s"</span> }</span></code></pre>';
const DIAGRAM =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 110"><g fill="#fcfbf9" stroke="#8d897f"><rect x="10" y="25" width="140" height="60" rx="2"/><rect x="190" y="25" width="140" height="60" rx="2"/><rect x="370" y="25" width="140" height="60" rx="2"/></g><path d="M150 55h34m-8-6 8 6-8 6M330 55h34m-8-6 8 6-8 6" fill="none" stroke="#7a3a22"/><g fill="#26231f" font-family="system-ui, sans-serif" font-size="16" text-anchor="middle"><text x="80" y="60">Parse</text><text x="260" y="60">Check</text><text x="440" y="60">Convert</text></g></svg>';

/** Rendered code, a diagram, steps and features: how the sample explains its model. */
export function ModelSpecimens() {
  return (
    <>
      <MonoCodePair>
        <MonoRenderedCode
          caption={
            <>
              Your code<span>Highlighted at build time</span>
            </>
          }
          html={RENDERED_INPUT}
        />
        <MonoRenderedCode
          caption={
            <>
              What it prints<span>Invented output</span>
            </>
          }
          html={RENDERED_OUTPUT}
        />
      </MonoCodePair>
      <MonoDiagram
        caption="One conversion, three steps · selectable labels"
        label="A quantity is parsed, its dimensions are checked, then it is converted."
        svg={DIAGRAM}
      />
      <MonoSteps
        caption="What a conversion does"
        items={[
          { heading: "Parse", text: "Reads the number and the unit as written." },
          { heading: "Check", text: "Refuses units whose dimensions differ." },
          { heading: "Convert", text: "Scales the value by the ratio of the units." },
        ]}
      />
      <MonoFeatureGrid
        items={[
          { heading: "One notation", text: "Units are read the way UCUM writes them." },
          { heading: "Checked dimensions", text: "Meters never become seconds by accident." },
          { heading: "Exact ratios", text: "Fractions stay fractions until you round." },
        ]}
      />
    </>
  );
}

/** Options as a captioned table and a configuration file on a code sheet. */
export function ConfigurationSpecimens() {
  return (
    <>
      <MonoTable caption="Options of convert()">
        <thead>
          <tr>
            <th scope="col">Option</th>
            <th scope="col">Default</th>
            <th scope="col">What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <code>exact</code>
            </th>
            <td>
              <code>false</code>
            </td>
            <td>Keeps ratios as fractions instead of rounding them.</td>
          </tr>
          <tr>
            <th scope="row">
              <code>precision</code>
            </th>
            <td>
              <code>4</code>
            </td>
            <td>Significant digits of a rounded result.</td>
          </tr>
        </tbody>
      </MonoTable>
      <MonoCode caption="A project-wide default" file="ferrometro.toml">
        {'[convert]\nexact = true\nprecision = 6\n\n[units]\nextra = ["furlong", "fortnight"]'}
      </MonoCode>
      <MonoColumns>
        <MonoArticle
          id="added-units"
          title="Units you add"
          icon={<Mark name="document" size={24} />}
          meta={<p>Read from ferrometro.toml at start.</p>}
        >
          <p>Define a unit once by its ratio to a known one; every conversion can use it.</p>
        </MonoArticle>
        <MonoArticle
          id="left-out-units"
          title="Units you leave out"
          icon={<Mark name="pen" size={24} />}
          meta={<a href={`${PAGE}#configuration`}>The unit table</a>}
        >
          <p>Turn off groups you never read, so a typo cannot match an unexpected unit.</p>
        </MonoArticle>
      </MonoColumns>
      <MonoMedia>
        <img
          src={`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1360" height="120" viewBox="0 0 1360 120"><path d="M20 80H1340" stroke="#8d897f"/><path d="M20 50V80M360 60V80M700 50V80M1040 60V80M1340 50V80" stroke="#26231f"/><path d="M190 70V80M530 70V80M870 70V80M1190 70V80" stroke="#8d897f"/></svg>')}`}
          width={1360}
          height={120}
          alt="A ruler with major marks at equal distances and minor marks between them."
        />
      </MonoMedia>
    </>
  );
}

/** Bars, a benchmark table, a comparison and the conditions: every figure invented. */
export function PerformanceSpecimens() {
  return (
    <>
      <MonoBars
        caption="Conversions per second, more is better · invented figures"
        items={[
          { id: "sample", label: SAMPLE.title, value: 9.2, displayValue: "9.2 M", highlight: true },
          { id: "a", label: "Library A", value: 6.1, displayValue: "6.1 M" },
          { id: "b", label: "Library B", value: 2.4, displayValue: "2.4 M" },
          { id: "c", label: "Library C", value: 0.7, displayValue: "0.7 M" },
        ]}
      >
        The kit shows the bars, not a result.
      </MonoBars>
      <MonoBenchmarkTable caption="Median time per input · invented figures">
        <thead>
          <tr>
            <th scope="col">Input</th>
            <th scope="col" align="right">
              {SAMPLE.title}
            </th>
            <th scope="col" align="right">
              Library A
            </th>
            <th scope="col" className="mono-benchmark-conformance">
              Agrees
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <span className="mono-benchmark-name">
                Lengths<sup>1</sup>
              </span>
              <span className="mono-benchmark-detail">10 000 values</span>
            </th>
            <td align="right">1.2 ms</td>
            <td align="right">1.9 ms</td>
            <td>
              <a className="mono-benchmark-source" href={`${PAGE}#performance`}>
                Yes
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span className="mono-benchmark-name">Speeds</span>
              <span className="mono-benchmark-detail">2 500 values</span>
            </th>
            <td align="right">0.4 ms</td>
            <td align="right">0.4 ms</td>
            <td>
              Yes <span className="mono-benchmark-reference">reference</span>
            </td>
          </tr>
        </tbody>
      </MonoBenchmarkTable>
      <MonoComparisonTable
        caption="What each library accepts · illustrative, not measured"
        subject="Input"
        contenders={[
          { id: "sample", label: SAMPLE.title, own: true },
          { id: "a", label: "Library A" },
          { id: "b", label: "Library B" },
        ]}
        rows={[
          {
            label: "Compound units",
            detail: "Such as km/h or kg·m/s².",
            values: { sample: true, a: true, b: { mark: "partial", note: "One division only" } },
          },
          {
            label: "Exact ratios",
            values: { sample: true, a: false, b: false },
          },
          {
            label: "Units added at runtime",
            values: { sample: true, a: { mark: "partial", note: "At build time" }, b: undefined },
          },
        ]}
      />
      <MonoMeasured on="An invented date" machine="An illustrative laptop" revision="0000000">
        <a href={`${PAGE}#performance`}>How the invented figures were made</a>
      </MonoMeasured>
    </>
  );
}

/** Related destinations and the actions that close a guide. */
export function NextSteps() {
  return (
    <>
      <MonoChoices>
        <article>
          <h3>Add your own units</h3>
          <p>Define a unit by its ratio and use it everywhere.</p>
          <a href={`${PAGE}#configuration`}>Configuration</a>
        </article>
        <article>
          <h3>Measure it yourself</h3>
          <p>Run the invented benchmarks on your own machine.</p>
          <a href={`${PAGE}#performance`}>Performance</a>
        </article>
      </MonoChoices>
      <div className="mono-actions">
        <MonoAction href={`${PAGE}#install`} variant="primary" detail={SAMPLE.install}>
          Install {SAMPLE.title}
        </MonoAction>
        <MonoAction href="/kit/monografie/" detail="The homepage parts">
          Back to the kit
        </MonoAction>
      </div>
    </>
  );
}
