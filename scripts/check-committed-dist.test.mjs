/**
 * The guard's own regression test, on throwaway repositories: a `git diff`
 * check passes an untracked file, which is exactly how a new source module
 * would ship a package with a missing entry point.
 */
import assert from "node:assert/strict";
import { execFile as execFileCallback, execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const guard = fileURLToPath(new URL("check-committed-dist.mjs", import.meta.url));

/** A repository with one committed file in `packages/family/dist`. */
async function fixture() {
  const repo = await mkdtemp(join(tmpdir(), "committed-dist-"));
  const dist = join(repo, "packages", "family", "dist");
  await mkdir(dist, { recursive: true });
  await writeFile(join(dist, "index.js"), "export const built = true;\n");
  const git = (...arguments_) => execFileSync("git", arguments_, { cwd: repo, stdio: "ignore" });
  git("init", "--quiet");
  git("config", "user.email", "check@example.com");
  git("config", "user.name", "Check");
  git("add", ".");
  git("commit", "--quiet", "-m", "committed build output");
  return { dist, repo };
}

/** The guard's exit code plus what it printed. */
async function runGuard(repo) {
  try {
    const { stdout } = await execFile(process.execPath, [guard, "--repo", repo]);
    return { code: 0, output: stdout };
  } catch (error) {
    return { code: error.code, output: `${error.stdout}${error.stderr}` };
  }
}

test("committed output that matches the sources passes", async () => {
  const { repo } = await fixture();
  try {
    const result = await runGuard(repo);
    assert.equal(result.code, 0, result.output);
  } finally {
    await rm(repo, { force: true, recursive: true });
  }
});

test("an untracked output file fails the guard", async () => {
  // The finding this test exists for: `git diff` reports nothing for a file
  // Git has never seen, so a new module would build output nobody commits.
  const { dist, repo } = await fixture();
  try {
    await writeFile(join(dist, "NewThing.js"), "export const added = true;\n");
    const result = await runGuard(repo);
    assert.equal(result.code, 1, "an untracked build artifact must fail");
    assert.match(result.output, /NewThing\.js/u);
  } finally {
    await rm(repo, { force: true, recursive: true });
  }
});

test("a modified output file fails the guard", async () => {
  const { dist, repo } = await fixture();
  try {
    await writeFile(join(dist, "index.js"), "export const built = false;\n");
    const result = await runGuard(repo);
    assert.equal(result.code, 1, "stale build output must fail");
    assert.match(result.output, /index\.js/u);
  } finally {
    await rm(repo, { force: true, recursive: true });
  }
});

test("a deleted output file fails the guard", async () => {
  const { dist, repo } = await fixture();
  try {
    await rm(join(dist, "index.js"));
    const result = await runGuard(repo);
    assert.equal(result.code, 1, "removed build output must fail");
  } finally {
    await rm(repo, { force: true, recursive: true });
  }
});
