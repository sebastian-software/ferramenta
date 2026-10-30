import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";

import * as ferra from "../dist/ferra.js";
import { assertInOrder, kit, member, render } from "./helpers.mjs";

test("editorial articles preserve image-first reading order, registry copy and live facts", () => {
  const tool = member("ferroni");
  const html = render(kit.RegistryFacts, {
    snapshot: { ferroni: { crates: { version: "99.0.0", downloads: 4321 } } },
    children: createElement(ferra.FerraEngineArticle, { tool }),
  });
  assertInOrder(
    html,
    [
      "ferra-engine-art",
      `id="${tool.name}-title"`,
      tool.editorial.subtitle,
      tool.editorial.introduction,
      "Explore Ferroni",
      '<footer class="ferra-engine-meta">',
      "99.0.0",
      "4,321",
    ],
    "the article must read from illustration to product to facts",
  );
  assert.ok(html.includes(`aria-labelledby="${tool.name}-title"`));
  assert.ok(html.includes(`href="${kit.toolHref(tool)}"`));
  assert.ok(
    !html.includes('class="ferra-mark"'),
    "compact marks belong in navigation, not product articles",
  );
  const unavailable = render(ferra.FerraReleaseFacts, { tool });
  assert.ok(
    !unavailable.includes("total downloads"),
    "an unavailable download total must not become a displayed zero",
  );
});

test("contents keep the caller's ungrouped order, descriptions, location semantics and disclosure", () => {
  const items = ["ferrocat", "ferroni"].map((name) => {
    const tool = member(name);
    return {
      href: `#${name}`,
      label: kit.displayName(tool),
      description: tool.editorial.navigation,
      product: name,
    };
  });
  const html = render(ferra.FerraContents, { items });
  assertInOrder(
    html,
    ["Ferrocat", "Translation catalogs", "Ferroni", "Regular expressions"],
    "contents follow the host's order",
  );
  assert.ok(html.includes('aria-label="Engines"'));
  assert.ok(html.includes('aria-expanded="false"'));
  assert.match(html, /aria-controls="([^"]+)"[\s\S]*<ul class="ferra-contents-list" id="\1"/u);
  assert.ok(html.includes('href="#ferrocat" aria-current="location"'));
});

test("soft cards preserve native semantics and notes link a named heading to their source", () => {
  const card = render(ferra.FerraSoftCard, {
    as: "article",
    id: "sample",
    className: "sample-card",
    "aria-labelledby": "sample-title",
    children: createElement("h2", { id: "sample-title" }, "A sample"),
  });
  assert.ok(card.startsWith('<article id="sample"'));
  assert.ok(card.includes('class="ferra-soft-card sample-card"'));
  const note = render(ferra.FerraNote, {
    title: "A sample decision",
    source: { href: "/sample/", label: "Read the source" },
    children: createElement("p", null, "A related explanation."),
  });
  assert.match(note, /<aside[\s\S]*aria-labelledby="([^"]+)"[\s\S]*<h3 id="\1">A sample decision/u);
  assert.ok(note.includes('href="/sample/"'));
  assert.ok(
    !render(ferra.FerraEditorial, { navigation: "Contents", children: card }).includes("<main"),
  );
});

test("every engine has source-backed evergreen editorial copy and its own presentation order", () => {
  const engines = kit.family.filter(kit.isEngine);
  const orders = new Set();
  for (const tool of engines) {
    assert.ok(tool.editorial, tool.name);
    const entry = tool.editorial;
    assert.ok(entry.navigation && entry.subtitle && entry.introduction, tool.name);
    assert.ok(entry.notes.length >= 2 && entry.notes.length <= 3, tool.name);
    for (const note of entry.notes) {
      assert.ok(note.title && note.body, tool.name);
      assert.match(
        note.href,
        /^https:\/\/github\.com\/sebastian-software\/[a-z]+\/blob\/[a-f0-9]{40}\//u,
      );
    }
    assert.ok(!entry.introduction.includes(tool.version), "release numbers belong to live facts");
    orders.add(entry.order);
  }
  assert.equal(orders.size, engines.length);
});

test("related aspects share one named complementary card with individually linked sources", () => {
  const tool = member("ferrocat");
  const html = render(ferra.FerraNotes, { label: "About Ferrocat", notes: tool.editorial.notes });
  assert.equal((html.match(/<aside/gu) ?? []).length, 1);
  assert.ok(html.includes('aria-label="About Ferrocat"'));
  for (const note of tool.editorial.notes) {
    assert.ok(html.includes(note.title));
    assert.ok(html.includes(`href="${note.href}"`));
  }
  assert.equal((html.match(/class="ferra-note-section"/gu) ?? []).length, 2);
});

test("benchmark tables retain native groups, context and missing-result labels", () => {
  const html = render(ferra.FerraBenchmarkTable, {
    id: "sample-comparison",
    caption: createElement("span", null, "Fictional latency in ms; lower is faster"),
    children: createElement(
      "tbody",
      { "aria-label": "Sample platform" },
      createElement(
        "tr",
        null,
        createElement("th", { scope: "row" }, "Sample workload"),
        createElement("td", null, createElement("a", { href: "#sample-source" }, "1.2 ms")),
        createElement("td", null, "Not measured"),
      ),
    ),
  });
  assert.ok(html.includes('role="region"'));
  assert.ok(html.includes('tabindex="0"'));
  assert.ok(html.includes('id="sample-comparison"'));
  assert.ok(html.includes('class="ferra-table ferra-benchmark-table"'));
  assert.ok(html.includes('aria-label="Sample platform"'));
  assert.ok(html.includes('href="#sample-source"'));
  assert.ok(html.includes("Not measured"));
});

test("product stories attach metadata and continuous reading retains native content", () => {
  const article = render(ferra.FerraArticle, {
    id: "sample-story",
    title: "Fictional engine",
    art: createElement("img", { src: "/sample.png", alt: "Sample" }),
    meta: createElement("p", null, "Sample conditions"),
    children: createElement("p", null, "Host-owned copy"),
  });
  assert.ok(article.indexOf("/sample.png") < article.indexOf("Fictional engine"));
  assert.ok(article.includes('class="ferra-engine-meta"'));
  assert.ok(article.includes('tabindex="-1"'));
  assert.ok(article.includes('aria-labelledby="sample-story-title"'));
  assert.ok(article.includes('id="sample-story-title"'));
  const page = render(ferra.FerraReadingLayout, {
    id: "sample-reading",
    navigation: createElement("nav", { "aria-label": "Sample guide" }, "Pages"),
    outline: createElement("nav", { "aria-label": "Sample outline" }, "Headings"),
    children: createElement("h1", null, "Sample title"),
  });
  assert.ok(page.includes('id="sample-reading"'));
  assert.ok(page.includes('class="ferra-prose"'));
  assert.ok(!page.includes("<main"));
  assert.ok(page.includes('aria-label="Sample guide"'));
});
