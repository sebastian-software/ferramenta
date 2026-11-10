/* eslint-disable max-lines-per-function, max-statements -- The release fixture keeps its complete scratch repository setup together. */
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { nativePackages } from "../src/targets.mjs";

export async function fixture(t) {
  const rootDir = await mkdtemp(path.join(tmpdir(), "native release with spaces "));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  const config = {
    name: "example",
    rootDir,
    workspaceDir: path.join(rootDir, "node"),
    packageDir: path.join(rootDir, "node/core"),
    platformDir: path.join(rootDir, "node/platforms"),
    packagePattern: "@example/{target}",
    binaryPattern: "example.node",
    licenses: ["LICENSE"],
    release: {
      repository: "https://github.com/example/project",
      tagPrefix: "v",
      cargoFiles: ["Cargo.toml"],
    },
  };
  await mkdir(config.packageDir, { recursive: true });
  await writeFile(path.join(rootDir, "Cargo.toml"), '[package]\nversion = "1.2.3"\n');
  await writeFile(path.join(config.packageDir, "LICENSE"), "license fixture");
  await writeFile(path.join(config.packageDir, "README.md"), "package fixture");
  await writeFile(
    path.join(config.packageDir, "package.json"),
    JSON.stringify({
      name: "@example/core",
      version: "1.2.3",
      private: false,
      packageManager: "pnpm@11.10.0",
      files: ["README.md", "LICENSE"],
      optionalDependencies: Object.fromEntries(
        nativePackages(config).map((target) => [target.packageName, "1.2.3"]),
      ),
    }),
  );
  for (const target of nativePackages(config)) {
    const directory = path.join(config.platformDir, target.id);
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, "package.json"),
      JSON.stringify({ name: target.packageName, version: "1.2.3" }),
    );
    await writeFile(path.join(directory, target.binaryName), `binary fixture ${target.id}`);
  }
  const git = (args) => execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();
  git(["init", "--initial-branch=main"]);
  git([
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "--allow-empty",
    "-m",
    "fixture",
  ]);
  return { config, sourceSha: git(["rev-parse", "HEAD"]), git };
}
