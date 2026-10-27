import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

import { detectLinuxLibc, nativeTarget } from "../runtime/native.mjs";
import { nativePackages, targetForTriple } from "./targets.mjs";

export function buildArguments(options) {
  const args = [
    "exec",
    "napi",
    "build",
    "--platform",
    "--profile",
    options.profile ?? "release",
    "--manifest-path",
    options.manifestPath,
    "--dts",
    options.dts ?? "native.d.ts",
    "--no-js",
    "--output-dir",
    options.outputDir,
  ];
  if (options.target) {
    targetForTriple(options.target);
    args.push("--target", options.target);
    if (options.target.includes("-unknown-linux-gnu")) args.push("--use-napi-cross");
    else if (options.target.endsWith("-musl")) args.push("--cross-compile");
  }
  if (options.noDefaultFeatures) args.push("--no-default-features");
  if (options.features) args.push("--features", options.features);
  args.push("--", "--locked", ...(options.cargoArgs ?? []));
  return args;
}

export function runBuild(options, { spawn = spawnSync } = {}) {
  const result = spawn(
    process.platform === "win32" ? "pnpm.cmd" : "pnpm",
    buildArguments(options),
    {
      cwd: options.cwd,
      env: options.env ?? process.env,
      shell: process.platform === "win32",
      stdio: "inherit",
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Native addon build failed with exit ${result.status}`);
}

export async function stageAddon(config, options) {
  const id = options.target
    ? targetForTriple(options.target).id
    : nativeTarget(process.platform, process.arch, detectLinuxLibc());
  const target = nativePackages(config).find((entry) => entry.id === id);
  const files = await readdir(options.outputDir);
  const addons = files.filter((file) => file.endsWith(".node"));
  if (addons.length !== 1)
    throw new Error(`Expected one native addon in ${options.outputDir}, found ${addons.length}`);
  const input = path.join(options.outputDir, addons[0]);
  await copyFile(input, path.join(config.packageDir, target.binaryName));
  const destination = path.join(config.platformDir, id);
  await mkdir(destination, { recursive: true });
  await copyFile(input, path.join(destination, target.binaryName));
  for (const filename of config.licenses)
    await copyFile(path.join(config.packageDir, filename), path.join(destination, filename));
  await copyFile(
    path.join(options.outputDir, options.dts ?? "native.d.ts"),
    path.join(config.packageDir, options.dts ?? "native.d.ts"),
  );
  return { input, target };
}
