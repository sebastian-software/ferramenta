import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const pages = {
  ferromark: {
    name: "Ferromark",
    topic: "Rendering",
    core: "rendering",
    object: "document-register",
    subtitle: "Markdown, ready for your pipeline.",
    description:
      "Turn Markdown into HTML and the metadata around it. A focused Rust engine for the documents that get complicated.",
    caption:
      "<strong>One source. HTML and document metadata.</strong><br>A registration bridge aligns the source and rendered sheet. The separate oxide leaf stands for extracted metadata.",
  },
  ferroni: {
    name: "Ferroni",
    topic: "Scanner",
    core: "scanner",
    object: "pattern-comparator",
    subtitle: "Oniguruma regex, in memory-safe Rust.",
    description:
      "Run familiar patterns, from lookbehind to recursion, and the scanner that syntax highlighters drive.",
    caption:
      "<strong>Patterns in parallel. One next match.</strong><br>Pattern cassettes feed a scanning carriage. The pointer locates a matching span on the source ribbon.",
  },
};
const view = (slug, topic) => `../round-03-core-pages/${slug}-${topic}.html`;
const link = (href, text) => `<a class="text-link" href="${href}">${text}</a>`;
const actions = (...items) => `<div class="actions">${items.join("")}</div>`;
const button = (href, text, secondary = false) =>
  `<a class="button button-${secondary ? "secondary" : "primary"}" href="${href}">${text}</a>`;
const prose = (heading, paragraphs, ending = "") =>
  `<article class="prose"><h2>${heading}</h2>${paragraphs.map((p) => `<p>${p}</p>`).join("")}${ending}</article>`;
const story = (left, right, extra = "") =>
  `<section class="story ${extra}">${left}${right}</section>`;
const note = (text) => `<p class="note">${text}</p>`;
function table(title, headings, rows, extra = "") {
  return `<div class="table-scroll" role="region" aria-label="${escape(title)}" tabindex="0"><table><thead><tr>${headings.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>${extra}`;
}
const mark = (slug, size = 40) =>
  `<img src="../logos/${slug}/mark-128.png" width="${size}" height="${size}" alt="" />`;
const brand = (slug, size = 40) =>
  `<a class="brand" href="${slug}.html">${mark(slug, size)}<span>${pages[slug].name}</span></a>`;
const nav = (slug) =>
  `<a href="${slug}.html" aria-current="page">Overview</a><a href="${view(slug, "start")}">Start with Rust</a><a href="${view(slug, pages[slug].core)}">${pages[slug].topic}</a><a href="${view(slug, "benchmarks")}">Benchmarks</a>`;
