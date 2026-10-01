/**
 * The landing kit, rendered the way a sibling home page renders it: from the
 * package's build output, in a bare Node process.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";

import { assertInOrder, kit, render } from "./helpers.mjs";
/** A minimal fetch Response carrying JSON, for the stubbed registries. */
const body = (value) => ({ ok: true, json: async () => value });

/** Splits a selector list on its top-level commas: `:where(a, b)` is one selector. */
function splitSelectorList(list) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (const [index, char] of [...list].entries()) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      parts.push(list.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(list.slice(start).trim());
  return parts;
}
const landing = await readFile(new URL("../styles/landing.css", import.meta.url), "utf8");
const tokens = await readFile(new URL("../styles/tokens.css", import.meta.url), "utf8");

test("the hero plate says what the thing is first, and hangs its facts below", () => {
  const html = render(kit.ProjectHero, {
    facts: [
      { label: "Succeeds", value: "Oniguruma" },
      { label: "Release", value: "v1.0.0" },
    ],
    icon: "ferroni",
    install: createElement("code", null, "cargo add ferroni"),
    lede: "It continues Oniguruma.",
    title: "Ferroni",
    what: "A regex engine in memory-safe Rust.",
  });
  assert.match(html, /^<section class="fam-hero" aria-labelledby="(?<id>[^"]+)">/u);
  const id = /aria-labelledby="(?<id>[^"]+)"/u.exec(html).groups.id;
  assert.ok(html.includes(`<h1 class="fam-title" id="${id}">Ferroni</h1>`), "a labelled h1");
  assert.ok(html.includes('<div class="fam-plate fam-hero-plate">'), "one riveted plate");
  assert.equal(html.match(/class="fam-rivet"/gu).length, 4, "a rivet per corner");
  assertInOrder(
    html,
    [
      '<h1 class="fam-title"',
      '<p class="fam-what">A regex engine in memory-safe Rust.</p>',
      '<p class="fam-lede">It continues Oniguruma.</p>',
      '<p class="fam-install"><code>cargo add ferroni</code></p>',
      '<span class="fam-icon" data-icon="ferroni" data-form="hero" aria-hidden="true">',
      '<div class="fam-hanger">',
      '<dl class="fam-plate fam-tag"><div><dt>Succeeds</dt><dd>Oniguruma</dd></div><div><dt>Release</dt><dd>v1.0.0</dd></div></dl>',
    ],
    "the name, what it is, the lede, the action; the facts come second, off the plate",
  );
});

test("the hero renders nothing it was not given, and an aside replaces the icon", () => {
  const bare = render(kit.ProjectHero, { title: "Family" });
  assert.ok(!bare.includes("fam-actions"), "no empty action row");
  assert.ok(!bare.includes("fam-hanger"), "no empty tag");
  assert.ok(!bare.includes("fam-hero-side"), "no empty side");

  const own = render(kit.ProjectHero, {
    aside: createElement("div", { className: "own" }),
    icon: "ferroni",
    title: "Family",
  });
  assert.ok(own.includes('<div class="fam-hero-side"><div class="own"></div></div>'));
  assert.ok(!own.includes("data-icon"), "the aside replaces the icon");
});

