/**
 * The family catalog, rendered the way a sibling home page renders it: the
 * engine catalog and the applications band from the package's build output,
 * the registry's two tiers and relations, and the registry-facts policy behind
 * the release figures.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";

import { assertInOrder, kit, member, render } from "./helpers.mjs";

test("the registry has two tiers: the engines, and the applications the workshop also makes", () => {
  const { applications, engines } = kit.familyTiers();
  assert.equal(engines.length + applications.length, kit.family.length);
  assert.ok(engines.every((tool) => kit.isEngine(tool)));
  assert.ok(applications.every((tool) => !kit.isEngine(tool)));
  assert.deepEqual(
    kit.family.map((tool) => tool.name),
    [...engines, ...applications].map((tool) => tool.name),
    "the catalog lists every engine before the first application",
  );
  assert.ok(!kit.familyTiers("ferroni").engines.some((tool) => tool.name === "ferroni"));
  assert.throws(() => kit.familyTiers("nope"), /Unknown Ferramenta project/u);
});

test("every member says what it is before where it comes from", () => {
  for (const tool of kit.family) {
    if (kit.isEngine(tool)) {
      // A page lists the engines as "a regex engine, a syntax highlighter, …".
      assert.match(tool.what, /^An? /u, `${tool.name}: \`what\` is a noun phrase with its article`);
    }
    assert.doesNotMatch(tool.what, /\.$/u, `${tool.name}: \`what\` is a phrase, not a sentence`);
    assert.match(tool.does, /^[A-Z].*\.$/u, `${tool.name}: \`does\` is one sentence`);
    assert.match(tool.audience, /^For .*\.$/u, `${tool.name}: \`audience\` starts with "For"`);
    assert.equal(tool.brand !== undefined, !kit.isEngine(tool), "only an application has a brand");
  }
});

/** A member's relations as short strings: "runs-on ferroni". */
const relations = (name) =>
  kit.relationsOf(member(name)).map((relation) => `${relation.kind} ${relation.tool.name}`);

test("relations are read from both sides, and never imply a chain", () => {
  assert.deepEqual(relations("ferriki"), ["runs-on ferroni", "pairs-with ferromark"]);
  assert.deepEqual(relations("ferroni"), ["carries ferriki"]);
  assert.deepEqual(
    relations("ferromark"),
    ["pairs-with ferriki", "carries palamedes"],
    "Ferromark pairs with Ferriki; it does not depend on it",
  );
  assert.deepEqual(relations("ferrolex"), [], "a member that stands alone has none");
  assert.deepEqual(
    relations("palamedes"),
    member("palamedes").runsOn.map((name) => `runs-on ${name}`),
  );
  for (const tool of kit.family) {
    for (const name of [...(tool.uses ?? []), ...(tool.pairsWith ?? [])]) member(name);
  }
});

const catalog = render(kit.EngineCatalog);

test("the engine catalog gives each engine a plate, then what it does, then its facts", () => {
  const { engines } = kit.familyTiers();
  assert.match(catalog, /^<ul class="fam-engines">/u);
  assert.equal(catalog.match(/<article class="fam-engine"/gu).length, engines.length);
  assert.ok(!catalog.includes('id="palamedes"'), "applications are not in the engine catalog");

  const ferroni = member("ferroni");
  const row = catalog.slice(catalog.indexOf('id="ferroni"'), catalog.indexOf('id="ferriki"'));
  assertInOrder(
    row,
    [
      'class="fam-plate fam-engine-plate"',
      'data-icon="ferroni" data-form="rendered"',
      `<a class="fam-engine-link" href="${kit.toolHref(ferroni)}">ferroni</a>`,
      `<p class="fam-engine-what">${ferroni.what}</p>`,
      `<p class="fam-engine-does">${ferroni.does}</p>`,
      ferroni.audience,
      ferroni.proof,
      'class="fam-engine-fits"',
      "<dt>Succeeds</dt>",
      "<dt>Checked against</dt>",
      `<dd class="fam-engine-version">v${ferroni.version}</dd>`,
    ],
    "what it is, what it does, for whom, where it comes from, the facts last",
  );
  assert.ok(row.includes('<a href="https://ferriki.dev">Ferriki</a> runs on it'));
  assert.ok(
    !catalog.includes("fam-stamp"),
    "no maturity stamp: the release says how far it has come",
  );
});

test("a catalog row names the lineage its engine has, and a page can choose its rows", () => {
  const newDevelopment = catalog.slice(
    catalog.indexOf('id="ferromark"'),
    catalog.indexOf('id="ferrolex"'),
  );
  assert.match(newDevelopment, /<dt>Built to<\/dt>/u, "a new development names its standard");
  assert.doesNotMatch(newDevelopment, /<dt>Succeeds<\/dt>/u);

  const own = render(kit.EngineCatalog, { current: "ferroni" });
  assert.ok(!own.includes('id="ferroni"'), "a site leaves itself out");
  assert.equal(
    render(kit.EngineCatalog, { tools: [member("ferroni")] }).match(/<article/gu).length,
    1,
    "a page can show the rows it names",
  );
});

test("a catalog row without a site says where its link leads", () => {
  for (const tool of kit.familyTiers().engines) {
    const note = `${tool.name}<span class="fam-sr-only"> (GitHub repository)</span>`;
    assert.equal(catalog.includes(note), kit.leadsToRepo(tool), tool.name);
  }
  assert.ok(catalog.includes("GitHub repository <svg"), "and says so visibly on its link");
});

test("the applications band shows each application in its own colors", () => {
  const html = render(kit.ApplicationsBand, { intro: "Intro.", title: "What the engines carry" });
  const { applications } = kit.familyTiers();
  assert.match(html, /^<section class="fam-band fam-apps on-iron" id="applications"/u);
  assert.equal(html.match(/<article class="fam-app"/gu).length, applications.length);
  for (const tool of applications) {
    assert.ok(html.includes(`--fam-app-color:${tool.brand.color}`), `${tool.name}: its color`);
    assert.ok(html.includes(`<h3 class="fam-app-name">${kit.displayName(tool)}</h3>`));
    assert.ok(html.includes(`href="${kit.toolHref(tool)}"`));
  }
  const palamedes = member("palamedes");
  const lead = html.slice(html.indexOf('data-lead=""'), html.indexOf("</article>"));
  assertInOrder(
    lead,
    [
      "Palamedes",
      ...kit.runsOnTools(palamedes).map((engine) => `<b>${engine.name}</b>${engine.shortJob}`),
    ],
    "the application that runs on family engines leads, and names them",
  );
  assert.ok(html.includes("From the same workshop"), "one that stands alone claims no more");
  assert.equal(
    render(kit.ApplicationsBand, { current: "palamedes" }).match(/<article/gu).length,
    applications.length - 1,
    "an application's own site leaves itself out",
  );
});

test("an application's card keeps the family's steel out, and is light for its logo", () => {
  const html = render(kit.ApplicationsBand);
  const lead = html.slice(html.indexOf('data-lead=""'), html.indexOf("</article>"));
  assert.doesNotMatch(
    lead,
    /fam-plate/u,
    "the engines it names sit on an inlay: no small type on steel inside a brand card",
  );
  assert.ok(!html.includes("data-ground"), "a logo needs no tile: the card itself is light");
});

test("the engines link to their own sites once they have one", () => {
  for (const name of ["ferroni", "ferriki", "ferromark"]) {
    assert.equal(kit.toolHref(member(name)), `https://${name}.dev`);
    assert.equal(kit.leadsToRepo(member(name)), false);
  }
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
