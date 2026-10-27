import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { detectLinuxLibc, nativeTarget } from "../runtime/native.mjs";
import { archiveManifest } from "./packages.mjs";
import { nativePackages } from "./targets.mjs";

function checkedProcess(command, args, options) {
  const result = spawnSync(command, args, options);
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${result.stdout ?? ""}\n${result.stderr ?? ""}`);
  return result;
}

export function packPackage(directory, destination) {
  const result = checkedProcess(
    process.platform === "win32" ? "pnpm.cmd" : "pnpm",
    ["pack", "--json", "--pack-destination", destination],
    {
      cwd: directory,
      shell: process.platform === "win32",
      encoding: "utf8",
    },
  );
  const output = JSON.parse(result.stdout);
  const packed = Array.isArray(output) ? output[0] : output;
  const filename = path.resolve(destination, path.basename(packed.filename));
  return { filename, manifest: archiveManifest(filename) };
}

async function installConsumer(temp, archives) {
  const directory = path.join(temp, "consumer");
  await mkdir(directory);
  await writeFile(
    path.join(directory, "package.json"),
    JSON.stringify({ private: true, type: "module" }),
  );
  checkedProcess(
    process.platform === "win32" ? "npm.cmd" : "npm",
    [
      "install",
      "--offline",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--omit=optional",
      ...archives,
    ],
    {
      cwd: directory,
      shell: process.platform === "win32",
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: path.join(temp, "cache") },
    },
  );
  return directory;
}

async function probeConsumer(directory, metadata, source) {
  const { target, main } = metadata;
  const installed = path.join(directory, "node_modules", ...main.name.split("/"));
  const installedFiles = await readdir(installed);
  assert.ok(
    !installedFiles.some((file) => file.endsWith(".node")),
    "The main package must not contain a native addon",
  );
  const probe = path.join(directory, "smoke.mjs");
  await writeFile(probe, source);
  checkedProcess(process.execPath, [probe], { cwd: directory, encoding: "utf8" });
  await rm(
    path.join(directory, "node_modules", ...target.packageName.split("/"), target.binaryName),
  );
  const failure = spawnSync(process.execPath, [probe], { cwd: directory, encoding: "utf8" });
  if (failure.error) throw failure.error;
  assert.notEqual(failure.status, 0, "Consumer still loads after removing its only native addon");
  assert.ok(failure.stderr.includes(target.packageName), failure.stderr);
}

export async function verifyPackedConsumer(config, smokeSource) {
  const temp = await mkdtemp(path.join(tmpdir(), "ferramenta-native-consumer-"));
  try {
    const id = nativeTarget(process.platform, process.arch, detectLinuxLibc());
    const target = nativePackages(config).find((entry) => entry.id === id);
    const main = packPackage(config.packageDir, temp);
    const sidecar = packPackage(path.join(config.platformDir, id), temp);
    assert.equal(sidecar.manifest.name, target.packageName);
    assert.equal(sidecar.manifest.version, main.manifest.version);
    assert.equal(main.manifest.optionalDependencies[target.packageName], main.manifest.version);
    const consumer = await installConsumer(temp, [main.filename, sidecar.filename]);
    await probeConsumer(consumer, { target, main: main.manifest }, smokeSource);
    console.log(
      `Packed consumer and missing-binary control passed: ${main.manifest.name}@${main.manifest.version} (${id})`,
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}

function runCommand(command, args, cwd) {
  checkedProcess(command, args, { cwd, stdio: "inherit", encoding: "utf8" });
}

function inspectPack(pkg, temp, dependencies) {
  const result = dependencies.spawnImpl(
    "pnpm",
    ["--dir", pkg.path, "pack", "--pack-destination", temp, "--json"],
    { cwd: pkg.path, encoding: "utf8" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`pnpm pack failed for ${pkg.name}: ${result.stderr}`);
  const pack = JSON.parse(result.stdout);
  if (pack.name !== pkg.name || pack.version !== pkg.version)
    throw new Error(`pnpm packed the wrong package for ${pkg.name}@${pkg.version}`);
  if (
    typeof pack.filename !== "string" ||
    !path.resolve(pack.filename).startsWith(`${temp}${path.sep}`)
  )
    throw new Error("pnpm did not return a tarball in the temporary directory");
  const manifest = dependencies.inspectPackImpl(pack.filename);
  if (manifest.name !== pkg.name || manifest.version !== pkg.version)
    throw new Error(`packed tarball identity differs from ${pkg.name}@${pkg.version}`);
  if (/\b(?:catalog|workspace):/.test(JSON.stringify(manifest)))
    throw new Error(`packed ${pkg.name}@${pkg.version} still has workspace dependency specifiers`);
  return pack.filename;
}

export async function publishWithNpm(pkg, tag, options = {}) {
  const dependencies = {
    runImpl: runCommand,
    spawnImpl: spawnSync,
    inspectPackImpl: archiveManifest,
    ...options,
  };
  const temp = await mkdtemp(path.join(tmpdir(), "ferramenta-npm-pack-"));
  try {
    const filename = inspectPack(pkg, temp, dependencies);
    dependencies.runImpl(
      "npm",
      ["publish", filename, "--access", "public", "--provenance", "--tag", tag],
      pkg.path,
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}
