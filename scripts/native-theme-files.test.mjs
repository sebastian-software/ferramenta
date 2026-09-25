import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "native-theme-files-"));
  const movedHelper = new URL("lib/native-theme.mjs", import.meta.url);
  const oldHelper = new URL("../packages/family/lib/native-theme.mjs", import.meta.url);
  const helperPath = existsSync(fileURLToPath(movedHelper))
    ? "scripts/lib/native-theme.mjs"
    : "packages/family/lib/native-theme.mjs";
  const helperSource = helperPath.startsWith("scripts/") ? movedHelper : oldHelper;

  await Promise.all([
    mkdir(join(root, "scripts"), { recursive: true }),
    mkdir(join(root, "packages/family/src"), { recursive: true }),
    mkdir(dirname(join(root, helperPath)), { recursive: true }),
  ]);
  await cp(new URL("native-theme.mjs", import.meta.url), join(root, "scripts/native-theme.mjs"));
  await cp(new URL("../packages/family/lib", import.meta.url), join(root, "packages/family/lib"), {
    recursive: true,
  });
  await cp(helperSource, join(root, helperPath));
  await cp(
    new URL("../packages/family/src/family.ts", import.meta.url),
    join(root, "packages/family/src/family.ts"),
  );
  await writeFile(join(root, "package.json"), '{"type":"module"}');
  return root;
}

function run(root, mode) {
  return spawnSync(process.execPath, ["scripts/native-theme.mjs", mode], {
    cwd: root,
    encoding: "utf8",
  });
}

test("theme check skips stray root files and catches leftovers in a tool directory", async () => {
  const root = await fixture();
  try {
    const write = run(root, "--write");
    assert.equal(write.status, 0, write.stderr);

    const markdown = join(root, "packages/family/markdown");
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
