/**
 * The theme writer on a throwaway copy of the package: what it writes, what
 * its check tolerates, and the one boundary it must never cross — deleting
 * anything outside the generated theme directories.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

/** A copy of the package with only what the writer needs: the script, the lib, the registry. */
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "family-theme-files-"));
  await mkdir(join(root, "src"), { recursive: true });
  await cp(new URL("../scripts", import.meta.url), join(root, "scripts"), { recursive: true });
  await cp(new URL("../lib", import.meta.url), join(root, "lib"), { recursive: true });
  await cp(new URL("../src/family.ts", import.meta.url), join(root, "src/family.ts"));
  await writeFile(join(root, "package.json"), '{"type":"module"}');
  return root;
}

function run(root, mode) {
  return spawnSync(process.execPath, ["scripts/native-theme.mjs", mode], {
    cwd: root,
    encoding: "utf8",
  });
}

test("the check skips stray root files and catches leftovers in a member's directory", async () => {
  const root = await fixture();
  try {
    const write = run(root, "--write");
    assert.equal(write.status, 0, write.stderr);

    const markdown = join(root, "markdown");
    await writeFile(join(markdown, ".DS_Store"), "metadata");
    const checkRootFile = run(root, "--check");
    assert.equal(checkRootFile.status, 0, checkRootFile.stderr);

    await writeFile(join(markdown, "ferroni/unexpected.md"), "stale generated output");
    const checkLeftover = run(root, "--check");
    assert.equal(checkLeftover.status, 1);
    assert.match(checkLeftover.stderr, /Unexpected generated theme file: ferroni\/unexpected\.md/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("unexpected URL-like names never cause deletion outside the generated output", async () => {
  const root = await fixture();
  try {
    await writeFile(join(root, "keep.txt"), "owned source");
    await mkdir(join(root, "markdown/%2e%2e"), { recursive: true });
    const result = run(root, "--write");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unexpected generated theme/u);
    assert.equal(await readFile(join(root, "keep.txt"), "utf8"), "owned source");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
