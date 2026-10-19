// cspell:words letterform fetchpriority
/* eslint-disable security/detect-non-literal-fs-filename -- Copy comes from the fixed local design source. */
import { FerraWorkshop } from "ferramenta-family/ferra";
import { displayName, family, isEngine, WORKSHOP } from "ferramenta-family/registry";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const engines = family.filter((tool) => isEngine(tool));
const copy = JSON.parse(readFileSync(new URL("content/ferramenta.json", import.meta.url), "utf8"));
const workshopReferences = `<div class="ferra-page workshop-references">${renderToStaticMarkup(createElement(FerraWorkshop, { id: "workshop-links" }))}</div>`;
const escape = (s) =>
  s.replaceAll(
    /[&<>"']/gu,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const link = (url, label) => `<a href="${escape(url)}">${escape(label)}</a>`;
const brand = `<a class="brand" href="index.html" aria-label="Ferramenta home"><img src="../packages/family/ferra/ferramenta/mark-64.png" width="64" height="64" alt="" />Ferramenta</a>`;
const footer = `<footer class="wrap site-footer"><div class="footer-brand">${brand}<p>Rust engines from one workshop.</p></div><nav aria-label="Footer">${link(WORKSHOP.source, "GitHub")}${link(WORKSHOP.imprint, "Imprint")}${link(WORKSHOP.privacy, "Privacy")}</nav></footer>`;
function html(title, description, body) {
  return `<!doctype html><html lang="en" class="ferra-tokens"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><meta name="color-scheme" content="light" /><meta name="robots" content="noindex,nofollow" /><meta name="description" content="${escape(description)}" /><title>${escape(title)}</title><link rel="icon" type="image/png" sizes="32x32" href="../packages/family/ferra/ferramenta/mark-32.png" /><link rel="icon" type="image/png" sizes="64x64" href="../packages/family/ferra/ferramenta/mark-64.png" /><link rel="alternate icon" href="../packages/family/ferra/ferramenta/favicon.ico" /><link rel="apple-touch-icon" href="../packages/family/ferra/ferramenta/apple-touch-icon.png" /><link rel="stylesheet" href="../design/ferra/family-preview.css" /><link rel="stylesheet" href="../packages/family/styles/ferra.css" /></head><body><a class="skip" href="#main">Skip to content</a>${body}</body></html>`;
}
const header = `<header id="top" class="wrap site-header">${brand}<nav aria-label="Main">${link("#engines", "Engines")}${link("#choosing", "Choosing an engine")}${link("#workshop", "The workshop")}${link(WORKSHOP.source, "GitHub")}</nav></header>`;
const cards = engines
  .map(
    (t) =>
      `<article class="engine" id="${t.name}" aria-labelledby="${t.name}-name"><div class="engine-heading"><img src="../packages/family/ferra/${t.name}/mark-128.png" width="128" height="128" alt="" /><div><h3 id="${t.name}-name">${escape(displayName(t))}</h3><p class="engine-role">${escape(t.what)}</p></div></div><p class="engine-description">${escape(t.does)}</p><div class="engine-links">${link(`${t.name}.html`, `Explore ${displayName(t)}`)}${link(t.docs ?? t.repo, t.docs ? "Project site" : "Repository")}</div></article>`,
  )
  .join("");
const rows = engines
  .map(
    (t) =>
      `<tr><th scope="row">${link(`${t.name}.html`, displayName(t))}</th><td>${escape(copy.references[t.name][0])}</td><td>${escape(copy.references[t.name][1])}</td></tr>`,
  )
  .join("");
const home = `${header}<main id="main"><section class="wrap hero" aria-labelledby="hero-title"><div class="hero-copy"><h1 id="hero-title">${escape(copy.title)}</h1><p class="subtitle">${escape(copy.subtitle)}</p><p class="hero-intro">${escape(copy.intro)}</p><div class="actions"><a class="button button-primary" href="#engines">Explore the engines</a><a class="button" href="${WORKSHOP.source}">Source on GitHub</a></div></div><figure class="hero-art"><img src="../packages/family/ferra/ferramenta/instrument.webp" width="1774" height="887" alt="A precision register with seven separate removable tool inserts: pattern rail, token comb, document plate, letterform tile, catalog leaves, branching path and preview aperture." fetchpriority="high" /></figure></section>
<section id="engines" class="wrap family-story" aria-labelledby="engines-title"><aside class="margin-note"><h2>The engines</h2><p>Seven independent engines.<br />One workshop.</p></aside><div class="story"><h2 id="engines-title">Seven engines, each with a job.</h2><p class="lede">Each engine has its own scope, documentation and repository. Start with the task in front of you.</p><div class="engine-grid">${cards}<aside class="catalog-note"><strong>Your task decides<br />where to start.</strong>Choose an engine for the work it does. There is no required starting point for the family.</aside></div></div></section>
<section id="choosing" class="material" aria-labelledby="choosing-title"><div class="wrap family-story"><aside class="margin-note"><h2>Familiar contracts</h2><p>Know what you are choosing.</p></aside><div class="story"><h2 id="choosing-title">Familiar inputs.<br />Explicit boundaries.</h2><p class="lede">The engines work with established formats and contracts. Compatibility evidence belongs with each project, where its scope and limitations can be read in full.</p><table class="reference-table"><caption class="sr-only">The seven engines, their familiar foundations and the evidence in each repository.</caption><colgroup><col /><col /><col /></colgroup><thead><tr><th scope="col">Engine</th><th scope="col">Familiar foundation</th><th scope="col">Evidence to look for</th></tr></thead><tbody>${rows}</tbody></table><p class="table-note">Read each project's evidence and limits before adopting it.</p></div></div></section>
<section id="workshop" class="wrap family-story workshop" aria-labelledby="workshop-title"><aside class="margin-note"><h2>The workshop</h2><p>Built with care.<br />Adopted independently.</p></aside><div class="story"><h2 id="workshop-title">Shared workmanship.<br />Independent tools.</h2><div class="prose-columns"><div><h3>Take the tool you need.</h3><p>The family is a way to find related work, not a required stack. Each engine keeps a focused purpose. Where two fit together, their documentation explains the relationship.</p><p>Ferriki uses Ferroni for pattern matching and pairs with Ferromark for highlighted documents. Ferromark does not require Ferriki.</p></div><div><h3>Keep the evidence close.</h3><p>Read the reference tests, compatibility notes and measurements in each repository. That is where the conditions stay attached to the claim and where limitations can be checked against your workload.</p><p>Use the engine's own documentation to understand the interfaces and boundaries that matter to your application.</p></div></div><p class="workshop-line">Built by ${escape(WORKSHOP.name)} in ${escape(WORKSHOP.place)}. </p></div></section>${workshopReferences}</main>${footer}`;

export const familyPreview = () => html("Ferramenta · A family of Rust engines", copy.intro, home);
