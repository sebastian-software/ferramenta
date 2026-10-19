import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorialWorkshop } from "ferramenta-family/editorial";

const root = fileURLToPath(new URL(".", import.meta.url));
// Snapshot the shipped kit so the standalone design remains portable and uses the real component.
const familyPackage = fileURLToPath(
  new URL(".", import.meta.resolve("ferramenta-family/package.json")),
);
const shared = join(root, "assets/shared");
mkdirSync(join(shared, "styles"), { recursive: true });
cpSync(join(familyPackage, "editorial"), join(shared, "editorial"), { recursive: true });
for (const stylesheet of [
  "editorial.css",
  "editorial-tokens.css",
  "editorial-assets.css",
  "editorial-fonts.css",
])
  cpSync(join(familyPackage, "styles", stylesheet), join(shared, "styles", stylesheet));
const workshopReferences = `<div class="fe-page workshop-references">${renderToStaticMarkup(createElement(EditorialWorkshop, { id: "workshop-links" }))}</div>`;
const { engines, workshop } = JSON.parse(readFileSync(join(root, "sources/engines.json"), "utf8"));
const copy = JSON.parse(readFileSync(join(root, "content/page.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
const escape = (s) =>
  s.replace(
    /[&<>"']/gu,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const link = (url, label) => `<a href="${escape(url)}">${escape(label)}</a>`;
const brand = `<a class="brand" href="index.html" aria-label="Ferramenta home"><img src="assets/ferramenta/mark-64.png" width="64" height="64" alt="" />Ferramenta</a>`;
const footer = `<footer class="wrap site-footer"><div class="footer-brand">${brand}<p>Rust engines from one workshop.</p></div><nav aria-label="Footer">${link(workshop.source, "GitHub")}${link(workshop.imprint, "Imprint")}${link(workshop.privacy, "Privacy")}${link("concept.html", "Design review")}${link("typography.html", "Typography study")}</nav></footer>`;
function html(title, description, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><meta name="color-scheme" content="light" /><meta name="robots" content="noindex,nofollow" /><meta name="description" content="${escape(description)}" /><title>${escape(title)}</title><link rel="icon" type="image/png" sizes="32x32" href="assets/ferramenta/mark-32.png" /><link rel="icon" type="image/png" sizes="64x64" href="assets/ferramenta/mark-64.png" /><link rel="alternate icon" href="assets/ferramenta/favicon.ico" /><link rel="apple-touch-icon" href="assets/ferramenta/apple-touch-icon.png" /><link rel="stylesheet" href="site.css" /><link rel="stylesheet" href="assets/shared/styles/editorial.css" /></head><body><a class="skip" href="#main">Skip to content</a>${body}</body></html>`;
}
const header = `<header id="top" class="wrap site-header">${brand}<nav aria-label="Main">${link("#engines", "Engines")}${link("#choosing", "Choosing an engine")}${link("#workshop", "The workshop")}${link(workshop.source, "GitHub")}</nav></header>`;
const cards = engines
  .map(
    (t) =>
      `<article class="engine" id="${t.name}" aria-labelledby="${t.name}-name"><div class="engine-heading"><img src="${t.icon}" width="128" height="128" alt="" /><div><h3 id="${t.name}-name">${escape(t.displayName)}</h3><p class="engine-role">${escape(t.what)}</p></div></div><p class="engine-description">${escape(copy.cards[t.name])}</p><div class="engine-links">${link(`../current/${t.name}.html`, `Explore ${t.displayName}`)}${link(t.docs ?? t.repo, t.docs ? "Project site" : "Repository")}</div></article>`,
  )
  .join("");
const rows = engines
  .map(
    (t) =>
      `<tr><th scope="row">${link(`../current/${t.name}.html`, t.displayName)}</th><td>${escape(copy.references[t.name][0])}</td><td>${escape(copy.references[t.name][1])}</td></tr>`,
  )
  .join("");
const home = `${header}<main id="main"><section class="wrap hero" aria-labelledby="hero-title"><div class="hero-copy"><h1 id="hero-title">${escape(copy.title)}</h1><p class="subtitle">${escape(copy.subtitle)}</p><p class="hero-intro">${escape(copy.intro)}</p><div class="actions"><a class="button button-primary" href="#engines">Explore the engines</a><a class="button" href="${workshop.source}">Source on GitHub</a></div></div><figure class="hero-art"><img src="assets/ferramenta/hero.png" width="1774" height="887" alt="A precision register with seven separate removable tool inserts: pattern rail, token comb, document plate, letterform tile, catalog leaves, branching path and preview aperture." fetchpriority="high" /></figure></section>
<section id="engines" class="wrap editorial" aria-labelledby="engines-title"><aside class="margin-note"><h2>The engines</h2><p>Seven independent engines.<br />One workshop.</p></aside><div class="story"><h2 id="engines-title">Seven engines, each with a job.</h2><p class="lede">Each engine has its own scope, documentation and repository. Start with the task in front of you.</p><div class="engine-grid">${cards}<aside class="catalog-note"><strong>Your task decides<br />where to start.</strong>Choose an engine for the work it does. There is no required starting point for the family.</aside></div></div></section>
<section id="choosing" class="material" aria-labelledby="choosing-title"><div class="wrap editorial"><aside class="margin-note"><h2>Familiar contracts</h2><p>Know what you are choosing.</p></aside><div class="story"><h2 id="choosing-title">Familiar inputs.<br />Explicit boundaries.</h2><p class="lede">The engines work with established formats and contracts. Compatibility evidence belongs with each project, where its scope and limitations can be read in full.</p><table class="reference-table"><caption class="sr-only">The seven engines, their familiar foundations and the evidence in each repository.</caption><colgroup><col /><col /><col /></colgroup><thead><tr><th scope="col">Engine</th><th scope="col">Familiar foundation</th><th scope="col">Evidence to look for</th></tr></thead><tbody>${rows}</tbody></table><p class="table-note">Read each project's evidence and limits before adopting it.</p></div></div></section>
<section id="workshop" class="wrap editorial workshop" aria-labelledby="workshop-title"><aside class="margin-note"><h2>The workshop</h2><p>Built with care.<br />Adopted independently.</p></aside><div class="story"><h2 id="workshop-title">Shared workmanship.<br />Independent tools.</h2><div class="prose-columns"><div><h3>Take the tool you need.</h3><p>The family is a way to find related work, not a required stack. Each engine keeps a focused purpose. Where two fit together, their documentation explains the relationship.</p><p>Ferriki uses Ferroni for pattern matching and pairs with Ferromark for highlighted documents. Ferromark does not require Ferriki.</p></div><div><h3>Keep the evidence close.</h3><p>Read the reference tests, compatibility notes and measurements in each repository. That is where the conditions stay attached to the claim and where limitations can be checked against your workload.</p><p>Use the engine's own documentation to understand the interfaces and boundaries that matter to your application.</p></div></div><p class="workshop-line">Built by ${escape(workshop.name)} in ${escape(workshop.place)}. </p></div></section>${workshopReferences}</main>${footer}`;
writeFileSync(
  join(root, "index.html"),
  html("Ferramenta · A family of Rust engines", copy.intro, home),
);
const typeControls = `<section class="type-controls wrap" aria-labelledby="type-study-title"><div><h2 id="type-study-title">Typography, in context.</h2><p>Same page, materials and spacing. Compare the heading character and body stack independently.</p></div><form><label>Headings<select name="headings" disabled><option value="helvetica">Helvetica Neue · previous</option><option value="plex" selected>IBM Plex Sans · selected</option><option value="instrument">Instrument Sans · editorial</option></select></label><label>Body text<select name="body" disabled><option value="helvetica">Helvetica Neue · previous</option><option value="system" selected>System UI · selected</option></select></label></form><p class="type-study-note">Selected family typography: IBM Plex Sans headings and system UI body text. Alternatives remain available for comparison. Webfonts are self-hosted under the SIL Open Font License. <a href="index.html">Return to the approved homepage</a></p><noscript><p>Enable JavaScript to switch fonts. The selected Plex and system UI combination is shown below.</p></noscript></section>`;
const typePage = html(
  "Ferramenta · Typography comparison",
  "Compare Helvetica, IBM Plex Sans and Instrument Sans in the approved family layout.",
  `${typeControls}${home}`,
)
  .replace(
    "</head>",
    '<link rel="stylesheet" href="typography.css" /><script src="typography.js" defer></script></head>',
  )
  .replace("<body>", '<body class="type-study">');
writeFileSync(join(root, "typography.html"), typePage);
const reviewNav = `<nav aria-label="Design review">${link("index.html", "Family homepage")}${link("concept.html", "Imagegen page comp")}${link("identity.html", "Logo and family icons")}${link("../index.html", "All design studies")}</nav>`;
const reviewLinks = `<div class="review-links">${link("BRIEF.md", "Design brief")}${link("prompts.md", "Exact prompts")}${link("content/ferramenta-home.md", "Source copy")}${link("assets/README.md", "Asset kit")}${link("sources/manifest.json", "Frozen evidence")}</div>`;
const compBody = `<header class="wrap review-header">${reviewNav}<h1>Ferramenta, together.</h1><p>The complete Imagegen homepage concept. The ${link("index.html", "linked HTML preview")} uses the original hero, exact icons and real text. Engine links in that preview open the existing local product designs.</p>${reviewLinks}</header><main id="main" class="wrap review-panel"><a class="comp-image" href="${manifest.comp}" aria-label="Open full-resolution Ferramenta homepage comp"><img src="${manifest.comp}" alt="Complete warm editorial Ferramenta family homepage concept with all seven engines, reference table and workshop." /></a></main>${footer}`;
writeFileSync(
  join(root, "concept.html"),
  html("Ferramenta · Full homepage design comp", "The family homepage Imagegen concept.", compBody),
);
const sizes = [32, 48, 64, 128];
const identityBody = `<header class="wrap review-header">${reviewNav}<h1>One register. Seven tools.</h1><p>The family mark is a shared F-shaped registration fixture. The engine symbols stay distinct. All marks below are real raster exports at the labeled CSS pixel sizes.</p></header><main id="main" class="wrap"><section class="identity-grid" aria-labelledby="identity-title"><div><h2 id="identity-title">Ferramenta</h2><img class="wordmark" src="assets/ferramenta/logo-lockup.png" alt="Ferramenta typeset logo lockup" /><div class="icon-sizes">${sizes.map((s) => `<figure><img src="assets/ferramenta/mark-${s}.png" width="${s}" height="${s}" alt="Ferramenta mark at ${s} pixels" /><figcaption>${s} px</figcaption></figure>`).join("")}</div>${reviewLinks}<div class="review-links">${link("assets/ferramenta/mark-master.png", "Transparent mark master")}${link("assets/ferramenta/favicon.ico", "32/48/64px favicon")}</div></div><figure><img src="assets/ferramenta/hero.png" width="1774" height="887" alt="Seven-position precision tool register" /><figcaption>Seven independent inserts share a mounting standard. Their separation represents individual adoption; they are not a required processing chain.</figcaption></figure></section><section aria-labelledby="family-icons-title"><h2 id="family-icons-title">The complete engine family</h2><div class="family-identity">${engines.map((t) => `<figure><a href="../current/${t.name}.html"><img src="assets/engines/${t.name}-64.png" width="64" height="64" alt="${t.displayName} icon" /></a><figcaption>${link(`../current/${t.name}.html`, t.displayName)}</figcaption></figure>`).join("")}</div></section></main>${footer}`;
writeFileSync(
  join(root, "identity.html"),
  html(
    "Ferramenta · Logo and engine family",
    "Original Ferramenta logo, favicon sizes and all seven engine identities.",
    identityBody,
  ),
);
const files = [
  "site.css",
  "build-review.mjs",
  "build-assets.mjs",
  "index.html",
  "concept.html",
  "identity.html",
  "typography.html",
  "typography.css",
  "typography.js",
].map((f) => join(root, f));
const fmt = spawnSync("./node_modules/.bin/oxfmt", ["--write", ...files], { encoding: "utf8" });
if (fmt.status !== 0) throw new Error(fmt.stderr || fmt.stdout);
console.log(
  "Built the linked family homepage, full-page concept review and original logo/identity review.",
);
