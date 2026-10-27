/* eslint-disable max-lines-per-function, max-params, max-statements, complexity, sonarjs/cognitive-complexity, max-depth -- Release gates keep their deny, wait and allow decisions in one auditable sequence. */
import assert from "node:assert/strict";
import { appendFile } from "node:fs/promises";

import { assertSource } from "./artifacts.mjs";
import { command } from "./process.mjs";
import { releaseChannel } from "./publication.mjs";
import { isLegacyReleaseVersion, resolveConfig, verifyReleaseMetadata } from "./release.mjs";

const SHA = /^[0-9a-f]{40}$/;

export function verifyGitHubRelease(tag, release, tagPrefix = "v") {
  assert.ok(tag.startsWith(tagPrefix), "Invalid release tag");
  const { tag: channel } = releaseChannel(tag.slice(tagPrefix.length));
  assert.equal(release.tagName ?? release.tag_name, tag, "GitHub release tag differs");
  assert.equal(release.isDraft ?? release.draft, false, "GitHub release is a draft");
  assert.equal(
    release.isPrerelease ?? release.prerelease,
    channel !== "latest",
    "GitHub release status does not match tag",
  );
}

export function resolveReleaseSource({
  tag,
  tagPrefix = "v",
  root = process.cwd(),
  eventName = process.env.GITHUB_EVENT_NAME,
  eventRef = process.env.GITHUB_REF,
  eventSha = process.env.GITHUB_SHA,
  legacyRecoveryThrough,
}) {
  assert.ok(["push", "workflow_dispatch"].includes(eventName), "Unsupported release event");
  const fromTag = eventName === "workflow_dispatch" && eventRef === `refs/tags/${tag}`;
  assert.ok(
    eventRef === "refs/heads/main" || fromTag,
    "Release source must be resolved on main or the exact release tag ref",
  );
  assert.ok(tag?.startsWith(tagPrefix), "Invalid release tag");
  releaseChannel(tag.slice(tagPrefix.length));
  for (const reference of [
    "+refs/heads/main:refs/remotes/origin/main",
    `+refs/tags/${tag}:refs/tags/${tag}`,
  ])
    command("git", ["fetch", "--force", "--no-tags", "origin", reference], { cwd: root });
  const sourceSha = command("git", ["rev-parse", `refs/tags/${tag}^{commit}`], {
    cwd: root,
  }).stdout.trim();
  assert.match(sourceSha, SHA);
  command("git", ["merge-base", "--is-ancestor", sourceSha, "refs/remotes/origin/main"], {
    cwd: root,
  });
  const version = tag.slice(tagPrefix.length);
  if (fromTag)
    assert.equal(eventSha, sourceSha, "Tag dispatch SHA differs from the release source");
  if (eventName === "workflow_dispatch" && !fromTag && legacyRecoveryThrough)
    assert.ok(
      isLegacyReleaseVersion({ release: { legacyRecoveryThrough } }, version),
      "Dispatch recovery from the exact release tag ref",
    );
  return { tag, sourceSha, version };
}

export async function resolveTag(api, tag) {
  const ref = await api(`/git/ref/tags/${encodeURIComponent(tag)}`);
  let object = ref.object;
  for (let depth = 0; depth < 3 && object?.type === "tag"; depth++) {
    const annotated = await api(`/git/tags/${object.sha}`);
    object = annotated.object;
  }
  assert.equal(object?.type, "commit", `release tag ${tag} must resolve to a commit`);
  assert(SHA.test(object.sha), `release tag ${tag} has an invalid commit SHA`);
  return object.sha;
}

export function inspectCiRuns(runs, sha) {
  const matching = runs.filter(
    (run) =>
      run.head_sha === sha &&
      run.event === "push" &&
      run.head_branch === "main" &&
      run.path?.split("@")[0] === ".github/workflows/ci.yml",
  );
  if (!matching.length) return { state: "pending", detail: `No CI push/main run for ${sha}` };
  matching.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id);
  const run = matching[0];
  if (run.status !== "completed")
    return { state: "pending", detail: `CI run ${run.id} is ${run.status}`, run };
  if (run.conclusion !== "success")
    return { state: "denied", detail: `CI run ${run.id} concluded ${run.conclusion}`, run };
  return { state: "check-jobs", detail: `CI run ${run.id} succeeded`, run };
}

