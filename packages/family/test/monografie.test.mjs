/** The Monografie entry: its markup contract, its assets and its scoping. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";

import * as mono from "../dist/monografie.js";
import { render } from "./helpers.mjs";

/** Splits a selector list at its top-level commas, not those inside :is() or :where(). */
function selectorsOf(list) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const character of list) {
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else current += character;
  }
  return [...parts, current.trim()];
}

const css = await readFile(new URL("../styles/monografie.css", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

test("the entry and its stylesheet are exported", () => {
  assert.deepEqual(manifest.exports["./monografie"], {
    types: "./dist/monografie.d.ts",
    default: "./dist/monografie.js",
  });
  assert.equal(manifest.exports["./monografie.css"], "./styles/monografie.css");
});

test("every file the stylesheet points at ships with its provenance", async () => {
  const files = [...css.matchAll(/url\("\.\.\/(?<file>ferra\/[^"]+)"\)/gu)].map(
    (match) => match.groups.file,
  );
  assert.ok(files.length >= 4, "the fonts and both surface bands");
  for (const file of files) {
    await access(new URL(`../${file}`, import.meta.url));
    if (file.endsWith(".webp")) {
      const record = JSON.parse(
        await readFile(new URL(`../${file}.json`, import.meta.url), "utf8"),
      );
      const bytes = await readFile(new URL(`../${file}`, import.meta.url));
      assert.equal(createHash("sha256").update(bytes).digest("hex"), record.sha256, file);
      assert.match(record.generatedWith, /Blender/u);
    }
  }
  const fonts = JSON.parse(
    await readFile(new URL("../ferra/fonts/source-serif-4/manifest.json", import.meta.url), "utf8"),
  );
  for (const font of fonts.files) {
    const bytes = await readFile(
      new URL(`../ferra/fonts/source-serif-4/${font.file}`, import.meta.url),
    );
    assert.equal(createHash("sha256").update(bytes).digest("hex"), font.sha256, font.file);
  }
});

test("rules stay inside the page, the header and the footer", () => {
  const body = css.replaceAll(/\/\*[\s\S]*?\*\//gu, "");
  // Each block opens after the selectors that follow the previous rule's end.
  for (const before of body.split("{").slice(0, -1)) {
    const selectors = before.slice(Math.max(before.lastIndexOf("}"), before.lastIndexOf(";")) + 1);
    if (selectors.trim().startsWith("@")) continue;
    for (const selector of selectorsOf(selectors)) {
      if (selector === "") continue;
      assert.match(
        selector,
        /^(?:details)?(?:\.mono\b|:where\(\.mono\b)/u,
        `unscoped selector in monografie.css: ${selector}`,
      );
    }
  }
});

test("the header folds its links into a menu and names the release", () => {
  const html = render(mono.MonoHeader, {
    product: "ferroni",
    home: "/",
    release: "1.2.3",
    links: [createElement("a", { key: "guide", href: "/guide/" }, "Guide")],
  });
  assert.ok(html.includes('class="mono-header"'));
  assert.ok(html.includes('aria-expanded="false"'));
  assert.ok(html.includes('<li><a href="/guide/">Guide</a></li>'));
  assert.ok(html.includes("v1.2.3"));
  assert.ok(html.includes('href="https://ferramenta.dev"'));
});

test("the opening names the instrument and marks only the primary action in rust", () => {
  const html = render(mono.MonoOpening, {
    product: "ferroni",
    instrumentLabel: "A pattern comparator",
    kicker: "Kicker",
    title: "Title.",
    subtitle: "Second line.",
    standfirst: "Standfirst.",
    actions: [
      createElement(
        mono.MonoAction,
        { key: "a", href: "/a", primary: true, detail: "cargo add x" },
        "A",
      ),
      createElement(mono.MonoAction, { key: "b", href: "/b" }, "B"),
    ],
    facts: [{ value: "1 of 1", label: "fact" }],
  });
  assert.ok(html.includes('role="img" aria-label="A pattern comparator"'));
  assert.equal((html.match(/data-primary=""/gu) ?? []).length, 1);
  assert.ok(html.includes('<span class="mono-second">Second line.</span>'));
});

test("a passage keeps its note beside it, before the text in reading order", () => {
  const html = render(mono.MonoPassage, {
    note: { side: "right", term: "Term", children: "Explained." },
    children: createElement("p", null, "Text."),
  });
  assert.ok(html.indexOf('data-side="right"') < html.indexOf("Text."));
  assert.equal(render(mono.MonoPassage, { children: "Only text." }), "Only text.");
});

test("the bar chart labels every row with its value and draws the 1× line", () => {
  const html = render(mono.MonoBarChart, {
    label: "Time",
    title: "Time",
    rows: [
      { id: "own", label: "Own", value: 1, own: true },
      { id: "far", label: "Far", sub: "C", value: 9 },
    ],
    scale: 4,
    ticks: [1, 2, 3, 4],
    describe: () => "tip",
  });
  assert.ok(html.includes('aria-label="Own: 1.00×"'));
  assert.ok(html.includes('aria-label="Far, C: 9.00×"'));
  assert.ok(html.includes("mono-bar mono-own"));
  assert.ok(html.includes("data-cut"), "a bar past the scale shows its break");
  assert.equal((html.match(/class="mono-ref"/gu) ?? []).length, 2);
});

test("engravings are deterministic and carry one oxide line", () => {
  const html = render(mono.MonoEngraving, { seed: 3 });
  assert.equal(html, render(mono.MonoEngraving, { seed: 3 }));
  assert.equal((html.match(/class="mono-oxide"/gu) ?? []).length, 1);
  assert.ok(html.includes('aria-hidden="true"'));
});
