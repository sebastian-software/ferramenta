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
