/**
 * The landing kit, rendered the way a sibling home page renders it: from the
 * package's build output, in a bare Node process.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const { renderToStaticMarkup } = await import("react-dom/server");
const { createElement } = await import("react");
const kit = await import("../dist/index.js");

const render = (component, props) => renderToStaticMarkup(createElement(component, props));

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

test("the hero hangs the project's plate, or the host's own aside instead", () => {
  const html = render(kit.ProjectHero, {
    install: createElement("code", null, "cargo add ferroni"),
    lede: "Continued in Rust.",
    mark: "ferroni",
    title: "Oniguruma",
  });
  assert.match(html, /^<section class="fam-hero" aria-labelledby="(?<id>[^"]+)">/u);
  const id = /aria-labelledby="(?<id>[^"]+)"/u.exec(html).groups.id;
  assert.ok(html.includes(`<h1 class="fam-title" id="${id}">Oniguruma</h1>`), "a labelled h1");
  assert.ok(html.includes('<span class="markplate fam-hero-plate" aria-hidden="true">'));
  assert.ok(html.includes("#i-ferroni"));
  assert.ok(html.includes('<p class="fam-install"><code>cargo add ferroni</code></p>'));
  assert.ok(!html.includes("fam-actions"), "no empty action row");

  const board = render(kit.ProjectHero, {
    aside: createElement("div", { className: "board" }),
    mark: "ferroni",
    title: "Family",
  });
  assert.ok(board.includes('<div class="board"></div>'), "the aside renders");
  assert.ok(!board.includes("fam-hero-plate"), "and replaces the plate");
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
    render(kit.Section, { className: "partners", title: "T" }).startsWith(
      '<section class="fam-section partners"',
    ),
  );
});

test("the iron band is an iron context with hairline rows", () => {
  const html = render(kit.IronBand, {
    rows: [{ heading: "Same engine", text: "Verified." }],
    title: "Carried forward",
  });
  assert.match(html, /^<section class="fam-band on-iron"/u);
  assert.ok(html.includes('<div class="fam-rows"><div><h3>Same engine</h3><p>Verified.</p>'));
  assert.ok(!render(kit.IronBand, { title: "T" }).includes("fam-rows"), "no empty rows");
});

test("the pipeline assembly follows the registry and marks the current stage", () => {
  const { pipeline } = kit.familyGroups();
  const family = render(kit.PipelineAssembly);
  assert.ok(family.includes(`aria-label="${kit.PIPELINE.description}"`));
  assert.equal(family.match(/class="fastener"/gu).length, 4, "four fasteners, one per corner");
  for (const [index, tool] of pipeline.entries()) {
    assert.ok(family.includes(`href="${tool.docs ?? tool.repo}"`), `a link to ${tool.name}`);
    assert.ok(family.includes(`>${String(index + 1).padStart(2, "0")}</span>`), "the step");
  }
  assert.ok(family.includes(kit.PIPELINE.input.text) && family.includes(kit.PIPELINE.output.text));
  assert.ok(!family.includes("aria-current"), "the family site is no stage");
});

test("a site's own stage is marked, and only pipeline members can be one", () => {
  const own = render(kit.PipelineAssembly, {
    current: "ferroni",
    input: { label: "Input", text: "TextMate grammars" },
  });
  assert.ok(own.includes('<span class="fam-assembly-stage" aria-current="true">'));
  const ferroni = kit.family.find((tool) => tool.name === "ferroni");
  assert.ok(!own.includes(`href="${ferroni.docs}"`), "the current stage is not a self-link");
  assert.ok(own.includes("TextMate grammars"), "the site names its own input");
  assert.throws(() => render(kit.PipelineAssembly, { current: "nope" }), /Unknown/u);
  assert.throws(
    () => render(kit.PipelineAssembly, { current: "ferrocat" }),
    /not a pipeline stage/u,
    "a member outside the chain is a configuration error, not an unmarked chain",
  );
  for (const end of [kit.PIPELINE.input.label, kit.PIPELINE.output.label]) {
    assert.doesNotMatch(end, /Application/u, "the terminals must not reuse the application role");
  }
});

test("figures, ledger and stamps render as lists with their states", () => {
  const figures = render(kit.EvidenceFigures, {
    figures: [
      { detail: "117 patterns", label: "CSS", measure: "~93 µs vs ~3.04 ms", value: "32.6×" },
      { label: "Bare", value: "2×" },
    ],
  });
  assert.match(figures, /^<dl class="fam-figures"><div><dt>CSS<\/dt>/u);
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

test("the closing action puts the link line under the copy", () => {
  const html = render(kit.ClosingAction, {
    actions: createElement("a", { className: "fam-btn fam-btn-primary", href: "#" }, "Go"),
    children: createElement("p", null, "Copy."),
    links: createElement("a", { href: "https://docs.rs" }, "docs.rs"),
    title: "Start",
  });
  assert.match(html, /^<section class="fam-section fam-closing"/u);
  assert.ok(
    html.includes(
      '<div class="fam-closing-copy"><p>Copy.</p><p class="fam-links"><a href="https://docs.rs">docs.rs</a></p></div>',
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
        /^(?:\.fam-|:where\(\.fam-|\.markplate\.fam-|\.on-iron \.fam-|a\.fam-|:root\.dark \.fam-)/u,
        `landing.css styles outside its namespace: ${selector}`,
      );
    }
  }
  // Bare elements only through `:where()`, so any host rule outranks the defaults.
  assert.doesNotMatch(landing, /^\.fam-page (?:h1|h2|h3|p|a|code)\b/mu);
});

test("the materials are tokens, not copies", async () => {
  for (const file of ["chrome.css", "landing.css"]) {
    const css = await readFile(new URL(`../styles/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(css, /feTurbulence/u, `${file} restates a texture instead of the token`);
  }
  for (const token of ["--texture-brush", "--texture-speckle", "--octagon", "--chamfer"]) {
    assert.ok(tokens.includes(`${token}:`), `tokens.css has no ${token}`);
  }
});

test("the stamp legend reads every status from the registry", () => {
  const html = render(kit.StampKey);
  assert.match(html, /^<dl class="fam-stamp-key">/u);
  for (const status of kit.STATUS_ORDER) {
    assert.ok(html.includes(`>${status}</span></dt><dd>${kit.STATUS_MEANING[status]}</dd>`));
  }
  assert.ok(html.includes('<span class="fam-stamp" data-tone="solid">stable</span>'));
});

test("the lead tool is the most mature member, registry order on a tie", () => {
  const { language, workbench } = kit.familyGroups();
  assert.equal(kit.leadTool(language)?.status, "stable");
  const best = Math.min(...workbench.map((tool) => kit.STATUS_ORDER.indexOf(tool.status)));
  assert.equal(
    kit.leadTool(workbench),
    workbench.find((tool) => kit.STATUS_ORDER.indexOf(tool.status) === best),
  );
  assert.equal(kit.leadTool([]), undefined);
});

test("short jobs keep their acronyms: the board shows them without a text transform", () => {
  for (const tool of kit.family) {
    assert.doesNotMatch(
      tool.shortJob,
      /\b(?:svg|pdf|markdown)\b/u,
      `${tool.name}: ${tool.shortJob}`,
    );
  }
});

test("the registry names results nowhere: evidence is a method, never a number or a ranking", () => {
  const ranking = /\b(?:faster|slower|ahead of|beats?|fastest|outperforms?)\b|[×%]/iu;
  for (const tool of kit.family) {
    assert.doesNotMatch(tool.evidence, ranking, `${tool.name} evidence states a result`);
    assert.doesNotMatch(tool.proof, ranking, `${tool.name} proof states a result`);
    assert.ok(
      tool.succeeds === undefined || tool.buildsOn === undefined,
      `${tool.name} is either a successor or a new development, not both`,
    );
    assert.equal(kit.isSuccessor(tool), tool.succeeds !== undefined);
  }
});

test("a registry badge is live, themed, and says what it shows", () => {
  const html = render(kit.RegistryBadge, { name: "ferroni", registry: "crates" });
  assert.match(html, /^<span class="fam-badge"><img class="fam-badge-light"/u);
  assert.ok(html.includes('src="https://img.shields.io/crates/d/ferroni?style=flat-square'));
  assert.ok(html.includes('alt="ferroni downloads on crates.io, live"'));
  assert.ok(html.includes('class="fam-badge-dark"') && html.includes('aria-hidden="true"'));
  assert.ok(
    render(kit.RegistryBadge, { name: "ferrocat", registry: "npm" }).includes("/npm/dm/ferrocat?"),
  );
});
