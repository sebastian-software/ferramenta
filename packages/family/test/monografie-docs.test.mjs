/** Monografie's documentation side: its stylesheets' scope and its components' markup contracts. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";

import * as mono from "../dist/monografie.js";
import { assertInOrder, render, selectorsIn } from "./helpers.mjs";

const read = (name) => readFile(new URL(`../styles/${name}`, import.meta.url), "utf8");
const css = await read("monografie.css");
const docsCss = await read("monografie-docs.css");
const ardoCss = await read("monografie-ardo.css");

/** The Ferra components the engines' documentation pages use; each has a Mono counterpart. */
const FERRA_DOCS = [
  "FerraPage",
  "FerraReadingLayout",
  "FerraGuideNavigation",
  "FerraSectionRail",
  "FerraReadingTable",
  "FerraTableViewport",
  "FerraTable",
  "FerraTabs",
  "FerraSelect",
  "FerraChoices",
  "FerraArticle",
  "FerraFeatureGrid",
  "FerraColumns",
  "FerraBenchmarkTable",
  "FerraComparisonTable",
  "FerraMeasured",
  "FerraBars",
  "FerraCode",
  "FerraRenderedCode",
  "FerraCodePair",
  "FerraExample",
  "FerraToggle",
  "FerraSteps",
  "FerraDiagram",
  "FerraAction",
  "FerraMedia",
];

/** Every mono- class in the markup has a rule in one of the Monografie stylesheets. */
function assertStyled(html) {
  const sheets = `${css}\n${docsCss}\n${ardoCss}`;
  for (const [, list] of html.matchAll(/class="([^"]+)"/gu)) {
    for (const name of list.split(" ").filter((entry) => entry.startsWith("mono-"))) {
      assert.ok(sheets.includes(`.${name}`), `no rule for .${name}`);
    }
  }
}

