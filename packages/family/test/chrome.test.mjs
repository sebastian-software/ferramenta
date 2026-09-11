/**
 * Consumer smoke test: renders the shipped chrome the way a sibling site would
 * — from the package's build output, in a bare Node process, with no bundler
 * and no repository-local import path.
 */
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";
import { promisify } from "node:util";

const { renderToStaticMarkup } = await import("react-dom/server");
const { createElement } = await import("react");
const family = await import("../dist/index.js");
const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

const render = (component, props) => renderToStaticMarkup(createElement(component, props));

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
  assert.ok(html.includes('<a class="lockup" href="/">'), "the family site links its own root");
  assert.ok(html.includes("Tools"), "the switcher has its summary");
  for (const tool of family.family) {
    assert.ok(html.includes(`>${tool.name}</b>`), `missing from the switcher: ${tool.name}`);
    assert.ok(html.includes(`href="${tool.docs ?? tool.repo}"`), `missing link: ${tool.name}`);
  }
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
});

test("the switcher stands alone, for a host header that is not ours", () => {
  const html = render(family.ToolSwitcher, { current: "ferroni" });
  assert.match(html, /^<details class="switcher">/u);
  assert.ok(html.includes("Tools"), "the default trigger text");
  assert.ok(html.includes('<div class="flyout">'), "and its flyout");
  assert.ok(!html.includes('aria-current="page"'));
  for (const tool of family.relatedTools("ferroni")) {
    assert.ok(html.includes(`>${tool.name}</b>`), `missing from the switcher: ${tool.name}`);
  }
  assert.ok(
    render(family.SiteHeader, { current: "ferroni" }).includes(html),
    "the header renders the very same switcher",
  );
});

test("the switcher takes a trigger label, a start alignment and host classes", () => {
  const html = render(family.ToolSwitcher, {
    align: "start",
    className: "ardo-header-item",
    label: "Ferramenta",
  });
  assert.match(html, /^<details class="switcher switcher-start ardo-header-item">/u);
  assert.ok(html.includes("Ferramenta"), "the trigger text is the host's");
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
    html.indexOf('aria-label="Docs"') < html.indexOf('<nav class="site"'),
    "before the bar",
  );
  assert.ok(
    html.indexOf('class="docs-search"') < html.indexOf('class="ardo-theme-toggle"'),
    "actions come before the theme toggle",
  );
  assert.ok(!render(family.SiteHeader).includes("<form"), "and nothing without them");
});

test("`as` drops the landmark element for a host that provides its own", () => {
  const header = render(family.SiteHeader, { as: "div", current: "ferroni" });
  assert.match(header, /^<div class="site-header">/u);
  assert.ok(!header.includes("<header"), "no banner landmark inside the host's");
  assert.ok(header.includes('<a class="lockup"'), "the chrome itself is unchanged");

  const footer = render(family.SiteFooter, { as: "div", current: "ferroni" });
  assert.match(footer, /^<div class="site-footer">/u);
  assert.ok(!footer.includes("<footer"), "no contentinfo landmark inside the host's");
  assert.ok(footer.includes(">Pipeline</h3>"), "the chrome itself is unchanged");
});

