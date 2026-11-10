/** The Monografie entry: its markup contract, its assets and its scoping. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";

import * as mono from "../dist/monografie.js";
import { render, selectorsIn } from "./helpers.mjs";

const css = await readFile(new URL("../styles/monografie.css", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

test("the entry and its stylesheets are exported", () => {
  assert.deepEqual(manifest.exports["./monografie"], {
    types: "./dist/monografie.d.ts",
    default: "./dist/monografie.js",
  });
  assert.equal(manifest.exports["./monografie.css"], "./styles/monografie.css");
  assert.equal(manifest.exports["./monografie-docs.css"], "./styles/monografie-docs.css");
  assert.equal(manifest.exports["./monografie-ardo.css"], "./styles/monografie-ardo.css");
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
  for (const selector of selectorsIn(css)) {
    assert.match(
      selector,
      /^(?:details)?(?:\.mono\b|:where\(\.mono\b)/u,
      `unscoped selector in monografie.css: ${selector}`,
    );
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

test("the family overview lists every engine and application from the registry", async () => {
  const { kit } = await import("./helpers.mjs");
  const tiers = kit.familyTiers();
  const catalog = render(mono.MonoEngineCatalog, {});
  for (const tool of tiers.engines) {
    assert.ok(catalog.includes(`id="${tool.name}"`), `no plate for ${tool.name}`);
    assert.ok(catalog.includes(`data-product="${tool.name}"`), `no instrument for ${tool.name}`);
    assert.ok(catalog.includes(`href="${kit.toolHref(tool)}"`));
  }
  assert.ok(!catalog.includes(". Used by "), "one sentence per relation kind");
  const applications = render(mono.MonoApplications, {});
  for (const tool of tiers.applications) {
    assert.ok(applications.includes(`data-brand="${tool.name}"`));
    assert.ok(
      css.includes(`.mono-application-logo[data-brand="${tool.name}"]`),
      `no logo rule for ${tool.name}`,
    );
  }
  const workshop = render(mono.MonoWorkshop, {});
  assert.equal((workshop.match(/class="ferra-workshop-logo"/gu) ?? []).length, 2);
});

test("the catalog labels an unpublished engine without implying a release or downloads", () => {
  const html = render(mono.RegistryFacts, {
    snapshot: {
      ferrixel: {
        crates: { version: "9.9.9", downloads: 999 },
        npm: null,
        release: { version: "9.9.9" },
      },
    },
    metrics: false,
    children: createElement(mono.MonoEngineCatalog),
  });
  const article = html.match(/<article[^>]*id="ferrixel"[\s\S]*?<\/article>/u)?.[0];
  assert.ok(article, "the unpublished engine has a catalog entry");
  assert.match(article, /<dt>Release<\/dt><dd>Unpublished<\/dd>/u);
  assert.doesNotMatch(article, /<dt>Version|9\.9\.9|0\.1\.0|crates\.io downloads/u);
  assert.match(article, /Explore Ferrixel on GitHub/u);
});

test("the family site's header leaves out the link back to the family", () => {
  const html = render(mono.MonoHeader, {
    product: "ferramenta",
    home: "/",
    familyHref: null,
    links: [createElement("a", { key: "engines", href: "#engines" }, "Engines")],
  });
  assert.ok(!html.includes('class="mono-family"'));
  const footer = render(mono.MonoFooter, { product: "ferramenta", home: "/" });
  assert.ok(footer.includes("Rust engines from one workshop"));
  assert.ok(!footer.includes("part of"));
});

test("on narrow screens a term note folds behind a toggle and a figure note stays a line", () => {
  const term = render(mono.MonoPassage, {
    note: { term: "Affix", children: "A piece added to a word." },
    children: createElement("p", null, "Text."),
  });
  assert.ok(term.includes('data-kind="term"'));
  assert.match(
    term,
    /<button type="button" class="mono-note-toggle" aria-expanded="false" aria-controls="[^"]+"><svg[^>]*class="mono-info-icon"[^>]*>.*?<\/svg>Affix<\/button>/u,
  );
  const figure = render(mono.MonoPassage, {
    note: { figure: "57", children: "real documents" },
    children: createElement("p", null, "Text."),
  });
  assert.ok(figure.includes('data-kind="figure"'));
  assert.ok(!figure.includes("mono-note-toggle"));
  assert.ok(css.includes('.mono-row[data-note-open] > .mono-note[data-kind="term"]'));
});

test("the opening plate carries no caption, only the instrument's label", () => {
  const html = render(mono.MonoOpening, {
    product: "ferroni",
    instrumentLabel: "A pattern comparator",
    kicker: "Kicker",
    title: "Title",
    standfirst: "Standfirst",
    actions: null,
  });
  assert.ok(html.includes('aria-label="A pattern comparator"'));
  assert.ok(!html.includes("<figcaption"));
});

test("the Ardo shell is its own entry, and Ardo a peer of the package", async () => {
  const manifest = JSON.parse(
    await import("node:fs").then(({ readFileSync }) =>
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ),
  );
  assert.equal(manifest.exports["./ardo"].default, "./dist/ardo.js");
  assert.ok(manifest.peerDependencies.ardo);
});
