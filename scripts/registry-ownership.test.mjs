import assert from "node:assert/strict";
import { test } from "node:test";

import { family } from "../packages/family/dist/family.js";
import {
  classifyOwnership,
  FOREIGN,
  lookupNames,
  ORG_TEAM_PREFIX,
  OURS,
  UNKNOWN,
} from "./registry-ownership.mjs";

const member = (name) => family.find((tool) => tool.name === name);

test("a member is looked up under its published package names, else under its name", () => {
  // Ferriki's npm package is scoped; the unscoped name is not its package.
  assert.deepEqual(lookupNames(member("ferriki")), {
    crate: "ferriki",
    npm: "@ferriki/core",
    repo: "ferriki",
  });
  assert.deepEqual(lookupNames(member("ferromark")), {
    crate: "ferromark",
    npm: "ferromark",
    repo: "ferromark",
  });
  assert.deepEqual(
    lookupNames({ name: "example", packages: { crates: "example-core" } }),
    { crate: "example-core", npm: "example", repo: "example" },
    "each registry falls back on its own",
  );
});

test("a package published by an org account is ours", () => {
  assert.equal(classifyOwnership(["swernerx"]), OURS);
  assert.equal(classifyOwnership(["someone-else", "fastner"]), OURS);
});

test("owner logins are matched case-insensitively", () => {
  assert.equal(classifyOwnership(["SwernerX"]), OURS);
});

test("an org team owner counts as ours", () => {
  assert.equal(classifyOwnership([`${ORG_TEAM_PREFIX}publishers`]), OURS);
});

test("a package published by strangers is foreign", () => {
  assert.equal(classifyOwnership(["someone-else"]), FOREIGN);
  assert.equal(classifyOwnership(["github:another-org:team"]), FOREIGN);
});

test("a name with no owners at all is foreign, not ours", () => {
  assert.equal(classifyOwnership([]), FOREIGN);
});

test("a failed ownership lookup is unknown, never foreign", () => {
  // The regression this guards: a transient 429 on the crates.io /owners
  // endpoint arrived as an empty owner list and demoted a real crate to
  // "absent", which the nightly job then committed.
  assert.equal(classifyOwnership(null), UNKNOWN);
  assert.notEqual(classifyOwnership(null), FOREIGN);
});
