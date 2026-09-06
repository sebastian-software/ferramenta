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

export const START = "<!-- ferramenta-family:start -->";
export const END = "<!-- ferramenta-family:end -->";
export const BRANDING_START = "<!-- sebastian-software-branding:start -->";
export const VARIANTS = ["github", "registry"];

const GROUP_LABELS = {
  pipeline: "The content pipeline",
  language: "The language workshop",
  workbench: "On the workbench",
};

/**
 * The registry, from the build output when there is one and from the
 * TypeScript source otherwise — so the generator also works in a fresh
 * checkout with no build. Node strips the type annotations (>= 22.18); `dist`
 * keeps older Node working after a `pnpm --filter @ferramenta/ardo-config build`.
 */
export async function loadRegistry() {
  const errors = [];
  for (const candidate of ["../dist/family.js", "../src/family.ts"]) {
    try {
      return await import(new URL(candidate, import.meta.url).href);
    } catch (error) {
      errors.push(`${candidate}: ${error.message}`);
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
