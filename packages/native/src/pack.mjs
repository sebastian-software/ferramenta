/* eslint-disable max-statements, complexity -- Packing validates the complete product and sidecar set before returning archives. */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";

import { detectLinuxLibc, nativeTarget } from "../runtime/native.mjs";
import { archiveManifest, verifyPlatform } from "./packages.mjs";
import { command } from "./process.mjs";
import { releaseChannel } from "./publication.mjs";
import { nativePackages } from "./targets.mjs";

export function hostTarget() {
  return nativeTarget(process.platform, process.arch, detectLinuxLibc());
}

/** pnpm resolves both workspace: and catalog: references before publication. */
export function packPackage(directory, destination) {
  const result = command("pnpm", ["pack", "--json", "--pack-destination", destination], {
    cwd: directory,
  });
  const output = JSON.parse(result.stdout);
  const packed = Array.isArray(output) ? output[0] : output;
  assert.equal(typeof packed.filename, "string", "pnpm pack returned no archive filename");
  const filename = path.resolve(destination, path.basename(packed.filename));
  const manifest = archiveManifest(filename);
  const unpackedSize = archiveUnpackedSize(filename);
  const files = command("tar", ["-tzf", path.basename(filename)], {
    cwd: path.dirname(filename),
  })
    .stdout.trim()
    .split(/\r?\n/)
    .filter((name) => !name.endsWith("/"))
    .map((name) => name.replace(/^package\//, ""));
  return { filename, manifest, files, unpackedSize };
}

export function verifyArchive(
  archive,
  { required = [], allowed, forbidden = [], maxUnpackedSize } = {},
) {
  for (const file of required)
    assert.ok(archive.files.includes(file), `Packed ${archive.manifest.name} is missing ${file}`);
  for (const file of archive.files) {
    if (allowed)
      assert.ok(
        allowed.includes(file),
        `Packed ${archive.manifest.name} contains unexpected ${file}`,
      );
    assert.ok(
      !forbidden.some((pattern) => pattern.test(file)),
      `Packed ${archive.manifest.name} contains forbidden ${file}`,
    );
  }
  if (maxUnpackedSize !== undefined)
    assert.ok(
      archive.unpackedSize < maxUnpackedSize,
      `Packed ${archive.manifest.name} exceeds its ${maxUnpackedSize} byte budget (${archive.unpackedSize})`,
    );
}

export async function packRelease(
  config,
  {
    directory = path.join(config.workspaceDir, "artifacts"),
    allTargets = false,
    target = hostTarget(),
  } = {},
) {
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  const main = packPackage(config.packageDir, directory);
  assert.equal(main.manifest.private, false, "The facade must be publishable");
  verifyArchive(main, {
    ...config.pack,
    required: ["package.json", ...config.licenses, ...(config.pack?.required ?? [])],
    forbidden: [/\.node$/, ...(config.pack?.forbidden ?? [])],
  });
  const platforms = [];
  for (const entry of nativePackages(config).filter((entry) => allTargets || entry.id === target)) {
    await verifyPlatform(config, entry.id);
    const archive = packPackage(path.join(config.platformDir, entry.id), directory);
    assert.equal(archive.manifest.name, entry.packageName);
    assert.equal(archive.manifest.version, main.manifest.version);
    assert.equal(main.manifest.optionalDependencies?.[entry.packageName], main.manifest.version);
    const files = ["package.json", entry.binaryName, ...config.licenses];
    verifyArchive(archive, {
      required: [...files, ...(config.pack?.platformRequired ?? [])],
      allowed: [...files, "README.md"],
    });
    platforms.push(archive);
  }
  assert.ok(platforms.length, `Unsupported target: ${target}`);
  return { main, platforms };
}

/** Revalidate every tarball and resolved dependency before the first registry write. */
export function validateArchives(
  directory,
  facade,
  {
    names = [...Object.keys(facade.optionalDependencies).sort(), facade.name],
    readManifest = archiveManifest,
  } = {},
) {
  const { tag: distTag } = releaseChannel(facade.version);
  assert.equal(facade.private, false, "The facade must be publishable");
  const expected = names.map(
    (name) => `${name.replace(/^@/, "").replaceAll("/", "-")}-${facade.version}.tgz`,
  );
  assert.deepEqual(
    readdirSync(directory)
      .filter((name) => name.endsWith(".tgz"))
      .sort(),
    [...expected].sort(),
    "The archive directory must hold exactly the declared release archives",
  );
  const archives = names.map((name, index) => {
    const filename = path.resolve(directory, expected[index]);
    const manifest = readManifest(filename);
    assert.equal(manifest.name, name, `${name}: archive manifest name`);
    assert.equal(manifest.version, facade.version, `${name}: archive manifest version`);
    assert.equal(manifest.private, false, `${name}: archive manifest must be publishable`);
    if (name === facade.name)
      assert.deepEqual(
        manifest.optionalDependencies,
        Object.fromEntries(
          Object.keys(facade.optionalDependencies).map((sidecar) => [sidecar, facade.version]),
        ),
        "The packed facade must pin every sidecar at the release version",
      );
    return filename;
  });
  return { distTag, archives };
}

export function publishArguments(archives, workingDirectory) {
  return archives.map((archive) => `./${path.relative(workingDirectory, archive)}`);
}

export async function releaseArchives(config, directory) {
  const facade = JSON.parse(await readFile(path.join(config.packageDir, "package.json"), "utf8"));
  const packages = nativePackages(config).map((entry) => ({
    name: entry.packageName,
    path: path.join(config.platformDir, entry.id),
  }));
  packages.push(
    { name: facade.name, path: config.packageDir },
    ...(config.release?.extraPackages ?? []),
  );
  const { archives } = validateArchives(directory, facade, {
    names: packages.map((pkg) => pkg.name),
  });
  return packages.map((pkg, index) => ({
    ...pkg,
    version: facade.version,
    filename: archives[index],
  }));
}

function archiveUnpackedSize(filename) {
  const tar = gunzipSync(readFileSync(filename));
  let unpackedSize = 0;
  for (let offset = 0; offset + 512 <= tar.length && tar[offset] !== 0;) {
    const size = Number.parseInt(
      tar
        .toString("utf8", offset + 124, offset + 136)
        .split("\0", 1)[0]
        .trim(),
      8,
    );
    assert.ok(Number.isFinite(size) && size >= 0, `Unreadable tar header in ${filename}`);
    assert.ok(offset + 512 + size <= tar.length, `Truncated tar member in ${filename}`);
    if (tar[offset + 156] === 0 || tar[offset + 156] === 48) unpackedSize += size;
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return unpackedSize;
}
