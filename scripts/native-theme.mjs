/* eslint-disable security/detect-non-literal-fs-filename -- Paths use validated catalog IDs under the generated theme directory. */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";

import { loadRegistry } from "../packages/family/lib/family-readme.mjs";
import { nativeFrame } from "../packages/family/lib/native-theme.mjs";

const mode = process.argv[2];
if (!["--write", "--check"].includes(mode) || process.argv.length !== 3) {
  throw new Error("Usage: node scripts/native-theme.mjs --write|--check");
}
const registry = await loadRegistry();
const root = new URL("../packages/family/markdown/", import.meta.url);
const expected = new Set();
for (const tool of registry.family) {
  if (!/^[a-z][a-z0-9-]*$/u.test(tool.name) || expected.has(tool.name)) {
    throw new Error(`Invalid or duplicate theme ID: ${tool.name}`);
  }
  expected.add(tool.name);
}
const frames = [...expected].map((name) => [name, nativeFrame(registry, name)]);
if (mode === "--write") await mkdir(root, { recursive: true });
for (const [name, frame] of frames) {
  const directory = new URL(`${name}/`, root);
  if (mode === "--write") await mkdir(directory, { recursive: true });
  for (const [part, content] of Object.entries(frame)) {
    const file = new URL(`${part}.md`, directory);
    if (mode === "--write") await writeFile(file, content);
    else if ((await readFile(file, "utf8")) !== content) {
      throw new Error(`Stale theme: ${name}/${part}.md. Run pnpm theme:write.`);
    }
  }
}
for (const name of await readdir(root)) {
  if (expected.has(name)) continue;
  if (mode === "--check") throw new Error(`Unexpected generated theme: ${name}`);
  await rm(new URL(name, root), { recursive: true, force: true });
}
console.log(`${frames.length} native themes ${mode === "--write" ? "written" : "verified"}.`);
