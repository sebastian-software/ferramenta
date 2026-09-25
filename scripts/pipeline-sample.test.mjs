import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { PIPELINE_SAMPLE_MARKDOWN } from "./lib/pipeline-sample.mjs";

test("the committed pipeline sample matches its input and contains only sanitized HTML", async () => {
  const sample = JSON.parse(
    await readFile(new URL("../app/data/pipeline-sample.json", import.meta.url), "utf8"),
  );

  assert.equal(sample.markdown, PIPELINE_SAMPLE_MARKDOWN);
  assert.doesNotMatch(sample.html, /<\s*script\b/iu);
  assert.doesNotMatch(sample.html, /\son[a-z]+\s*=/iu);
  assert.doesNotMatch(sample.html, /\bjavascript\s*:/iu);
});
