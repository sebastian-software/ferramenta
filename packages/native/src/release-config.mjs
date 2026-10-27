/* eslint-disable max-lines-per-function, max-statements, complexity -- Release metadata validation checks the configured manifests as one coherent version set. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { releaseChannel } from "./publication.mjs";
import { nativePackages } from "./targets.mjs";

export function resolveConfig(config) {
  const workspaceDir = config.workspaceDir ?? path.dirname(config.packageDir);
  return { ...config, workspaceDir, rootDir: config.rootDir ?? path.dirname(workspaceDir) };
}

export function rebaseConfig(config, rootDir) {
  config = resolveConfig(config);
  const rebase = (filename) => path.resolve(rootDir, path.relative(config.rootDir, filename));
  return {
    ...config,
    rootDir,
    workspaceDir: rebase(config.workspaceDir),
    packageDir: rebase(config.packageDir),
    platformDir: rebase(config.platformDir),
    release: {
      ...config.release,
      extraPackages: config.release?.extraPackages?.map((pkg) => ({
        ...pkg,
        path: rebase(pkg.path),
      })),
    },
  };
}

export async function readReleasePackages(config) {
  const main = JSON.parse(await readFile(path.join(config.packageDir, "package.json"), "utf8"));
  const groups = {
    sidecars: [],
    core: [{ name: main.name, version: main.version, path: config.packageDir }],
  };
  for (const target of nativePackages(config)) {
    const directory = path.join(config.platformDir, target.id);
    const manifest = JSON.parse(await readFile(path.join(directory, "package.json"), "utf8"));
    assert.equal(manifest.name, target.packageName);
    assert.equal(manifest.version, main.version);
    assert.equal(
      main.optionalDependencies?.[target.packageName],
      config.workspaceProtocol ? "workspace:*" : main.version,
    );
    groups.sidecars.push({ name: manifest.name, version: manifest.version, path: directory });
  }
  assert.deepEqual(
    Object.keys(main.optionalDependencies).sort(),
    groups.sidecars.map((pkg) => pkg.name).sort(),
    "The facade must declare exactly the native matrix",
  );
  for (const extra of config.release?.extraPackages ?? []) {
    const manifest = JSON.parse(await readFile(path.join(extra.path, "package.json"), "utf8"));
    assert.equal(manifest.name, extra.name);
    assert.equal(manifest.version, main.version);
    assert.equal(manifest.dependencies?.[main.name], main.version);
    groups[extra.phase] = [{ name: manifest.name, version: manifest.version, path: extra.path }];
  }
  return groups;
}

export async function verifyReleaseMetadata(
  configuration,
  { root, version, tag, binaries = false } = {},
) {
  let config = resolveConfig(configuration);
  if (root) config = rebaseConfig(config, root);
  const groups = await readReleasePackages(config);
  const expected = groups.core[0].version;
  if (version) assert.equal(expected, version, "Package version differs from the verified release");
  if (tag) {
    releaseChannel(expected);
    assert.equal(
      tag,
      `${config.release?.tagPrefix ?? "v"}${expected}`,
      "Release tag does not match package version",
    );
  }
  for (const filename of config.release?.cargoFiles ?? []) {
    const source = await readFile(path.join(config.rootDir, filename), "utf8");
    assert.equal(
      source.match(/^version = "([^"]+)"/m)?.[1],
      expected,
      `${filename}: Rust/npm version mismatch`,
    );
  }
  for (const pin of config.release?.exactCargoDependencies ?? []) {
    const source = await readFile(path.join(config.rootDir, pin.file), "utf8");
    const dependency = pin.name.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // The dependency name is escaped before constructing this repository-owned pattern.

    const requirement = source.match(
      // eslint-disable-next-line security/detect-non-literal-regexp -- The configured dependency name is escaped above.
      new RegExp(`^${dependency} = \\{ version = "([^"]+)"`, "m"),
    )?.[1];
    assert.equal(
      requirement,
      `=${expected}`,
      `${pin.file}: ${pin.name} must pin the matching core version`,
    );
  }
  if (config.release?.manifestKey) {
    const manifest = JSON.parse(
      await readFile(path.join(config.rootDir, ".release-please-manifest.json"), "utf8"),
    );
    assert.equal(
      manifest[config.release.manifestKey],
      expected,
      "Release Please manifest version differs from the tag",
    );
  }
  if (binaries) {
    const { verifyPlatform } = await import("./packages.mjs");
    for (const target of nativePackages(config)) await verifyPlatform(config, target.id);
  }
  await config.release?.verifyMetadata?.(config.rootDir, expected);
  return { version: expected, groups };
}
