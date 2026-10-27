import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { publishWithNpm } from "../src/consumer.mjs";
import { createNpmPublisher } from "../src/publish.mjs";

await import("./verify-release.mjs");
const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const pkg = {
  name: manifest.name,
  version: manifest.version,
  path: fileURLToPath(new URL("..", import.meta.url)),
};
const sourceSha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const publisher = createNpmPublisher({
  repository: "https://github.com/sebastian-software/ferramenta",
  tagPrefix: "ferramenta-native-v",
});
const tag = manifest.version.includes("-") ? "next" : "latest";
await publisher.publishPhase({
  packages: [pkg],
  phase: "tooling",
  sourceSha,
  releaseTag: process.env.TAG,
  tag,
  recovery: process.env.GITHUB_EVENT_NAME === "workflow_dispatch",
  publishImpl: publishWithNpm,
  promoteImpl: async (entry, distTag) =>
    execFileSync("npm", ["dist-tag", "add", `${entry.name}@${entry.version}`, distTag], {
      stdio: "inherit",
    }),
});
assert.equal(
  await publisher.lookupPackage({ ...pkg, sourceSha, releaseTag: process.env.TAG, recovery: true }),
  "existing",
);
assert.equal(await publisher.lookupDistTag({ name: pkg.name, tag }), pkg.version);
