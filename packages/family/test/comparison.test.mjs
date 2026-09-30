/**
 * The patterns several members' pages share: a project beside the
 * alternatives (a table, bars, where it was measured), where a member fits
 * with the others, and the two stylesheet contracts behind them: they hold
 * inside a host's documentation, and a header can carry the host's search.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { assertInOrder, kit, render } from "./helpers.mjs";

const stylesheet = (name) => readFile(new URL(`../styles/${name}`, import.meta.url), "utf8");

const contenders = [
  { id: "own", label: "Ours", own: true },
  { id: "other", label: "Theirs" },
];

test("a comparison is a real table with the project's own column set apart", () => {
  const html = render(kit.ComparisonTable, {
    align: "end",
    caption: "Median time; lower is faster.",
    contenders,
    rows: [
      { label: "Parse", detail: "A corpus", values: { own: "1 ms", other: "2 ms" }, verdict: "2×" },
      { label: "Convert", values: { own: "3 ms" }, verdict: "0.5×", behind: true },
    ],
    subject: "Workload",
    verdictLabel: "Factor",
  });
  assert.match(
    html,
    /^<figure class="fam-compare" data-align="end" style="--fam-compare-columns:3">/u,
  );
  const captionId = /<figcaption class="fam-compare-caption" id="(?<id>[^"]+)">/u.exec(html).groups
    .id;
  assert.ok(
    html.includes(
      `<div class="fam-compare-scroll" role="region" aria-labelledby="${captionId}" tabindex="0">`,
    ),
    "the scroll box is a named region a keyboard can reach",
  );
  assertInOrder(
    html,
    [
      '<th scope="col">Workload</th>',
      '<th scope="col" data-own="">Ours</th>',
      '<th scope="col">Theirs</th>',
      '<th scope="col">Factor</th>',
      '<th scope="row">Parse<small>A corpus</small></th>',
      '<td data-own="">1 ms</td>',
      "<td>2 ms</td>",
      '<td class="fam-compare-verdict">2×</td>',
      '<tr data-behind="">',
      '<span class="fam-sr-only">No value</span>',
      '<td class="fam-compare-verdict">0.5×</td>',
    ],
    "head, then one row per workload; a missing cell is a dash with its meaning",
  );
});

test("a mark carries its meaning as text, and a table without verdicts has no such column", () => {
  const html = render(kit.ComparisonTable, {
    caption: "Support.",
    contenders,
    rows: [
      { label: "Prefixes", values: { own: true, other: false } },
      { label: "Codes", values: { own: { mark: "partial", note: "Common units" }, other: true } },
    ],
    subject: "Feature",
  });
  assert.ok(!html.includes("data-align"), "cells start-aligned unless told otherwise");
  assert.ok(!html.includes("fam-compare-verdict"), "no verdict column without its heading");
  assert.ok(html.includes('style="--fam-compare-columns:2"'));
  assertInOrder(
    html,
    [
      '<span class="fam-compare-mark" data-mark="yes"><svg class="icon" width="18" height="18" aria-hidden="true"><use href="#i-check"></use></svg><span class="fam-sr-only">Yes</span></span>',
      'data-mark="no"',
      '<use href="#i-cross"></use></svg><span class="fam-sr-only">No</span>',
      'data-mark="partial"',
      '<use href="#i-half"></use></svg><span class="fam-sr-only">Partial: </span>Common units</span>',
    ],
    "a check, a cross, a half: each with its word for a screen reader",
  );
  for (const symbol of ["check", "half", "cross"]) {
    assert.ok(kit.MARK_DEFS.includes(`<symbol id="i-${symbol}"`), `the sprite has no ${symbol}`);
  }
});

test("bars share one baseline, and every bar states its figure as text", () => {
  const html = render(kit.ComparisonBars, {
    bars: [
      { label: "Ours", detail: "Rust", value: 200, own: true },
      { label: "Theirs", value: 50, text: "50 MiB/s" },
    ],
    caption: "Throughput; higher is faster.",
  });
  assertInOrder(
    html,
    [
      '<figure class="fam-bars"><figcaption class="fam-compare-caption">Throughput; higher is faster.</figcaption>',
      '<li class="fam-bar" data-own="" style="--fam-bar:100.00%">',
      "<b>Ours</b><small>Rust</small>",
      '<span class="fam-bar-track" aria-hidden="true"></span><span class="fam-bar-value">200</span>',
      '<li class="fam-bar" style="--fam-bar:25.00%">',
      '<span class="fam-bar-value">50 MiB/s</span>',
    ],
    "the longest bar is full width, the others a share of it",
  );
  const scaled = render(kit.ComparisonBars, {
    bars: [{ label: "Ours", value: 50 }],
    caption: "c",
    max: 200,
  });
  assert.ok(scaled.includes('style="--fam-bar:25.00%"'), "`max` sets what a full bar stands for");
});

test("a measurement says when, on what, at which revision, and how to reproduce it", () => {
  const html = render(kit.Measured, {
    children: "the report",
    machine: "Apple M1 Pro",
    more: [{ label: "Corpus", value: "50 documents" }],
    on: "2026-09-23",
    revision: "2f109a75",
  });
  assert.equal(
    html,
    '<dl class="fam-measured"><div><dt>Measured</dt><dd>2026-09-23</dd></div><div><dt>Machine</dt><dd>Apple M1 Pro</dd></div><div><dt>Revision</dt><dd>2f109a75</dd></div><div><dt>Corpus</dt><dd>50 documents</dd></div><div><dt>Reproduce</dt><dd>the report</dd></div></dl>',
  );
  const short = render(kit.Measured, { machine: "m", on: "d" });
  assert.ok(!short.includes("Revision") && !short.includes("Reproduce"));
});

test("relations name where a member fits with the others, and nothing for one that stands alone", () => {
  const ferriki = render(kit.Relations, { current: "ferriki" });
  assertInOrder(
    ferriki,
    [
      '<dl class="fam-relations">',
      "<dt>Runs on</dt>",
      '<a class="fam-chip" href="https://ferroni.dev">',
      "<b>ferroni</b>Regex engine",
      "<dt>Pairs with</dt>",
      "<b>ferromark</b>",
    ],
    "what it runs on, then what it pairs with",
  );
  assert.ok(!ferriki.includes("Carries"), "no empty group");
  assert.ok(render(kit.Relations, { current: "ferroni" }).includes("<dt>Carries</dt>"));
  assert.equal(render(kit.Relations, { current: "ferrugo" }), "", "a member that stands alone");
  assert.equal(render(kit.Relations, { current: "nope" }), "", "an unknown name renders nothing");
});

test("comparisons hold inside a host's documentation", async () => {
  const landing = await stylesheet("landing.css");
  // A host styles bare `table`, `th`, `ul`, `li` with one class and one element; two classes outrank that.
  for (const selector of [
    ".fam-compare .fam-compare-table {",
    ".fam-compare .fam-compare-table th,\n.fam-compare .fam-compare-table td {",
    ".fam-bars .fam-bars-list {",
    ".fam-bars .fam-bar {",
  ]) {
    assert.ok(landing.includes(`\n${selector}`), `landing.css has no rule ${selector}`);
  }
  const scroll = landing.slice(landing.indexOf("\n.fam-compare-scroll {"));
  const rule = scroll.slice(0, scroll.indexOf("}"));
  assert.match(rule, /overflow-x: auto/u, "a wide table scrolls in its own box");
  assert.match(
    rule,
    /position: relative/u,
    "the marks' hidden text is positioned: outside a positioned scroll box it widens the page",
  );
  assert.match(rule, /min-width: 100%/u, "the box fills its column without sizing it");
  assert.ok(
    landing.includes("\n.fam-code-grid {"),
    "two code panels side by side are a shared class",
  );

  const docs = await stylesheet("docs.css");
  assert.match(
    docs,
    /\.fam-docs-shell #main-content :where\(th\) \{\n {2}text-transform: none;/u,
    "a unit in a table head keeps its case: uppercase turns µs into MS",
  );
});

test("a header carries the host's search, on a row of its own where the bar is full", async () => {
  const chrome = await stylesheet("chrome.css");
  assert.ok(chrome.includes("\n.site-search {"), "chrome.css has no search slot");
  assert.match(
    chrome,
    /@media \(max-width: 64rem\) \{\n {2}\.site-header:has\(\.site-search\) \.bar \{[^}]*padding-bottom: 3\.5rem;/u,
    "the search row is the bar's bottom padding",
  );
  const docs = await stylesheet("docs.css");
  assert.match(
    docs,
    /@media \(max-width: 64rem\) \{\n {2}:root:has\(\.site-header \.site-search\) \{\n {4}--ardo-layout-headerHeight: 7\.5rem;/u,
    "the docs layout clears the taller header",
  );
});
