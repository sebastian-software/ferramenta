import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";

import * as ferra from "../dist/ferra.js";
import { kit, render } from "./helpers.mjs";

test("the Ferra catalog follows the engine registry and links to the declared destination", () => {
  const html = render(ferra.FerraEngineCatalog, {});
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
  const local = render(ferra.FerraEngineCatalog, { hrefFor: (t) => `/preview/${t.name}/` });
  assert.ok(local.includes('href="/preview/ferroni/"'));
});

test("the Ferra entry preserves application brands, engine relations and release snapshots", () => {
  const applications = render(ferra.FerraApplications, {});
  for (const tool of kit.family.filter((tool) => !kit.isEngine(tool))) {
    assert.ok(applications.includes(`data-brand="${tool.name}"`));
    assert.ok(applications.includes(`href="${kit.toolHref(tool)}"`));
  }
  const catalog = render(kit.RegistryFacts, {
    snapshot: { ferroni: { crates: { version: "99.0.0", downloads: 1 } } },
    children: createElement(ferra.FerraEngineCatalog, {}),
  });
  assert.ok(catalog.includes("v99.0.0"));
  assert.ok(catalog.includes("Pairs with "));
  assert.ok(catalog.includes("Used by "));
  assert.ok(catalog.includes(kit.family.find((tool) => tool.name === "ferroni").evidence));
});

test("marks are decorative beside text and named when used alone", () => {
  const decorative = render(ferra.FerraMark, { product: "ferramenta", size: 32 });
  assert.ok(decorative.includes('aria-hidden="true"'));
  assert.ok(decorative.includes("--ferra-mark-size:32px"));
  const named = render(ferra.FerraMark, { product: "ferroni", label: "Ferroni" });
  assert.ok(named.includes('role="img" aria-label="Ferroni"'));
  assert.ok(!named.includes("aria-hidden"));
});

test("the closing section identifies both workshop brands and ships their unchanged logos", async () => {
  const { WORKSHOP_REFERENCES } = await import("../dist/family.js");
  const html = render(ferra.FerraWorkshop, { id: "workshop-links" });
  assert.ok(html.includes('data-surface="plain"'));
  assert.ok(html.includes('aria-labelledby="workshop-links-title"'));
  assert.equal(WORKSHOP_REFERENCES.length, 2);
  for (const reference of WORKSHOP_REFERENCES) {
    assert.ok(html.includes(`href="${reference.href}"`));
    assert.ok(html.includes(`role="img" aria-label="${reference.name}"`));
    const name = `sebastian-${reference.id}.svg`;
    const original = await readFile(new URL(`../../../app/assets/logos/${name}`, import.meta.url));
    const shipped = await readFile(new URL(`../ferra/brands/${name}`, import.meta.url));
    assert.deepEqual(shipped, original, name);
  }
});

test("sections own unique named headings and tables retain native header semantics", () => {
  const first = render(ferra.FerraSection, {
    id: "contract",
    label: "Contract",
    intro: "Known inputs.",
    title: "Read the scope.",
    children: "A focused contract.",
  });
  assert.ok(first.includes('aria-labelledby="contract-title"'));
  assert.ok(first.includes('<h2 id="contract-title">Read the scope.</h2>'));
  const table = render(ferra.FerraTable, {
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
    /aria-labelledby="([^"]+)" tabindex="0"><table class="ferra-table"><caption id="\1">Sample measurements/u,
  );
});

test("code remains escaped text in a keyboard-reachable scroll box", () => {
  const html = render(ferra.FerraCode, {
    caption: "Untrusted input",
    children: '<script>alert("text")</script>',
  });
  assert.ok(html.includes('<pre tabindex="0"><code>'));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
});

