/**
 * The registry-facts policy behind the release figures a page shows: live over
 * snapshot over the registry's fallback, asked only for packages the family
 * owns, from one metrics document where it answers.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { kit } from "./helpers.mjs";

test("registry facts: live over snapshot over fallback, and only owned packages are asked for", () => {
  const tool = kit.family.find((member) => member.name === "ferrocat");
  const stat = {
    crates: { version: "3.4.2", downloads: 10 },
    npm: { version: "0.2.0", lastMonth: 5 },
  };
  assert.deepEqual(kit.toolFacts(tool, stat), {
    version: "3.4.2",
    crateDownloads: 10,
    onCrates: true,
    adapter: true,
  });
  assert.equal(
    kit.toolFacts(tool, stat, { crates: { version: "3.5.0", downloads: 11 } }).version,
    "3.5.0",
  );
  assert.equal(kit.toolFacts(tool, undefined).version, tool.version, "the registry's fallback");
  assert.equal(
    kit.toolFacts(tool, {
      crates: null,
      npm: { version: "1.0.0", lastMonth: 0, placeholder: true },
    }).adapter,
    false,
    "a held npm name is no adapter",
  );

  const request = kit.liveRequestFor({
    ferroni: { crates: { version: "1", downloads: 1 }, npm: null },
    ferrocat: stat,
    palamedes: { crates: null, npm: { version: "1", lastMonth: 1, placeholder: true } },
    ferriki: { crates: null, npm: { version: "1", lastMonth: 1 } },
  });
  assert.deepEqual(request.crates, ["ferroni", "ferrocat"]);
  assert.deepEqual(request.npm, ["ferriki"], "npm only where no crate carries the version");
  assert.deepEqual(kit.liveRequestFor({ stranger: stat }), { crates: [], npm: [] });
});

const body = (value) => ({ ok: true, json: async () => value });
const metricsDoc = (sources = { github: "ok", crates: "ok", npm: "ok" }) => ({
  schema: 1,
  generatedAt: "2026-09-24T12:00:00Z",
  sources,
  github: {
    ferriki: { stars: 0, forks: 1, release: { tag: "v9.3.0", version: "9.3.0", publishedAt: "x" } },
  },
  crates: {
    ferroni: { version: "9.0.0", downloads: 5, recentDownloads: 1, publishedAt: "x" },
    "someone-else": { version: "1.0.0", downloads: 1, recentDownloads: 1, publishedAt: "x" },
  },
  npm: { ferromark: { version: "9.1.0", monthlyDownloads: 7, publishedAt: "x" } },
});
const verified = { ferroni: { crates: { version: "1", downloads: 1 }, npm: null } };

test("family facts come from the metrics document in one request", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url: String(url), cache: options?.cache });
    return body(metricsDoc());
  });
  const facts = await kit.fetchFamilyFacts(verified);
  assert.deepEqual(
    calls,
    [{ url: kit.METRICS_URL, cache: "no-cache" }],
    "the page revalidates its metrics document and asks no registry when the service answered",
  );
  assert.deepEqual(facts.ferroni, { crates: { version: "9.0.0", downloads: 5 } });
  assert.deepEqual(facts.ferromark, { npm: { version: "9.1.0", lastMonth: 7 } });
  assert.equal(facts["someone-else"], undefined, "only family members");
  assert.deepEqual(facts.ferriki, { release: { version: "9.3.0" } }, "a Git-only tool's release");
  const ferriki = kit.family.find((tool) => tool.name === "ferriki");
  assert.equal(kit.toolFacts(ferriki, { crates: null, npm: null }, facts.ferriki).version, "9.3.0");
  assert.equal(
    kit.toolFacts(ferriki, { crates: null, npm: null, release: { version: "9.2.0" } }).version,
    "9.2.0",
    "the snapshot's release before the registry's hand-set fallback",
  );

  // Without a snapshot the live facts stand on their own: a sibling site gets figures too.
  const ferroni = kit.family.find((tool) => tool.name === "ferroni");
  assert.equal(kit.toolFacts(ferroni, undefined, facts.ferroni).version, "9.0.0");
});

test("metrics older than the snapshot are ignored and verified registries are queried", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(String(url));
    if (String(url) === kit.METRICS_URL) return body(metricsDoc());
    if (String(url).includes("/crates?")) {
      return body({ crates: [{ id: "ferroni", max_stable_version: "2.0.0", downloads: 2 }] });
    }
    throw new Error("unexpected request");
  });
  const facts = await kit.fetchFamilyFacts(verified, {
    snapshotGeneratedAt: "2026-09-25T05:00:00Z",
  });
  assert.deepEqual(calls, [
    kit.METRICS_URL,
    `${kit.REGISTRY_ENDPOINTS.crates}/crates?ids[]=ferroni&per_page=1`,
  ]);
  assert.deepEqual(facts.ferroni, { crates: { version: "2.0.0", downloads: 2 } });
});

test("a registry the metrics service did not answer is asked directly, for verified names only", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(String(url));
    if (String(url) === kit.METRICS_URL) {
      return body(metricsDoc({ github: "ok", crates: "error", npm: "ok" }));
    }
    if (String(url).includes("/crates?")) {
      return body({ crates: [{ id: "ferroni", max_stable_version: "9.9.9", downloads: 42 }] });
    }
    throw new Error("offline");
  });
  const facts = await kit.fetchFamilyFacts(verified);
  assert.equal(calls.length, 2, "the document, then crates.io");
  assert.equal(facts.ferroni.crates.version, "9.9.9");
});

test("with the metrics service down, the page falls back to the registries", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (String(url).includes("/crates?")) {
      return body({ crates: [{ id: "ferroni", max_stable_version: "9.9.9", downloads: 42 }] });
    }
    return { ok: false, json: async () => ({}) };
  });
  const facts = await kit.fetchFamilyFacts(verified);
  assert.equal(facts.ferroni.crates.version, "9.9.9");
  assert.deepEqual(
    await kit.fetchFamilyFacts({}),
    {},
    "nothing verified, nothing asked, nothing shown",
  );
});
