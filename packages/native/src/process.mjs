import { spawnSync } from "node:child_process";

/** One checked, Windows-aware process boundary for native npm tooling. */
export function command(program, args, options = {}) {
  const windowsCommand = process.platform === "win32" && ["npm", "pnpm"].includes(program);
  const result = spawnSync(windowsCommand ? `${program}.cmd` : program, args, {
    encoding: "utf8",
    shell: windowsCommand,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${program} ${args.join(" ")} failed with exit ${result.status}\n${result.stdout ?? ""}\n${result.stderr ?? ""}`,
    );
  return result;
}
