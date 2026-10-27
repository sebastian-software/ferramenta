/* eslint-disable max-lines-per-function, max-statements -- Each test keeps its complete release fixture and failure sequence together. */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { restoreNativeArtifacts, stageNativeArtifact } from "../src/artifacts.mjs";
import { packPackage, verifyArchive } from "../src/pack.mjs";
import { verifyNpmPublication } from "../src/publication.mjs";
import { verifyGitHubRelease } from "../src/release-source.mjs";
import {
  createNativeRelease,
  legacyRecoveryAllowed,
  readReleasePackages,
  verifyReleaseMetadata,
} from "../src/release.mjs";
import { nativePackages } from "../src/targets.mjs";

async function fixture(t) {
  const rootDir = await mkdtemp(path.join(tmpdir(), "native release with spaces "));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  const config = {
    name: "example",
    rootDir,
    workspaceDir: path.join(rootDir, "node"),
    packageDir: path.join(rootDir, "node/core"),
    platformDir: path.join(rootDir, "node/platforms"),
    packagePattern: "@example/{target}",
    binaryPattern: "example.node",
    licenses: ["LICENSE"],
    release: {
      repository: "https://github.com/example/project",
      tagPrefix: "v",
      cargoFiles: ["Cargo.toml"],
    },
  };
  await mkdir(config.packageDir, { recursive: true });
  await writeFile(path.join(rootDir, "Cargo.toml"), '[package]\nversion = "1.2.3"\n');
  await writeFile(path.join(config.packageDir, "LICENSE"), "license fixture");
  await writeFile(path.join(config.packageDir, "README.md"), "package fixture");
  await writeFile(
    path.join(config.packageDir, "package.json"),
    JSON.stringify({
      name: "@example/core",
      version: "1.2.3",
      private: false,
      packageManager: "pnpm@11.10.0",
      files: ["README.md", "LICENSE"],
      optionalDependencies: Object.fromEntries(
        nativePackages(config).map((target) => [target.packageName, "1.2.3"]),
      ),
    }),
  );
  for (const target of nativePackages(config)) {
    const directory = path.join(config.platformDir, target.id);
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, "package.json"),
      JSON.stringify({ name: target.packageName, version: "1.2.3" }),
    );
    await writeFile(path.join(directory, target.binaryName), `binary fixture ${target.id}`);
  }
  const git = (args) => execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();
  git(["init", "--initial-branch=main"]);
  git([
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "--allow-empty",
    "-m",
    "fixture",
  ]);
  return { config, sourceSha: git(["rev-parse", "HEAD"]), git };
}

test("native artifacts reject foreign sources and tampering before promoting any binary", async (t) => {
  const { config, sourceSha } = await fixture(t);
  const directory = path.join(config.rootDir, "artifacts");
  for (const target of nativePackages(config))
    await stageNativeArtifact(config, { id: target.id, sourceSha, directory });
  const first = nativePackages(config)[0];
  const binary = path.join(directory, `native-${first.id}`, first.binaryName);
  const original = await readFile(path.join(config.platformDir, first.id, first.binaryName));
  await writeFile(binary, "tampered bytes");
  await assert.rejects(
    restoreNativeArtifacts(config, { sourceSha, directory }),
    /source or digest mismatch/,
  );
  assert.deepEqual(
    await readFile(path.join(config.platformDir, first.id, first.binaryName)),
    original,
  );
  await writeFile(binary, original);
  const receipt = path.join(directory, `native-${first.id}`, "source.json");
  const metadata = JSON.parse(await readFile(receipt, "utf8"));
  await writeFile(receipt, JSON.stringify({ ...metadata, sourceSha: "f".repeat(40) }));
  await assert.rejects(
    restoreNativeArtifacts(config, { sourceSha, directory }),
    /source or digest mismatch/,
  );
  await writeFile(receipt, JSON.stringify(metadata));
  await restoreNativeArtifacts(config, { sourceSha, directory });
  await assert.rejects(
    stageNativeArtifact(config, { id: first.id, sourceSha: "e".repeat(40), directory }),
    /checkout differs/,
  );
  await rm(path.join(directory, `native-${first.id}`), { recursive: true });
  await assert.rejects(restoreNativeArtifacts(config, { sourceSha, directory }), /exactly match/);
});

