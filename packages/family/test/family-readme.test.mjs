import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

import {
  BRANDING_START,
  END,
  findBlock,
  insertionPoint,
  loadRegistry,
  normalize,
  render,
  START,
  upsert,
} from "../lib/family-readme.mjs";

const registry = await loadRegistry();

test("the github block groups the family the way the site does", () => {
  const block = render(registry, { variant: "github", current: "ferrocat" });
  assert.match(block, /^<!-- ferramenta-family:start -->/u);
  assert.match(block, /<!-- ferramenta-family:end -->$/u);
  for (const label of ["The content pipeline", "The language workshop", "On the workbench"]) {
    assert.ok(block.includes(`**${label}**`), `missing group: ${label}`);
  }
});

test("--current excludes the current tool", () => {
  const block = render(registry, { current: "ferrocat" });
  assert.ok(!block.includes("[ferrocat]("));
});

test("applications get a row like every other member", () => {
  const block = render(registry, { variant: "github" });
  const application = registry.family.find((tool) => tool.role === "application");
  assert.ok(application, "the registry has no application to check");
  assert.ok(block.includes(`[${application.name}](${application.docs})`));
});

test("the registry variant is two plain-Markdown lines with no HTML", () => {
  const block = render(registry, { variant: "registry", current: "ferriki" });
  const body = block.slice(START.length, -END.length).trim();
  assert.equal(body.split("\n\n").length, 2);
  assert.ok(!body.includes("<"), "registry variant must not contain HTML");
  assert.ok(!body.includes("|"), "registry variant must not contain a table");
  assert.ok(body.includes("https://ferramenta.dev"));
  assert.ok(!body.includes("[ferriki]"), "the current tool is not its own sibling");
});

test("formatter whitespace is not drift", () => {
  const block = render(registry, { variant: "github", current: "ferroni" });
  const formatted = block
    .replaceAll("| --- | --- |", "| ------ | --------- |")
    .replaceAll(START, `${START}\n`)
    .replaceAll(END, `\n${END}`)
    .replaceAll(" |", "   |");
  assert.equal(normalize(formatted), normalize(block));
});

test("a different job string is drift", () => {
  const block = render(registry, { variant: "github" });
  assert.notEqual(normalize(block.replace("regex engine", "regex thing")), normalize(block));
});

test("the block lands above the standards branding section", () => {
  const readme = [
    "# Tool",
    "",
    "Body.",
    "",
    "---",
    "",
    "<!-- sebastian-software-branding:start -->",
    "footer",
    "<!-- sebastian-software-branding:end -->",
    "",
  ].join("\n");
  const block = render(registry, { variant: "github", current: "ferroni" });
  const { content, changed } = upsert(readme, block);
  assert.ok(changed);
  assert.ok(content.indexOf(START) < content.indexOf(BRANDING_START));
  const between = content.slice(content.indexOf(END) + END.length, content.indexOf(BRANDING_START));
  assert.match(between, /^\s*---\s*$/u, "the horizontal rule stays with the footer");
});

test("without a branding section the block goes to the end", () => {
  const readme = "# Tool\n\nBody.\n";
  const block = render(registry, { variant: "registry" });
  const { content } = upsert(readme, block);
  assert.equal(insertionPoint(readme), readme.length);
  assert.ok(content.trimEnd().endsWith(END));
});

test("upsert replaces an existing block in place and is idempotent", () => {
  const readme = `# Tool\n\n${START}\nstale\n${END}\n\n## After\n`;
  const block = render(registry, { variant: "github", current: "ferralk" });
  const first = upsert(readme, block);
  assert.ok(first.changed);
  assert.ok(first.content.includes("## After"));
  assert.ok(!first.content.includes("stale"));
  assert.equal(upsert(first.content, block).changed, false);
});

test("findBlock reports no block when the markers are missing", () => {
  assert.equal(findBlock("# Tool\n"), null);
});

