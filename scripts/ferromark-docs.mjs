/** Run the isolated Ardo 6 reference, optionally against a locally built Ardo package. */
import { spawnSync } from "node:child_process";
import { cp, lstat, mkdir, readFile, realpath, symlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const project = new URL("../examples/ferromark-docs/", import.meta.url);
const dependencies = new URL("node_modules/", project);
const family = new URL("../packages/family/", import.meta.url);
const ardo = process.env.ARDO_PACKAGE;

// All writes are confined to this example's ignored node_modules; ARDO_PACKAGE is read-only.
/* eslint-disable security/detect-non-literal-fs-filename */
await mkdir(dependencies, { recursive: true });
if (ardo) {
  const source = await realpath(ardo);
  const api = await readFile(`${source}/dist/ui/index.d.ts`, "utf8");
  if (!api.includes("ArdoMobileNavigation"))
    throw new Error("Build an Ardo checkout containing the v6 composition APIs first.");
  const target = new URL("ardo", dependencies);
  const existing = await lstat(target).catch(() => null);
  if (existing) {
    if ((await realpath(target)) !== source)
      throw new Error(
        "The example already has another Ardo installation. Use a fresh node_modules.",
      );
  } else await symlink(source, target, "dir");
  const manifest = JSON.parse(await readFile(new URL("package.json", family), "utf8"));
  const installed = new URL("ferramenta-family/", dependencies);
  await mkdir(installed, { recursive: true });
  // A real package copy keeps every imported family module inside Ardo's project boundary.
  for (const name of ["package.json", ...manifest.files])
    await cp(new URL(name, family), new URL(name, installed), { recursive: true });
}
/* eslint-enable security/detect-non-literal-fs-filename */

const command = process.argv.slice(2);
if (command.length === 0) command.push("dev");
const result = spawnSync(
  process.execPath,
  [fileURLToPath(new URL("ardo/bin/ardo.js", dependencies)), ...command],
  {
    cwd: fileURLToPath(project),
    stdio: "inherit",
  },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
