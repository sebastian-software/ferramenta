import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

import { createNativeLoader, linuxLibc, nativeTarget } from "../runtime/native.mjs";
import {
  archiveManifest,
  buildArguments,
  generatePackages,
  generateRuntime,
  NATIVE_TARGETS,
  nativeMatrix,
  nativePackages,
  runBuild,
  targetForTriple,
} from "../src/index.mjs";

test("packed metadata is read from an absolute archive path, including drive prefixes", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "native packed metadata "));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = path.join(root, "package");
  await mkdir(directory);
  const manifest = { name: "@example/core", version: "1.0.0" };
  const filename = path.join(root, "package.tgz");
  const pack = () =>
    execFileSync("tar", ["-czf", "package.tgz", "package/package.json"], { cwd: root });
  await writeFile(path.join(directory, "package.json"), JSON.stringify(manifest));
  pack();
  assert.deepEqual(archiveManifest(filename), manifest);
  await writeFile(
    path.join(directory, "package.json"),
    JSON.stringify({ ...manifest, optionalDependencies: { "@example/native": "workspace:*" } }),
  );
  pack();
  assert.throws(() => archiveManifest(filename), /Unresolved dependency protocol/);
});

test("all supported targets have one unambiguous Rust, npm, and runtime identity", () => {
  assert.equal(NATIVE_TARGETS.length, 7);
  const packages = nativePackages({
    packagePattern: "@example/{target}",
    binaryPattern: "example.node",
  });
  for (const target of packages) {
    assert.equal(targetForTriple(target.triple).id, target.id);
    assert.equal(
      nativeTarget(target.os, target.cpu, target.libc === "musl" ? "musl" : "gnu"),
      target.id,
    );
    assert.equal(target.packageName, `@example/${target.id}`);
  }
  assert.throws(() => targetForTriple("bogus"), /Unsupported/);
  assert.throws(() => nativeTarget("darwin", "x64"), /Unsupported/);
  assert.equal(
    linuxLibc({ header: { glibcVersionRuntime: "2.39" } }, () => "musl"),
    "gnu",
  );
  assert.equal(
    linuxLibc({ header: {} }, () => ""),
    "musl",
  );
  assert.equal(
    linuxLibc(undefined, () => "musl libc"),
    "musl",
  );
  assert.equal(
    linuxLibc(undefined, () => ""),
    "gnu",
  );
});

test("builds are locked and use the correct libc cross toolchain", () => {
  const config = { manifestPath: "Cargo.toml", outputDir: "out", features: "example" };
  assert.ok(
    buildArguments({ ...config, target: "aarch64-unknown-linux-musl" }).includes("--cross-compile"),
  );
  assert.ok(
    buildArguments({ ...config, target: "x86_64-unknown-linux-gnu" }).includes("--use-napi-cross"),
  );
  assert.deepEqual(buildArguments({ ...config, noDefaultFeatures: true }).slice(-5), [
    "--no-default-features",
    "--features",
    "example",
    "--",
    "--locked",
  ]);
  assert.throws(() => runBuild(config, { spawn: () => ({ status: 1 }) }), /exit 1/);
});

test("generated packages and runtime are checked from the consumer output", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "native-generation-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const config = {
    name: "example",
    packageDir: root,
    platformDir: path.join(root, "platforms"),
    repositoryPlatformDir: "node/platforms",
    packagePattern: "@example/{target}",
    binaryPattern: "example.node",
    licenses: ["LICENSE"],
  };
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({
      name: "@example/core",
      version: "1.0.0",
      engines: { node: ">=22.13.0" },
      license: "MIT",
      repository: { type: "git", url: "https://example.com" },
      optionalDependencies: Object.fromEntries(
        nativePackages(config).map((target) => [target.packageName, "1.0.0"]),
      ),
    }),
  );
  await generatePackages(config);
  await generateRuntime(config);
  await generatePackages(config, { check: true });
  await generateRuntime(config, { check: true });
  await writeFile(path.join(root, "native-runtime.mjs"), "stale");
  await assert.rejects(generateRuntime(config, { check: true }), /Regenerate/);
});

test("a missing addon retains lookup causes; a broken present addon cannot silently fall through", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "native-loader-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const parent = pathToFileURL(path.join(root, "index.mjs")).href;
  const load = createNativeLoader(parent, {
    name: "example",
    packagePattern: "@example/{target}",
    binaryPattern: "example.node",
  });
  assert.throws(
    load,
    (error) => error.cause instanceof AggregateError && error.cause.errors.length === 2,
  );
  await writeFile(path.join(root, "example.node"), "not an addon");
  assert.throws(
    load,
    (error) => error.cause?.code === "ERR_DLOPEN_FAILED" && /ERR_DLOPEN_FAILED/.test(error.message),
  );
});

test("the native matrix has exactly the runtime targets", () => {
  assert.deepEqual(
    nativeMatrix().include.map((target) => target.id),
    NATIVE_TARGETS.map((target) => target.id),
  );
});
