import assert from "node:assert/strict";
import { test } from "node:test";

import { releaseObservation } from "./lib/release-observation.mjs";

const monday = "2026-09-21T12:00:00Z";
const tuesday = "2026-09-22T12:00:00Z";
const wednesday = "2026-09-23T12:00:00Z";
const unresolved = { resolved: false };

test("failed refreshes retain the original release observation", () => {
  const observed = releaseObservation(
    undefined,
    { resolved: true, value: { version: "1.0.0" } },
    { previousGeneratedAt: undefined, observedAt: monday },
  );
  const first = releaseObservation(observed, unresolved, {
    previousGeneratedAt: tuesday,
    observedAt: tuesday,
  });
  const second = releaseObservation(first, unresolved, {
    previousGeneratedAt: wednesday,
    observedAt: wednesday,
  });
  assert.deepEqual(first, observed);
  assert.deepEqual(second, observed);
  assert.deepEqual(
    releaseObservation({ release: null }, unresolved, {
      previousGeneratedAt: monday,
      observedAt: tuesday,
    }),
    {
      release: null,
      releaseObservedAt: monday,
    },
  );
});

test("outages never invent a release observation for a new member", () => {
  const first = releaseObservation(undefined, unresolved, {
    previousGeneratedAt: monday,
    observedAt: tuesday,
  });
  const second = releaseObservation(first, unresolved, {
    previousGeneratedAt: tuesday,
    observedAt: wednesday,
  });
  assert.deepEqual(first, {});
  assert.deepEqual(second, {});
  assert.deepEqual(
    releaseObservation(
      first,
      { resolved: true, value: null },
      { previousGeneratedAt: tuesday, observedAt: wednesday },
    ),
    {
      release: null,
      releaseObservedAt: wednesday,
    },
  );
});