export function inspectCiJobs(jobs, sha, { requiredJobs = [], platformJobs = [] } = {}) {
  const missing = [];
  for (const name of requiredJobs) {
    if (
      !jobs.some((job) => job.name === name && job.head_sha === sha && job.conclusion === "success")
    )
      missing.push(name);
  }
  for (const entry of platformJobs) {
    const pattern = typeof entry === "string" ? entry : entry.pattern;
    // The pattern comes from reviewed product configuration, never an API response.
    // eslint-disable-next-line security/detect-non-literal-regexp
    const expression = new RegExp(pattern);
    const matching = jobs.filter(
      (job) => expression.test(job.name) && job.head_sha === sha && job.conclusion === "success",
    );
    if (matching.length !== 1) missing.push(`${entry.label ?? pattern} (${matching.length}/1)`);
  }
  return missing.length
    ? { state: "denied", detail: `Missing or unsuccessful required CI jobs: ${missing.join(", ")}` }
    : { state: "allowed", detail: "Required CI jobs succeeded" };
}

export async function fetchCiRuns(api, sha) {
  const runs = [];
  for (let page = 1; page <= 10; page++) {
    const query = new URLSearchParams({
      head_sha: sha,
      event: "push",
      branch: "main",
      per_page: "100",
      page: String(page),
    });
    const data = await api(`/actions/workflows/ci.yml/runs?${query}`);
    assert(
      Array.isArray(data.workflow_runs) && Number.isInteger(data.total_count),
      "CI run response is malformed",
    );
    assert(data.total_count <= 1000, "CI run search exceeds the GitHub API result bound");
    runs.push(...data.workflow_runs);
    if (runs.length >= data.total_count) return runs;
    assert(data.workflow_runs.length > 0, "CI run pagination ended before total_count");
  }
  throw new Error("CI run listing exceeds the verification bound");
}

export async function githubApi(
  repository,
  endpoint,
  { token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN, fetchImpl = fetch } = {},
) {
  const response = await fetchImpl(`https://api.github.com/repos/${repository}${endpoint}`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`GitHub API ${endpoint} returned HTTP ${response.status}`);
  return response.json();
}

export async function requireSuccessfulCi(
  api,
  sha,
  configuration,
  {
    timeoutMs = 30 * 60_000,
    pollMs = 20_000,
    now = Date.now,
    sleep = (ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      }),
  } = {},
) {
  const deadline = now() + timeoutMs;
  let last = "No matching CI run";
  while (now() < deadline) {
    const result = inspectCiRuns(await fetchCiRuns(api, sha), sha);
    last = result.detail;
    if (result.state === "denied") throw new Error(last);
    if (result.state === "check-jobs") {
      const jobs = [];
      for (let page = 1; page <= 10; page++) {
        const data = await api(
          `/actions/runs/${result.run.id}/jobs?filter=latest&per_page=100&page=${page}`,
        );
        assert.ok(
          Array.isArray(data.jobs) && Number.isInteger(data.total_count),
          "CI jobs response is malformed",
        );
        jobs.push(...data.jobs);
        if (jobs.length >= data.total_count) break;
        assert.ok(data.jobs.length && page < 10, "CI job listing exceeds the verification bound");
      }
      const decision = inspectCiJobs(jobs, sha, configuration);
      if (decision.state !== "allowed")
        throw new Error(`${decision.detail} in CI run ${result.run.id}`);
      return result.run.id;
    }
    console.log(`${last}; waiting for exact-commit CI`);
    await sleep(Math.min(pollMs, deadline - now()));
  }
  throw new Error(`Timed out waiting for exact-commit CI: ${last}`);
}

function validTag(tag, prefix) {
  if (!tag?.startsWith(prefix)) return false;
  try {
    releaseChannel(tag.slice(prefix.length));
    return true;
  } catch {
    return false;
  }
}

