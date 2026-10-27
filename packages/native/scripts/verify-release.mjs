import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
assert.equal(process.env.TAG, `ferramenta-native-v${manifest.version}`);
const sha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
assert.equal(sha, process.env.GITHUB_SHA, "Run recovery on the release tag ref");
assert.equal(
  execFileSync("git", ["rev-parse", `${process.env.TAG}^{commit}`], { encoding: "utf8" }).trim(),
  sha,
);
