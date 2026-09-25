import assert from "node:assert/strict";
import { test } from "node:test";

import { inspectRenderedPage } from "./lib/rendered-page.mjs";

test("rendered page checker accepts matching fragments and the canonical URL", () => {
  assert.deepEqual(
    inspectRenderedPage(
      '<link rel="canonical" href="https://ferramenta.dev/"><main id="main-content"><a href="#why">Why</a><h2 id="why">Why</h2><a href="#">Top</a></main>',
    ),
    { fragmentCount: 1, missingFragments: [], hasCanonical: true },
  );
});

test("rendered page checker reports broken fragment links and missing canonical metadata", () => {
  assert.deepEqual(inspectRenderedPage('<main><a href="#main-content">Skip</a></main>'), {
    fragmentCount: 1,
    missingFragments: ["main-content"],
    hasCanonical: false,
  });
});
