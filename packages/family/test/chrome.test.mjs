/**
 * Consumer smoke test: renders the shipped chrome the way a sibling site would
 * — from the package's build output, in a bare Node process, with no bundler
 * and no repository-local import path.
 */
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { test } from "node:test";
import { promisify } from "node:util";
import { createElement } from "react";

import { kit as family, render } from "./helpers.mjs";

test("registry evidence carries durable provenance instead of release counts", () => {
  for (const tool of family.family) {
    assert.doesNotMatch(
      tool.evidence,
      /\d/u,
      `${tool.name} evidence must not embed a volatile release number`,
    );
  }
  assert.equal(
    family.family.find((tool) => tool.name === "ferroni")?.evidence,
    "Oniguruma compatibility oracle",
  );
  assert.equal(
    family.family.find((tool) => tool.name === "ferromark")?.evidence,
    "CommonMark & GFM conformance",
  );
});

test("the header renders the switcher with every family member", () => {
  const html = render(family.SiteHeader);
  assert.match(html, /^<header class="site-header">/u);
  assert.ok(html.includes('<nav class="site-nav" aria-label="Site">'));
  assert.ok(html.includes('<a class="lockup" href="/">'), "the family site links its own root");
  assert.ok(
    html.includes(
      '<a class="ghlink" href="https://github.com/sebastian-software" aria-label="GitHub">',
    ),
    "the family header links to the organization",
  );
  assert.ok(html.includes("Tools"), "the switcher has its summary");
  for (const tool of family.family) {
    assert.ok(html.includes(`<b>${tool.name}`), `missing from the switcher: ${tool.name}`);
    assert.ok(html.includes(`href="${tool.docs ?? tool.repo}"`), `missing link: ${tool.name}`);
  }
});

test("the switcher lists the engines, then the applications, and can be left out", () => {
  const html = render(family.SiteHeader);
  const { applications, engines } = family.familyTiers();
  assert.ok(html.includes('<div class="flygroup"><small>Engines</small>'));
  assert.ok(html.includes('<div class="flygroup"><small>Applications</small>'));
  assert.ok(
    html.indexOf(`<b>${engines.at(-1).name}`) < html.indexOf(`<b>${applications[0].name}`),
    "every engine before the first application",
  );
  const bare = render(family.SiteHeader, { switcher: false });
  assert.ok(!bare.includes("<details"), "the family's own index shows no switcher");
  assert.ok(bare.includes('class="ghlink"'), "the rest of the bar stays");
});

test("the theme toggle is the site's, rendered into the slot", () => {
  // The package must not import `ardo/ui`: it is a bundler-only module, and a
  // git consumer would then install Ardo's whole tree to build this package.
  const toggle = createElement("button", { className: "ardo-theme-toggle", type: "button" });
  const html = render(family.SiteHeader, { themeToggle: toggle });
  assert.ok(html.includes('<button class="ardo-theme-toggle"'), "the slot renders its child");
  assert.ok(!render(family.SiteHeader).includes("<button"), "and nothing without one");
});

test("current is context rather than a self-link", () => {
  const html = render(family.SiteHeader, { current: "ferroni" });
  assert.ok(html.includes("Current: ferroni"));
  assert.ok(!html.includes('href="https://sebastian-software.github.io/ferroni/"'));
  assert.ok(
    html.includes(
      '<a class="ghlink" href="https://github.com/sebastian-software/ferroni" aria-label="ferroni on GitHub">',
    ),
    "a project header links to its repository with a descriptive name",
  );
});

test("the project lockup names the site and moves the family into the switcher", () => {
  const html = render(family.SiteHeader, {
    current: "ferroni",
    home: "/ferroni/",
    lockup: "project",
  });
  assert.ok(html.includes('<a class="lockup" href="/ferroni/">'), "the lockup links the site home");
  assert.ok(
    html.includes(
      '<span class="fam-tile"><span class="fam-icon" data-icon="ferroni" data-form="small" style="--fam-icon-size:28px" aria-hidden="true"></span></span><span>ferroni</span>',
    ),
    "the project's small icon on a steel tile, then its name",
  );
  assert.ok(html.includes('<details class="switcher switcher-family">'), "the family trigger");
  assert.ok(html.includes('aria-label="Ferramenta: all tools"'), "its name keeps the visible word");
  assert.ok(
    html.includes(`<a class="flyhome" href="${family.FAMILY_SITE}">`),
    "the way back to the family site",
  );
  assert.ok(!html.includes("<span>ferramenta</span>"), "no family lockup in the brand slot");
  assert.ok(
    render(family.SiteHeader, { current: "ferroni", lockup: "project" }).includes(
      '<a class="lockup" href="/">',
    ),
    "home defaults to the site root",
  );
  assert.throws(
    () => render(family.SiteHeader, { lockup: "project" }),
    /needs `current`/u,
    "a project lockup without a project is a configuration error",
  );
});

