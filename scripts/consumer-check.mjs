/**
 * Runs inside the scratch project that `verify-package-consumers.mjs` builds:
 * imports both entry points of the installed `@ferramenta/family` and renders
 * the chrome. Plain Node, no bundler — the state a consumer is in right after
 * `pnpm add` and before its own build.
 */
import { family, SiteFooter, SiteHeader } from "@ferramenta/family";
import { familyGroups } from "@ferramenta/family/registry";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const header = renderToStaticMarkup(createElement(SiteHeader, { current: family[0].name }));
const footer = renderToStaticMarkup(createElement(SiteFooter));

function expect(condition, message) {
  if (!condition) {
    console.error(`consumer check failed: ${message}`);
    process.exit(1);
  }
}

expect(header.includes('<header class="site-header">'), "the header did not render");
expect(header.includes('aria-current="page"'), "`current` did not mark the site's own entry");
expect(footer.includes('<footer class="site-footer">'), "the footer did not render");
for (const tool of family) {
  expect(footer.includes(`>${tool.name}</a>`), `missing from the footer: ${tool.name}`);
}
expect(Object.keys(familyGroups()).length === 3, "the registry entry is broken");

console.log(`rendered the chrome for ${family.length} family members`);
