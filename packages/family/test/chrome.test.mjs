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

test("current marks the site's own entry and sends the lockup to the family site", () => {
  const html = render(family.SiteHeader, { current: "ferroni" });
  assert.ok(html.includes(`<a class="lockup" href="${family.FAMILY_SITE}">`));
  assert.equal(html.match(/aria-current="page"/gu)?.length, 1);
  const entry = html.slice(html.indexOf('aria-current="page"'));
  assert.ok(entry.includes(">ferroni</b>"), "the marked entry is the current tool");
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

test("a family site de-emphasizes its own footer entry", () => {
  const html = render(family.SiteFooter, { current: "ferrocat" });
  assert.equal(html.match(/aria-current="page"/gu)?.length, 1);
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
    'const registry = await import("@ferramenta/family/registry");',
    'const root = await import("@ferramenta/family");',
    "console.log(JSON.stringify({",
    "  groups: Object.keys(registry.familyGroups()),",
    "  members: registry.family.length,",
    "  site: registry.FAMILY_SITE,",
    "  engines: registry.family.filter((tool) => registry.isEngine(tool)).length,",
    "  chrome: [typeof root.SiteHeader, typeof root.SiteFooter, typeof root.MarkDefs],",
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
