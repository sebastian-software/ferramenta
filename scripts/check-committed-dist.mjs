/**
 * Fails when the committed build output of `@ferramenta/family` does not match
 * what the sources produce.
 *
 * `packages/family/dist` is committed because git consumers install it as it is
 * (ADR-0007), so a commit that edits `src` without rebuilding ships a package
 * whose entry points are stale — or, for a new module, missing entirely. Run it
 * after a build: anything the build changed, added or removed inside the
 * directory is a finding, untracked files included.
 *
 *   node scripts/check-committed-dist.mjs [--repo <path>] [--path <dir>]
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function parseArguments(argv) {
  const options = {
    path: "packages/family/dist",
    repo: fileURLToPath(new URL("..", import.meta.url)),
  };
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag !== "--repo" && flag !== "--path") throw new Error(`unknown argument: ${flag}`);
    if (value === undefined) throw new Error(`${flag} needs a value`);
    options[flag.slice(2)] = value;
  }
  return options;
}

const { path, repo } = parseArguments(process.argv.slice(2));

// --untracked-files=all lists every new file, not just the directory holding
// them: a new source module builds a new, untracked output file, and that is
// exactly the case a plain `git diff` would wave through.
const status = execFileSync("git", ["status", "--porcelain", "--untracked-files=all", "--", path], {
  cwd: repo,
  encoding: "utf8",
}).trim();

if (status !== "") {
  console.error(`${path} does not match the sources:\n${status}`);
  console.error("\nRun `pnpm build:package` and commit the result (ADR-0007).");
  process.exit(1);
}
console.log(`${path} is up to date`);