test("documentation composition preserves host landmarks, heading IDs and navigation state", () => {
  const html = render(ferra.FerraDocsLayout, {
    id: "sample-article",
    "aria-labelledby": "sample-title",
    hero: createElement("h1", { id: "sample-title" }, "Sample guide"),
    navigation: createElement(
      "nav",
      { "aria-label": "Product" },
      createElement("a", { href: "/guide/", "aria-current": "page" }, "Guide"),
    ),
    outline: createElement(
      "nav",
      { "aria-label": "On this page" },
      createElement("a", { href: "#input-title" }, "Choose an input"),
    ),
    children: createElement(
      ferra.FerraSection,
      {
        id: "input",
        label: "Input",
        intro: "Known inputs.",
        title: "Choose an input",
      },
      "Sample prose.",
    ),
  });
  assert.ok(html.startsWith('<article id="sample-article" aria-labelledby="sample-title"'));
  assert.ok(!html.includes("<main"));
  assert.ok(html.includes('href="/guide/" aria-current="page"'));
  assert.ok(html.includes('id="input-title"'));
  assert.ok(html.includes('href="#input-title"'));
  const header = render(ferra.FerraHeader, {
    home: "/",
    nav: createElement("a", { href: "/guide/" }, "Guide"),
    actions: createElement("button", { type: "button" }, "Search"),
  });
  assert.ok(header.includes('</nav><div class="ferra-header-actions"><button'));
});

test("bars keep textual values, handle zero and reject invalid measurements", () => {
  const item = { id: "one", label: "Sample", value: 0, displayValue: "0 units" };
  const html = render(ferra.FerraBars, { caption: "Fictional sample data", items: [item] });
  assert.ok(html.includes("0 units"));
  assert.ok(html.includes("width:0%"));
  assert.ok(!html.includes("NaN"));
  for (const value of [-1, Infinity, Number.NaN]) {
    assert.throws(
      () => render(ferra.FerraBars, { caption: "Invalid", items: [{ ...item, value }] }),
      RangeError,
    );
  }
});

test("the additive entry, tokens and every CSS asset travel in the package", async () => {
  const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(manifest.exports["./ferra"].default, "./dist/ferra.js");
  assert.ok(manifest.files.includes("ferra"));
  for (const name of ["ferra.css", "ferra-tokens.css"])
    await access(new URL(`../${manifest.exports[`./${name}`]}`, import.meta.url));
  const assets = JSON.parse(
    await readFile(new URL("../ferra/manifest.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(
    Object.keys(assets.products).toSorted(),
    ["ferramenta", ...kit.family.filter(kit.isEngine).map((t) => t.name)].toSorted(),
  );
  assert.deepEqual(ferra.FERRA_PRODUCTS.toSorted(), Object.keys(assets.products).toSorted());
  for (const product of Object.values(assets.products)) {
    for (const asset of [product.mark, product.instrument, product.favicon])
      await access(new URL(`../ferra/${asset}`, import.meta.url));
  }
  for (const name of [
    "ferra.css",
    "ferra-docs.css",
    "ferra-ardo.css",
    "ferra-reading.css",
    "ferra-stories.css",
    "ferra-product.css",
    "ferra-catalog.css",
    "ferra-assets.css",
    "ferra-fonts.css",
  ]) {
    const css = await readFile(new URL(`../styles/${name}`, import.meta.url), "utf8");
    for (const [, file] of css.matchAll(/url\("(\.\.\/[^"]+)"\)/gu))
      await access(new URL(`../styles/${file}`, import.meta.url));
  }
});

test("exported assets retain their source provenance and token JSON matches the canonical values", async () => {
  const output = new URL("../ferra/", import.meta.url);
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
    await readFile(new URL("../../../design/ferra/tokens.json", import.meta.url), "utf8"),
  );
  const exported = JSON.parse(await readFile(new URL("tokens.json", output), "utf8"));
  assert.deepEqual(exported, canonical);
});

test("the selected Plex heading font and its license ship unchanged with system body tokens", async () => {
  const output = new URL("../ferra/", import.meta.url);
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
  const css = await readFile(new URL("../styles/ferra-fonts.css", import.meta.url), "utf8");
  assert.ok(css.includes("font-display: swap"));
  assert.ok(!css.includes("https://"));
});
