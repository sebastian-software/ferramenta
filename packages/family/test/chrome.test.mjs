/**
 * Consumer smoke test: renders the shipped chrome the way a sibling site would
 * — from the package's build output, in a bare Ardo-shaped app, with no Vite
 * and no repository-local import path.
 */
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { register } from "node:module";
import { test } from "node:test";
import { promisify } from "node:util";

register("./ardo-ui-loader.mjs", import.meta.url);

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
  assert.ok(html.includes("ardo-theme-toggle"), "Ardo's theme toggle keeps its slot");
  for (const tool of family.family) {
    assert.ok(html.includes(`>${tool.name}</b>`), `missing from the switcher: ${tool.name}`);
    assert.ok(html.includes(`href="${tool.docs ?? tool.repo}"`), `missing link: ${tool.name}`);
  }
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

test("the registry entry loads in a bare Node process", async () => {
  // The root entry pulls in `SiteHeader` -> `ardo/ui`, which needs a bundler —
  // hence the stub above. A consumer that only wants the data must not need
  // one, so this runs in a child process with no loader hooks at all.
  const script = [
    'const registry = await import("@ferramenta/family/registry");',
    "console.log(JSON.stringify({",
    "  groups: Object.keys(registry.familyGroups()),",
    "  members: registry.family.length,",
    "  site: registry.FAMILY_SITE,",
    "  engines: registry.family.filter((tool) => registry.isEngine(tool)).length,",
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
