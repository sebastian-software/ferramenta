/**
 * The family catalog, rendered the way a sibling home page renders it: the
 * pegboard, the tool ledger and the job index from the package's build output,
 * and the registry-facts policy behind their release figures.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

const { renderToStaticMarkup } = await import("react-dom/server");
const { createElement } = await import("react");
const kit = await import("../dist/index.js");

const render = (component, props) => renderToStaticMarkup(createElement(component, props));

test("the job index lists every member A to Z by job, and ranks none", () => {
  const sorted = kit.byJob().map((tool) => tool.shortJob.toLowerCase());
  assert.deepEqual(
    sorted,
    [...sorted].sort((a, b) => a.localeCompare(b, "en")),
  );
  assert.equal(kit.byJob().length, kit.family.length);

  const html = render(kit.JobIndex);
  assert.match(html, /^<ul class="fam-jobs">/u);
  assert.equal(html.match(/class="fam-job"/gu).length, kit.family.length);
  const positions = kit.byJob().map((tool) => html.indexOf(`>${tool.shortJob}</span>`));
  assert.deepEqual(
    positions,
    [...positions].sort((a, b) => a - b),
    "rendered in job order",
  );
  for (const tool of kit.family) {
    assert.ok(html.includes(`href="${kit.toolHref(tool)}"`), `a link to ${tool.name}`);
  }
  const ferroni = kit.family.find((tool) => tool.name === "ferroni");
  assert.ok(
    html.includes(`aria-label="${ferroni.shortJob}: Ferroni, ${ferroni.status}"`),
    "a screen reader hears job, tool and stamp with their pauses",
  );
  const own = render(kit.JobIndex, { current: "ferroni" });
  assert.ok(!own.includes("#i-ferroni"), "a site leaves itself out");
});

test("the pegboard hangs every member with its stamp, grouped like the family", () => {
  const html = render(kit.Pegboard);
  assert.match(html, /^<nav class="fam-board" aria-label="The tool family">/u);
  assert.equal(html.match(/class="fam-board-item"/gu).length, kit.family.length);
  assert.equal(html.match(/class="fam-board-stamp"/gu).length, kit.family.length);
  assert.equal(html.match(/class="fam-board-group"/gu).length, 3);
  const ferroniStart = html.indexOf(
    '<a class="fam-board-item" href="https://sebastian-software.github.io/ferroni/">',
  );
  const ferroniEnd = html.indexOf("</a>", ferroniStart);
  const ferroni = html.slice(ferroniStart, ferroniEnd);
  assert.ok(
    ferroni.indexOf("ferroni") < ferroni.indexOf("Regex engine") &&
      ferroni.indexOf("Regex engine") < ferroni.indexOf("stable"),
    "the tool name and job come before its maturity stamp",
  );
  assert.equal(
    render(kit.Pegboard, { current: "ferroni" }).match(/fam-board-item/gu).length,
    kit.family.length - 1,
  );
});

test("the tool ledger numbers only a real sequence, and names what each member rests on", () => {
  const { language, pipeline } = kit.familyGroups();
  const chain = render(kit.ToolLedger, { steps: true, tools: pipeline });
  assert.match(chain, /^<div class="fam-tools" data-steps="">/u);
  assert.ok(chain.includes('<span class="fam-tool-num" aria-hidden="true">01</span>'));
  const plain = render(kit.ToolLedger, { tools: language });
  assert.ok(!plain.includes("fam-tool-num"), "no empty step column");
  assert.ok(!plain.includes("data-steps"));
  const palamedes = kit.family.find((tool) => tool.name === "palamedes");
  const names = palamedes.runsOn.map((name) => kit.displayName(name)).join(" · ");
  assert.ok(plain.includes(`<dt>Runs on</dt><dd>${names}</dd>`), "names as prose writes them");
  assert.match(names, /^Ferrocat/u, "the first name too: no text-transform guesswork");
  // Outside RegistryFacts a row shows the registry's fallback version.
  assert.ok(plain.includes(`v${language[0].version}`));
  const application = render(kit.ToolLedger, { tools: [palamedes] });
  assert.ok(
    !application.includes('<span class="fam-tool-platforms"></span>'),
    "applications without a published registry package do not render an empty platform line",
  );
});

test("every member rests on exactly one fact: what it succeeds, builds on, or runs on", () => {
  const palamedes = kit.family.find((tool) => tool.name === "palamedes");
  for (const tool of kit.family) {
    const lineage = [tool.succeeds, tool.buildsOn, tool.runsOn].filter(
      (fact) => fact !== undefined,
    );
    assert.equal(
      lineage.length,
      1,
      `${tool.name} rests on exactly one of succeeds, buildsOn, runsOn`,
    );
    assert.equal(
      tool.runsOn !== undefined,
      !kit.isEngine(tool),
      "only an application runs on engines",
    );
    assert.ok(kit.runsOnTools(tool).every((member) => kit.family.includes(member)));
  }
  assert.throws(() => kit.runsOnTools({ ...palamedes, runsOn: ["nope"] }), /unknown member: nope/u);
});

test("registry facts: live over snapshot over fallback, and only owned packages are asked for", () => {
  const tool = kit.family.find((member) => member.name === "ferrocat");
  const stat = {
    crates: { version: "3.4.2", downloads: 10 },
    npm: { version: "0.2.0", lastMonth: 5 },
  };
  assert.deepEqual(kit.toolFacts(tool, stat), {
    version: "3.4.2",
    crateDownloads: 10,
    onCrates: true,
    adapter: true,
  });
  assert.equal(
    kit.toolFacts(tool, stat, { crates: { version: "3.5.0", downloads: 11 } }).version,
    "3.5.0",
  );
  assert.equal(kit.toolFacts(tool, undefined).version, tool.version, "the registry's fallback");
  assert.equal(
    kit.toolFacts(tool, {
      crates: null,
      npm: { version: "1.0.0", lastMonth: 0, placeholder: true },
    }).adapter,
    false,
    "a held npm name is no adapter",
  );

  const request = kit.liveRequestFor({
    ferroni: { crates: { version: "1", downloads: 1 }, npm: null },
    ferrocat: stat,
    palamedes: { crates: null, npm: { version: "1", lastMonth: 1, placeholder: true } },
    ferriki: { crates: null, npm: { version: "1", lastMonth: 1 } },
  });
  assert.deepEqual(request.crates, ["ferroni", "ferrocat"]);
  assert.deepEqual(request.npm, ["ferriki"], "npm only where no crate carries the version");
  assert.deepEqual(kit.liveRequestFor({ stranger: stat }), { crates: [], npm: [] });
});

const body = (value) => ({ ok: true, json: async () => value });
const metricsDoc = (sources = { github: "ok", crates: "ok", npm: "ok" }) => ({
  schema: 1,
  generatedAt: "2026-09-24T12:00:00Z",
  sources,
  github: {
    ferriki: { stars: 0, forks: 1, release: { tag: "v9.3.0", version: "9.3.0", publishedAt: "x" } },
  },
  crates: {
    ferroni: { version: "9.0.0", downloads: 5, recentDownloads: 1, publishedAt: "x" },
    "someone-else": { version: "1.0.0", downloads: 1, recentDownloads: 1, publishedAt: "x" },
  },
  npm: { ferromark: { version: "9.1.0", monthlyDownloads: 7, publishedAt: "x" } },
});
const verified = { ferroni: { crates: { version: "1", downloads: 1 }, npm: null } };

test("family facts come from the metrics document in one request", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url: String(url), cache: options?.cache });
    return body(metricsDoc());
  });
  const facts = await kit.fetchFamilyFacts(verified);
  assert.deepEqual(
    calls,
    [{ url: kit.METRICS_URL, cache: "no-cache" }],
    "the page revalidates its metrics document and asks no registry when the service answered",
  );
  assert.deepEqual(facts.ferroni, { crates: { version: "9.0.0", downloads: 5 } });
  assert.deepEqual(facts.ferromark, { npm: { version: "9.1.0", lastMonth: 7 } });
  assert.equal(facts["someone-else"], undefined, "only family members");
  assert.deepEqual(facts.ferriki, { release: { version: "9.3.0" } }, "a Git-only tool's release");
  const ferriki = kit.family.find((tool) => tool.name === "ferriki");
  assert.equal(kit.toolFacts(ferriki, { crates: null, npm: null }, facts.ferriki).version, "9.3.0");
  assert.equal(
    kit.toolFacts(ferriki, { crates: null, npm: null, release: { version: "9.2.0" } }).version,
    "9.2.0",
    "the snapshot's release before the registry's hand-set fallback",
  );

  // Without a snapshot the live facts stand on their own: a sibling site gets figures too.
  const ferroni = kit.family.find((tool) => tool.name === "ferroni");
  assert.equal(kit.toolFacts(ferroni, undefined, facts.ferroni).version, "9.0.0");
});

test("metrics older than the snapshot are ignored and verified registries are queried", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(String(url));
    if (String(url) === kit.METRICS_URL) return body(metricsDoc());
    if (String(url).includes("/crates?")) {
      return body({ crates: [{ id: "ferroni", max_stable_version: "2.0.0", downloads: 2 }] });
    }
    throw new Error("unexpected request");
  });
  const facts = await kit.fetchFamilyFacts(verified, {
    snapshotGeneratedAt: "2026-09-25T05:00:00Z",
  });
  assert.deepEqual(calls, [
    kit.METRICS_URL,
    `${kit.REGISTRY_ENDPOINTS.crates}/crates?ids[]=ferroni&per_page=1`,
  ]);
  assert.deepEqual(facts.ferroni, { crates: { version: "2.0.0", downloads: 2 } });
});

test("a registry the metrics service did not answer is asked directly, for verified names only", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(String(url));
    if (String(url) === kit.METRICS_URL) {
      return body(metricsDoc({ github: "ok", crates: "error", npm: "ok" }));
    }
    if (String(url).includes("/crates?")) {
      return body({ crates: [{ id: "ferroni", max_stable_version: "9.9.9", downloads: 42 }] });
    }
    throw new Error("offline");
  });
  const facts = await kit.fetchFamilyFacts(verified);
  assert.equal(calls.length, 2, "the document, then crates.io");
  assert.equal(facts.ferroni.crates.version, "9.9.9");
});

test("with the metrics service down, the page falls back to the registries", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (String(url).includes("/crates?")) {
      return body({ crates: [{ id: "ferroni", max_stable_version: "9.9.9", downloads: 42 }] });
    }
    return { ok: false, json: async () => ({}) };
  });
  const facts = await kit.fetchFamilyFacts(verified);
  assert.equal(facts.ferroni.crates.version, "9.9.9");
  assert.deepEqual(
    await kit.fetchFamilyFacts({}),
    {},
    "nothing verified, nothing asked, nothing shown",
  );
});

test("the closing action takes a list beside the copy, with or without actions", () => {
  const html = render(kit.ClosingAction, {
    aside: createElement("ul", null),
    children: createElement("p", null, "Copy."),
    title: "Pick",
  });
  assert.ok(html.includes('<div class="fam-closing-aside"><ul></ul></div>'));
  assert.ok(!html.includes("fam-actions"), "no empty action row");
});

test("a run sample shows its input once to assistive technology, the output for the eye", () => {
  const html = render(kit.RunSample, {
    input: "# Hi",
    inputCaption: "hi.md",
    output: "<h1>Hi</h1>",
    outputCaption: "Rendered by Tool 1.0",
  });
  assert.match(
    html,
    /^<div class="fam-run"><div class="fam-run-input"><div class="fam-run-wide"><figure class="fam-code"><figcaption>hi.md<\/figcaption>/u,
  );
  assert.ok(
    html.includes(
      '<details class="fam-run-narrow"><summary><span>hi.md</span><small>Source</small>',
    ),
    "on a phone the input folds away; CSS picks one variant",
  );
  assert.ok(html.includes("<figcaption>Rendered by Tool 1.0</figcaption>"));
  assert.ok(
    html.includes('<div class="fam-run-doc" inert=""><h1>Hi</h1></div>'),
    "inert, unedited",
  );
});
