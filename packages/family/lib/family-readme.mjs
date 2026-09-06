/**
 * Renders the `ferramenta-family` README block from the family registry.
 *
 * The block is generated, never hand-copied: `src/family.ts` is the single
 * source of truth (ADR-0001), so a job string or a new member changes in one
 * place and every sibling README follows.
 *
 * The company footer is deliberately NOT rendered here. That is the
 * standards-owned `sebastian-software-branding` section, written by
 * `pnpm dlx @sebastian-software/standards apply`; this block always goes above
 * it so the two marker sections never fight.
 */

import { readFile } from "node:fs/promises";
import * as nodeModule from "node:module";

export const START = "<!-- ferramenta-family:start -->";
export const END = "<!-- ferramenta-family:end -->";
export const BRANDING_START = "<!-- sebastian-software-branding:start -->";
export const VARIANTS = ["github", "registry"];

const GROUP_LABELS = {
  pipeline: "The content pipeline",
  language: "The language workshop",
  workbench: "On the workbench",
};

/** Imports a module URL as it is on disk. */
const importModule = (url) => import(url.href);

/**
 * Runs `run` with experimental warnings muted.
 *
 * `stripTypeScriptTypes` is flagged experimental, and a warning line on stderr
 * every time a sibling runs `--check` in CI is noise, not a signal. The swap is
 * deliberately narrow: it wraps one synchronous call, restores the original
 * hook afterwards, and lets every other warning through.
 */
function withoutExperimentalWarning(run) {
  const emitWarning = process.emitWarning;
  process.emitWarning = (warning, ...rest) => {
    const type = typeof rest[0] === "string" ? rest[0] : rest[0]?.type;
    if (type !== "ExperimentalWarning") emitWarning.call(process, warning, ...rest);
  };
  try {
    return run();
  } finally {
    process.emitWarning = emitWarning;
  }
}

/**
 * Strips the type annotations here instead of letting Node do it, and imports
 * the JavaScript through a `data:` URL — a URL with no `node_modules` in it.
 */
async function importWithTypesStripped(url) {
  const { stripTypeScriptTypes } = nodeModule;
  if (typeof stripTypeScriptTypes !== "function") {
    throw new TypeError("module.stripTypeScriptTypes needs Node >= 22.13");
  }
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the URL is this module's own sibling file, resolved from import.meta.url
  const source = await readFile(url, "utf8");
  const javascript = withoutExperimentalWarning(() => stripTypeScriptTypes(source));
  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
}

/**
 * How the registry is loaded, in the order the candidates are tried.
 *
 * `src/family.ts` is the declared source of truth (ADR-0001) and must win:
 * `dist` is build output, so preferring it would let `--write` emit and
 * `--check` bless a registry that is one edit out of date whenever someone
 * changes `family.ts` without rebuilding first.
 *
 * There are two ways to read that source because Node refuses to strip types
 * from any file under `node_modules` — which is exactly where every consumer
 * outside this repository runs the generator from:
 *
 * 1. import the file and let Node strip the types (Node >= 22.18, this
 *    repository and any checkout),
 * 2. strip the types here and import the result through a `data:` URL
 *    (Node >= 22.13, the installed-package case),
 * 3. `dist/family.js`, the last fallback for older Node, after a build.
 *
 * A `data:` module cannot resolve relative specifiers, so `src/family.ts` stays
 * import-free; a test guards that.
 */
const REGISTRY_SOURCES = [
  { specifier: "../src/family.ts", load: importModule },
  {
    specifier: "../src/family.ts",
    label: "../src/family.ts (types stripped here)",
    load: importWithTypesStripped,
  },
  { specifier: "../dist/family.js", load: importModule },
];

/** The registry. `base` exists so the tests can point at a fixture package. */
export async function loadRegistry(base = import.meta.url) {
  const errors = [];
  for (const { specifier, label, load } of REGISTRY_SOURCES) {
    try {
      return await load(new URL(specifier, base));
    } catch (error) {
      errors.push(`${label ?? specifier}: ${error.message}`);
    }
  }
  throw new Error(`cannot load the family registry\n  ${errors.join("\n  ")}`);
}

