/* eslint-disable security/detect-non-literal-fs-filename -- Paths belong to the fixed approved preview manifests and local output directory. */
import {
  FerraAction,
  FerraFooter,
  FerraHeader,
  FerraHero,
  FerraPage,
  FerraSection,
  FerraWorkshop,
} from "ferramenta-family/ferra";
import { displayName, family, toolHref } from "ferramenta-family/registry";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { familyPreview } from "./family-preview.mjs";
import { paragraph, parseCopy, renderSection } from "./preview-content.mjs";

const repository = fileURLToPath(new URL("../../", import.meta.url));
const output = join(repository, "designs");
const read = (path) => readFileSync(join(repository, path), "utf8");
const records = JSON.parse(read("design/ferra/pages.json"));
mkdirSync(output, { recursive: true });

const link = (href, label, current = false) =>
  h("a", { href, key: `${href}:${label}`, "aria-current": current ? "page" : undefined }, label);
const homeFor = (product) => `${product}.html`;
function navigation(record) {
  const pages = records.filter((page) => page.product === record.product);
  return [
    ...pages.map((page) => link(page.file, page.title, page.file === record.file)),
    link(toolHref(family.find((tool) => tool.name === record.product)), "Project documentation"),
    link("index.html#engines", "The Ferramenta family"),
  ];
}

const labels = {
  ferromark: [
    "Rendering",
    "Output policy",
    "Measurements",
    "Compatibility",
    "The document",
    "Get started",
  ],
  ferroni: [
    "Working example",
    "The contract",
    "The scanner",
    "Compatibility",
    "Measurements",
    "Limits",
  ],
};
const intros = {
  ferromark: [
    "From Markdown to structured HTML and metadata.",
    "Correct handling for real documents.",
    "Performance, with the conditions attached.",
    "Recognize content without granting permission.",
    "More than paragraphs.",
    "Use it your way.",
  ],
  ferroni: [
    "Read the pattern and its result.",
    "Familiar expressions, explicit behavior.",
    "Many patterns. The next leftmost match.",
    "Continued with care.",
    "Reuse changes the picture.",
    "Bound the work your application accepts.",
  ],
};

function heroCopy(record, source, sections) {
  if (record.type !== "overview") {
    const preamble = source.slice(source.indexOf("\n") + 1, source.indexOf("\n## ")).trim();
    return {
      title: record.title,
      what: preamble.split("\n\n")[0],
      children: preamble
        .split("\n\n")
        .slice(1)
        .map((text) =>
          h(
            "p",
            { key: text, className: "live-measurement" },
            ...text.split("\n").map((line) => h("span", { key: line }, line)),
          ),
        ),
    };
  }
  const first = sections.shift();
  const lead = first.raw.trim().split("\n\n")[0];
  const named = record.product === "ferromark" || record.product === "ferroni";
  return {
    title: named ? `${displayName(record.product)}.` : first.title,
    what: named ? first.title : family.find((tool) => tool.name === record.product).what,
    children: paragraph(lead),
  };
}

function renderHero(record, copy, sections) {
  const product = family.find((tool) => tool.name === record.product);
  const start = records.find((page) => page.product === record.product && page.type === "start");
  const actions = [
    h(
      FerraAction,
      { key: "start", href: start?.file ?? `#${sections.at(-1).id}` },
      start ? "Start with Rust" : "Get started",
    ),
    h(
      FerraAction,
      { key: "docs", href: toolHref(product), variant: "secondary" },
      product.docs ? "Read the documentation" : "Source on GitHub",
    ),
  ];
  const hero = h(
    FerraHero,
    {
      product: record.product,
      title: copy.title,
      what: copy.what,
      actions: record.type === "overview" ? actions : undefined,
    },
    copy.children,
  );
  if (record.type === "overview") return hero;
  return h(
    "div",
    { className: "live-docs-header ferra-wrap" },
    h(
      "nav",
      { className: "live-side-nav", "aria-label": "Product pages" },
      ...navigation(record).slice(0, -1),
    ),
    hero,
    h(
      "nav",
      { className: "live-side-nav", "aria-label": "On this page" },
      h("p", null, "On this page"),
      ...sections.map((section) => link(`#${section.id}`, section.title)),
    ),
  );
}

function renderStory(record, section, index) {
  const home = record.type === "overview";
  const label =
    section.label ?? (home ? labels[record.product]?.[index] : section.title) ?? "The contract";
  const intro =
    section.intro ??
    (home ? intros[record.product]?.[index] : "Read the example and its conditions.") ??
    "A focused engine, with explicit boundaries.";
  const pewter = /^(?:Speed, with|Reuse changes|Native engine|Steady reuse|Render once)/u.test(
    section.title,
  );
  return h(
    FerraSection,
    {
      id: section.id,
      title: section.title,
      label,
      intro,
      surface: pewter ? "pewter" : "paper",
    },
    ...renderSection(record.product, section, { index, home }),
  );
}

function document(record) {
  const source = read(record.source);
  const sections = parseCopy(source);
  const copy = heroCopy(record, source, sections);
  const page = h(
    FerraPage,
    { className: record.type === "overview" ? "live-home" : "live-document" },
    h("a", { className: "live-skip", href: "#content" }, "Skip to content"),
    h(FerraHeader, {
      product: record.product,
      home: homeFor(record.product),
      nav: navigation(record),
    }),
    h(
      "main",
      { id: "content" },
      renderHero(record, copy, sections),
      ...sections.map((section, index) => renderStory(record, section, index)),
      h(FerraWorkshop, { id: "workshop-links" }),
    ),
    h(
      FerraFooter,
      { product: record.product, home: homeFor(record.product) },
      link(`../${record.source}`, "Source copy"),
    ),
  );
  const title = `${displayName(record.product)} · ${record.title}`;
  const head = renderToStaticMarkup(
    h(
      "head",
      null,
      h("meta", { charSet: "utf8" }),
      h("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      h("meta", { name: "color-scheme", content: "light" }),
      h("meta", { name: "robots", content: "noindex,nofollow" }),
      h("title", null, title),
      h("link", { rel: "stylesheet", href: "../packages/family/styles/ferra.css" }),
      h("link", { rel: "stylesheet", href: "../design/ferra/preview.css" }),
      h("link", { rel: "icon", href: `../packages/family/ferra/${record.product}/favicon.ico` }),
    ),
  );
  return `<!doctype html><html lang="en">${head}<body>${renderToStaticMarkup(page)}</body></html>`;
}

for (const record of records) writeFileSync(join(output, record.file), document(record));
writeFileSync(join(output, "index.html"), familyPreview());
writeFileSync(
  join(output, "manifest.json"),
  `${JSON.stringify(
    {
      typography: {
        headings: "IBM Plex Sans",
        weight: 600,
        body: "system-ui",
        code: "system monospace",
        localFonts: true,
      },
      family: "index.html",
      pages: records,
      source: "design/ferra/build-previews.mjs",
      note: "Final Ferra designs. Assets resolve from the shared package; source copy and dated measurement evidence live in design/ferra.",
    },
    null,
    2,
  )}\n`,
);
const format = spawnSync(
  join(repository, "node_modules/.bin/oxfmt"),
  [
    "--write",
    ...records.map((record) => join(output, record.file)),
    join(output, "index.html"),
    join(output, "manifest.json"),
  ],
  { encoding: "utf8" },
);
if (format.status !== 0) throw new Error(format.stderr || format.stdout);
console.log(
  `Built ${records.length + 1} native previews: Ferramenta, seven engine homes and six core pages.`,
);
