import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { command } from "./process.mjs";
import { nativePackages } from "./targets.mjs";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

export function assertSource(root, sourceSha) {
  assert.match(sourceSha ?? "", /^[0-9a-f]{40}$/, "Release source must be a full commit SHA");
  assert.equal(
    command("git", ["rev-parse", "HEAD"], { cwd: root }).stdout.trim(),
    sourceSha,
    "Native checkout differs from the validated release source",
  );
}

export async function stageNativeArtifact(config, { id, sourceSha, directory }) {
  assertSource(config.rootDir, sourceSha);
  const target = nativePackages(config).find((entry) => entry.id === id);
  assert.ok(target, `Unsupported platform: ${id}`);
  const filename = path.join(config.platformDir, id, target.binaryName);
  const info = await stat(filename);
  assert.ok(info.isFile(), "Native addon is not a file");
  const bytes = await readFile(filename);
  assert.ok(bytes.length, "Native addon is empty");
  const destination = path.join(directory, `native-${id}`);
  await mkdir(destination, { recursive: true });
  assert.deepEqual(await readdir(destination), [], "Native artifact directory must start empty");
  await copyFile(filename, path.join(destination, target.binaryName));
  await writeFile(
    path.join(destination, "source.json"),
    `${JSON.stringify({ schemaVersion: 1, platformId: id, sourceSha, sha256: digest(bytes) })}\n`,
  );
  return destination;
}

// Verify the complete set before the first promotion, keeping that ordering visible.
// eslint-disable-next-line max-statements
export async function restoreNativeArtifacts(config, { sourceSha, directory }) {
  assertSource(config.rootDir, sourceSha);
  const targets = nativePackages(config);
  const received = await readdir(directory);
  assert.deepEqual(
    received.toSorted(),
    targets.map((entry) => `native-${entry.id}`).sort(),
    "Artifacts must exactly match the native matrix",
  );
  // Validate the entire set before promoting even one addon into a package.
  for (const target of targets) {
    const artifact = path.join(directory, `native-${target.id}`);
    const files = await readdir(artifact);
    assert.deepEqual(
      files.toSorted(),
      [target.binaryName, "source.json"].sort(),
      "Unexpected native artifact files",
    );
    const bytes = await readFile(path.join(artifact, target.binaryName));
    assert.ok(bytes.length, "Native addon is empty");
    assert.deepEqual(
      JSON.parse(await readFile(path.join(artifact, "source.json"), "utf8")),
      { schemaVersion: 1, platformId: target.id, sourceSha, sha256: digest(bytes) },
      `Native source or digest mismatch: ${target.id}`,
    );
  }
  for (const target of targets) {
    const destination = path.join(config.platformDir, target.id);
    await mkdir(destination, { recursive: true });
    await copyFile(
      path.join(directory, `native-${target.id}`, target.binaryName),
      path.join(destination, target.binaryName),
    );
    for (const license of config.licenses)
      await copyFile(path.join(config.packageDir, license), path.join(destination, license));
  }
}
