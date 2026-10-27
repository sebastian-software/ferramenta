/* eslint-disable max-lines-per-function, max-statements, complexity -- The consumer lifecycle keeps installation, probes and cleanup in one transaction. */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { hostTarget, packPackage, verifyArchive } from "./pack.mjs";
import { archiveManifest } from "./packages.mjs";
import { command } from "./process.mjs";
import { nativePackages } from "./targets.mjs";

export { packPackage } from "./pack.mjs";

export async function withPackedConsumer(
  config,
  verify,
  { target = hostTarget(), archiveDirectory, packageTests = false } = {},
) {
  assert.equal(
    target,
    hostTarget(),
    "A consumer must exercise the requested target on a matching host",
  );
  const temp = await mkdtemp(path.join(tmpdir(), "ferramenta-native-consumer-"));
  try {
    const entry = nativePackages(config).find((entry) => entry.id === target);
    assert.ok(entry, `Unsupported target: ${target}`);
    const manifest = JSON.parse(
      await readFile(path.join(config.packageDir, "package.json"), "utf8"),
    );
    const archive = (name, directory) =>
      archiveDirectory
        ? {
            filename: path.join(
              archiveDirectory,
              `${name.replace(/^@/, "").replaceAll("/", "-")}-${manifest.version}.tgz`,
            ),
            manifest: null,
          }
        : packPackage(directory, temp);
    const main = archive(manifest.name, config.packageDir);
    const sidecar = archive(entry.packageName, path.join(config.platformDir, target));
    main.manifest ??= archiveManifest(main.filename);
    sidecar.manifest ??= archiveManifest(sidecar.filename);
    assert.equal(main.manifest.name, manifest.name);
    assert.equal(main.manifest.version, manifest.version);
    assert.equal(sidecar.manifest.name, entry.packageName);
    assert.equal(sidecar.manifest.version, manifest.version);
    assert.equal(main.manifest.optionalDependencies?.[entry.packageName], manifest.version);
    if (main.files)
      verifyArchive(main, {
        ...config.pack,
        forbidden: [/\.node$/, ...(config.pack?.forbidden ?? [])],
      });
    const consumer = path.join(temp, "consumer");
    await mkdir(consumer);
    await writeFile(
      path.join(consumer, "package.json"),
      JSON.stringify({ private: true, type: "module" }),
    );
    const run = (program, args, options = {}) =>
      command(program, args, {
        cwd: consumer,
        env: {
          ...process.env,
          npm_config_cache: path.join(temp, "cache"),
          npm_config_update_notifier: "false",
        },
        ...options,
      });
    run("npm", [
      "install",
      "--offline",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--omit=optional",
      main.filename,
      sidecar.filename,
    ]);
    const installed = path.join(consumer, "node_modules", ...manifest.name.split("/"));
    const installedFiles = await readdir(installed);
    assert.ok(
      !installedFiles.some((file) => file.endsWith(".node")),
      "The main package must not contain a native addon",
    );
    assert.equal(
      await readFile(path.join(installed, "README.md"), "utf8"),
      await readFile(path.join(config.packageDir, "README.md"), "utf8"),
      "Packed README differs from the package README",
    );
    await verify?.({ consumer, installed, run, main, sidecar, temp });
    if (packageTests) {
      const files = config.consumer?.tests ?? [];
      assert.ok(files.length, "No installed-package tests are configured");
      for (const file of files) {
        await mkdir(path.dirname(path.join(installed, file)), { recursive: true });
        await copyFile(path.join(config.packageDir, file), path.join(installed, file));
      }
      run(process.execPath, ["--test", ...files], { cwd: installed, stdio: "inherit" });
    }
    const probe = path.join(consumer, "smoke.mjs");
    const source = config.consumer?.smoke;
    assert.equal(typeof source, "string", "A native consumer smoke probe is required");
    await writeFile(probe, source);
    run(process.execPath, [probe]);
    await rm(
      path.join(consumer, "node_modules", ...entry.packageName.split("/"), entry.binaryName),
    );
    const failure = spawnSync(process.execPath, [probe], { cwd: consumer, encoding: "utf8" });
    if (failure.error) throw failure.error;
    assert.notEqual(failure.status, 0, "Consumer still loads after removing its only native addon");
    assert.ok(failure.stderr.includes(entry.packageName), failure.stderr);
    console.log(
      `Packed consumer and missing-binary control passed: ${manifest.name}@${manifest.version} (${target})`,
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}

export async function verifyPackedConsumer(config, smokeSource, options) {
  return withPackedConsumer(
    { ...config, consumer: { ...config.consumer, ...(smokeSource ? { smoke: smokeSource } : {}) } },
    config.consumer?.verify,
    options,
  );
}

function checkedProcess(program, args, options) {
  const result = spawnSync(program, args, options);
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${result.stdout ?? ""}\n${result.stderr ?? ""}`);
  return result;
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
