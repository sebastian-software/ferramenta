import assert from "node:assert/strict";
import { test } from "node:test";

import { FerraComparisonTable, FerraRenderedCode } from "../dist/ferra.js";
import { render } from "./helpers.mjs";

test("comparisons retain zero, negative and partial results with native table headers", () => {
  const html = render(FerraComparisonTable, {
    caption: "Fictional results",
    subject: "Input",
    contenders: [
      { id: "own", label: "Sample", own: true },
      { id: "other", label: "Reference" },
    ],
    rows: [
      { label: "Empty", values: { own: 0, other: false } },
      {
        label: "Context",
        values: { own: true, other: { mark: "partial", note: "One input kind" } },
      },
    ],
  });
  assert.match(html, /scope="col"/);
  assert.match(html, /scope="row"/);
  assert.match(html, />0<\/td>/);
  assert.match(html, />No<\/td>/);
  assert.match(html, /Partial.*One input kind/);
  assert.match(html, /role="region" tabindex="0"/);
});

test("generated code keeps its source and renderer attributes while gaining keyboard access", () => {
  const html = render(FerraRenderedCode, {
    caption: "Trusted example",
    html: '<pre data-renderer="sample" style="background-color:#24292e;color:#e1e4e8"><code>&lt;pre&gt; &amp; code</code></pre>',
  });
  assert.match(html, /<pre tabindex="0" data-renderer="sample"/);
  assert.match(html, /background-color:#24292e !important;color:#e1e4e8/);
  assert.match(html, /&lt;pre&gt; &amp; code/);
  const existing = render(FerraRenderedCode, {
    caption: "Already accessible",
    html: '<pre tabindex="0"><code>value</code></pre>',
  });
  assert.equal((existing.match(/tabindex="0"/g) ?? []).length, 1);
});