test("a change to src/family.ts is picked up without rebuilding dist", async () => {
  // The regression this guards: preferring the build output meant `--write`
  // could emit and `--check` could bless a registry one edit out of date.
  const root = await mkdtemp(join(tmpdir(), "family-registry-"));
  try {
    await mkdir(join(root, "src"), { recursive: true });
    await mkdir(join(root, "dist"), { recursive: true });
    await mkdir(join(root, "lib"), { recursive: true });
    await writeFile(
      join(root, "src", "family.ts"),
      [
        'export const FAMILY_SITE = "https://ferramenta.dev";',
        "export type Tool = { name: string };",
        'export const family: Tool[] = [{ name: "fresh-from-source" }];',
        "export function familyGroups() {",
        "  return { pipeline: family, language: [], workbench: [] };",
        "}",
        "",
      ].join("\n"),
    );
    await writeFile(
      join(root, "dist", "family.js"),
      [
        'export const FAMILY_SITE = "https://ferramenta.dev";',
        'export const family = [{ name: "stale-build-output" }];',
        "export function familyGroups() {",
        "  return { pipeline: family, language: [], workbench: [] };",
        "}",
        "",
      ].join("\n"),
    );
    const loaded = await loadRegistry(pathToFileURL(join(root, "lib", "family-readme.mjs")).href);
    assert.deepEqual(
      loaded.family.map((tool) => tool.name),
      ["fresh-from-source"],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("the build output is the fallback when the source cannot be loaded", async () => {
  const root = await mkdtemp(join(tmpdir(), "family-registry-"));
  try {
    await mkdir(join(root, "dist"), { recursive: true });
    await mkdir(join(root, "lib"), { recursive: true });
    await writeFile(
      join(root, "dist", "family.js"),
      [
        'export const FAMILY_SITE = "https://ferramenta.dev";',
        'export const family = [{ name: "from-build-output" }];',
        "export function familyGroups() {",
        "  return { pipeline: family, language: [], workbench: [] };",
        "}",
        "",
      ].join("\n"),
    );
    const loaded = await loadRegistry(pathToFileURL(join(root, "lib", "family-readme.mjs")).href);
    assert.deepEqual(
      loaded.family.map((tool) => tool.name),
      ["from-build-output"],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("the registry loads when the package sits under node_modules", async () => {
  // The regression this guards: Node refuses to strip types from a file under
  // `node_modules`, and that is where every consumer outside this repository
  // installs the package — so the generator has to strip the types itself.
  const root = await mkdtemp(join(tmpdir(), "family-registry-"));
  const installed = join(root, "node_modules", "ferramenta-family");
  try {
    await mkdir(join(installed, "src"), { recursive: true });
    await mkdir(join(installed, "lib"), { recursive: true });
    await writeFile(
      join(installed, "src", "family.ts"),
      [
        'export const FAMILY_SITE = "https://ferramenta.dev";',
        "export type Tool = { name: string };",
        'export const family: Tool[] = [{ name: "installed-from-source" }];',
        "export function familyGroups(): Record<string, Tool[]> {",
        "  return { pipeline: family, language: [], workbench: [] };",
        "}",
        "",
      ].join("\n"),
    );
    const loaded = await loadRegistry(
      pathToFileURL(join(installed, "lib", "family-readme.mjs")).href,
    );
    assert.deepEqual(
      loaded.family.map((tool) => tool.name),
      ["installed-from-source"],
    );
    assert.deepEqual(Object.keys(loaded.familyGroups()), ["pipeline", "language", "workbench"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("the registry source stays import-free so it loads through a data: URL", async () => {
  // A `data:` module has no base URL, so anything that resolves another module
  // — a side-effect import, a re-export, `import()`, `require()` — breaks
  // exactly the node_modules case the test above covers.
  const source = await readFile(new URL("../src/family.ts", import.meta.url), "utf8");
  const forbidden = [
    ["a static import", /^[ \t]*import[\s"'({*]/mu],
    ["a module specifier", /\bfrom[ \t]+["']/u],
    ["a dynamic import", /\bimport[ \t]*\(/u],
    ["a require call", /\brequire[ \t]*\(/u],
  ];
  const found = forbidden.filter(([, pattern]) => pattern.test(source)).map(([label]) => label);
  assert.deepEqual(found, [], "src/family.ts must not resolve another module");
});