test("the chrome CSS carries the duotone set outside the header and footer", async () => {
  const css = await readFile(new URL("../styles/chrome.css", import.meta.url), "utf8");
  // The selector list of the rule that declares the duotone set. Without these
  // two the switcher's marks, and a host's own mark on iron, are blank outside
  // `.site-header` / `.site-footer`.
  const declaration = css.indexOf("--duo0");
  const selectors = css.lastIndexOf("}", declaration) + 1;
  assert.ok(
    css.slice(selectors, declaration).includes("details.switcher"),
    "the switcher root carries no duotone variables",
  );
  assert.ok(
    css.slice(selectors, declaration).includes(".on-iron"),
    "there is no standalone duotone wrapper class",
  );
  assert.ok(
    css.slice(css.indexOf(".foot-legal")).includes(".foot .foot-legal"),
    "the legal line is still clamped to the 34ch measure `.foot p` sets",
  );
  // Both ship with the component: a consumer that renders only `ToolSwitcher`
  // cannot reach them any other way.
  assert.match(
    css,
    /@media \(max-width: 46rem\) \{\n {2}\.switcher > \.flyout \{/u,
    "the narrow-viewport flyout rules are not in the package",
  );
  const flyoutRule = css.indexOf("\n.flyout {");
  assert.ok(
    css.slice(flyoutRule, css.indexOf("}", flyoutRule)).includes("color: var(--iron-ink)"),
    "the flyout takes the host page's ink instead of its own",
  );
  assert.match(
    css,
    /\n\.site-footer \{\n {2}margin-top:/u,
    'the footer is keyed on its class, so `as="div"` styles the same',
  );
});

test("the footer lists the family in groups plus the company links", () => {
  const html = render(family.SiteFooter);
  assert.match(html, /^<footer class="site-footer">/u);
  for (const label of ["Pipeline", "Language", "Workbench", "Company"]) {
    assert.ok(html.includes(`>${label}</h3>`), `missing footer column: ${label}`);
  }
  for (const tool of family.family) {
    assert.ok(html.includes(`>${tool.name}</a>`), `missing from the footer: ${tool.name}`);
  }
  assert.ok(html.includes("https://oss.sebastian-software.com"));
  assert.ok(html.includes("MIT-licensed"), "the default legal line");
});

test("the company line drops the family columns (decision D2)", () => {
  const html = render(family.SiteFooter, { current: "dalo", legal: "Own terms.", line: "company" });
  assert.ok(html.includes('class="wrap foot foot-company"'));
  for (const label of ["Pipeline", "Language", "Workbench"]) {
    assert.ok(!html.includes(`>${label}</h3>`), `the company line must not list: ${label}`);
  }
  assert.ok(html.includes(">Company</h3>"));
  assert.ok(!html.includes("foot-gap"), "with one column there is no gap heading");
  assert.ok(html.includes("Own terms."), "the legal line is the consumer's");
});

test("a family site omits its own footer entry", () => {
  const html = render(family.SiteFooter, { current: "ferrocat" });
  assert.ok(!html.includes('aria-current="page"'));
});

test("every family member has a mark, and the sprite stays under 100 (ADR-0002)", () => {
  const symbols = [...family.MARK_DEFS.matchAll(/<symbol id="i-(?<name>[a-z-]+)"/gu)].map(
    (match) => match.groups.name,
  );
  for (const tool of family.family) {
    assert.ok(symbols.includes(tool.name), `no mark for ${tool.name}`);
  }
  assert.ok(symbols.includes("ferramenta"), "the family lockup mark");
  assert.ok(symbols.length < 100, `the package ships ${symbols.length} icons`);
});

test("both entries load in a bare Node process", async () => {
  // No bundler, no loader hooks, resolved through the exports map: the case a
  // git consumer hits before its own build ever runs.
  const script = [
    'const registry = await import("ferramenta-family/registry");',
    'const root = await import("ferramenta-family");',
    "console.log(JSON.stringify({",
    "  groups: Object.keys(registry.familyGroups()),",
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
  assert.deepEqual(result.groups, ["pipeline", "language", "workbench"]);
  assert.equal(result.members, family.family.length);
  assert.equal(result.site, family.FAMILY_SITE);
  assert.ok(result.engines > 0, "the registry knows which members are engines");
  assert.deepEqual(result.chrome, ["function", "function", "function"]);
  assert.equal(result.switcher, "function", "the standalone switcher is exported");
});

test("the CSS a consumer imports is exported and shipped", async () => {
  for (const entry of ["./chrome.css", "./fonts.css", "./theme.css", "./tokens.css"]) {
    const target = manifest.exports[entry];
    assert.equal(typeof target, "string", `missing export: ${entry}`);
    await access(new URL(`../${target}`, import.meta.url));
  }
  assert.equal(manifest.exports["./registry"].default, "./dist/family.js");
  await access(new URL("../fonts/big-shoulders.woff2", import.meta.url));
  assert.ok(manifest.files.includes("styles") && manifest.files.includes("fonts"));
});

test("every related React link has a job and omits the current project", () => {
  for (const current of family.family) {
    for (const component of [family.FamilyLinks, family.SiteFooter]) {
      const html = render(component, { current: current.name });
      assert.ok(!html.includes(`href="${current.docs ?? current.repo}"`));
      assert.ok(html.includes("#i-ferramenta"));
      for (const sibling of family.relatedTools(current.name)) {
        assert.ok(html.includes(`href="${sibling.docs ?? sibling.repo}"`));
        const escaped = sibling.job.replaceAll("&", "&amp;");
        assert.ok(html.includes(escaped));
      }
    }
  }
});