test("one release version covers the facade, native matrix and configured Rust manifests", async (t) => {
  const { config } = await fixture(t);
  const metadata = await verifyReleaseMetadata(config, { tag: "v1.2.3" });
  assert.equal(metadata.version, "1.2.3");
  await assert.rejects(verifyReleaseMetadata(config, { tag: "v1.2.4" }), /does not match/);
  const first = nativePackages(config)[0];
  await writeFile(
    path.join(config.platformDir, first.id, "package.json"),
    JSON.stringify({ name: first.packageName, version: "1.2.2" }),
  );
  await assert.rejects(readReleasePackages(config));
});

test("packing inspects the actual archive, including a path with spaces and content budgets", async (t) => {
  const { config } = await fixture(t);
  const output = path.join(config.rootDir, "pack output");
  await mkdir(output);
  const archive = packPackage(config.packageDir, output);
  assert.equal(archive.manifest.name, "@example/core");
  assert.ok(archive.unpackedSize > 0);
  verifyArchive(archive, { required: ["package.json", "LICENSE", "README.md"] });
  assert.throws(() => verifyArchive(archive, { required: ["missing"] }), /missing/);
  assert.throws(() => verifyArchive(archive, { maxUnpackedSize: 1 }), /budget/);
  assert.throws(() => verifyArchive(archive, { forbidden: [/LICENSE/] }), /forbidden/);
  const files = await readdir(output);
  assert.equal(files.length, 1);
});

test("a release must be published on GitHub in the channel its tag declares", () => {
  verifyGitHubRelease(
    "ferrigura-v1.2.3-rc.1",
    { tag_name: "ferrigura-v1.2.3-rc.1", draft: false, prerelease: true },
    "ferrigura-v",
  );
  assert.throws(
    () => verifyGitHubRelease("v1.2.3", { tag_name: "v1.2.3", draft: true, prerelease: false }),
    /draft/,
  );
  assert.throws(
    () =>
      verifyGitHubRelease("v1.2.3-rc.1", {
        tag_name: "v1.2.3-rc.1",
        draft: false,
        prerelease: false,
      }),
    /status/,
  );
});

test("a failed publishing job reports missing provenance once without a propagation wait", async () => {
  let requests = 0;
  await assert.rejects(
    verifyNpmPublication({
      packageName: "@example/core",
      version: "1.2.3",
      publishResult: "failure",
      async fetchImpl() {
        requests++;
        return { ok: true, json: async () => ({ name: "@example/core", version: "1.2.3" }) };
      },
      async sleepImpl() {
        throw new Error("must not wait");
      },
    }),
    /no npm provenance/,
  );
  assert.equal(requests, 1);
});

test("legacy recovery cannot opt a new release or another dispatch ref out of source provenance", () => {
  const config = { release: { legacyRecoveryThrough: "3.6.0" } };
  const request = {
    version: "3.6.0",
    recovery: true,
    directory: "archives",
    sourceSha: "a".repeat(40),
    workflowSha: "b".repeat(40),
    eventRef: "refs/heads/main",
  };
  assert.equal(legacyRecoveryAllowed(config, request), true);
  for (const change of [
    { version: "3.6.1" },
    { version: "4.0.0" },
    { recovery: false },
    { directory: undefined },
    { eventRef: "refs/heads/other" },
    { sourceSha: request.workflowSha },
  ])
    assert.equal(legacyRecoveryAllowed(config, { ...request, ...change }), false);
});

test("publication requires an explicit release tag and workflow identity before registry access", async (t) => {
  const { config, sourceSha } = await fixture(t);
  const release = createNativeRelease(config);
  await assert.rejects(
    release.publish({ sourceSha, workflowSha: sourceSha }),
    /Release tag does not match/,
  );
  await assert.rejects(
    release.publish({ sourceSha, releaseTag: "v1.2.3", workflowSha: "" }),
    /Workflow source must be a full commit SHA/,
  );
});
