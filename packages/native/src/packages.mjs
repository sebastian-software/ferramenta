import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { nativePackages } from "./targets.mjs";

export async function generatePackages(config, { check = false } = {}) {
  const main = JSON.parse(await readFile(path.join(config.packageDir, "package.json"), "utf8"));
  for (const target of nativePackages(config)) {
    const filename = path.join(config.platformDir, target.id, "package.json");
    const manifest = {
      name: target.packageName,
      version: main.version,
      private: false,
      description: `Native ${target.triple} binary for ${config.name}`,
      license: main.license,
      repository: { ...main.repository, directory: `${config.repositoryPlatformDir}/${target.id}` },
      files: [target.binaryName, ...config.licenses].sort(),
      os: [target.os],
      cpu: [target.cpu],
      ...(target.libc ? { libc: [target.libc] } : {}),
      main: target.binaryName,
      publishConfig: { access: "public", provenance: true },
      engines: main.engines,
    };
    if (check) assert.deepEqual(JSON.parse(await readFile(filename, "utf8")), manifest, filename);
    else {
      await mkdir(path.dirname(filename), { recursive: true });
      await writeFile(filename, `${JSON.stringify(manifest, null, 2)}\n`);
    }
    assert.equal(
      main.optionalDependencies?.[target.packageName],
      config.workspaceProtocol ? "workspace:*" : main.version,
    );
  }
}

export async function generateRuntime(config, { check = false } = {}) {
  const source = await readFile(new URL("../runtime/native.mjs", import.meta.url), "utf8");
  const filename = path.join(config.packageDir, config.runtimeFile ?? "native-runtime.mjs");
  if (check)
    assert.equal(
      await readFile(filename, "utf8"),
      source,
      `Regenerate ${filename} with ferramenta-native`,
    );
  else await writeFile(filename, source);
  const declarations = await readFile(new URL("../runtime/native.d.mts", import.meta.url), "utf8");
  const types = filename.replace(/\.mjs$/, ".d.mts");
  if (check) assert.equal(await readFile(types, "utf8"), declarations);
  else await writeFile(types, declarations);
}

export async function verifyPlatform(config, id) {
  const target = nativePackages(config).find((entry) => entry.id === id);
  assert.ok(target, `Unsupported platform: ${id}`);
  const directory = path.join(config.platformDir, id);
  const main = JSON.parse(await readFile(path.join(config.packageDir, "package.json"), "utf8"));
  const manifest = JSON.parse(await readFile(path.join(directory, "package.json"), "utf8"));
  assert.equal(manifest.name, target.packageName);
  assert.equal(manifest.version, main.version);
  const binary = path.join(directory, target.binaryName);
  const binaryInfo = await stat(binary);
  assert.ok(binaryInfo.size > 0, `Empty addon: ${binary}`);
  for (const filename of config.licenses) await stat(path.join(directory, filename));
  if (target.libc === "glibc" && process.platform === "linux") verifyGlibc(binary);
  return { name: target.packageName, version: main.version, path: directory };
}

export function verifyGlibc(filename) {
  const result = spawnSync("readelf", ["--version-info", filename], { encoding: "utf8" });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr);
  const versions = [...result.stdout.matchAll(/\bGLIBC_(\d+)\.(\d+)/g)];
  assert.ok(versions.length, `No glibc symbol versions found in ${filename}`);
  assert.ok(
    versions.every(
      ([, major, minor]) => Number(major) < 2 || (Number(major) === 2 && Number(minor) <= 17),
    ),
    `${filename} requires glibc newer than 2.17`,
  );
}

export function archiveManifest(filename) {
  // GNU tar treats a Windows drive prefix as a remote host. Keep the archive
  // argument local by selecting its directory separately.
  const result = spawnSync("tar", ["-xOzf", path.basename(filename), "package/package.json"], {
    cwd: path.dirname(filename),
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr);
  const manifest = JSON.parse(result.stdout);
  assert.doesNotMatch(
    JSON.stringify(manifest),
    /\b(?:workspace|catalog):/,
    "Unresolved dependency protocol in packed manifest",
  );
  return manifest;
}

export async function releasePackages(config) {
  const main = JSON.parse(await readFile(path.join(config.packageDir, "package.json"), "utf8"));
  return [
    ...nativePackages(config).map((target) => ({
      name: target.packageName,
      version: main.version,
      path: path.join(config.platformDir, target.id),
    })),
    { name: main.name, version: main.version, path: config.packageDir },
  ];
}

export async function generateReleaseHelpers(workspace, { check = false } = {}) {
  const root = workspace instanceof URL ? fileURLToPath(workspace) : workspace;
  const source = await readFile(new URL("registry.mjs", import.meta.url), "utf8");
  const filename = path.join(root, "scripts/native-registry.mjs");
  if (check)
    assert.equal(
      await readFile(filename, "utf8"),
      source,
      `Regenerate ${filename} with ferramenta-native`,
    );
  else {
    await mkdir(path.dirname(filename), { recursive: true });
    await writeFile(filename, source);
  }
}
