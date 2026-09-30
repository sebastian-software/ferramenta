/**
 * Takes the kit out of the built sitemap. The kit's pages are public but carry
 * `noindex` (app/root.tsx), and a sitemap that submits a page marked noindex
 * contradicts itself. Ardo lists every route; a `.tsx` route has no
 * frontmatter to opt out with, so the entries are removed after the build.
 */
import { readFile, writeFile } from "node:fs/promises";

import { pruneSitemap } from "./lib/sitemap.mjs";

const NOINDEX_PREFIXES = ["/kit"];
const output = new URL("../build/client/sitemap.xml", import.meta.url);

// eslint-disable-next-line security/detect-non-literal-fs-filename -- a fixed path inside this repository
const { removed, xml } = pruneSitemap(await readFile(output, "utf8"), NOINDEX_PREFIXES);
if (!xml.includes("<loc>https://ferramenta.dev/</loc>")) {
  throw new Error("The sitemap lost the home page.");
}
// eslint-disable-next-line security/detect-non-literal-fs-filename -- a fixed path inside this repository
await writeFile(output, xml);
console.log(`Sitemap pruned: ${removed.length} noindex page(s) removed.`);
