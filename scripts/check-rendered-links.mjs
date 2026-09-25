import { readFile } from "node:fs/promises";

import { inspectRenderedPage } from "./lib/rendered-page.mjs";

const output = new URL("../build/client/index.html", import.meta.url);
// eslint-disable-next-line security/detect-non-literal-fs-filename -- a fixed path inside this repository
const html = await readFile(output, "utf8");
const report = inspectRenderedPage(html);

if (report.missingFragments.length > 0) {
  throw new Error(
    `Rendered page links to missing fragment IDs: ${report.missingFragments.join(", ")}`,
  );
}
if (!report.hasCanonical) {
  throw new Error(`Rendered page is missing its canonical link to https://ferramenta.dev/`);
}

console.log(
  `Rendered page check passed: ${report.fragmentCount} fragment links and canonical URL.`,
);
