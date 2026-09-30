import assert from "node:assert/strict";
import { test } from "node:test";

import { pruneSitemap } from "./lib/sitemap.mjs";

const entry = (path) =>
  `  <url>\n    <loc>https://ferramenta.dev${path}</loc>\n    <priority>0.7</priority>\n  </url>\n`;
const sitemap = (paths) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset>\n${paths.map((path) => entry(path)).join("")}</urlset>\n`;

test("the kit's noindex pages leave the sitemap, everything else stays", () => {
  const { removed, xml } = pruneSitemap(sitemap(["/", "/kit", "/kit/tool", "/kitchen"]), ["/kit"]);
  assert.deepEqual(removed, ["/kit", "/kit/tool"]);
  assert.equal(xml, sitemap(["/", "/kitchen"]), "a path that only shares the prefix stays");
});

test("a sitemap without hidden pages is left as it is", () => {
  const xml = sitemap(["/"]);
  assert.deepEqual(pruneSitemap(xml, ["/kit"]), { xml, removed: [] });
});