function header(slug) {
  return `<a class="skip-link" href="#content">Skip to content</a><header class="site-header wrap">${brand(slug)}<nav class="primary-nav" aria-label="Main navigation">${nav(slug)}<a href="https://github.com/sebastian-software/${slug}">GitHub</a></nav><a class="family-link" href="../index.html">The Ferramenta family</a></header>`;
}
function footer(slug) {
  const other = slug === "ferroni" ? "ferromark" : "ferroni";
  return `<footer class="site-footer wrap"><div>${brand(slug, 32)}<p>Part of Ferramenta.<br>Rust-native developer engines.</p></div><nav aria-label="Footer pages">${nav(slug)}</nav><nav aria-label="Project and company"><a href="https://github.com/sebastian-software/${slug}">GitHub</a><a href="https://sebastian-software.com/imprint">Imprint</a><a href="https://sebastian-software.com/privacy-policy">Privacy</a></nav><div><a href="../index.html">The Ferramenta family</a><p>Focused tools for a more<br>capable open web.</p></div></footer><aside class="review-links" aria-label="Local design study"><a href="${other}.html">Compare ${pages[other].name}</a><a href="../logos/index.html">Logos &amp; favicons</a><a href="../round-03-core-pages/index.html">All eight page designs</a><a href="DESIGN-NOTES.md">Layout notes</a></aside>`;
}
function hero(slug) {
  const page = pages[slug];
  return `<section class="hero" aria-labelledby="project-title"><div class="hero-copy"><p class="hero-label">Rust-native</p><h1 id="project-title">${page.name}</h1><p class="hero-subtitle">${page.subtitle}</p><p class="hero-description">${page.description}</p>${actions(button(view(slug, "start"), "Start with Rust"), button(slug === "ferroni" ? view(slug, "scanner") : "https://ferromark.dev/node/getting-started/", slug === "ferroni" ? "Explore the scanner" : "Node.js guide", true))}</div><figure class="hero-object"><img src="../round-03-core-pages/assets/${page.object}.png" alt="${slug === "ferroni" ? "A precision instrument with parallel pattern cassettes and a pointer over a text ribbon" : "A precision registration bridge aligning source, rendered output and a separate metadata leaf"}" width="${slug === "ferroni" ? 1774 : 1536}" height="${slug === "ferroni" ? 887 : 1024}" fetchpriority="high" /><figcaption>${page.caption}</figcaption></figure></section>`;
}
function ferromark() {
  const slug = "ferromark";
  const demo = `<section class="demo" aria-labelledby="demo-title"><header><h2 id="demo-title">See what a document becomes</h2><p>A simple document, rendered with Ferromark.</p></header><div class="demo-columns"><div class="tool-panel"><div class="panel-label"><span>Markdown input</span><span>Markdown</span></div><pre class="panel-content"><code># Release notes\n\n- Clear structure\n- Useful metadata</code></pre></div><div class="tool-panel"><div class="panel-label"><span>Rendered preview</span><span>HTML</span></div><div class="panel-content"><h3>Release notes</h3><ul><li>Clear structure</li><li>Useful metadata</li></ul></div></div></div></section>`;
  const correctness = story(
    prose(
      "Correctness is a contract",
      [
        "A Markdown engine has to earn trust on the awkward document: a nested list, a reference that moves, a table with real content, or a footnote added at the last minute. Ferromark starts with CommonMark and GFM, then makes the publishing features explicit.",
        "Specification profiles turn off publishing extras so that conformance can be checked on its own terms. Optional heading IDs, front matter and footnotes belong to a documented output contract. A change to that contract deserves a record, not an accidental difference hidden in a faster implementation.",
      ],
      actions(
        link(view(slug, "rendering"), "Inspect correctness"),
        link(view(slug, "rendering"), "Explore syntax"),
      ),
    ),
    `<aside><h3>Publishing details</h3><dl class="ledger"><div><dt>Front matter</dt><dd>Extracted as raw text</dd></div><div><dt>Heading IDs</dt><dd>Configurable output</dd></div><div><dt>Footnotes</dt><dd>Document references and notes</dd></div><div><dt>Rendering hooks</dt><dd>Your application decides</dd></div></dl></aside>`,
    "story-intro",
  );
  const values = [
    ["Ferromark v2", 1],
    ["Ferromark v1", 0.48],
    ["pulldown-cmark", 0.38],
    ["md4c", 0.29],
    ["Bun native", 0.17],
  ];
  const chart = `<figure aria-labelledby="speed-title"><h2 id="speed-title">Speed, with the conditions attached</h2><p class="chart-label">Fresh throughput, relative to Ferromark v2. Higher is faster.</p><div class="bar-chart">${values.map(([name, value]) => `<div class="bar-row"><span>${name}</span><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--value:${value * 100}%"></div></div><output>${value.toFixed(2)}×</output></div>`).join("")}</div></figure>`;
  const speed = story(
    chart,
    `<div>${note("Measured September 21, 2026 · Apple M1 Pro · revision 39b1f0b7<br>50 documents with equivalent HTML across five engines.")}<div class="prose"><p>A useful comparison starts by checking the output. The frozen corpus contains 57 documents; the score shown here uses the 50-document agreement subset. The other cases remain visible as diagnostics instead of being normalized into the score.</p><p>Fresh and reuse are separate lifecycles. These figures describe the recorded input, configuration and machine; they are not a promise about every workload.</p>${actions(link(view(slug, "benchmarks"), "Read the measurements and exact flags"))}</div></div>`,
    "story-evidence",
  );
  const policy = story(
    prose("Recognition is not permission", [
      "The engine can recognize raw HTML without granting permission to emit it. Choose the output policy for the source your application accepts.",
    ]),
    `<div>${table(
      "Rendering defaults by API",
      ["API", "Default", "For untrusted Markdown"],
      [
        ["Rust", "Raw HTML passthrough", "Enable <code>sanitize</code>"],
        [
          "Node.js",
          "Escaped HTML and filtered URL schemes",
          "Keep <code>renderPolicy: 'untrusted'</code>",
        ],
      ],
    )}${note("Custom hooks and highlighter HTML are written verbatim. They must escape untrusted values themselves.<br>A rendering policy is an integration decision, not a badge on a parser.")}${actions(link(view(slug, "rendering"), "Choose your rendering policy"))}</div>`,
    "policy",
  );
  const document = story(
    prose(
      "The document, beyond paragraphs",
      [
        "Publishing needs structure as well as markup. Extract front matter as raw text; let the application interpret YAML or TOML. Configure heading IDs and footnotes for the site you are building. Tables can carry the classes, captions and column structure that your CSS needs.",
        "Ferromark leaves templates, translation, routing and syntax highlighting outside the core. That boundary keeps the renderer focused and gives the surrounding pipeline room to make its own decisions.",
      ],
      actions(link(view(slug, "rendering"), "Explore rendering and metadata")),
    ),
    `<aside><h3>API notebook</h3><dl class="notebook"><dt>Render one document</dt><dd><code>to_html()</code></dd><dt>Choose output policy</dt><dd><code>to_html_with_options()</code></dd><dt>Inspect structure</dt><dd><code>Allocator + Parser + HtmlRenderer</code></dd><dt>Customize output</dt><dd><code>HtmlRenderHooks</code></dd></dl></aside>`,
    "story-notebook",
  );
  const closing = story(
    prose(
      "Build the pipeline that fits",
      [
        "Start with the Rust crate, or use the native engine through Node.js. Pair Ferromark with Ferriki when your documents need syntax highlighting; neither engine requires the other.",
      ],
      actions(
        button(view(slug, "start"), "Start with Rust"),
        link("https://ferromark.dev/node/getting-started/", "Node.js guide"),
        link("https://github.com/sebastian-software/ferriki", "Meet Ferriki"),
      ),
    ),
    `<aside class="install"><h3>Start with Rust</h3><pre><code>cargo add ferromark</code></pre></aside>`,
  );
  return (
    demo +
    `<div class="reading-sequence">${correctness}${speed}${policy}${document}${closing}</div>`
  );
}
function ferroni() {
  const slug = "ferroni";
  const demo = `<section class="demo" aria-labelledby="demo-title"><header><h2 id="demo-title">See what the pattern finds</h2><p>A simple example with lookbehind.</p></header><dl class="regex-example"><div class="example-field"><dt>Pattern</dt><dd><code>(?&lt;=item-)\\d+</code></dd></div><div class="example-field"><dt>Text</dt><dd><code>item-104&nbsp; item-208</code></dd></div><div class="example-field"><dt>Matches</dt><dd><code>104, 208</code></dd></div></dl></section>`;
  const compatibility = story(
    prose(
      "Patterns carry a contract",
      [
        "A regex engine is more than a way to find a word. Existing grammars and applications depend on how lookbehind, captured text, Unicode properties and recursive patterns behave. Rewriting the expression can change that behavior just as surely as changing the engine.",
        "Ferroni continues Oniguruma’s expressive syntax in Rust. Choose it when that compatibility matters: an editor grammar, a highlighter, or a search that depends on a feature the regex crate deliberately leaves out. The point is to run the pattern your tool already understands, with behavior you can inspect.",
      ],
      actions(link(view(slug, "scanner"), "Explore syntax and compatibility")),
    ),
    `<aside><h3>Selected executable syntax checks</h3>${table(
      "Selected executable syntax checks",
      ["Feature", "Ferroni", "Rust regex"],
      [
        ["Lookahead and lookbehind", "Yes", "No"],
        ["Backreferences", "Yes", "No"],
        ["Unicode character properties", "Yes", "Yes"],
      ],
    )}${note("These examples describe selected checks, not every possible pattern.")}</aside>`,
    "story-intro",
  );
  const scanner = story(
    prose(
      "One line. Several patterns. The next match.",
      [
        "A TextMate grammar compiles a set of patterns, then asks which one matches next from a position in the line. The scanner returns the leftmost match, the index of the pattern that found it, and capture ranges. The tokenizer resumes at the previous match’s end.",
        "The regular scanner uses byte offsets. Explicit UTF-16 methods support editor text models. For a zero-width match, advance at a character boundary before asking again.",
      ],
      actions(
        link(view(slug, "scanner"), "Understand the scanner"),
        link("https://github.com/sebastian-software/ferriki", "Ferriki runs on Ferroni"),
      ),
    ),
    `<aside><div class="scanner-source"><p><code>const answer = 42 // note</code></p><p class="note">Patterns: 0 keywords, 1 strings,<br>2 comments, 3 numbers</p></div>${table(
      "Scanner positions in source text",
      ["Resume at byte", "Next match", "Pattern index", "Byte range"],
      [
        ["0", "<code>const</code>", "0", "<code>0..5</code>"],
        ["5", "<code>42</code>", "3", "<code>15..17</code>"],
        ["17", "<code>// note</code>", "2", "<code>18..25</code>"],
      ],
    )}</aside>`,
    "story-scanner",
  );
  const continued = story(
    "<header><h2>Continued with care</h2></header>",
    `<article class="prose"><p>Oniguruma’s C project ended in April 2025. Ferroni continues the engine in Rust, preserving its syntax and pattern semantics for the supported encodings. Compatibility checks compare behavior against the original; the history stays visible with the implementation.</p><p>A smaller system is not automatically a better fit for every pattern. Rust’s regex crate makes a different tradeoff: it leaves out constructs such as lookaround and backreferences to offer predictable linear-time searching. Ferroni keeps the expressive contract and gives callers controls for expensive searches.</p>${actions(link(view(slug, "scanner"), "Inspect compatibility"), link(view(slug, "benchmarks"), "Compare the engine contracts"))}</article>`,
    "story-feature",
  );
  const benchmark = story(
    `<div><h2>Reuse changes the picture</h2><p class="chart-label">Ferroni throughput relative to each comparator; higher is faster.</p>${table(
      "Steady-reuse throughput by platform",
      ["Comparator", "macOS ARM64", "Linux x86-64"],
      [
        ["C Oniguruma", "3.44×", "2.75×"],
        ["PCRE2 JIT", "0.70×", "0.63×"],
      ],
    )}${note("Steady reuse · 21 tasks per pair · 513 corpus inputs<br>Measured October 15, 2026 · revision 1c8d45f<br>Blacksmith VMs: macOS ARM64 and Linux x86-64.")}</div>`,
    `<article class="prose"><p>Compile, first use and steady reuse answer different questions. C Oniguruma compiles patterns faster. Ferroni pays off when a prepared pattern runs many times. PCRE2 JIT remains faster in the steady-reuse aggregates shown here.</p><p>Every task checks expected output before timing. These are isolated regex steps, not complete application benchmarks, and each row describes a pairwise task set.</p>${actions(link(view(slug, "benchmarks"), "Read the complete benchmarks"))}</article>`,
    "story-evidence",
  );
  const closing = story(
    prose(
      "Put a boundary around the work",
      [
        "Memory safety does not make every pattern cheap. For untrusted patterns or text, choose retry budgets and supported time limits; the fallible search methods distinguish a reached limit from no match. Browser WebAssembly searches use retry limits instead of timeouts.",
        "Keep those controls close to the place that accepts input, then reuse compiled patterns where the workload allows it.",
      ],
      actions(link(view(slug, "start"), "Read the untrusted-input guide")),
    ),
    `<aside class="install"><h3>Start with Rust</h3><pre><code>cargo add ferroni</code></pre></aside>`,
  );
  return (
    demo +
    `<div class="reading-sequence">${compatibility}${scanner}${continued}${benchmark}${closing}</div>`
  );
}
for (const [slug, page] of Object.entries(pages)) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="color-scheme" content="light"/><title>${page.name} · Homepage layout study</title><link rel="stylesheet" href="homepage.css"/><link rel="icon" type="image/png" sizes="32x32" href="../logos/${slug}/mark-32.png"/><link rel="icon" type="image/png" sizes="64x64" href="../logos/${slug}/mark-64.png"/><link rel="icon" href="../logos/${slug}/favicon.ico" sizes="32x32 48x48 64x64"/><link rel="apple-touch-icon" href="../logos/${slug}/apple-touch-icon.png"/></head><body>${header(slug)}<main id="content" class="wrap">${hero(slug)}${slug === "ferromark" ? ferromark() : ferroni()}</main>${footer(slug)}</body></html>`;
  writeFileSync(root + slug + ".html", html + "\n");
}
console.log("Built both homepages from shared layout primitives.");