test("the documentation stylesheets stay inside mono- classes and the Ardo root", () => {
  for (const [name, sheet] of [
    ["monografie-docs.css", docsCss],
    ["monografie-ardo.css", ardoCss],
  ]) {
    for (const selector of selectorsIn(sheet)) {
      assert.match(
        selector,
        /^(?:\.mono\b|:is\(\.mono\b|:root\.mono-ardo\b|html:has\(\.mono\b)/u,
        `unscoped selector in ${name}: ${selector}`,
      );
    }
    // No file of its own: an inline picture at most, so nothing can go missing.
    for (const match of sheet.matchAll(/url\("(?<target>[^"]+)"\)/gu))
      assert.ok(match.groups.target.startsWith("data:"), `${name} points at a file`);
  }
  assert.ok(css.includes(".mono-ardo {"), "the tokens also stand on the Ardo root class");
  assert.ok(ardoCss.includes("--ardo-color-brand: var(--mono-oxide)"));
});

test("every Ferra component the documentation uses has a Monografie counterpart", () => {
  for (const name of FERRA_DOCS) {
    const counterpart = name.replace(/^Ferra/u, "Mono");
    assert.equal(typeof mono[counterpart], "function", `no ${counterpart} for ${name}`);
  }
});

test("the reading layout keeps the host's navigation, the prose and the outline in order", () => {
  const navigation = [
    createElement(
      mono.MonoSectionRail,
      { key: "rail", "aria-label": "Sections" },
      createElement("a", { href: "/guide/", "data-active": "true" }, "Guide"),
    ),
    createElement(
      mono.MonoGuideNavigation,
      { key: "pages", "aria-label": "Pages" },
      createElement("a", { href: "/guide/", "aria-current": "page" }, "Start"),
    ),
  ];
  const html = render(mono.MonoReadingLayout, {
    id: "article",
    navigation,
    outline: createElement("nav", { "aria-label": "On this page" }),
    children: createElement("h1", null, "Title"),
  });
  assert.ok(html.startsWith('<article id="article" class="mono-reading">'));
  assertInOrder(
    html,
    [
      'class="mono-reading-navigation"',
      '<nav aria-label="Sections" class="mono-section-rail">',
      '<nav aria-label="Pages" class="mono-guide-navigation">',
      '<div class="mono-prose"><h1>Title</h1>',
      'class="mono-reading-outline"',
    ],
    "the reading layout",
  );
  assertStyled(html);
});

test("tables keep native geometry in a named, keyboard-scrollable region", () => {
  const reading = render(mono.MonoReadingTable, { children: createElement("tbody") });
  assert.ok(reading.includes('class="mono-table-frame mono-reading-table"'));
  assert.ok(reading.includes('aria-label="Data table" class="mono-table-region" role="region"'));
  assert.ok(reading.includes('tabindex="0"'));
  assert.ok(reading.includes('class="mono-table-hint" hidden=""'));

  const table = render(mono.MonoBenchmarkTable, {
    caption: "Median time",
    children: createElement("tbody"),
  });
  const id = /<caption id="([^"]+)">Median time<\/caption>/u.exec(table)?.[1];
  assert.ok(id, "the caption names the table");
  assert.ok(table.includes(`aria-labelledby="${id}"`), "the caption names the region");
  assert.ok(table.includes('class="mono-data-table mono-benchmark-table"'));
  assertStyled(`${reading}${table}`);
  for (const name of ["name", "detail", "source", "conformance", "reference"])
    assert.ok(docsCss.includes(`.mono-benchmark-${name}`), `no rule for mono-benchmark-${name}`);
});

test("the comparison table sets the own column apart and says every mark in words", () => {
  const html = render(mono.MonoComparisonTable, {
    caption: "Features",
    subject: "Feature",
    contenders: [
      { id: "own", label: "Own", own: true },
      { id: "other", label: "Other" },
    ],
    rows: [
      {
        label: "Captures",
        detail: "Named ones too.",
        values: { own: true, other: { mark: "partial", note: "Numbered only" } },
      },
      { label: "Lookbehind", values: { own: true, other: false } },
      { label: "Unknown", values: { own: "1.0" } },
    ],
    align: "end",
  });
  assert.ok(
    html.includes('<table data-align="end" class="mono-data-table mono-comparison-table">'),
  );
  assert.ok(html.includes('<th scope="col" data-own="true">Own</th>'));
  assert.ok(html.includes('<span class="mono-comparison-detail">Named ones too.</span>'));
  assert.ok(html.includes("<td>Partial: Numbered only</td>"));
  assert.ok(html.includes("<td>No</td>"));
  assert.ok(html.includes("<td>—</td>"), "a missing cell is a dash");
  assertStyled(html);
});

test("bars scale to the largest value and set only the engine's own bar in rust", () => {
  const html = render(mono.MonoBars, {
    caption: "Throughput",
    items: [
      { id: "own", label: "Own", value: 8, displayValue: "8 M", highlight: true },
      { id: "other", label: "Other", value: 2, displayValue: "2 M" },
    ],
    children: "Invented.",
  });
  assert.ok(html.includes('class="mono-bar mono-own" style="width:100%"'));
  assert.ok(html.includes('class="mono-bar" style="width:25%"'));
  assert.equal((html.match(/mono-own/gu) ?? []).length, 2, "the bar and its value");
  assert.ok(html.includes('<div class="mono-measure-note">Invented.</div>'));
  assertStyled(html);
  assert.throws(
    () =>
      render(mono.MonoBars, {
        caption: "Bad",
        items: [{ id: "x", label: "X", value: -1, displayValue: "-1" }],
      }),
    RangeError,
  );
});

test("rendered code keeps its renderer's background and can be scrolled by keyboard", () => {
  const html = render(mono.MonoRenderedCode, {
    caption: "Output",
    html: '<pre class="shiki" style="background-color:#fff;color:#000"><code>x</code></pre>',
  });
  assert.ok(html.includes('<pre tabindex="0" class="shiki"'));
  assert.ok(html.includes("background-color:#fff !important"));
  const pair = render(mono.MonoCodePair, { children: "pair" });
  assert.ok(pair.startsWith('<div class="mono-code-pair">'));
  const code = render(mono.MonoCode, { caption: "Config", file: "a.toml", children: "a = 1" });
  assert.ok(code.includes('<span class="mono-code-file">a.toml</span>'));
  assert.ok(code.includes('<pre tabindex="0"><code>a = 1</code></pre>'));
  const diagram = render(mono.MonoDiagram, {
    caption: "Flow",
    label: "A flow",
    svg: "<svg></svg>",
  });
  assert.ok(diagram.includes('role="region"'));
  assert.ok(diagram.includes('role="img" aria-label="A flow"'));
  assertStyled(`${html}${pair}${code}${diagram}`);
});

test("examples, toggles and selects keep their Ferra contracts", () => {
  const example = render(mono.MonoExample, {
    title: "Convert",
    introduction: "Intro.",
    source: "convert(x)",
    controls: createElement(mono.MonoToggle, {
      label: "Exact",
      description: "Keep fractions.",
      pressed: true,
    }),
    footer: "Footnote.",
    children: createElement("p", null, "1 m"),
  });
  const id = /<h3 id="([^"]+)">Convert<\/h3>/u.exec(example)?.[1];
  assert.ok(example.includes(`<section class="mono-example" aria-labelledby="${id}">`));
  assertInOrder(
    example,
    ["mono-example-controls", 'aria-pressed="true"', ">Source<", "convert(x)", ">Result<", "1 m"],
    "the example",
  );
  const select = render(mono.MonoSelect, {
    label: "Input",
    options: [{ value: "a", label: "A" }],
    defaultValue: "a",
  });
  assert.ok(select.startsWith('<label class="mono-select"><span>Input</span><select>'));
  assert.ok(select.includes('<option value="a" selected="">A</option>'));
  const steps = render(mono.MonoSteps, {
    caption: "Steps",
    items: [{ heading: "Parse", text: "Reads." }],
  });
  const measured = render(mono.MonoMeasured, { on: "Today", machine: "Laptop", children: "Run" });
  assertInOrder(measured, ["Measured", "Today", "Machine", "Laptop", "Reproduce", "Run"], "facts");
  assertStyled(`${example}${select}${steps}${measured}`);
});

test("stories, related links and actions keep their Ferra contracts", () => {
  const article = render(mono.MonoArticle, {
    id: "story",
    title: "A story",
    introduction: "Intro.",
    meta: "Facts",
    children: createElement("p", null, "Copy."),
  });
  assert.ok(article.includes('aria-labelledby="story-title"'));
  assert.ok(article.includes('<h2 id="story-title">A story</h2>'));
  assert.ok(article.includes('<footer class="mono-article-meta">Facts</footer>'));
  const parts = [
    render(mono.MonoTabs, { "aria-label": "Runtimes" }),
    render(mono.MonoChoices, { children: createElement("article") }),
    render(mono.MonoMedia, { children: createElement("img", { alt: "" }) }),
    render(mono.MonoColumns, {}),
    render(mono.MonoFeatureGrid, { items: [{ heading: "One", text: "Text." }] }),
  ].join("");
  assertStyled(`${article}${parts}`);
  const primary = render(mono.MonoAction, { href: "/a", variant: "primary", children: "A" });
  const secondary = render(mono.MonoAction, { href: "/b", variant: "secondary", children: "B" });
  assert.ok(primary.includes('data-primary=""'));
  assert.ok(!secondary.includes("data-primary"));
});
