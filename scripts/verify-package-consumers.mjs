/**
 * Proves the contract a consumer outside this repository actually gets:
 * packs `@ferramenta/family`, installs the tarball into a scratch project that
 * knows nothing about this workspace, and imports both entry points in a bare
 * Node process — no bundler, no loader hooks, no `pnpm` build approval.
 *
 * The bug this guards: `dist/` used to be gitignored and the package had no
 * usable build hook for git consumers, so
 * `pnpm add "github:sebastian-software/ferramenta#<sha>&path:/packages/family"`
 * installed a package whose every entry point pointed at missing files
 * (ADR-0007).
 *
 *   node scripts/verify-package-consumers.mjs
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repository = fileURLToPath(new URL("..", import.meta.url));
const packageDirectory = join(repository, "packages", "family");

const run = (command, arguments_, cwd) =>
  execFileSync(command, arguments_, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });

const scratch = mkdtempSync(join(tmpdir(), "family-consumer-"));
try {
  console.log(`scratch project: ${scratch}`);
  run("pnpm", ["pack", "--pack-destination", scratch], packageDirectory);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is this script's own mkdtemp scratch directory
  const tarball = readdirSync(scratch).find((entry) => entry.endsWith(".tgz"));
  if (tarball === undefined) throw new Error("pnpm pack produced no tarball");

  const shipped = run("tar", ["-tzf", join(scratch, tarball)]).split("\n");
  for (const required of [
    "package/dist/index.js",
    "package/dist/family.js",
    "package/styles/chrome.css",
  ]) {
    if (!shipped.includes(required)) throw new Error(`the tarball is missing ${required}`);
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is this script's own mkdtemp scratch directory
  writeFileSync(
    join(scratch, "package.json"),
    `${JSON.stringify(
      {
        name: "family-consumer-check",
        private: true,
        type: "module",
        dependencies: {
          "@ferramenta/family": `file:./${tarball}`,
          react: "^19.2.7",
          "react-dom": "^19.2.7",
        },
      },
      null,
      2,
    )}\n`,
  );
  run("pnpm", ["install", "--ignore-workspace"], scratch);

  copyFileSync(new URL("consumer-check.mjs", import.meta.url), join(scratch, "check.mjs"));
  process.stdout.write(run("node", ["check.mjs"], scratch));

  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is this script's own mkdtemp scratch directory
  writeFileSync(join(scratch, "README.md"), "# consumer\n\nA thing.\n");
  const binary = join(scratch, "node_modules", "@ferramenta", "family", "bin", "family-readme.mjs");
  run("node", [binary, "--current", "ferralk", "--write", "README.md"], scratch);
  process.stdout.write(
    run("node", [binary, "--current", "ferralk", "--check", "README.md"], scratch),
  );
  console.log("consumer check passed");
} finally {
  rmSync(scratch, { force: true, recursive: true });
}
