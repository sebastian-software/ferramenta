/**
 * Runs inside the scratch project that `verify-package-consumers.mjs` builds:
 * imports both entry points of the installed `ferramenta-family`, renders the
 * chrome and the landing kit once, and checks that every file the shipped
 * stylesheets name is in the package. Plain Node, no bundler — the state a
 * consumer is in right after `pnpm add` and before its own build. What the
 * components do is the package's own test suite's business.
 */
import { EngineCatalog, family, ProjectHero, SiteFooter, SiteHeader } from "ferramenta-family";
import { familyTiers } from "ferramenta-family/registry";
import { existsSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const render = (component, properties) =>
  renderToStaticMarkup(createElement(component, properties));

function expect(condition, message) {
  if (!condition) {
    console.error(`consumer check failed: ${message}`);
    process.exit(1);
  }
}

const header = render(SiteHeader, { current: family[0].name, lockup: "project" });
const footer = render(SiteFooter, { current: family[0].name });
expect(header.includes('<header class="site-header">'), "the header did not render");
expect(header.includes('<details class="switcher'), "the header has no switcher");
expect(footer.includes('<footer class="site-footer">'), "the footer did not render");
for (const tool of family.slice(1)) {
  expect(footer.includes(`>${tool.name}`), `missing from the footer: ${tool.name}`);
}
expect(Object.keys(familyTiers()).length === 2, "the registry entry is broken");
expect(
  render(ProjectHero, { icon: "ferroni", title: "Ferroni" }).includes('data-icon="ferroni"'),
  "the landing kit did not render",
);
expect(
  render(EngineCatalog, { current: "ferroni" }).includes('<article class="fam-engine"'),
  "the engine catalog did not render",
);

/** True when the installed package ships the file a stylesheet of its own names. */
function isShipped(file, stylesheet) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- a path the installed package's own stylesheet names
  return existsSync(new URL(file, stylesheet));
}

// The icons and textures are pictures the stylesheets place: every file they
// name has to be in the installed package, or a consumer sees blank tiles.
for (const name of ["chrome.css", "landing.css"]) {
  const url = new URL(import.meta.resolve(`ferramenta-family/${name}`));
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is the installed package's own exported stylesheet
  const css = readFileSync(url, "utf8");
  const files = [...css.matchAll(/url\("(?<file>\.\.\/[^"]+)"\)/gu)].map(
    (match) => match.groups.file,
  );
  if (name === "chrome.css")
    expect(files.length > family.length, "the shipped chrome.css places no icons");
  for (const file of files)
    expect(isShipped(file, url), `${name} names a file that is not shipped: ${file}`);
}

console.log(`rendered the chrome and the landing kit for ${family.length} family members`);
