import assert from "node:assert/strict";
import { test } from "node:test";

import { loadRegistry, nativeFrame } from "../lib/family-readme.mjs";

const registry = await loadRegistry();
for (const current of registry.family) {
  test(`${current.name}: native theme has descriptive siblings, an icon, and no self-link`, () => {
    const { header, footer } = nativeFrame(registry, current.name);
    assert.ok(header.includes("a family of Rust tools"));
    assert.ok(footer.includes('width="24"'));
    assert.ok(footer.includes("More from Ferramenta"));
    assert.ok(!footer.includes(`[${current.name}](`));
    for (const sibling of registry.family.filter((tool) => tool.name !== current.name)) {
      assert.ok(footer.includes(`[${sibling.name}](${sibling.docs ?? sibling.repo})`));
      assert.ok(footer.includes(sibling.job));
    }
    assert.ok(!footer.includes("\r"));
  });
}
test("the family site's frame is a footer only: it does not introduce itself as part of itself", () => {
  const frame = nativeFrame(registry, null);
  assert.deepEqual(Object.keys(frame), ["footer"]);
  assert.match(frame.footer, /^## /u);
});
test("unknown identities fail rather than silently include a self-link", () => {
  assert.throws(() => nativeFrame(registry, "typo"), /Unknown Ferramenta project/u);
});
