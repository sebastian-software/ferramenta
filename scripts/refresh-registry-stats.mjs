/**
 * Fetches published versions and download counts for every family tool and
 * writes app/data/registry-stats.json, which the site bakes in at build time.
 *
 * Hard-coded facts stay out of the page: family.ts keeps a fallback version so
 * the build survives an offline or rate-limited registry, but a successful run
 * always wins. Run via `pnpm stats:refresh` (and nightly in CI).
 *
 * A family name is not proof of family ownership: both registries hand out
 * names first come, first served. Every hit is therefore checked against the
 * organization's accounts (scripts/registry-ownership.mjs), and a package owned
 * by someone else is treated as absent rather than rendered as ours.
 *
 * A registry that does not answer is a third case, distinct from both. The
 * previous value is carried forward for that package instead — a 429 must never
 * be recorded as "this crate is gone" or "this crate is somebody else's".
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { classifyOwnership, OURS, UNKNOWN } from "./registry-ownership.mjs";

const here = import.meta.dirname;
const OUT = join(here, "..", "app", "data", "registry-stats.json");
const FAMILY = join(here, "..", "packages", "ardo-config", "src", "family.ts");
const UA = "ferramenta.dev stats refresh (https://github.com/sebastian-software/ferramenta)";

/** Marks a lookup the registry did not answer, as opposed to "not published". */
const UNRESOLVED = Symbol("unresolved");

let unresolved = 0;

/**
 * One registry request, with the three outcomes kept apart:
 * `{ ok: true, data }` — answered; `data === null` means the name is unknown to
 * the registry. `{ ok: false }` — the registry did not answer at all.
 */
async function fetchJson(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
    if (res.status === 404) return { ok: true, data: null };
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    return { ok: true, data: await res.json() };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

function warnUnresolved(what, reason) {
  unresolved += 1;
  console.warn(`  ${what} did not resolve (${reason}) — keeping the previous value`);
}

/**
 * Owner logins of a crate, or null when crates.io did not answer. crates.io
 * lists users and teams under /owners.
 */
async function crateOwnerLogins(name) {
  const answer = await fetchJson(`https://crates.io/api/v1/crates/${name}/owners`);
  if (!answer.ok || answer.data === null) return null;
  return (answer.data.users ?? []).map((owner) => owner.login ?? "");
}

/** Maintainer logins of an npm package, from the packument. */
function npmMaintainers(meta) {
  return (meta.maintainers ?? []).map((maintainer) => maintainer.name ?? "");
}

/**
 * Resolves ownership into one of three answers: true (ours), false (someone
 * else's — the package is then reported as absent) or UNRESOLVED.
 */
function resolveOwnership(registry, name, logins) {
  const verdict = classifyOwnership(logins);
  if (verdict === UNKNOWN) {
    warnUnresolved(`${registry}/${name} ownership`, "no owner list");
    return UNRESOLVED;
  }
  if (verdict !== OURS) {
    console.warn(`  ${registry}/${name} is published by ${logins.join(", ")} — skipped`);
    return false;
  }
  return true;
}

/** Crate metadata, null when unpublished, UNRESOLVED when crates.io is silent. */
async function crateMeta(name) {
  const answer = await fetchJson(`https://crates.io/api/v1/crates/${name}`);
  if (answer.ok) return answer.data?.crate ?? null;
  warnUnresolved(`crates.io/${name}`, answer.reason);
  return UNRESOLVED;
}

/**
 * crates.io: canonical version plus all-time and 90-day downloads, but only for
 * a crate the organization actually owns.
 */
async function crates(name) {
  const crate = await crateMeta(name);
  if (crate === UNRESOLVED || crate === null) return crate;
  const owned = resolveOwnership("crates.io", name, await crateOwnerLogins(name));
  if (owned === UNRESOLVED) return UNRESOLVED;
  if (!owned) return null;
  return {
    version: crate.max_stable_version ?? crate.max_version,
    downloads: crate.downloads ?? 0,
    recentDownloads: crate.recent_downloads ?? 0,
    updated: crate.updated_at?.slice(0, 10) ?? null,
  };
}

/** Monthly downloads, or the previous number when the endpoint is unavailable. */
async function npmDownloads(name, previous) {
  const answer = await fetchJson(`https://api.npmjs.org/downloads/point/last-month/${name}`);
  if (answer.ok) return answer.data?.downloads ?? 0;
  warnUnresolved(`npm/${name} downloads`, answer.reason);
  return previous?.lastMonth ?? 0;
}

/**
 * npm: only count a package we actually publish. The downloads endpoint answers
 * for unpublished names too, so a published version plus an organization
 * maintainer is the gate, and a reserved-name placeholder is not a usable
 * adapter.
 */
async function npm(name, previous) {
  const answer = await fetchJson(`https://registry.npmjs.org/${name}`);
  if (!answer.ok) {
    warnUnresolved(`npm/${name}`, answer.reason);
    return UNRESOLVED;
  }
  const meta = answer.data;
  const version = meta?.["dist-tags"]?.latest;
  if (!version) return null;
  const owned = resolveOwnership("npm", name, npmMaintainers(meta));
  if (owned === UNRESOLVED) return UNRESOLVED;
  if (!owned) return null;
  const description = meta.versions?.[version]?.description ?? "";
  return {
    version,
    lastMonth: await npmDownloads(name, previous),
    placeholder: /reserved/i.test(description),
  };
}

/** The committed stats, so an unresolved lookup can keep the previous value. */
async function loadPrevious() {
  try {
    return JSON.parse(await readFile(OUT, "utf8")).tools ?? {};
  } catch {
    return {};
  }
}

const familySource = await readFile(FAMILY, "utf8");
const names = familySource
  .split("\n")
  .map((line) => line.match(/^\s*name: "([a-z]+)",$/)?.[1])
  .filter(Boolean);

if (names.length === 0) throw new Error("no tool names found in family.ts");

const previous = await loadPrevious();
const tools = {};
for (const name of names) {
  const before = previous[name] ?? { crates: null, npm: null };
  // Sequential on purpose: crates.io asks API clients to stay well under a request per second.
  const crate = await crates(name);
  const adapter = await npm(name, before.npm);
  tools[name] = {
    crates: crate === UNRESOLVED ? before.crates : crate,
    npm: adapter === UNRESOLVED ? before.npm : adapter,
  };
  const c = tools[name].crates;
  const n = tools[name].npm;
  console.log(
    `${name.padEnd(10)} ${c ? `crates ${c.version} (${c.downloads})` : "crates —"}  ${n ? `npm ${n.version}${n.placeholder ? " (reserved name)" : ` (${n.lastMonth}/mo)`}` : "npm —"}`,
  );
}

const payload = {
  generatedAt: `${new Date().toISOString().slice(0, 19)}Z`,
  tools,
};
await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`\nwrote ${OUT}`);

if (unresolved > 0) {
  console.warn(
    `\n${unresolved} lookup(s) did not resolve; those entries kept their previous value.`,
  );
}
