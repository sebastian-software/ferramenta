import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

// Exercise the actual producer in an isolated repository, including its cleanup boundary.
test("unexpected URL-like names never cause deletion outside generated output", async () => {
  const root = await mkdtemp(join(tmpdir(), "family-theme-files-"));
  try {
    await Promise.all([
      mkdir(join(root, "scripts"), { recursive: true }),
      mkdir(join(root, "packages/family/src"), { recursive: true }),
    ]);
    await cp(
      new URL("../../../scripts/native-theme.mjs", import.meta.url),
      join(root, "scripts/native-theme.mjs"),
    );
    await cp(new URL("../lib", import.meta.url), join(root, "packages/family/lib"), {
      recursive: true,
    });
    await cp(
      new URL("../src/family.ts", import.meta.url),
      join(root, "packages/family/src/family.ts"),
    );
    await writeFile(join(root, "package.json"), '{"type":"module"}');
    await writeFile(join(root, "packages/family/keep.txt"), "owned source");
    await mkdir(join(root, "packages/family/markdown/%2e%2e"), { recursive: true });
    const result = spawnSync(process.execPath, ["scripts/native-theme.mjs", "--write"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unexpected generated theme/u);
    assert.equal(await readFile(join(root, "packages/family/keep.txt"), "utf8"), "owned source");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
