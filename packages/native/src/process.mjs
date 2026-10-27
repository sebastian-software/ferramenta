import spawn from "cross-spawn";

/** One checked, Windows-aware process boundary for native npm tooling. */
export function command(program, args, options = {}) {
  const result = spawn.sync(program, args, { encoding: "utf8", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${program} ${args.join(" ")} failed with exit ${result.status}\n${result.stdout ?? ""}\n${result.stderr ?? ""}`,
    );
  return result;
}
