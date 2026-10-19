import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";

import * as editorial from "../dist/editorial.js";
import { kit, render } from "./helpers.mjs";

test("the editorial catalog follows the engine registry and links to the declared destination", () => {
  const html = render(editorial.EditorialEngineCatalog, {});
  const engines = kit.family.filter(kit.isEngine);
  assert.equal((html.match(/<article /gu) ?? []).length, engines.length);
  for (const tool of engines) {
    assert.ok(html.includes(`>${kit.displayName(tool)}</h3>`));
    assert.ok(html.includes(`href="${kit.toolHref(tool)}"`));
    assert.ok(html.includes(tool.what));
  }
  for (const tool of kit.family.filter((t) => !kit.isEngine(t))) {
    assert.ok(!html.includes(`>${kit.displayName(tool)}</h3>`));
  }
  const local = render(editorial.EditorialEngineCatalog, { hrefFor: (t) => `/preview/${t.name}/` });
  assert.ok(local.includes('href="/preview/ferroni/"'));
});

test("marks are decorative beside text and named when used alone", () => {
  const decorative = render(editorial.EditorialMark, { product: "ferramenta", size: 32 });
  assert.ok(decorative.includes('aria-hidden="true"'));
  assert.ok(decorative.includes("--fe-mark-size:32px"));
  const named = render(editorial.EditorialMark, { product: "ferroni", label: "Ferroni" });
  assert.ok(named.includes('role="img" aria-label="Ferroni"'));
  assert.ok(!named.includes("aria-hidden"));
});

test("the closing section identifies both workshop brands and ships their unchanged logos", async () => {
  const { WORKSHOP_REFERENCES } = await import("../dist/family.js");
  const html = render(editorial.EditorialWorkshop, { id: "workshop-links" });
  assert.ok(html.includes('data-surface="plain"'));
  assert.ok(html.includes('aria-labelledby="workshop-links-title"'));
  assert.equal(WORKSHOP_REFERENCES.length, 2);
  for (const reference of WORKSHOP_REFERENCES) {
    assert.ok(html.includes(`href="${reference.href}"`));
    assert.ok(html.includes(`role="img" aria-label="${reference.name}"`));
    const name = `sebastian-${reference.id}.svg`;
    const original = await readFile(new URL(`../../../app/assets/logos/${name}`, import.meta.url));
    const shipped = await readFile(new URL(`../editorial/brands/${name}`, import.meta.url));
    assert.deepEqual(shipped, original, name);
  }
});

test("sections own unique named headings and tables retain native header semantics", () => {
  const first = render(editorial.EditorialSection, {
    id: "contract",
    label: "Contract",
    intro: "Known inputs.",
    title: "Read the scope.",
    children: "A focused contract.",
  });
  assert.ok(first.includes('aria-labelledby="contract-title"'));
  assert.ok(first.includes('<h2 id="contract-title">Read the scope.</h2>'));
  const table = render(editorial.EditorialTable, {
    caption: "Sample measurements",
    children: createElement(
      "tbody",
      null,
      createElement(
        "tr",
        null,
        createElement("th", { scope: "row" }, "Example"),
        createElement("td", null, "2 ms"),
      ),
    ),
  });
  assert.ok(table.includes('role="region"'));
  assert.ok(table.includes('tabindex="0"'));
  assert.ok(table.includes('<th scope="row">Example</th>'));
  assert.match(
    table,
    /aria-labelledby="([^"]+)" tabindex="0"><table class="fe-table"><caption id="\1">Sample measurements/u,
  );
});

test("code remains escaped text in a keyboard-reachable scroll box", () => {
  const html = render(editorial.EditorialCode, {
    caption: "Untrusted input",
    children: '<script>alert("text")</script>',
  });
  assert.ok(html.includes('<pre tabindex="0"><code>'));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
});