export function releaseTarget(
  { force, inputTag, releaseSha, releaseTag, releaseVersion, eventSha, eventRef },
  { tagPrefix = "v" } = {},
) {
  assert(SHA.test(eventSha), "GitHub event SHA is missing or malformed");
  if (force) {
    assert(
      validTag(inputTag, tagPrefix),
      "force-publish requires an explicit v<version> release-tag",
    );
    assert.equal(
      eventRef,
      `refs/tags/${inputTag}`,
      "force-publish must dispatch on the exact release tag ref",
    );
    return { tag: inputTag, version: inputTag.slice(tagPrefix.length), expectedSha: eventSha };
  }
  assert.equal(eventRef, "refs/heads/main", "normal release must run from main");
  assert(SHA.test(releaseSha), "Release Please did not provide a release SHA");
  assert(validTag(releaseTag, tagPrefix), "Release Please did not provide a release tag");
  assert.equal(
    releaseVersion,
    releaseTag.slice(tagPrefix.length),
    "Release Please tag and version differ",
  );
  assert.equal(releaseSha, eventSha, "Release Please SHA differs from the push commit");
  return { tag: releaseTag, version: releaseVersion, expectedSha: releaseSha };
}

export function createReleaseSourceGate(configuration) {
  const config = resolveConfig(configuration);
  const checkManifestVersions = async (root, version, sha) => {
    assert.match(sha ?? "", SHA, "release SHA is invalid");
    return verifyReleaseMetadata(config, { root, version });
  };
  return {
    releaseTarget: (input) => releaseTarget(input, { tagPrefix: config.release?.tagPrefix }),
    resolveTag,
    inspectCiRuns,
    fetchCiRuns,
    inspectCiJobs: (jobs, sha) => inspectCiJobs(jobs, sha, config.release?.ci),
    checkManifestVersions,
    async run(mode, env = process.env) {
      const repository = env.GITHUB_REPOSITORY;
      assert.match(repository ?? "", /^[\w.-]+\/[\w.-]+$/, "GitHub repository is missing");
      const api = (endpoint) =>
        githubApi(repository, endpoint, { token: env.GITHUB_TOKEN ?? env.GH_TOKEN });
      if (mode === "resolve") {
        const tag = env.INPUT_RELEASE_TAG ?? env.RELEASE_TAG ?? env.RELEASE_PLEASE_TAG;
        const target = releaseTarget(
          {
            force: env.FORCE_PUBLISH === "true" || env.GITHUB_EVENT_NAME === "workflow_dispatch",
            inputTag: tag,
            releaseTag: env.RELEASE_PLEASE_TAG ?? tag,
            releaseSha: env.RELEASE_PLEASE_SHA ?? env.GITHUB_SHA,
            releaseVersion:
              env.RELEASE_PLEASE_VERSION ?? tag?.slice((config.release?.tagPrefix ?? "v").length),
            eventSha: env.GITHUB_SHA,
            eventRef: env.GITHUB_REF,
          },
          { tagPrefix: config.release?.tagPrefix },
        );
        const sha = await resolveTag(api, target.tag);
        assert.equal(
          sha,
          target.expectedSha,
          "release tag does not point to the Release Please SHA",
        );
        verifyGitHubRelease(
          target.tag,
          await api(`/releases/tags/${encodeURIComponent(target.tag)}`),
          config.release?.tagPrefix,
        );
        await appendFile(
          env.GITHUB_OUTPUT,
          `release_sha=${sha}\nrelease_tag=${target.tag}\nrelease_version=${target.version}\n`,
        );
      } else if (mode === "ci") {
        assert.match(env.RELEASE_SHA ?? "", SHA, "release SHA is invalid");
        await requireSuccessfulCi(api, env.RELEASE_SHA, config.release?.ci);
      } else if (mode === "verify") {
        const root = env.GITHUB_WORKSPACE ?? config.rootDir;
        assertSource(root, env.RELEASE_SHA);
        await checkManifestVersions(root, env.RELEASE_VERSION, env.RELEASE_SHA);
        await requireSuccessfulCi(api, env.RELEASE_SHA, config.release?.ci);
      } else throw new Error("Expected release source command resolve or verify");
    },
  };
}
