import assert from "node:assert/strict";
import { test } from "node:test";

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

test("--current bolds exactly one tool", () => {
  const block = render(registry, { variant: "github", current: "ferrocat" });
  const bolded = [...block.matchAll(/\*\*\[(?<name>[a-z]+)\]/gu)].map((match) => match[1]);
  assert.deepEqual(bolded, ["ferrocat"]);
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
