import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(await fs.readFile(path.join(root, "manifest.json"), "utf8"));
const pages = manifest.pages;
for (const page of pages) {
  const meta = JSON.parse(await fs.readFile(path.join(root, page.promptSidecar), "utf8"));
  page.width = meta.width;
  page.height = meta.height;
}
const escape = (value) =>
  String(value).replace(
    /[&<>\"]/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[ch],
  );
const kinds = [
  [
    "overview",
    "Overview",
    "The approved homepage direction: short introductions in the left margin, broad reading and evidence, warm paper and pewter.",
  ],
  [
    "start",
    "Start with Rust",
    "Installation, the first working example, explicit results and the next step. One documentation family for both products.",
  ],
  [
    "core",
    "Core function",
    "Rendering and metadata for Ferromark; scanning and coordinate systems for Ferroni. Meaningful instruments and worked specimens.",
  ],
  [
    "benchmarks",
    "Benchmarks",
    "Recorded evidence, clear comparisons and conditions that remain attached to the figures.",
  ],
];
const shell = (title, body) =>
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>' +
  escape(title) +
  '</title><link rel="stylesheet" href="review.css"></head><body class="fe-tokens">' +
  body +
  "</body></html>";
const footer =
  '<footer><p>Eight coordinated visual studies created with built-in Imagegen. Source copy and frozen measurements remain authoritative. Local and uncommitted.</p><div><a href="BRIEF.md">Design brief</a> · <a href="prompts.md">Exact prompts</a> · <a href="assets/README.md">Asset kit</a> · <a href="README.md">Files and provenance</a></div></footer>';
const card = (p) =>
  '<article class="card"><a class="preview" href="' +
  p.view +
  '" aria-label="Open ' +
  escape(p.product + ": " + p.title) +
  '"><img src="' +
  p.file +
  '" width="' +
  p.width +
  '" height="' +
  p.height +
  '" alt="Complete ' +
  escape(p.product + " " + p.title) +
  ' page in the warm editorial direction" loading="lazy"></a><h3>' +
  escape(p.product + " · " + p.title) +
  "</h3><p>Design " +
  p.id +
  '</p><div class="card-links"><a href="' +
  p.view +
  '">Open full design</a><a href="' +
  p.file +
  '">Original PNG</a><a href="' +
  p.sourceCopy +
  '">Source copy</a></div></article>';
const directions = kinds.map(([key, title]) => '<a href="#' + key + '">' + title + "</a>").join("");
const sections = kinds
  .map(
    ([key, title, intro]) =>
      '<section class="pair" id="' +
      key +
      '" aria-labelledby="title-' +
      key +
      '"><h2 id="title-' +
      key +
      '">' +
      title +
      "</h2><p>" +
      intro +
      '</p><div class="pair-grid">' +
      pages
        .filter((p) => p.type === key)
        .map(card)
        .join("") +
      "</div></section>",
  )
  .join("");
const assets =
  '<section class="pair" id="assets"><h2>Materials and assets</h2><p>The supporting kit includes two transparent instruments, both logo and favicon export families, and reusable paper and pewter texture masters.</p><nav class="directions" aria-label="Asset kit"><a href="assets/paper-master.png">Warm paper texture</a><a href="assets/pewter-master.png">Matte pewter texture</a><a href="assets/document-register.png">Ferromark instrument</a><a href="assets/pattern-comparator.png">Ferroni instrument</a><a href="assets/logos/ferromark/logo-lockup.png">Ferromark logo</a><a href="assets/logos/ferroni/logo-lockup.png">Ferroni logo</a><a href="assets/README.md">Asset usage and provenance</a></nav></section>';
const intro =
  '<main><div class="topline"><span>Ferramenta · Warm editorial specimen</span><a href="../index.html">All design studies</a></div><header><h1>One family.<br>Eight core pages.</h1><p class="intro">The approved narrow-margin homepage layout, warm beige paper, matte pewter and rust-brown oxide, carried through both products and their core documentation.</p><p>Ferromark and Ferroni each have an overview, getting started, core-function explainer and benchmarks. All images, source copy, prompts and supporting assets are saved in this directory.</p><nav class="directions" aria-label="Page types">' +
  directions +
  '<a href="#assets">Materials and assets</a></nav></header>';
await fs.writeFile(
  path.join(root, "index.html"),
  shell(
    "Ferramenta · Eight warm editorial core pages",
    intro +
      '<p><a href="../current/index.html">Current HTML designs: Ferramenta and all seven engines</a></p>' +
      sections +
      assets +
      footer +
      "</main>",
  ),
);

for (const p of pages) {
  const sibling = pages.find((q) => q.type === p.type && q.product !== p.product);
  const productPages = pages
    .filter((q) => q.product === p.product)
    .sort(
      (a, b) => kinds.findIndex(([k]) => k === a.type) - kinds.findIndex(([k]) => k === b.type),
    );
  const currentLink =
    '<p class="caption"><a href="../current/' +
    p.view +
    '">Open the current Plex / system UI HTML design</a></p>';
  const pageNav = productPages
    .map(
      (q) =>
        '<a href="' +
        q.view +
        '"' +
        (q.id === p.id ? ' aria-current="page"' : "") +
        ">" +
        escape(q.title) +
        "</a>",
    )
    .join("");
  const refs =
    p.type === "overview"
      ? '<a href="' +
        p.layout +
        '">Layout authority: narrow left introductions</a><a href="' +
        p.material +
        '">Material authority: warm paper and pewter</a>'
      : '<a href="' +
        p.layout +
        '">Previous subpage structure</a><a href="' +
        p.style +
        '">Approved homepage style reference</a>';
  const body =
    '<main class="viewer">' +
    currentLink +
    '<div class="topline"><a href="index.html#' +
    p.type +
    '">All eight core pages</a><a href="' +
    sibling.view +
    '">Compare ' +
    escape(sibling.product + ": " + sibling.title) +
    "</a></div><header><h1>" +
    escape(p.product) +
    "<br>" +
    escape(p.title) +
    '</h1><p class="intro">Warm paper, matte pewter and rust-brown oxide. The shared visual family, adapted to this page’s reading and evidence.</p><nav class="directions" aria-label="Reference roles">' +
    refs +
    '</nav></header><nav class="review-nav" aria-label="' +
    p.product +
    ' core pages">' +
    pageNav +
    '</nav><figure class="design"><a href="' +
    p.file +
    '" aria-label="Open full-resolution ' +
    escape(p.product + " " + p.title) +
    ' design"><img src="' +
    p.file +
    '" width="' +
    p.width +
    '" height="' +
    p.height +
    '" alt="Full ' +
    escape(p.product + " " + p.title) +
    ' design in the warm editorial family"></a></figure><p class="caption"><a href="' +
    p.promptSidecar +
    '">Exact prompt and provenance</a> · <a href="' +
    p.sourceCopy +
    '">Authoritative source copy</a></p><nav class="review-nav" aria-label="Review links"><a href="index.html#' +
    p.type +
    '">Return to the paired review</a><a href="assets/README.md">Supporting asset kit</a></nav>' +
    footer +
    "</main>";
  await fs.writeFile(
    path.join(root, p.view),
    shell(p.product + " · " + p.title + " · Warm editorial design", body),
  );
}

const prompts = [
  "# Imagegen prompt set",
  "",
  "Mode: built-in Imagegen. Two approved homepage designs, six coordinated subpages and two reusable material texture masters.",
  "",
  "The homepage layout authority is Working specimen (31/32); its material authority is warm Paper & pewter (35/36). The subpages use the approved combined homepages (39/40) as their visual family authority. All inputs have explicit roles.",
  "",
];
for (const p of pages) {
  const meta = JSON.parse(await fs.readFile(path.join(root, p.promptSidecar), "utf8"));
  prompts.push(
    "## " + p.product + " · " + p.title + " · " + p.id,
    "",
    "[View design](" + p.view + ") · [PNG](" + p.file + ") · [Provenance](" + p.promptSidecar + ")",
    "",
  );
  for (const r of meta.references)
    prompts.push("- [" + r.file + "](" + r.file + "): " + r.role + ".");
  if (meta.previousFile) {
    const initial = JSON.parse(
      await fs.readFile(path.join(root, meta.previousFile + ".json"), "utf8"),
    );
    prompts.push(
      "",
      "### Initial generation",
      "",
      "[Retained initial image](" + meta.previousFile + ")",
      "",
    );
    for (const r of initial.references)
      prompts.push("- [" + r.file + "](" + r.file + "): " + r.role + ".");
    prompts.push("", "```text", initial.prompt, "```", "", "### Final targeted correction");
  }
  prompts.push("", "```text", meta.prompt, "```", "");
}
for (const texture of manifest.textures) {
  const meta = JSON.parse(await fs.readFile(path.join(root, texture.file + ".json"), "utf8"));
  prompts.push(
    "## Material master · " + texture.material,
    "",
    "[Texture](" + texture.file + ") · [Provenance](" + texture.file + ".json)",
    "",
    "```text",
    meta.prompt,
    "```",
    "",
  );
}
await fs.writeFile(path.join(root, "prompts.md"), prompts.join("\n"));
console.log("Built the eight-page review, eight viewers and exact prompt set.");