const link = (tool) => `[${tool.name}](${tool.docs ?? tool.repo})`;
const named = (tool, current) => (tool.name === current ? `**${link(tool)}**` : link(tool));

function table(tools, current) {
  return [
    "| Tool | Job |",
    "| --- | --- |",
    ...tools.map((tool) => `| ${named(tool, current)} | ${tool.job} |`),
  ].join("\n");
}

/** Full block for a repository README: one sentence plus the grouped tables. */
function githubBlock(registry, current) {
  const groups = registry.familyGroups();
  const sections = Object.entries(GROUP_LABELS)
    .filter(([group]) => groups[group].length > 0)
    .map(([group, label]) => `**${label}**\n\n${table(groups[group], current)}`);
  return [
    "## The Ferramenta family",
    "",
    `This project is part of [Ferramenta](${registry.FAMILY_SITE}) — the family of Rust-native developer tools by [Sebastian Software](https://oss.sebastian-software.com) that keep the APIs the ecosystem already knows.`,
    "",
    sections.join("\n\n"),
  ].join("\n");
}

/** Two plain-Markdown lines for the crates.io and npm rendering of a README. */
function registryBlock(registry, current) {
  const site = `[Ferramenta](${registry.FAMILY_SITE})`;
  const lead =
    current === null
      ? `Part of the ${site} family — Rust-native developer tools that keep the APIs the ecosystem already knows.`
      : `**${current}** is part of the ${site} family — Rust-native developer tools that keep the APIs the ecosystem already knows.`;
  const siblings = registry.family
    .filter((tool) => tool.name !== current)
    .map((tool) => link(tool));
  return `${lead}\n\nSiblings: ${siblings.join(" · ")}.`;
}

/** The block, markers included, for one variant. */
export function render(registry, { variant = "github", current = null } = {}) {
  const body =
    variant === "github" ? githubBlock(registry, current) : registryBlock(registry, current);
  return `${START}\n${body}\n${END}`;
}

/**
 * Compares block text without being fooled by a formatter. Markdown formatters
 * pad table cells, stretch the separator row, and add blank lines around HTML
 * comments — and the family repositories do not all run the same formatter.
 * Drift has to mean "different content", not "different whitespace", or every
 * repository would report drift the moment it formats its README.
 */
export function normalize(text) {
  return text
    .split("\n")
    .map((line) => line.replaceAll(/\s+/gu, " ").trim())
    .map((line) => (/^\|[\s|:-]+\|$/u.test(line) ? line.replaceAll(/-+/gu, "---") : line))
    .filter((line) => line !== "")
    .join("\n");
}

/** The current block in a README, or null when there is none. */
export function findBlock(readme) {
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start === -1 || end < start) return null;
  return { start, end: end + END.length, text: readme.slice(start, end + END.length) };
}

/**
 * Where a new block goes: above the standards-owned branding section when the
 * README has one — including the `---` rule the standards CLI puts in front of
 * it — and at the end otherwise.
 */
export function insertionPoint(readme) {
  const branding = readme.indexOf(BRANDING_START);
  if (branding === -1) return readme.length;
  const before = readme.slice(0, branding).trimEnd();
  return before.endsWith("---") ? before.length - "---".length : branding;
}

/** Inserts or updates the block; unchanged when only the whitespace differs. */
export function upsert(readme, block) {
  const existing = findBlock(readme);
  if (existing !== null) {
    if (normalize(existing.text) === normalize(block)) return { content: readme, changed: false };
    return {
      content: readme.slice(0, existing.start) + block + readme.slice(existing.end),
      changed: true,
    };
  }
  const cut = insertionPoint(readme);
  const head = readme.slice(0, cut).trimEnd();
  const tail = readme.slice(cut).trimStart();
  const content = tail === "" ? `${head}\n\n${block}\n` : `${head}\n\n${block}\n\n${tail}`;
  return { content, changed: true };
}