test("the family lockup stays the default, with no family entry in the flyout", () => {
  const html = render(family.SiteHeader, { current: "ferroni" });
  assert.ok(html.includes(`<a class="lockup" href="${family.FAMILY_SITE}">`));
  assert.ok(html.includes("<span>ferramenta</span>"));
  assert.ok(!html.includes("flyhome"), "the lockup already is the way back");
});

test("the switcher stands alone, for a host header that is not ours", () => {
  const html = render(family.ToolSwitcher, { current: "ferroni" });
  assert.match(html, /^<details class="switcher">/u);
  assert.ok(html.includes("Tools"), "the default trigger text");
  assert.ok(html.includes('<div class="flyout">'), "and its flyout");
  assert.ok(!html.includes('aria-current="page"'));
  for (const tool of family.relatedTools("ferroni")) {
    assert.ok(html.includes(`<b>${tool.name}`), `missing from the switcher: ${tool.name}`);
  }
  assert.ok(
    render(family.SiteHeader, { current: "ferroni" }).includes(html),
    "the header renders the very same switcher",
  );
});

test("the switcher takes a start alignment, for a trigger near the left edge", () => {
  const html = render(family.ToolSwitcher, { align: "start" });
  assert.match(html, /^<details class="switcher switcher-start">/u);
  assert.ok(html.includes('aria-label="All tools"'), "the accessible name stays");
});

test("the docs-site slots keep search and navigation out of the toggle slot", () => {
  const html = render(family.SiteHeader, {
    actions: createElement("form", { className: "docs-search" }),
    nav: createElement("nav", { "aria-label": "Docs" }),
    themeToggle: createElement("button", { className: "ardo-theme-toggle", type: "button" }),
  });
  assert.ok(html.includes('<nav aria-label="Docs">'), "the nav slot renders");
  assert.ok(
    html.indexOf('aria-label="Docs"') < html.indexOf('<nav class="site-nav"'),
    "before the bar",
  );
  assert.ok(
    html.indexOf('class="docs-search"') < html.indexOf('class="ardo-theme-toggle"'),
    "actions come before the theme toggle",
  );
  assert.ok(!render(family.SiteHeader).includes("<form"), "and nothing without them");
});

test("a site's sections fold into a menu where the bar cannot show them", () => {
  const html = render(family.SiteMenu, {
    children: createElement("a", { href: "/guide" }, "Guide"),
    label: "Docs",
  });
  assert.match(html, /^<details class="site-menu"><summary>Docs <svg class="chev icon"/u);
  assert.ok(html.includes('<div class="site-menu-flyout"><a href="/guide">Guide</a></div>'));
  assert.ok(!html.includes("aria-label"), "the visible word is its accessible name");
});

test("`as` drops the landmark element for a host that provides its own", () => {
  const header = render(family.SiteHeader, { as: "div", current: "ferroni" });
  assert.match(header, /^<div class="site-header">/u);
  assert.ok(!header.includes("<header"), "no banner landmark inside the host's");
  assert.ok(header.includes('<a class="lockup"'), "the chrome itself is unchanged");

  const footer = render(family.SiteFooter, { as: "div", current: "ferroni" });
  assert.match(footer, /^<div class="site-footer">/u);
  assert.ok(!footer.includes("<footer"), "no contentinfo landmark inside the host's");
  assert.ok(footer.includes("<h2>Engines</h2>"), "the chrome itself is unchanged");
});

