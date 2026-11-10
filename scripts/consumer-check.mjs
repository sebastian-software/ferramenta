/**
 * Runs inside the scratch project that `verify-package-consumers.mjs` builds:
 * imports the entry points of the installed `ferramenta-family`, renders
 * Monografie's header, catalog and reading layout once, and checks that every
 * file the shipped stylesheets name is in the package. Plain Node, no bundler —
 * the state a consumer is in right after `pnpm add` and before its own build.
 * What the components do is the package's own test suite's business.
 */
import { family, MarkDefs, RegistryFacts } from "ferramenta-family";
import {
  MonoEngineCatalog,
  MonoHeader,
  MonoReadingLayout,
  MonoReadingTable,
  MonoWorkshop,
} from "ferramenta-family/monografie";
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

expect(Object.keys(familyTiers()).length === 2, "the registry entry is broken");
// The Ardo shell runs only inside Ardo's Vite build (it reads virtual modules), so
// plain Node checks that the entry resolves to a shipped file, not that it loads.
expect(
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is the installed package's own entry
  existsSync(new URL(import.meta.resolve("ferramenta-family/ardo"))),
  "the ardo entry has no file",
);
expect(
  typeof MarkDefs === "function" && typeof RegistryFacts === "function",
  "the root entry lost its sprite or its registry facts",
);
expect(
  render(MonoHeader, { product: "ferroni", home: "/", links: [] }).includes('class="mono-header"'),
  "the Monografie header did not render",
);
const catalog = render(MonoEngineCatalog, {});
for (const tool of familyTiers().engines) {
  expect(catalog.includes(`id="${tool.name}"`), `missing from the engine catalog: ${tool.name}`);
}
const workshop = render(MonoWorkshop, {});
for (const name of ["Sebastian Software", "Sebastian Consulting"])
  expect(workshop.includes(name), `the workshop does not name ${name}`);
const reading = render(MonoReadingLayout, {
  navigation: "Pages",
  children: createElement(MonoReadingTable, {}),
});
expect(reading.includes('class="mono-reading"'), "the Monografie reading layout did not render");

/** True when the installed package ships the file a stylesheet of its own names. */
function isShipped(file, stylesheet) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- a path the installed package's own stylesheet names
  return existsSync(new URL(file, stylesheet));
}

// The marks, instruments, surfaces and faces are files the stylesheets place:
// every one they name has to be in the installed package.
for (const name of ["monografie.css", "monografie-docs.css", "monografie-ardo.css"]) {
  const url = new URL(import.meta.resolve(`ferramenta-family/${name}`));
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is the installed package's own exported stylesheet
  const css = readFileSync(url, "utf8");
  const sheets = [url];
  for (const [, imported] of css.matchAll(/@import url\("(\.\/[^"]+)"\)/gu))
    sheets.push(new URL(imported, url));
  for (const sheet of sheets) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- a stylesheet inside the installed package
    const text = readFileSync(sheet, "utf8");
    for (const [, file] of text.matchAll(/url\("(\.\.\/[^"]+)"\)/gu)) {
      expect(isShipped(file, sheet), `${name} references an unshipped asset: ${file}`);
    }
  }
}
expect(
  isShipped(
    "../ferra/ferramenta/favicon.ico",
    new URL(import.meta.resolve("ferramenta-family/monografie.css")),
  ),
  "the family favicon is missing",
);
console.log(`rendered Monografie for ${family.length} family members and verified its stylesheets`);
