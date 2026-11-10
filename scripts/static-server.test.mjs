import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { resolveRequest } from "./lib/static-server.mjs";

async function site() {
  const root = await mkdtemp(join(tmpdir(), "static-site-"));
  await mkdir(join(root, "kit", "docs"), { recursive: true });
  await writeFile(join(root, "index.html"), "home");
  await writeFile(join(root, "kit", "docs", "index.html"), "docs");
  return root;
}

test("a directory answers with its index, and only with its trailing slash", async () => {
  const root = await site();
  try {
    assert.deepEqual(resolveRequest(`${root}/`, "/"), {
      status: 200,
      file: join(root, "index.html"),
    });
    assert.deepEqual(resolveRequest(root, "/"), { status: 200, file: join(root, "index.html") });
    assert.deepEqual(resolveRequest(root, "/kit/docs/?x=1"), {
      status: 200,
      file: join(root, "kit", "docs", "index.html"),
    });
    assert.deepEqual(
      resolveRequest(root, "/kit/docs"),
      { status: 301, location: "/kit/docs/" },
      "as GitHub Pages does: never the home page in its place",
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("a missing page is a 404, and nothing outside the site is served", async () => {
  const root = await site();
  try {
    assert.deepEqual(resolveRequest(root, "/nope/"), { status: 404 });
    assert.deepEqual(
      resolveRequest(root, "/kit/"),
      { status: 404 },
      "a directory without an index",
    );
    assert.notEqual(resolveRequest(root, "/../../etc/passwd").status, 200);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});
