import assert from "node:assert/strict";
import { test } from "node:test";

import {
  classifyOwnership,
  FOREIGN,
  ORG_TEAM_PREFIX,
  OURS,
  UNKNOWN,
} from "./registry-ownership.mjs";

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
