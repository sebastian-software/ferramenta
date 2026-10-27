import assert from "node:assert/strict";
import { X509Certificate } from "node:crypto";

const PROVENANCE_TYPE = "https://slsa.dev/provenance/v1";
const REGISTRY = "https://registry.npmjs.org";
const sleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export function attestationUrl(name, version) {
  return `${REGISTRY}/-/npm/v1/attestations/${name.toLowerCase().replace("/", "%2f")}@${encodeURIComponent(version)}`;
}
export function distTagsUrl(name) {
  return `${REGISTRY}/-/package/${name.toLowerCase().replace("/", "%2f")}/dist-tags`;
}
async function fetchJson(url, fetchImpl) {
  const response = await fetchImpl(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}
function registryDigest(integrity) {
  const match = /^sha512-([A-Za-z0-9+/]+={0,2})$/.exec(integrity ?? "");
  if (!match) throw new Error("registry metadata has no SHA-512 tarball integrity");
  const bytes = Buffer.from(match[1], "base64");
  if (bytes.length !== 64 || bytes.toString("base64") !== match[1])
    throw new Error("registry metadata has invalid SHA-512 tarball integrity");
  return bytes.toString("hex");
}
function matchesSource(statement, expected) {
  const build = statement.predicate?.buildDefinition;
  const workflow = build?.externalParameters?.workflow;
  if (workflow?.repository !== expected.repository || workflow.path !== expected.workflow)
    return false;
  if (!["refs/heads/main", `refs/tags/${expected.releaseTag}`].includes(workflow.ref)) return false;
  return build.resolvedDependencies?.some(
    (dependency) =>
      dependency.uri === `git+${expected.repository}@${workflow.ref}` &&
      dependency.digest?.gitCommit === expected.sourceSha,
  );
}
function matchesSubject(statement, expected) {
  const subject = `pkg:npm/${encodeURIComponent(expected.name).replace("%2F", "/")}@${expected.version}`;
  return statement.subject?.some(
    (entry) => entry.name === subject && entry.digest?.sha512 === expected.digest,
  );
}
function matchesAttestation(item, expected) {
  try {
    const bundle = item.bundle;
    const envelope = bundle.dsseEnvelope;
    if (envelope?.payloadType !== "application/vnd.in-toto+json") return false;
    const statement = JSON.parse(Buffer.from(envelope.payload, "base64").toString("utf8"));
    if (statement.predicateType !== PROVENANCE_TYPE || !matchesSource(statement, expected))
      return false;
    if (!matchesSubject(statement, expected)) return false;
    const cert = new X509Certificate(
      Buffer.from(bundle.verificationMaterial.certificate.rawBytes, "base64"),
    );
    const ref = statement.predicate.buildDefinition.externalParameters.workflow.ref;
    return cert.subjectAltName === `URI:${expected.repository}/${expected.workflow}@${ref}`;
  } catch {
    return false;
  }
}
function verifyMetadata(metadata, { name, version }) {
  assert.equal(
    metadata.dist?.attestations?.url,
    attestationUrl(name, version),
    `${name}@${version} has an unexpected provenance endpoint`,
  );
  assert.equal(
    metadata.dist?.attestations?.provenance?.predicateType,
    PROVENANCE_TYPE,
    `${name}@${version} has no expected npm provenance`,
  );
}
function verifyExistingPackage(input, identity) {
  const { name, version, metadata, attestations } = input;
  assert.equal(metadata?.name, name, `registry returned the wrong package for ${name}@${version}`);
  assert.equal(
    metadata?.version,
    version,
    `registry returned the wrong version for ${name}@${version}`,
  );
  const digest = registryDigest(metadata.dist?.integrity);
  verifyMetadata(metadata, { name, version });
  const evidence =
    attestations?.attestations?.filter((item) => item.predicateType === PROVENANCE_TYPE) ?? [];
  assert.ok(
    evidence.some((item) => matchesAttestation(item, { ...input, ...identity, digest })),
    `${name}@${version} provenance does not match the release commit, workflow, and tarball`,
  );
}
async function lookupPackage(options, identity) {
  const { name, version, recovery, fetchImpl = fetch, sleepImpl = sleep } = options;
  const url = `${REGISTRY}/${encodeURIComponent(name)}/${encodeURIComponent(version)}`;
  const attempts = recovery ? 3 : 1;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const metadata = await fetchJson(url, fetchImpl);
    if (metadata) {
      const attestations = await fetchJson(attestationUrl(name, version), fetchImpl);
      if (!attestations)
        throw new Error(`${name}@${version} exists but its provenance is not available`);
      verifyExistingPackage({ ...options, metadata, attestations }, identity);
      return "existing";
    }
    if (attempt < attempts) await sleepImpl(5000);
  }
  return "missing";
}
async function lookupDistTag({ name, tag, fetchImpl = fetch }) {
  const tags = await fetchJson(distTagsUrl(name), fetchImpl);
  if (!tags || typeof tags !== "object")
    throw new Error(`cannot read public npm dist-tags for ${name}`);
  if (tags[tag] !== undefined && typeof tags[tag] !== "string")
    throw new Error(`npm returned invalid ${tag} dist-tag for ${name}`);
  return tags[tag];
}
async function publishOne(pkg, options, identity) {
  if ((await lookupPackage({ ...options, ...pkg }, identity)) === "existing") {
    if ((await lookupDistTag({ ...options, name: pkg.name })) !== pkg.version)
      await options.promoteImpl(pkg, options.tag);
    return;
  }
  await options.publishImpl(pkg, options.tag);
}
async function publishPhase(options, identity) {
  const { sourceSha, releaseTag, packages, tag } = options;
  if (!/^[0-9a-f]{40}$/.test(sourceSha ?? ""))
    throw new Error("release source is not a commit SHA");
  if (releaseTag !== `${identity.tagPrefix}${packages[0]?.version}`)
    throw new Error("release tag does not match the package version");
  if (!["latest", "next"].includes(tag)) throw new Error("unexpected npm dist-tag");
  for (const pkg of packages) {
    if (pkg.version !== packages[0].version)
      throw new Error(`${pkg.name} has a mismatched release version`);
    await publishOne(pkg, options, identity);
  }
}
export function createNpmPublisher({
  repository,
  workflow = ".github/workflows/publish.yml",
  tagPrefix = "v",
}) {
  const identity = { repository, workflow, tagPrefix };
  return {
    attestationUrl,
    distTagsUrl,
    lookupDistTag,
    verifyExistingPackage: (input) => verifyExistingPackage(input, identity),
    lookupPackage: (input) => lookupPackage(input, identity),
    publishPhase: (input) => publishPhase(input, identity),
  };
}
