/**
 * Which package names a member is looked up under, and who owns them.
 *
 * Both registries hand out names first come, first served, so a family name is
 * no proof of family ownership. These helpers live apart from the fetching
 * script so they can be tested without touching the network.
 */
import { packageName } from "../packages/family/dist/family.js";

/**
 * The names the stats refresh looks a member up under, and so checks the
 * ownership of: its crate and its npm package (the registry entry's `packages`
 * override, else its `name`), and its repository for the latest release.
 */
export function lookupNames(tool) {
  return { crate: packageName(tool, "crates"), npm: packageName(tool, "npm"), repo: tool.name };
}

/** crates.io and npm accounts that publish for Sebastian Software. */
export const ORG_ACCOUNTS = new Set(["fastner", "sebastian-software", "swernerx"]);

/** crates.io team owners are logins of the form `github:<org>:<team>`. */
export const ORG_TEAM_PREFIX = "github:sebastian-software:";

/** Ownership verdicts. `UNKNOWN` is not a soft `FOREIGN` — see below. */
export const OURS = "ours";
export const FOREIGN = "foreign";
export const UNKNOWN = "unknown";

/** True when at least one owner login belongs to the organization. */
export function ownedByOrg(logins) {
  return logins.some((login) => {
    const id = login.toLowerCase();
    return ORG_ACCOUNTS.has(id) || id.startsWith(ORG_TEAM_PREFIX);
  });
}

/**
 * Classifies a package from its owner logins.
 *
 * `null` means the registry did not answer — a 429, a 5xx, a timeout. That is
 * `UNKNOWN`, never `FOREIGN`: a failed lookup must not be recorded as somebody
 * else's package, or one rate-limited nightly run would drop a real crate from
 * the site until the next successful refresh.
 */
export function classifyOwnership(logins) {
  if (logins === null) return UNKNOWN;
  return ownedByOrg(logins) ? OURS : FOREIGN;
}
