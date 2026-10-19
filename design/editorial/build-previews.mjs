/* eslint-disable security/detect-non-literal-fs-filename -- Paths belong to the fixed approved preview manifests and local output directory. */
import {
  EditorialAction,
  EditorialFooter,
  EditorialHeader,
  EditorialHero,
  EditorialPage,
  EditorialSection,
  EditorialWorkshop,
} from "ferramenta-family/editorial";
import { displayName, family, toolHref } from "ferramenta-family/registry";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { paragraph, parseCopy, renderSection } from "./preview-content.mjs";

const repository = fileURLToPath(new URL("../../", import.meta.url));
const output = join(repository, "designs/current");
const packageRoot = fileURLToPath(
  new URL(".", import.meta.resolve("ferramenta-family/package.json")),
);
const read = (path) => readFileSync(join(repository, path), "utf8");
const core = JSON.parse(read("designs/round-06-warm-specimen/manifest.json"));
const expansion = JSON.parse(read("designs/round-07-family-expansion/manifest.json"));
mkdirSync(join(output, "assets/styles"), { recursive: true });
cpSync(join(packageRoot, "editorial"), join(output, "assets/editorial"), { recursive: true });
for (const file of [
  "editorial.css",
  "editorial-tokens.css",
  "editorial-assets.css",
  "editorial-fonts.css",
])
  cpSync(join(packageRoot, "styles", file), join(output, "assets/styles", file));
cpSync(join(repository, "design/editorial/preview.css"), join(output, "preview.css"));

const records = [
  ...core.pages.map((page) => ({
    product: page.productSlug,
    file: page.view,
    type: page.type,
    title: page.title,
    source: `designs/round-06-warm-specimen/${page.sourceCopy}`,
    original: `../round-06-warm-specimen/${page.view}`,
  })),
  ...expansion.products.map((product) => ({
    product: product.slug,
    file: product.view,
    type: "overview",
    title: "Overview",
    source: `designs/round-07-family-expansion/${product.sourceCopy}`,
    original: `../round-07-family-expansion/${product.view}`,
  })),
];

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
      EditorialAction,
      { key: "start", href: start?.file ?? `#${sections.at(-1).id}` },
      start ? "Start with Rust" : "Get started",
    ),
    h(
      EditorialAction,
      { key: "docs", href: toolHref(product), variant: "secondary" },
      product.docs ? "Read the documentation" : "Source on GitHub",
    ),
  ];
  const hero = h(
    EditorialHero,
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
    { className: "live-docs-header fe-wrap" },
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
    EditorialSection,
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
    EditorialPage,
    { className: record.type === "overview" ? "live-home" : "live-document" },
    h("a", { className: "live-skip", href: "#content" }, "Skip to content"),
    h(EditorialHeader, {
      product: record.product,
      home: homeFor(record.product),
      nav: navigation(record),
    }),
    h(
      "main",
      { id: "content" },
      renderHero(record, copy, sections),
      ...sections.map((section, index) => renderStory(record, section, index)),
      h(EditorialWorkshop, { id: "workshop-links" }),
    ),
    h(
      EditorialFooter,
      { product: record.product, home: homeFor(record.product) },
      link(record.original, "Original image comp"),
      link(record.source.replace(/^designs\//u, "../"), "Source copy"),
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
      h("link", { rel: "stylesheet", href: "assets/styles/editorial.css" }),
      h("link", { rel: "stylesheet", href: "preview.css" }),
      h("link", { rel: "icon", href: `assets/editorial/${record.product}/favicon.ico` }),
    ),
  );
  return `<!doctype html><html lang="en">${head}<body>${renderToStaticMarkup(page)}</body></html>`;
}

for (const record of records) writeFileSync(join(output, record.file), document(record));
// The family homepage keeps its authored layout; all engine destinations now open native previews.
const familyHome = read("designs/round-08-ferramenta/index.html")
  .replaceAll('href="site.css"', 'href="../round-08-ferramenta/site.css"')
  .replaceAll('href="assets/', 'href="../round-08-ferramenta/assets/')
  .replaceAll('src="assets/', 'src="../round-08-ferramenta/assets/')
  .replaceAll('href="../current/', 'href="')
  .replaceAll('href="concept.html"', 'href="../round-08-ferramenta/concept.html"')
  .replaceAll('href="typography.html"', 'href="../round-08-ferramenta/typography.html"');
writeFileSync(join(output, "index.html"), familyHome);
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
      source: "design/editorial/build-previews.mjs",
      note: "Native HTML translations of the approved image studies. Original images and evidence are retained unchanged.",
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
    join(output, "preview.css"),
  ],
  { encoding: "utf8" },
);
if (format.status !== 0) throw new Error(format.stderr || format.stdout);
console.log(
  `Built ${records.length + 1} native previews: Ferramenta, seven engine homes and six core pages.`,
);
