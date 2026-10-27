/* eslint-disable max-lines-per-function, max-statements, complexity -- Registry observation keeps retries, channel checks and failure diagnostics together. */
import assert from "node:assert/strict";

// First releases have taken more than ten minutes to propagate. Packages are
// observed concurrently; a failed publishing job gets one diagnostic attempt.
export const MAX_ATTEMPTS = 80;
export const RETRY_DELAY_MS = 15_000;
export const REQUEST_TIMEOUT_MS = 10_000;

export function releaseChannel(version) {
  const [core, rc, extra] = version.split("-rc.");
  const number = (value) => /^(?:0|[1-9]\d*)$/.test(value);
  const parts = core.split(".");
  assert.ok(
    extra === undefined &&
      parts.length === 3 &&
      parts.every((part) => number(part)) &&
      (rc === undefined || number(rc)),
    `Release version must be stable or an rc: ${version}`,
  );
  return { tag: rc === undefined ? "latest" : "next", prerelease: rc !== undefined };
}

export function registryPackageUrl(packageName) {
  return `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
}

export function registryVersionUrl(packageName, version) {
  return `https://registry.npmjs.org/${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`;
}

const sleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export async function verifyNpmPublication({
  packageName,
  version,
  publishResult,
  fetchImpl = fetch,
  sleepImpl = sleep,
  requireProvenance = true,
  checkDistTag = true,
}) {
  const registryUrl = registryVersionUrl(packageName, version);
  // The channel a release publishes to is derived from the version alone, so
  // the same rule proves the dist-tag that installs it afterwards.
  const { tag: distTag } = releaseChannel(version);
  let published = false;
  let lastObservation = "the registry did not return the expected package metadata";

  const maxAttempts = publishResult === "success" ? MAX_ATTEMPTS : 1;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const observation = await observePublication({
      registryUrl,
      packageName,
      version,
      distTag,
      fetchImpl,
      requireProvenance,
      checkDistTag,
    });
    if (observation.published) {
      published = true;
      console.log(
        `npm registry confirmed ${packageName}@${version} as ${distTag} on attempt ${attempt}`,
      );
      break;
    }
    lastObservation = observation.message;

    console.log(
      `npm release verification for ${packageName}@${version}, attempt ${attempt}/${maxAttempts}: ${lastObservation}`,
    );
    if (attempt < maxAttempts) {
      await sleepImpl(RETRY_DELAY_MS);
    }
  }

  const failures = [];
  if (publishResult !== "success") {
    failures.push(`publish-npm concluded ${publishResult}`);
  }
  if (!published) {
    failures.push(
      `expected ${packageName}@${version} at ${registryUrl} with dist-tag ${distTag}; ${lastObservation}`,
    );
  }
  if (failures.length > 0) {
    throw new Error(`npm release verification failed: ${failures.join("; ")}`);
  }
}

async function observePublication({
  registryUrl,
  packageName,
  version,
  distTag,
  fetchImpl,
  requireProvenance,
  checkDistTag,
}) {
  const versionObservation = await observeVersion({
    registryUrl,
    packageName,
    version,
    fetchImpl,
    requireProvenance,
  });
  if (!versionObservation.published) {
    return versionObservation;
  }
  if (!checkDistTag) return versionObservation;
  return observeDistTag({ packageName, version, distTag, fetchImpl });
}

async function observeVersion({ registryUrl, packageName, version, fetchImpl, requireProvenance }) {
  try {
    const response = await fetchImpl(registryUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      return { published: false, message: `registry returned HTTP ${response.status}` };
    }
    const metadata = await response.json();
    if (metadata.name === packageName && metadata.version === version) {
      if (requireProvenance && !metadata.dist?.attestations?.provenance)
        return { published: false, message: "registry metadata has no npm provenance attestation" };
      return { published: true, message: "" };
    }
    return {
      published: false,
      message: `registry returned ${metadata.name ?? "unknown"}@${metadata.version ?? "unknown"}`,
    };
  } catch (error) {
    return { published: false, message: `registry request failed: ${error.message}` };
  }
}

async function observeDistTag({ packageName, version, distTag, fetchImpl }) {
  const packageUrl = registryPackageUrl(packageName);
  try {
    const response = await fetchImpl(packageUrl, {
      cache: "no-store",
      // The abbreviated document carries dist-tags without every version's manifest.
      headers: { accept: "application/vnd.npm.install-v1+json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      return {
        published: false,
        message: `registry returned HTTP ${response.status} for the dist-tags of ${packageName}`,
      };
    }
    const metadata = await response.json();
    const tagged = metadata["dist-tags"]?.[distTag];
    if (tagged === version) {
      return { published: true, message: "" };
    }
    return {
      published: false,
      message: `registry lists ${packageName}@${distTag} as ${tagged ?? "unset"}`,
    };
  } catch (error) {
    return { published: false, message: `registry dist-tag request failed: ${error.message}` };
  }
}

export { runPublicNpmInstall, withPublicConsumer } from "./npm-install.mjs";