test("bars keep textual values, handle zero and reject invalid measurements", () => {
  const item = { id: "one", label: "Sample", value: 0, displayValue: "0 units" };
  const html = render(editorial.EditorialBars, { caption: "Fictional sample data", items: [item] });
  assert.ok(html.includes("0 units"));
  assert.ok(html.includes("width:0%"));
  assert.ok(!html.includes("NaN"));
  for (const value of [-1, Infinity, Number.NaN]) {
    assert.throws(
      () => render(editorial.EditorialBars, { caption: "Invalid", items: [{ ...item, value }] }),
      RangeError,
    );
  }
});

test("the additive entry, tokens and every CSS asset travel in the package", async () => {
  const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(manifest.exports["./editorial"].default, "./dist/editorial.js");
  assert.ok(manifest.files.includes("editorial"));
  for (const name of ["editorial.css", "editorial-tokens.css"])
    await access(new URL(`../${manifest.exports[`./${name}`]}`, import.meta.url));
  const assets = JSON.parse(
    await readFile(new URL("../editorial/manifest.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(
    Object.keys(assets.products).toSorted(),
    ["ferramenta", ...kit.family.filter(kit.isEngine).map((t) => t.name)].toSorted(),
  );
  assert.deepEqual(
    editorial.EDITORIAL_PRODUCTS.toSorted(),
    Object.keys(assets.products).toSorted(),
  );
  for (const product of Object.values(assets.products)) {
    for (const asset of [product.mark, product.instrument, product.favicon, product.wordmark])
      await access(new URL(`../editorial/${asset}`, import.meta.url));
  }
  for (const name of ["editorial.css", "editorial-assets.css", "editorial-fonts.css"]) {
    const css = await readFile(new URL(`../styles/${name}`, import.meta.url), "utf8");
    for (const [, file] of css.matchAll(/url\("(\.\.\/[^"]+)"\)/gu))
      await access(new URL(`../styles/${file}`, import.meta.url));
  }
});

test("exported assets retain their source provenance and token JSON matches the canonical values", async () => {
  const output = new URL("../editorial/", import.meta.url);
  const entries = await readdir(output, { recursive: true });
  const rasters = entries.filter((name) => /\.(?:png|webp|ico)$/u.test(name));
  assert.ok(rasters.length > 80);
  for (const name of rasters) {
    const bytes = await readFile(new URL(name, output));
    const sidecar = JSON.parse(await readFile(new URL(`${name}.json`, output), "utf8"));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), sidecar.sha256, name);
    const master = await readFile(new URL(`../../../${sidecar.source}`, import.meta.url));
    assert.equal(createHash("sha256").update(master).digest("hex"), sidecar.sourceSha256, name);
    assert.equal(typeof sidecar.prompt, "string");
  }
  const canonical = JSON.parse(
    await readFile(new URL("../../../design/editorial/tokens.json", import.meta.url), "utf8"),
  );
  const exported = JSON.parse(await readFile(new URL("tokens.json", output), "utf8"));
  assert.deepEqual(exported, canonical);
});

test("the selected Plex heading font and its license ship unchanged with system body tokens", async () => {
  const output = new URL("../editorial/", import.meta.url);
  const manifest = JSON.parse(await readFile(new URL("fonts/manifest.json", output), "utf8"));
  assert.equal(manifest.family, "IBM Plex Sans");
  assert.equal(manifest.weight, 600);
  for (const file of manifest.files) {
    const bytes = await readFile(new URL(`fonts/${file.file}`, output));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
  }
  const tokens = JSON.parse(await readFile(new URL("tokens.json", output), "utf8"));
  assert.ok(tokens.type["font-sans"].startsWith("system-ui"));
  assert.ok(tokens.type["font-display"].startsWith('"IBM Plex Sans"'));
  const css = await readFile(new URL("../styles/editorial-fonts.css", import.meta.url), "utf8");
  assert.ok(css.includes("font-display: swap"));
  assert.ok(!css.includes("https://"));
});
