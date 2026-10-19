import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = async (file) => JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
const manifest = await read("manifest.json");
const products = manifest.products;
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const image = async (file, alt, attrs = "") => {
  const meta = await read(file + ".json");
  const [width, height] = meta.width
    ? [meta.width, meta.height]
    : meta.geometry.split(" ")[0].split("x").map(Number);
  return (
    '<img src="' +
    file +
    '" width="' +
    width +
    '" height="' +
    height +
    '" alt="' +
    escape(alt) +
    '" ' +
    attrs +
    ">"
  );
};
const head = (title, product) =>
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>' +
  escape(title) +
  '</title><link rel="stylesheet" href="review.css">' +
  (product
    ? '<link rel="icon" type="image/png" sizes="32x32" href="' +
      product.assets.mark32 +
      '"><link rel="icon" href="' +
      product.assets.favicon +
      '" sizes="32x32 48x48 64x64">'
    : "") +
  '</head><body class="fe-tokens">';
const footer =
  '<footer><p>Built-in Imagegen concepts and original assets. Source copy and repository snapshots remain authoritative. Local and uncommitted.</p><div><a href="BRIEF.md">Brief</a> · <a href="prompts.md">Prompts</a> · <a href="assets/README.md">Asset kit</a> · <a href="README.md">Files and sources</a></div></footer>';
const productNav = (active = "") =>
  products
    .map(
      (p) =>
        '<a href="' +
        p.view +
        '"' +
        (active === p.slug ? ' aria-current="page"' : "") +
        ">" +
        p.name +
        "</a>",
    )
    .join("");
const iconSizes = (p) =>
  '<div class="icon-list">' +
  [32, 48, 64, 128]
    .map(
      (size) =>
        '<figure class="icon-demo"><img src="assets/' +
        p.slug +
        "/mark-" +
        size +
        '.png" width="' +
        size +
        '" height="' +
        size +
        '" alt="' +
        p.name +
        " mark at " +
        size +
        ' pixels"><figcaption>' +
        size +
        " px</figcaption></figure>",
    )
    .join("") +
  "</div>";
const identity = async (p) =>
  '<div class="identity"><h3>Icon and wordmark</h3>' +
  iconSizes(p) +
  (await image(p.assets.wordmark, p.name + " typeset wordmark", 'class="wordmark"')) +
  '<p class="card-links"><a href="' +
  p.assets.master +
  '">Transparent mark master</a><a href="' +
  p.assets.favicon +
  '">32/48/64px favicon</a></p></div>';
const summaries = {
  ferriki:
    "Token groups pass through a theme register; the same source receives meaningful colors.",
  ferrolex:
    "A wordform fits a dictionary profile; a keyed affix slot makes language rules visible.",
  ferrocat: "Indexed catalog leaves align by message identity; one edited leaf is retained.",
  ferralk: "A pattern gate selects a branch before the stopped subtree is visited.",
  ferrugo: "A source page becomes a smaller preview inside an explicit aperture boundary.",
};

const sections = [];
for (const p of products) {
  const assets =
    '<div class="product-assets"><h3>' +
    escape(p.heroName) +
    "</h3><p>" +
    summaries[p.slug] +
    '</p><figure class="asset-stage"><a href="' +
    p.assets.hero +
    '" aria-label="Open ' +
    p.name +
    ' instrument master">' +
    (await image(
      p.assets.hero,
      p.name + " meaningful mechanical hero",
      'class="hero-asset" loading="lazy"',
    )) +
    '</a></figure><p class="card-links"><a href="' +
    p.assets.hero +
    '">Transparent graphic</a><a href="' +
    p.assets.hero +
    '.json">Graphic prompt</a></p>' +
    (await identity(p)) +
    "</div>";
  const page =
    '<div><a class="preview" href="' +
    p.view +
    '" aria-label="Open ' +
    p.name +
    ' homepage">' +
    (await image(p.file, "Complete " + p.name + " warm editorial homepage", 'loading="lazy"')) +
    "</a><h3>" +
    p.name +
    ' homepage</h3><p class="card-links"><a href="' +
    p.view +
    '">Open full design</a><a href="' +
    p.file +
    '">Original PNG</a><a href="' +
    p.sourceCopy +
    '">Source copy</a></p></div>';
  sections.push(
    '<section class="product-section" id="' +
      p.slug +
      '" aria-labelledby="title-' +
      p.slug +
      '"><div class="product-heading"><img src="' +
      p.assets.mark64 +
      '" width="64" height="64" alt=""><div><h2 id="title-' +
      p.slug +
      '">' +
      p.name +
      "</h2><p>" +
      escape(p.what) +
      '</p></div></div><div class="product-grid">' +
      assets +
      page +
      "</div></section>",
  );
  const body =
    '<main class="viewer"><p class="caption"><a href="../current/' +
    p.view +
    '">Open the current Plex / system UI HTML design</a></p><div class="topline"><a href="index.html#' +
    p.slug +
    '">Five-engine review</a><a href="icons.html">Icons at 32–128px</a></div><header><h1>' +
    p.name +
    "<br>" +
    escape(p.headline) +
    '</h1><p class="intro">' +
    escape(p.what) +
    ". " +
    summaries[p.slug] +
    '</p></header><nav class="review-nav" aria-label="Other engines">' +
    productNav(p.slug) +
    '</nav><figure class="design"><a href="' +
    p.file +
    '" aria-label="Open full-resolution ' +
    p.name +
    ' homepage">' +
    (await image(p.file, "Full " + p.name + " warm editorial homepage design")) +
    '</a></figure><p class="caption"><a href="' +
    p.sourceCopy +
    '">Authoritative source copy</a> · <a href="' +
    p.file +
    '.json">Exact homepage prompt</a> · <a href="' +
    p.sourceSnapshot +
    '">Frozen repository evidence</a></p><section class="product-section"><h2>Supporting identity</h2><p>' +
    summaries[p.slug] +
    '</p><div class="product-grid"><figure class="asset-stage">' +
    (await image(p.assets.hero, p.name + " instrument master", 'class="hero-asset"')) +
    "</figure>" +
    (await identity(p)) +
    "</div></section>" +
    footer +
    "</main>";
  await fs.writeFile(
    path.join(root, p.view),
    head(p.name + " · Warm editorial homepage", p) + body + "</body></html>",
  );
}
const intro =
  '<main><div class="topline"><span>Ferramenta · Family expansion</span><a href="../index.html">All design studies</a></div><header><h1>Five more engines.<br>One warm family.</h1><p class="intro">A meaningful mechanical graphic, a rendered icon with real favicon exports, and a complete homepage for each engine. The approved narrow introductory margin, warm paper, matte pewter and oxide continue throughout.</p><nav class="directions" aria-label="Products">' +
  products.map((p) => '<a href="#' + p.slug + '">' + p.name + "</a>").join("") +
  '<a href="icons.html">Compare all icons</a><a href="../round-06-warm-specimen/index.html#overview">Ferromark and Ferroni references</a></nav></header>';
