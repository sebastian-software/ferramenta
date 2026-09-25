import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CRATES_IO_MIN_INTERVAL_MS,
  createRegistryFetcher,
  REGISTRY_TIMEOUT_MS,
} from "./lib/registry-fetch.mjs";

test("registry fetches have a timeout and crates.io requests are paced", async () => {
  let now = 0;
  const waits = [];
  const timeouts = [];
  const urls = [];
  const fetchJson = createRegistryFetcher({
    now: () => now,
    async wait(milliseconds) {
      waits.push(milliseconds);
      now += milliseconds;
    },
    timeoutSignal(milliseconds) {
      timeouts.push(milliseconds);
      return new AbortController().signal;
    },
    async request(url) {
      urls.push(url);
      return { ok: true, status: 200, json: async () => ({}) };
    },
  });

  await fetchJson("https://crates.io/api/v1/crates/ferroni");
  now += 250;
  await fetchJson("https://crates.io/api/v1/crates/ferroni/owners");
  await fetchJson("https://registry.npmjs.org/ferroni");

  assert.deepEqual(waits, [CRATES_IO_MIN_INTERVAL_MS - 250]);
  assert.deepEqual(timeouts, [REGISTRY_TIMEOUT_MS, REGISTRY_TIMEOUT_MS, REGISTRY_TIMEOUT_MS]);
  assert.equal(urls.length, 3);
});

test("registry fetch failures stay unresolved instead of looking like missing packages", async () => {
  const fetchJson = createRegistryFetcher({
    async request() {
      throw new Error("offline");
    },
    timeoutSignal: () => new AbortController().signal,
  });

  assert.deepEqual(await fetchJson("https://crates.io/api/v1/crates/ferroni"), {
    ok: false,
    reason: "offline",
  });
});
