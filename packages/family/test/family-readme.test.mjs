import assert from "node:assert/strict";
import { test } from "node:test";

import { familyBlock, loadRegistry } from "../lib/family-readme.mjs";

const registry = await loadRegistry();

test("a member's block lists the family's two tiers the way the site does, without itself", () => {
  const block = familyBlock(registry, "ferrocat");
  assert.match(block, /^### <a href="https:\/\/ferramenta\.dev">/u);
  assert.ok(block.includes("More from Ferramenta"));
  for (const label of ["Engines", "Applications"]) {
    assert.ok(block.includes(`**${label}**`), `missing tier: ${label}`);
  }
  assert.ok(
    block.indexOf("**Engines**") < block.indexOf("**Applications**"),
    "the engines come first",
  );
  assert.ok(!block.includes("[ferrocat]("), "a member is not its own sibling");
  const application = registry.family.find((tool) => tool.role === "application");
  assert.ok(application, "the registry has no application to check");
  assert.ok(
    block.includes(`[${application.name}](${application.docs})`),
    "applications get a row like every other member",
  );
});

test("the family site's own block names the whole family under one heading", () => {
  const block = familyBlock(registry, null);
  assert.match(block, /^## <a href="https:\/\/ferramenta\.dev">/u);
  assert.ok(!block.includes("More from Ferramenta"));
  for (const tool of registry.family) {
    assert.ok(block.includes(`[${tool.name}](${tool.docs ?? tool.repo})`), `missing: ${tool.name}`);
  }
});

test("a name the registry does not know fails rather than rendering an empty block", () => {
  assert.throws(() => familyBlock(registry, "typo"), /Unknown Ferramenta project/u);
});
