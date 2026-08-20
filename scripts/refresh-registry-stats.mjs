#!/usr/bin/env node
/**
 * Fetches published versions and download counts for every family tool and
 * writes app/data/registry-stats.json, which the site bakes in at build time.
 *
 * Hard-coded facts stay out of the page: family.ts keeps a fallback version so
 * the build survives an offline or rate-limited registry, but a successful run
 * always wins. Run via `pnpm stats:refresh` (and nightly in CI).
 */
import { writeFile, readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, "..", "app", "data", "registry-stats.json")
const FAMILY = join(here, "..", "packages", "ardo-config", "src", "family.ts")
const UA = "ferramenta.dev stats refresh (https://github.com/sebastian-software/ferramenta)"

async function json(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } })
  if (!res.ok) return null
  return res.json()
}

/** crates.io: canonical version plus all-time and 90-day downloads. */
async function crates(name) {
  const data = await json(`https://crates.io/api/v1/crates/${name}`)
  const crate = data?.crate
  if (!crate) return null
  return {
    version: crate.max_stable_version ?? crate.max_version,
    downloads: crate.downloads ?? 0,
    recentDownloads: crate.recent_downloads ?? 0,
    updated: crate.updated_at?.slice(0, 10) ?? null,
  }
}

/**
 * npm: only count a package we actually publish. The downloads endpoint answers
 * for unpublished names too, so dist-tags.latest is the ownership gate, and a
 * reserved-name placeholder is not a usable adapter.
 */
async function npm(name) {
  const meta = await json(`https://registry.npmjs.org/${name}`)
  const version = meta?.["dist-tags"]?.latest
  if (!version) return null
  const description = meta.versions?.[version]?.description ?? ""
  const placeholder = /reserved/i.test(description)
  const point = await json(`https://api.npmjs.org/downloads/point/last-month/${name}`)
  return { version, lastMonth: point?.downloads ?? 0, placeholder }
}

const names = (await readFile(FAMILY, "utf8"))
  .split("\n")
  .map((line) => line.match(/^\s*name: "([a-z]+)",$/)?.[1])
  .filter(Boolean)

if (names.length === 0) throw new Error("no tool names found in family.ts")

const tools = {}
for (const name of names) {
  // Sequential on purpose: crates.io asks API clients to stay well under a request per second.
  tools[name] = { crates: await crates(name), npm: await npm(name) }
  const c = tools[name].crates
  const n = tools[name].npm
  console.log(
    `${name.padEnd(10)} ${c ? `crates ${c.version} (${c.downloads})` : "crates —"}  ${n ? `npm ${n.version}${n.placeholder ? " (reserved name)" : ` (${n.lastMonth}/mo)`}` : "npm —"}`,
  )
}

const payload = {
  generatedAt: new Date().toISOString().slice(0, 19) + "Z",
  tools,
}
await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n")
console.log(`\nwrote ${OUT}`)
