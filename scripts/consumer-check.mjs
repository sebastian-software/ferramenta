/**
 * Runs inside the scratch project that `verify-package-consumers.mjs` builds:
 * imports both entry points of the installed `ferramenta-family` and renders
 * the chrome. Plain Node, no bundler — the state a consumer is in right after
 * `pnpm add` and before its own build.
 */
import {
  family,
  PipelineAssembly,
  ProjectHero,
  SiteFooter,
  SiteHeader,
  ToolSwitcher,
} from "ferramenta-family";
import { familyGroups } from "ferramenta-family/registry";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const render = (component, properties) =>
  renderToStaticMarkup(createElement(component, properties));

const header = render(SiteHeader, { current: family[0].name });
const footer = render(SiteFooter);

function expect(condition, message) {
  if (!condition) {
    console.error(`consumer check failed: ${message}`);
    process.exit(1);
  }
}

expect(header.includes('<header class="site-header">'), "the header did not render");
expect(
  header.includes(`Current: ${family[0].name}`),
  "`current` did not mark the site's own entry",
);
expect(footer.includes('<footer class="site-footer">'), "the footer did not render");
for (const tool of family) {
  expect(footer.includes(`>${tool.name}`), `missing from the footer: ${tool.name}`);
}
expect(Object.keys(familyGroups()).length === 3, "the registry entry is broken");

// The switcher on its own, the way an Ardo docs site puts it into
// `ArdoHeaderActions`: it has to render without the package's own header
// around it, and the duotone variables its marks read have to come with it.
const switcher = render(ToolSwitcher, { current: family[0].name });
expect(switcher.startsWith('<details class="switcher">'), "the standalone switcher did not render");
expect(switcher.includes('<div class="flyout">'), "the standalone switcher has no flyout");
expect(switcher.includes(`Current: ${family[0].name}`), "the standalone switcher lost `current`");
for (const tool of family.slice(1)) {
  expect(switcher.includes(`<b>${tool.name}`), `missing from the switcher: ${tool.name}`);
}
expect(
  render(ToolSwitcher, { align: "start", label: "Ferramenta" }).startsWith(
    '<details class="switcher switcher-start">',
  ),
  "the switcher ignored `align`",
);

// eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is the installed package's own exported stylesheet
const chrome = readFileSync(new URL(import.meta.resolve("ferramenta-family/chrome.css")), "utf8");
const declaration = chrome.indexOf("--duo0");
const selectors = chrome.lastIndexOf("}", declaration) + 1;
expect(
  chrome.slice(selectors, declaration).includes("details.switcher"),
  "the shipped chrome.css defines no duotone variables on the switcher root",
);
expect(
  chrome.slice(selectors, declaration).includes(".on-iron"),
  "the shipped chrome.css has no standalone duotone wrapper class",
);

// The docs-site slots: search and a section menu go in `actions`, not in the
// theme-toggle slot.
const slotted = render(SiteHeader, {
  actions: createElement("form", { className: "docs-search" }),
  themeToggle: createElement("button", { className: "toggle", type: "button" }),
});
expect(
  slotted.indexOf('class="docs-search"') < slotted.indexOf('class="toggle"'),
  "`actions` did not render before `themeToggle`",
);

// A host that already owns the landmark renders the chrome as a plain element.
expect(
  render(SiteHeader, { as: "div", current: family[0].name }).startsWith(
    '<div class="site-header">',
  ),
  "`as` did not swap the header element",
);
const hosted = render(SiteFooter, { as: "div", current: family[0].name });
expect(
  !hosted.includes(`href="${family[0].docs ?? family[0].repo}"`),
  "footer contains a self-link",
);
expect(hosted.startsWith('<div class="site-footer">'), "`as` did not swap the footer element");
expect(!hosted.includes("<footer"), '`as="div"` still emitted a contentinfo landmark');

// A sibling's own lockup, and the landing kit its home page is built from.
const project = render(SiteHeader, { current: "ferroni", home: "/ferroni/", lockup: "project" });
expect(
  project.includes('<a class="lockup" href="/ferroni/">'),
  "the project lockup did not link home",
);
expect(project.includes('class="flyhome"'), "the project lockup lost the way back to the family");
expect(
  render(ProjectHero, { mark: "ferroni", title: "Ferroni" }).includes("fam-hero-plate"),
  "the hero did not hang the project's plate",
);
expect(
  render(PipelineAssembly, { current: "ferroni" }).includes('aria-current="true"'),
  "the pipeline assembly did not mark the current stage",
);
// eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is the installed package's own exported stylesheet
const landing = readFileSync(new URL(import.meta.resolve("ferramenta-family/landing.css")), "utf8");
expect(landing.includes(".fam-page"), "the shipped landing.css has no page scope");

console.log(`rendered the chrome and the standalone switcher for ${family.length} family members`);
console.log("rendered the project lockup and the landing kit");
