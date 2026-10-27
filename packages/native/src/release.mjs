/* eslint-disable max-lines-per-function, complexity -- Publication preserves sidecar ordering and the bounded historical recovery policy. */
import assert from "node:assert/strict";
import path from "node:path";

import { assertSource } from "./artifacts.mjs";
import { publishWithNpm } from "./consumer.mjs";
import { packPackage, releaseArchives } from "./pack.mjs";
import { command } from "./process.mjs";
import { releaseChannel, verifyNpmPublication, withPublicConsumer } from "./publication.mjs";
import { createNpmPublisher } from "./publish.mjs";
import { planNpmPublications } from "./registry.mjs";
import {
  readReleasePackages,
  rebaseConfig,
  resolveConfig,
  verifyReleaseMetadata,
} from "./release-config.mjs";

export function createNativeRelease(configuration) {
  const config = resolveConfig(configuration);
  const publisher = createNpmPublisher(config.release);
  return {
    ...publisher,
    readReleasePackages: (root = config.workspaceDir) =>
      readReleasePackages(rebaseConfig(config, path.dirname(root))),
    publish: (options) => publishRelease(config, publisher, options),
    verify: (options) => verifyRelease(config, options),
  };
}

export async function packExtraPackages(config, directory) {
  for (const pkg of config.release?.extraPackages ?? []) packPackage(pkg.path, directory);
}

export {
  readReleasePackages,
  rebaseConfig,
  resolveConfig,
  verifyReleaseMetadata,
} from "./release-config.mjs";

async function publishRelease(
  config,
  publisher,
  {
    phase = "product",
    sourceSha,
    releaseTag,
    tag,
    recovery = false,
    workflowSha = process.env.GITHUB_SHA,
    directory,
  } = {},
) {
  assertSource(config.rootDir, sourceSha);
  assert.match(workflowSha ?? "", /^[0-9a-f]{40}$/, "Workflow source must be a full commit SHA");

  const { version, groups } = await verifyReleaseMetadata(config, { tag: releaseTag });
  assert.equal(
    releaseTag,
    `${config.release?.tagPrefix ?? "v"}${version}`,
    "Release tag does not match package version",
  );
  assert.equal(
    tag ?? releaseChannel(version).tag,
    releaseChannel(version).tag,
    "Requested dist-tag differs from the release channel",
  );
  const packages = directory
    ? await releaseArchives(config, directory)
    : phase === "product"
      ? Object.values(groups).flat()
      : groups[phase];
  assert.ok(packages?.length, `Unknown release phase: ${phase}`);
  if (sourceSha !== workflowSha) {
    // Older Ferromark releases were recovered from main before source-pinned
    // npm provenance existed. Keep that reviewed, read-only identity check
    // bounded to those versions; new releases use the strict publisher.
    assert.ok(
      legacyRecoveryAllowed(config, {
        version,
        recovery,
        directory,
        sourceSha,
        workflowSha,
        eventRef: process.env.GITHUB_REF,
      }),
      "Dispatch recovery from the exact release tag ref so npm provenance identifies its source",
    );
    const plan = await planNpmPublications({
      packageNames: packages.map((pkg) => pkg.name),
      version,
      archiveArguments: packages.map((pkg) => pkg.filename),
    });
    for (const filename of plan.publishArguments)
      command(
        "npm",
        [
          "publish",
          filename,
          "--access",
          "public",
          "--provenance",
          "--tag",
          releaseChannel(version).tag,
        ],
        { cwd: config.workspaceDir, stdio: "inherit" },
      );
    return;
  }

  await publisher.publishPhase({
    packages,
    phase,
    sourceSha,
    releaseTag,
    tag: releaseChannel(version).tag,
    recovery,
    publishImpl: directory
      ? async (pkg, channel) =>
          command(
            "npm",
            ["publish", pkg.filename, "--access", "public", "--provenance", "--tag", channel],
            { cwd: config.workspaceDir, stdio: "inherit" },
          )
      : publishWithNpm,
    promoteImpl: async (pkg, channel) =>
      command("npm", ["dist-tag", "add", `${pkg.name}@${pkg.version}`, channel], {
        cwd: config.workspaceDir,
        stdio: "inherit",
      }),
  });
}
async function verifyRelease(
  config,
  {
    publishResult = process.env.NPM_PUBLISH_RESULT ?? "unknown",
    requireProvenance = true,
    publicInstall = true,
  } = {},
) {
  const groups = await readReleasePackages(config);
  const sourceSha = command("git", ["rev-parse", "HEAD"], { cwd: config.rootDir }).stdout.trim();
  const version = groups.core[0].version;
  const legacy = legacyRecoveryAllowed(config, {
    version,
    recovery: process.env.GITHUB_EVENT_NAME === "workflow_dispatch",
    directory: true,
    sourceSha,
    workflowSha: process.env.GITHUB_SHA,
    eventRef: process.env.GITHUB_REF,
  });
  const results = await Promise.allSettled(
    Object.values(groups)
      .flat()
      .map((pkg) =>
        verifyNpmPublication({
          packageName: pkg.name,
          version: pkg.version,
          publishResult,
          requireProvenance: requireProvenance && !legacy,
        }),
      ),
  );
  const failures = results
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason);
  if (failures.length)
    throw new AggregateError(failures, failures.map((error) => error.message).join("\n"));
  if (!legacy) {
    const publisher = createNpmPublisher(config.release);
    for (const pkg of Object.values(groups).flat()) {
      assert.equal(
        await publisher.lookupPackage({
          ...pkg,
          sourceSha,
          releaseTag: `${config.release?.tagPrefix ?? "v"}${version}`,
          recovery: true,
        }),
        "existing",
        "Public npm provenance must match the release source",
      );
    }
  }
  if (publicInstall) {
    for (const pkg of [
      ...groups.core,
      ...Object.entries(groups)
        .filter(([phase]) => !["core", "sidecars"].includes(phase))
        .flatMap(([, packages]) => packages),
    ]) {
      await withPublicConsumer({ packageName: pkg.name, version: pkg.version }, async (context) => {
        if (pkg.name === groups.core[0].name && config.consumer?.smoke) {
          const filename = path.join(context.directory, "smoke.mjs");
          const { writeFile } = await import("node:fs/promises");
          await writeFile(filename, config.consumer.smoke);
          context.run(process.execPath, [filename]);
        }
        await config.release?.verifyPublic?.(pkg, context);
      });
    }
  }
}

export function isLegacyReleaseVersion(config, version) {
  const cutoff = config.release?.legacyRecoveryThrough;
  if (!cutoff) return false;
  const candidate = version.split("-")[0].split(".").map(Number);
  const maximum = cutoff.split(".").map(Number);
  for (const [index, value] of candidate.entries()) {
    if (value !== maximum[index]) return value < maximum[index];
  }
  return true;
}

export function legacyRecoveryAllowed(
  config,
  { version, recovery, directory, sourceSha, workflowSha, eventRef },
) {
  return Boolean(
    recovery &&
    directory &&
    sourceSha !== workflowSha &&
    eventRef === "refs/heads/main" &&
    isLegacyReleaseVersion(config, version),
  );
}