await fs.writeFile(
  path.join(root, "index.html"),
  head("Ferramenta · Five-engine identity and homepage expansion") +
    intro +
    '<p><a href="../current/index.html">Current HTML designs: Ferramenta and all seven engines</a></p>' +
    sections.join("") +
    footer +
    "</main></body></html>",
);

const rows = products.map(
  (p) =>
    '<section class="icon-row" id="' +
    p.slug +
    '"><div><h2>' +
    p.name +
    "</h2><p>" +
    escape(p.what) +
    '</p><a href="' +
    p.view +
    '">Homepage and graphic</a></div>' +
    iconSizes(p) +
    "</section>",
);
const references = ["ferromark", "ferroni"]
  .map(
    (slug) =>
      '<section class="icon-row"><div><h2>' +
      (slug === "ferromark" ? "Ferromark" : "Ferroni") +
      '</h2><p>Existing family reference</p></div><div class="icon-list">' +
      [32, 48, 64, 128]
        .map(
          (size) =>
            '<figure class="icon-demo"><img src="../logos/' +
            slug +
            "/mark-" +
            size +
            '.png" width="' +
            size +
            '" height="' +
            size +
            '" alt="' +
            slug +
            " reference mark at " +
            size +
            ' pixels"><figcaption>' +
            size +
            " px</figcaption></figure>",
        )
        .join("") +
      "</div></section>",
  )
  .join("");
await fs.writeFile(
  path.join(root, "icons.html"),
  head("Ferramenta · Seven-engine icon family") +
    '<main><div class="topline"><a href="index.html">Five-engine review</a><a href="assets/README.md">Export files and usage</a></div><header><h1>Icons at their actual sizes.</h1><p class="intro">Five new identities and the two existing references. Each mark is displayed at 32, 48, 64 and 128 CSS pixels. Original rendered masters stay unchanged; exports normalize their transparent margin and resize them.</p></header>' +
    rows.join("") +
    '<section class="product-section"><h2>Existing family references</h2>' +
    references +
    "</section>" +
    footer +
    "</main></body></html>",
);

const prompts = [
  "# Exact Imagegen prompts",
  "",
  "Mode: built-in Imagegen. Five transparent hero illustrations, five transparent icon masters, and five complete homepage concepts. Exported icon sizes, wordmarks and ICO files are deterministic derivatives of the untouched rendered masters.",
  "",
  "All reference paths below are relative to this review directory. Frozen repository evidence and the authored source copy govern facts, code and claims.",
  "",
];
for (const p of products) {
  prompts.push("## " + p.name, "");
  for (const [label, file] of [
    ["Instrument", p.assets.hero],
    ["Icon master", p.assets.master],
    ["Homepage", p.file],
  ]) {
    const meta = await read(file + ".json");
    prompts.push("### " + label, "", "[Image](" + file + ") · [Provenance](" + file + ".json)", "");
    for (const ref of meta.references)
      prompts.push("- [" + ref.file + "](" + ref.file + "): " + ref.role + ".");
    if (meta.previousFile) {
      const initial = await read(meta.previousFile + ".json");
      prompts.push(
        "",
        "#### Initial generation",
        "",
        "[Retained initial output](" + meta.previousFile + ")",
        "",
      );
      for (const ref of initial.references)
        prompts.push("- [" + ref.file + "](" + ref.file + "): " + ref.role + ".");
      prompts.push("", "```text", initial.prompt, "```", "", "#### Final targeted correction");
    }
    prompts.push("", "```text", meta.prompt, "```", "");
  }
}
await fs.writeFile(path.join(root, "prompts.md"), prompts.join("\n"));
console.log(
  "Built five product viewers, the combined review, actual-size icon review and exact prompt bundle.",
);