test("the footer lists the family's two tiers plus the workshop's links", () => {
  const html = render(family.SiteFooter);
  assert.match(html, /^<footer class="site-footer">/u);
  for (const label of ["Engines", "Applications", "Work with us"]) {
    assert.ok(html.includes(`>${label}</h2>`), `missing footer column: ${label}`);
  }
  assert.ok(
    html.indexOf(">Engines</h2>") < html.indexOf(">Applications</h2>") &&
      html.indexOf(">Applications</h2>") < html.indexOf(">Work with us</h2>"),
    "engines, then applications, then the workshop",
  );
  for (const tool of family.family) {
    assert.ok(html.includes(`>${tool.name}`), `missing from the footer: ${tool.name}`);
  }
  assert.ok(
    html.includes(`<a href="${family.WORKSHOP.consulting}">Consulting</a>`),
    "every family site carries the consulting link (ADR-0008)",
  );
  assert.ok(
    html.indexOf(family.WORKSHOP.consulting) < html.indexOf(family.WORKSHOP.openSource),
    "and it comes first",
  );
  assert.ok(html.includes("https://oss.sebastian-software.com"));
  assert.ok(html.includes("MIT-licensed"), "the default legal line");
});

test("a family site omits its own footer entry", () => {
  const html = render(family.SiteFooter, { current: "ferrocat" });
  assert.ok(!html.includes('aria-current="page"'));
});

test("both entries load in a bare Node process", async () => {
  // No bundler, no loader hooks, resolved through the exports map: the case a
  // git consumer hits before its own build ever runs.
  const script = [
    'const registry = await import("ferramenta-family/registry");',
    'const root = await import("ferramenta-family");',
    "console.log(JSON.stringify({",
    "  tiers: Object.keys(registry.familyTiers()),",
    "  members: registry.family.length,",
    "  site: registry.FAMILY_SITE,",
    "  engines: registry.family.filter((tool) => registry.isEngine(tool)).length,",
    "  chrome: [typeof root.SiteHeader, typeof root.SiteFooter, typeof root.MarkDefs],",
    "  switcher: typeof root.ToolSwitcher,",
    "}));",
  ].join("\n");
  const { stdout } = await promisify(execFile)(
    process.execPath,
    ["--input-type=module", "-e", script],
    {
      cwd: new URL("../../../", import.meta.url),
    },
  );
  const result = JSON.parse(stdout);
  assert.deepEqual(result.tiers, ["engines", "applications"]);
  assert.equal(result.members, family.family.length);
  assert.equal(result.site, family.FAMILY_SITE);
  assert.ok(result.engines > 0, "the registry knows which members are engines");
  assert.deepEqual(result.chrome, ["function", "function", "function"]);
  assert.equal(result.switcher, "function", "the standalone switcher is exported");
});

test("the footer lists every related member with its job and omits the current project", () => {
  for (const current of family.family) {
    const html = render(family.SiteFooter, { current: current.name });
    assert.ok(!html.includes(`href="${current.docs ?? current.repo}"`));
    assert.ok(html.includes('data-icon="ferramenta"'), "the family's toolbox");
    for (const sibling of family.relatedTools(current.name)) {
      assert.ok(html.includes(`href="${sibling.docs ?? sibling.repo}"`));
      const escaped = sibling.job.replaceAll("&", "&amp;");
      assert.ok(html.includes(escaped));
    }
  }
});

test("every link to a member without a site says it leads to its repository", () => {
  const footer = render(family.SiteFooter, { members: "short" });
  const header = render(family.SiteHeader);
  for (const tool of family.family) {
    const note = `${tool.name}<span class="fam-sr-only"> (GitHub repository)</span>`;
    assert.equal(footer.includes(note), family.leadsToRepo(tool), `footer: ${tool.name}`);
    assert.equal(header.includes(note), family.leadsToRepo(tool), `switcher: ${tool.name}`);
    assert.equal(family.toolHref(tool), tool.docs ?? tool.repo);
  }
  assert.ok(footer.includes(`>${family.family[0].shortJob}</span>`), "short jobs on request");
  assert.ok(footer.includes("</span></span>ferramenta</a>"), "the lockup is the family's name");
  assert.ok(!footer.includes("More from Ferramenta"), "the family site names itself");
  assert.ok(render(family.SiteFooter, { current: "ferroni" }).includes("More from Ferramenta"));
});

test("the family's own index drops the footer's member columns, and headings are its own", () => {
  const index = render(family.SiteFooter, { members: "none" });
  for (const tool of family.family) assert.ok(!index.includes(`href="${family.toolHref(tool)}"`));
  assert.ok(index.includes('class="wrap foot foot-index"'), "one column less");
  assert.ok(index.includes("<h2>Work with us</h2>"), "the workshop's links stay");
  assert.ok(!/<h3/u.test(render(family.SiteFooter)), "footer headings are h2: its own outline");
});