test("sections carry a ruled, labelled heading; split puts the head beside the content", () => {
  const html = render(kit.Section, {
    children: createElement("p", null, "body"),
    id: "evidence",
    intro: "Intro.",
    layout: "split",
    note: "Measured on a stated machine.",
    title: "Faster",
  });
  assert.match(html, /^<section class="fam-section" id="evidence" aria-labelledby="/u);
  assert.ok(html.includes('<div class="wrap fam-split"><div><h2 class="fam-heading"'));
  assert.ok(html.includes('<p class="fam-intro">Intro.</p>'));
  assert.ok(html.includes('<p class="fam-note">Measured on a stated machine.</p>'));
  assert.ok(html.includes("<div><p>body</p></div>"), "the content column");
  assert.ok(
    render(kit.Section, { className: "story", title: "T" }).startsWith(
      '<section class="fam-section story"',
    ),
  );
  assert.ok(
    render(kit.Section, { title: "T", tone: "dim" }).startsWith(
      '<section class="fam-section" data-tone="dim"',
    ),
    "a section set apart on the darker ground",
  );
});

test("principles stand side by side, on the ground or in a dark oak band", () => {
  const items = [{ heading: "Same engine", text: "Verified." }];
  assert.equal(
    render(kit.Principles, { items }),
    '<ul class="fam-principles" data-count="1"><li><h3>Same engine</h3><p>Verified.</p></li></ul>',
  );
  const html = render(kit.IronBand, {
    children: createElement(kit.Principles, { items }),
    title: "Carried forward",
  });
  assert.match(html, /^<section class="fam-band on-iron"/u);
  assert.ok(html.includes('<ul class="fam-principles" data-count="1">'));
  assert.ok(!render(kit.IronBand, { title: "T" }).includes("fam-principles"), "no empty list");
});

test("the closing band offers the workshop's help with one action", () => {
  const html = render(kit.WorkWithUs);
  assert.match(html, /^<section class="fam-work" id="work" aria-labelledby="/u);
  assert.equal(html.match(/<a /gu).length, 1, "one action, no form");
  assert.ok(
    html.includes(`<a class="fam-btn fam-btn-steel" href="${kit.WORKSHOP.consulting}">`),
    "to the workshop's consulting site",
  );
  assert.ok(!html.includes("<form"), "no form on a family page");
  const own = render(kit.WorkWithUs, { offers: ["Audits"], title: "Hire us" });
  assert.ok(own.includes('<ul class="fam-offers"><li>Audits</li></ul>'));
});

test("figures, ledger and stamps render as lists with their states", () => {
  const figures = render(kit.EvidenceFigures, {
    figures: [
      { detail: "117 patterns", label: "CSS", measure: "~93 µs vs ~3.04 ms", value: "32.6×" },
      { label: "Bare", value: "2×" },
    ],
  });
  assert.match(figures, /^<dl class="fam-figures"><div class="fam-plate fam-figure">/u);
  assert.ok(figures.includes("<dt>CSS</dt>"), "the label is the term");
  assert.ok(figures.includes('<dd class="fam-figure-value">32.6×</dd>'));
  assert.ok(figures.includes("117 patterns<span>~93 µs vs ~3.04 ms</span>"));
  assert.equal(figures.match(/fam-figure-detail/gu).length, 1, "no empty detail line");

  const ledger = render(kit.Ledger, {
    entries: [
      { detail: "Full.", name: "jq", settled: true, status: "Covered" },
      { name: "Ruby", status: "Not a target" },
    ],
  });
  assert.match(ledger, /^<ul class="fam-ledger"><li class="fam-ledger-row">/u);
  assert.ok(ledger.includes('<span class="fam-stamp" data-tone="solid">Covered</span>'));
  assert.ok(ledger.includes('<span class="fam-stamp">Not a target</span>'));
});

test("the code panel scrolls in its own box and is reachable by keyboard", () => {
  const html = render(kit.CodePanel, { caption: "main.rs", children: "fn main() {}" });
  assert.equal(
    html,
    '<figure class="fam-code"><figcaption>main.rs</figcaption><pre tabindex="0"><code>fn main() {}</code></pre></figure>',
  );
  assert.match(landing, /\.fam-code pre \{[^}]*overflow-x: auto/u);
});

test("the closing action follows its copy, and the link line follows the action", () => {
  const html = render(kit.ClosingAction, {
    actions: createElement("a", { className: "fam-btn fam-btn-primary", href: "#" }, "Go"),
    children: createElement("p", null, "Copy."),
    links: createElement("a", { href: "https://docs.rs" }, "docs.rs"),
    title: "Start",
  });
  assert.match(html, /^<section class="fam-section fam-closing"/u);
  assert.ok(
    html.includes(
      '<div class="fam-closing-copy"><p>Copy.</p><div class="fam-actions"><a class="fam-btn fam-btn-primary" href="#">Go</a></div><p class="fam-links"><a href="https://docs.rs">docs.rs</a></p></div>',
    ),
  );
});

test("the kit stays in its namespace and yields to the host", () => {
  const selectors = landing
    .replaceAll(/\/\*[\s\S]*?\*\//gu, "")
    .split("{")
    .slice(0, -1)
    .map((chunk) => chunk.split("}").at(-1).trim())
    .filter((selector) => selector !== "" && !selector.startsWith("@") && !/^\d/u.test(selector));
  for (const list of selectors) {
    for (const selector of splitSelectorList(list)) {
      assert.match(
        selector,
        /^(?:\.fam-|:where\(\.fam-|\.on-iron (?:\.fam-|a\.fam-|:where\()|a\.fam-)/u,
        `landing.css styles outside its namespace: ${selector}`,
      );
    }
  }
  // Bare elements only through `:where()`, so any host rule outranks the defaults.
  assert.doesNotMatch(landing, /^\.fam-page (?:h1|h2|h3|p|a|code)\b/mu);
});

test("the materials are files the package ships, and small type never sits on the texture", async () => {
  for (const texture of ["steel.webp", "oak.webp", "rust.webp"]) {
    assert.ok(
      landing.includes(`url("../textures/${texture}")`),
      `landing.css does not use ${texture}`,
    );
  }
  for (const file of ["chrome.css", "landing.css"]) {
    const css = await readFile(new URL(`../styles/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(css, /feTurbulence/u, `${file} draws a texture instead of shipping it`);
  }
  for (const token of ["--steel", "--steel-ink", "--inlay", "--inlay-ink", "--iron", "--ember"]) {
    assert.ok(tokens.includes(`${token}:`), `tokens.css has no ${token}`);
  }
  // Every piece of small type a plate carries sits on the dark inlay, not on the steel:
  // the hanging tag's facts, the install line, an outlined stamp, a figure's detail,
  // and the engines an application names.
  for (const selector of [
    ".fam-tag > div",
    ".fam-install",
    '.fam-plate .fam-stamp:not([data-tone="solid"])',
    ".fam-figure-detail",
    ".fam-app-runs li",
  ]) {
    const start = landing.indexOf(`\n${selector} {`);
    assert.notEqual(start, -1, `landing.css has no rule for ${selector}`);
    assert.ok(
      landing.slice(start, landing.indexOf("}", start)).includes("background: var(--inlay)"),
      `small type on the texture: ${selector}`,
    );
  }
});

test("a landing page keeps the authored scheme; only documentation follows the visitor's", () => {
  const pinned = tokens.slice(tokens.indexOf("\n.fam-page {"));
  assert.match(pinned, /^\n\.fam-page \{\n {2}color-scheme: light;/u);
  assert.ok(
    tokens.indexOf("prefers-color-scheme: dark") < tokens.indexOf("\n.fam-page {"),
    "the pinned values come after the dark sets, so they win inside a landing page",
  );
  for (const token of ["--bg", "--ink", "--rust", "--line"]) {
    assert.ok(pinned.slice(0, pinned.indexOf("}")).includes(`${token}:`), `${token} is not pinned`);
  }
});

test("motion yields to a visitor who asked for less", () => {
  const reduced = landing.slice(landing.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reduced, /\.fam-hanger \{\s*animation: none;/u);
  assert.match(reduced, /\.fam-plate::after[^{]*\{\s*transition: none;/u);
});

test("the stamp legend reads every status from the registry", () => {
  const html = render(kit.StampKey);
  assert.match(html, /^<dl class="fam-stamp-key">/u);
  for (const status of kit.STATUS_ORDER) {
    assert.ok(html.includes(`>${status}</span></dt><dd>${kit.STATUS_MEANING[status]}</dd>`));
  }
  assert.ok(html.includes('<span class="fam-stamp" data-tone="solid">stable</span>'));
});

test("short jobs keep their acronyms: the chrome shows them without a text transform", () => {
  for (const tool of kit.family) {
    assert.doesNotMatch(
      tool.shortJob,
      /\b(?:svg|pdf|markdown)\b/u,
      `${tool.name}: ${tool.shortJob}`,
    );
  }
});

test("the registry claims results qualitatively, never with a figure that goes stale", () => {
  // "Ahead of globset", "among the fastest", "a larger test suite" are fine; a
  // factor, a timing, a percentage or a test count pretends to a precision the
  // family site cannot keep current.
  const figure =
    /[×%]|(?<![\d.,])\d[\d.,]*\s?(?:x|ms|µs|ns|s|mib|mb|gib|gb|kib|kb|times|tests?|test functions)\b/iu;
  for (const tool of kit.family) {
    assert.doesNotMatch(tool.evidence, figure, `${tool.name} evidence states a figure`);
    assert.doesNotMatch(tool.proof, figure, `${tool.name} proof states a figure`);
    assert.ok(
      tool.succeeds === undefined || tool.buildsOn === undefined,
      `${tool.name} is either a successor or a new development, not both`,
    );
    assert.equal(kit.isSuccessor(tool), tool.succeeds !== undefined);
  }
});

test("live registry figures come from one bulk request per registry and survive failures", async (t) => {
  const calls = [];
  const fetchStub = t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(String(url));
    if (String(url).includes("/crates?")) {
      return body({
        crates: [
          { id: "ferroni", max_stable_version: "9.9.9", max_version: "9.9.9", downloads: 42 },
        ],
      });
    }
    if (String(url).includes("/point/last-month/")) {
      return body({ ferromark: { downloads: 7, package: "ferromark" }, ferrocat: null });
    }
    if (String(url).endsWith("/ferromark/latest")) return body({ version: "3.0.0" });
    throw new Error("offline");
  });

  const live = await kit.fetchLiveRegistry({ crates: ["ferroni"], npm: ["ferromark", "ferrocat"] });
  assert.deepEqual(live.ferroni, { crates: { version: "9.9.9", downloads: 42 } });
  assert.deepEqual(live.ferromark, { npm: { version: "3.0.0", lastMonth: 7 } });
  assert.equal(live.ferrocat, undefined, "an unanswered package is left out, not zeroed");
  assert.equal(calls.filter((url) => url.includes("/crates?")).length, 1, "one crates.io request");
  assert.ok(calls.some((url) => url.startsWith(kit.REGISTRY_ENDPOINTS.crates)));

  fetchStub.mock.mockImplementation(async () => {
    throw new Error("offline");
  });
  assert.deepEqual(await kit.fetchLiveRegistry({ crates: ["ferroni"], npm: ["ferromark"] }), {});
});
