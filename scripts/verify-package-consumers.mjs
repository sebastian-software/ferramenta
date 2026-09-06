/**
 * Proves the contract a consumer outside this repository actually gets, on both
 * routes into the package, in a scratch project that knows nothing about this
 * workspace:
 *
 * 1. **npm** — `pnpm pack`, then install the tarball.
 * 2. **Git** — `git archive HEAD`, then install the extracted directory. Those
 *    are exactly the tracked files codeload serves for a pinned commit, so this
 *    fails if `packages/family/dist` ever stops being committed (ADR-0007).
 *
 * Both then import the two entry points in a bare Node process and render the
 * chrome. What this cannot do is resolve `github:…#<sha>` for a commit that does
 * not exist yet; that install is checked by hand when a sibling moves its pin,
 * with the command in the package README.
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

const REQUIRED_FILES = [
  "dist/index.js",
  "dist/family.js",
  "styles/chrome.css",
  "fonts/big-shoulders.woff2",
];

/** Packs the package and returns the tarball's specifier and its file list. */
function packTarball(scratch) {
  run("pnpm", ["pack", "--pack-destination", scratch], packageDirectory);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is this script's own mkdtemp scratch directory
  const tarball = readdirSync(scratch).find((entry) => entry.endsWith(".tgz"));
  if (tarball === undefined) throw new Error("pnpm pack produced no tarball");
  const shipped = run("tar", ["-tzf", join(scratch, tarball)]).split("\n");
  for (const file of REQUIRED_FILES) {
    if (!shipped.includes(`package/${file}`)) throw new Error(`the npm tarball is missing ${file}`);
  }
  return `file:./${tarball}`;
}

/** Extracts the tracked files at HEAD — what a git consumer downloads. */
function exportTrackedFiles(scratch) {
  const archive = join(scratch, "from-git.tar");
  run(
    "git",
    ["archive", "--format=tar", `--output=${archive}`, "HEAD", "packages/family"],
    repository,
  );
  const shipped = run("tar", ["-tf", archive]).split("\n");
  for (const file of REQUIRED_FILES) {
    if (!shipped.includes(`packages/family/${file}`)) {
      throw new Error(
        `Git carries no packages/family/${file} at HEAD — a git consumer would install a broken package`,
      );
    }
  }
  run("tar", ["-xf", archive, "-C", scratch]);
  return "file:./packages/family";
}

/** Installs one specifier into a fresh project and imports both entry points. */
function checkConsumer(scratch, label, specifier) {
  console.log(`\n${label}: installing ${specifier}`);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is this script's own mkdtemp scratch directory
  writeFileSync(
    join(scratch, "package.json"),
    `${JSON.stringify(
      {
        name: "family-consumer-check",
        private: true,
        type: "module",
        dependencies: {
          "@ferramenta/family": specifier,
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
}

const scratch = mkdtempSync(join(tmpdir(), "family-consumer-"));
try {
  console.log(`scratch project: ${scratch}`);
  checkConsumer(scratch, "npm route (packed tarball)", packTarball(scratch));
  rmSync(join(scratch, "node_modules"), { force: true, recursive: true });
  checkConsumer(scratch, "git route (tracked files at HEAD)", exportTrackedFiles(scratch));
  console.log("\nboth consumer routes passed");
} finally {
  rmSync(scratch, { force: true, recursive: true });
}
