/**
 * Runs the content pipeline on a real document and commits what comes out:
 * Ferromark renders the Markdown and hands the code block to Ferriki, whose
 * TextMate engine is Ferroni. The home page shows the input beside this
 * output, so nothing in the output panel is hand-written.
 *
 *   FERROMARK=/path/to/ferromark FERRIKI=/path/to/ferriki/node/ferriki \
 *     node scripts/render-pipeline-sample.mjs
 *
 * Both paths point at a package directory: Ferromark from npm
 * (`npm install ferromark`), Ferriki built from its repository
 * (`pnpm -C node/ferriki build:native && pnpm -C node/ferriki build`) until
 * it is published again. Re-run when the sample or either tool changes.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const THEME = "gruvbox-dark-hard";

/** The family's own quick start, from Ferromark's README. An h3: on the page it sits under the section's h2. */
const MARKDOWN = `### Render Markdown in Rust

Ferromark turns **Markdown** into HTML:

\`\`\`rust
let html = ferromark::to_html("Hello, **world**!").unwrap();
assert_eq!(html, "<p>Hello, <strong>world</strong>!</p>\\n");
\`\`\`
`;

function packageDir(name) {
  const dir = process.env[name];
  if (!dir) throw new Error(`${name} is required: the path to the ${name.toLowerCase()} package`);
  return dir;
}

async function load(dir) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the package directory the caller named on purpose
  const manifest = JSON.parse(await readFile(join(dir, "package.json"), "utf8"));
  const entry =
    manifest.exports?.["."]?.import ?? manifest.exports?.["."]?.default ?? manifest.main;
  const module = await import(
    pathToFileURL(join(dir, typeof entry === "string" ? entry : "index.js")).href
  );
  return { module, version: manifest.version };
}

/**
 * The Ferroni version a Ferriki build runs on, from the repository's Cargo.lock
 * (two levels above node/ferriki): the chain's first stage, named with the rest.
 */
async function ferroniIn(ferrikiDir) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the Ferriki checkout the caller named
  const lock = await readFile(join(ferrikiDir, "..", "..", "Cargo.lock"), "utf8");
  const version = /\[\[package\]\]\nname = "ferroni"\nversion = "([^"]+)"/u.exec(lock)?.[1];
  if (!version) throw new Error("no ferroni package in Ferriki's Cargo.lock");
  return version;
}

const ferromark = await load(packageDir("FERROMARK"));
const ferriki = await load(packageDir("FERRIKI"));
const ferroni = await ferroniIn(packageDir("FERRIKI"));

const highlighter = await ferriki.module.createHighlighter({ langs: ["rust"], themes: [THEME] });
const html = ferromark.module.toHtmlWithHighlighter(MARKDOWN, highlighter, {
  theme: THEME,
  onHighlightError(error) {
    throw error;
  },
});
if (!html.includes('class="shiki')) throw new Error("the code block came out unhighlighted");

const output = new URL("../app/data/pipeline-sample.json", import.meta.url);
const sample = {
  markdown: MARKDOWN,
  html,
  theme: THEME,
  rendered: { ferromark: ferromark.version, ferriki: ferriki.version, ferroni },
};
// eslint-disable-next-line security/detect-non-literal-fs-filename -- a fixed path inside this repository
await writeFile(output, `${JSON.stringify(sample, null, 2)}\n`);
console.log(
  `wrote ${output.pathname} (ferromark ${ferromark.version}, ferriki ${ferriki.version}, ferroni ${ferroni})`,
);
