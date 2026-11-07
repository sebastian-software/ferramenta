/**
 * What the package ships: its entries and stylesheets, the line-icon sprite,
 * and the members' identity pictures with their provenance.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

import * as mono from "../dist/monografie.js";
import { kit } from "./helpers.mjs";

const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const identities = JSON.parse(
  await readFile(new URL("../ferra/manifest.json", import.meta.url), "utf8"),
);

test("the package exports the registry, the root entry and Monografie, and nothing else", async () => {
  assert.deepEqual(Object.keys(manifest.exports).toSorted(), [
    ".",
    "./ferra-assets/*",
    "./icons/*",
    "./monografie",
    "./monografie-ardo.css",
    "./monografie-docs.css",
    "./monografie.css",
    "./package.json",
    "./registry",
  ]);
  assert.equal(manifest.exports["./registry"].default, "./dist/family.js");
  for (const directory of ["dist", "styles", "icons", "ferra", "markdown"]) {
    assert.ok(manifest.files.includes(directory), `the package does not ship ${directory}/`);
  }
  // The applications' own logos, which Monografie and the engine sites show on light cards.
  const icons = await readdir(new URL("../icons/", import.meta.url));
  assert.deepEqual(icons.toSorted(), ["ardo.svg", "dalo.svg", "palamedes.svg"]);
  for (const stylesheet of await readdir(new URL("../styles/", import.meta.url))) {
    const css = await readFile(new URL(`../styles/${stylesheet}`, import.meta.url), "utf8");
    for (const [, file] of css.matchAll(/url\("\.\.\/(?<file>[^"]+)"\)/gu))
      await access(new URL(`../${file}`, import.meta.url));
  }
});

test("the Monografie entry carries what a page needs from the root entry", () => {
  for (const name of ["Mark", "MarkDefs", "RegistryFacts", "useToolFacts"]) {
    assert.equal(typeof mono[name], "function", `monografie does not export ${name}`);
    assert.equal(mono[name], kit[name], `${name} is one implementation in both entries`);
  }
});

test("the sprite holds only line icons, none of them a member's", () => {
  const symbols = [...kit.MARK_DEFS.matchAll(/<symbol id="i-(?<name>[a-z-]+)"/gu)].map(
    (match) => match.groups.name,
  );
  assert.deepEqual(
    symbols.toSorted(),
    [
      "adapter",
      "arrow",
      "check",
      "chev",
      "crate",
      "cross",
      "document",
      "external",
      "github",
      "half",
      "package",
      "pen",
    ],
    "the members' marks are pictures, not symbols",
  );
});

test("the GitHub mark fills itself: the stroked `.icon` class would leave only its outline", () => {
  assert.match(
    kit.MARK_DEFS,
    /<symbol id="i-github" viewBox="0 0 16 16"><path fill="currentColor" stroke="none" d=/u,
  );
});

test("every engine and the family have a mark, an instrument and a favicon", async () => {
  assert.deepEqual(
    Object.keys(identities.products).toSorted(),
    ["ferramenta", ...kit.family.filter(kit.isEngine).map((tool) => tool.name)].toSorted(),
  );
  assert.deepEqual(mono.IDENTITIES.toSorted(), Object.keys(identities.products).toSorted());
  const css = await readFile(new URL("../styles/ferra-assets.css", import.meta.url), "utf8");
  for (const [id, product] of Object.entries(identities.products)) {
    for (const asset of [product.mark, product.instrument, product.favicon])
      await access(new URL(`../ferra/${asset}`, import.meta.url));
    assert.ok(css.includes(`.ferra-mark[data-product="${id}"]`), `no mark rule for ${id}`);
    assert.ok(css.includes(`.ferra-instrument[data-product="${id}"]`), `no instrument for ${id}`);
  }
});

test("every shipped raster keeps its source provenance", async () => {
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
});

test("the workshop's logos ship unchanged", async () => {
  const { WORKSHOP_REFERENCES } = await import("../dist/family.js");
  assert.equal(WORKSHOP_REFERENCES.length, 2);
  for (const reference of WORKSHOP_REFERENCES) {
    const name = `sebastian-${reference.id}.svg`;
    const original = await readFile(new URL(`../../../app/assets/logos/${name}`, import.meta.url));
    const shipped = await readFile(new URL(`../ferra/brands/${name}`, import.meta.url));
    assert.deepEqual(shipped, original, name);
  }
});
