import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { checkMarkdownLinks } from "./check-markdown-links.mjs";

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "markdown-links-"));
  await mkdir(join(root, "docs"), { recursive: true });
  await writeFile(
    join(root, "README.md"),
    "# Home\n\n[Guide](docs/guide.md#installation)\n\n[External](https://example.com)\n",
  );
  await writeFile(join(root, "docs", "guide.md"), "# Guide\n\n## Installation\n");
  return root;
}

test("accepts existing local links and ignores external URLs", async () => {
  const root = await fixture();
  try {
    assert.deepEqual(checkMarkdownLinks(root), []);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("reports missing files and ignores missing heading anchors", async () => {
  const root = await fixture();
  try {
    await writeFile(
      join(root, "README.md"),
      "[Missing](docs/nope.md)\n[Anchor](docs/guide.md#missing)\n",
    );
    assert.deepEqual(checkMarkdownLinks(root), [
      "README.md: docs/nope.md does not resolve to docs/nope.md",
    ]);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("ignores same-document anchors", async () => {
  const root = await fixture();
  try {
    await writeFile(
      join(root, "README.md"),
      "# Repeat\n\n# Repeat\n\n[First](#repeat) [Missing](#missing)\n",
    );
    assert.deepEqual(checkMarkdownLinks(root), []);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("ignores Markdown links inside code fences", async () => {
  const root = await fixture();
  try {
    await writeFile(
      join(root, "README.md"),
      "# Café\n\n```md\n[Missing](docs/nope.md)\n```\n\n[Real](#café)\n",
    );
    assert.deepEqual(checkMarkdownLinks(root), []);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("splits raw delimiters before decoding and checks reference links", async () => {
  const root = await fixture();
  try {
    await writeFile(join(root, "docs", "hash#name.md"), "# Hash\n");
    await writeFile(join(root, "docs", "query?name.md"), "# Query\n");
    await writeFile(
      join(root, "README.md"),
      "[Hash](docs/hash%23name.md) [Query](docs/query%3Fname.md) [Missing hash](docs/missing%23name.md) [Missing query](docs/missing%3Fname.md)\n\n[Guide][guide] [Missing][missing]\n\n[guide]: docs/guide.md\n[missing]: docs/nope.md\n",
    );
    assert.deepEqual(checkMarkdownLinks(root), [
      "README.md: docs/missing%23name.md does not resolve to docs/missing#name.md",
      "README.md: docs/missing%3Fname.md does not resolve to docs/missing?name.md",
      "README.md: docs/nope.md does not resolve to docs/nope.md",
    ]);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("checks destinations containing balanced parentheses", async () => {
  const root = await fixture();
  try {
    await writeFile(join(root, "docs", "setup(legacy).md"), "# Legacy setup\n");
    await writeFile(
      join(root, "README.md"),
      "[Existing](docs/setup(legacy).md) [Missing](docs/missing(legacy).md)\n",
    );
    assert.deepEqual(checkMarkdownLinks(root), [
      "README.md: docs/missing(legacy).md does not resolve to docs/missing(legacy).md",
    ]);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});
