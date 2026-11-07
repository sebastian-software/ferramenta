/**
 * The registry, `family.ts`: the single source of truth for what each member
 * is and does, how the members relate, and what a page may claim about them.
 * Read from the package's build output, the way a sibling site reads it.
 */
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { test } from "node:test";
import { promisify } from "node:util";

import { kit, member } from "./helpers.mjs";

/** A minimal fetch Response carrying JSON, for the stubbed registries. */
const body = (value) => ({ ok: true, json: async () => value });

test("the registry has two tiers: the engines, and the applications the workshop also makes", () => {
  const { applications, engines } = kit.familyTiers();
  assert.equal(engines.length + applications.length, kit.family.length);
  assert.ok(engines.every((tool) => kit.isEngine(tool)));
  assert.ok(applications.every((tool) => !kit.isEngine(tool)));
  assert.deepEqual(
    kit.family.map((tool) => tool.name),
    [...engines, ...applications].map((tool) => tool.name),
    "the catalog lists every engine before the first application",
  );
  assert.ok(!kit.familyTiers("ferroni").engines.some((tool) => tool.name === "ferroni"));
  assert.throws(() => kit.familyTiers("nope"), /Unknown Ferramenta project/u);
});

test("every member says what it is before where it comes from", () => {
  for (const tool of kit.family) {
    if (kit.isEngine(tool)) {
      // A page lists the engines as "a regex engine, a syntax highlighter, …".
      assert.match(tool.what, /^An? /u, `${tool.name}: \`what\` is a noun phrase with its article`);
    }
    assert.doesNotMatch(tool.what, /\.$/u, `${tool.name}: \`what\` is a phrase, not a sentence`);
    assert.match(tool.does, /^[A-Z].*\.$/u, `${tool.name}: \`does\` is one sentence`);
    assert.match(tool.audience, /^For .*\.$/u, `${tool.name}: \`audience\` starts with "For"`);
    assert.equal(tool.brand !== undefined, !kit.isEngine(tool), "only an application has a brand");
  }
});

/** A member's relations as short strings: "runs-on ferroni". */
const relations = (name) =>
  kit.relationsOf(member(name)).map((relation) => `${relation.kind} ${relation.tool.name}`);

test("relations are read from both sides, and never imply a chain", () => {
  assert.deepEqual(relations("ferriki"), [
    "runs-on ferroni",
    "pairs-with ferromark",
    "carries ardo",
  ]);
  assert.deepEqual(relations("ferroni"), ["carries ferriki", "carries ferrolink"]);
  assert.deepEqual(
    relations("ferromark"),
    ["pairs-with ferriki", "carries palamedes", "carries ardo"],
    "Ferromark pairs with Ferriki; it does not depend on it",
  );
  assert.deepEqual(relations("ferrolex"), [], "a member that stands alone has none");
  assert.deepEqual(
    relations("palamedes"),
    member("palamedes").runsOn.map((name) => `runs-on ${name}`),
  );
  for (const tool of kit.family) {
    for (const name of [...(tool.uses ?? []), ...(tool.pairsWith ?? [])]) member(name);
  }
});

test("every member rests on exactly one fact: what it succeeds, builds on, or runs on", () => {
  const palamedes = member("palamedes");
  for (const tool of kit.family) {
    const lineage = [tool.succeeds, tool.buildsOn, tool.runsOn].filter(
      (fact) => fact !== undefined,
    );
    assert.equal(
      lineage.length,
      1,
      `${tool.name} rests on exactly one of succeeds, buildsOn, runsOn`,
    );
    assert.equal(
      tool.runsOn !== undefined,
      !kit.isEngine(tool),
      "only an application runs on engines",
    );
    assert.ok(kit.runsOnTools(tool).every((entry) => kit.family.includes(entry)));
  }
  assert.throws(() => kit.runsOnTools({ ...palamedes, runsOn: ["nope"] }), /unknown member: nope/u);
});

test("Ardo names the native engines shipped in its static documentation build", () => {
  const ardo = member("ardo");
  assert.deepEqual(
    kit.runsOnTools(ardo).map((tool) => tool.name),
    ["ferromark", "ferriki", "ferrolink"],
  );
  assert.deepEqual(
    kit.plannedRunsOnTools(ardo).map((tool) => tool.name),
    ["ferrigura"],
  );
  assert.deepEqual(relations("ardo"), [
    "runs-on ferromark",
    "runs-on ferriki",
    "runs-on ferrolink",
  ]);
  assert.throws(
    () => kit.plannedRunsOnTools({ ...ardo, plannedRunsOn: ["nope"] }),
    /unknown member: nope/u,
  );
});

test("a member links to its own site once it has one, to its repository until then", () => {
  for (const name of ["ferroni", "ferriki", "ferromark"]) {
    assert.equal(kit.toolHref(member(name)), `https://${name}.dev`);
    assert.equal(kit.leadsToRepo(member(name)), false);
  }
  for (const tool of kit.family) {
    assert.equal(kit.toolHref(tool), tool.docs ?? tool.repo);
  }
});

test("labels keep their acronyms and terms of art, with no text transform to fix them", () => {
  for (const tool of kit.family) {
    const label = kit.whatLabel(tool);
    assert.doesNotMatch(label, /\b(?:svg|pdf|markdown)\b/u, `${tool.name}: ${label}`);
    assert.doesNotMatch(label, /^An? /u, `${tool.name}: a label carries no article`);
    assert.match(label, /^[A-Zi]/u, `${tool.name}: sentence case, or a lowercase term of art`);
  }
  assert.equal(kit.whatLabel(kit.family[0]), "Regex engine");
  assert.equal(kit.whatLabel(member("palamedes")), "i18n toolchain for TypeScript apps");
});

test("registry evidence carries durable provenance instead of release counts", () => {
  for (const tool of kit.family) {
    assert.doesNotMatch(
      tool.evidence,
      /\d/u,
      `${tool.name} evidence must not embed a volatile release number`,
    );
  }
  assert.equal(member("ferroni").evidence, "Oniguruma compatibility oracle");
  assert.equal(member("ferromark").evidence, "CommonMark & GFM conformance");
});

test("the registry claims results qualitatively, never with a figure that goes stale", () => {
  // "Ahead of globset", "among the fastest", "a larger test suite" are fine; a
  // factor, a timing, a percentage or a test count pretends to a precision the
  // family site cannot keep current.
  const figure =
    /[×%]|(?<![\d.,])\d[\d.,]*\s?(?:x|ms|µs|ns|s|mib|mb|gib|gb|kib|kb|times|tests?|test functions)\b/iu;
  for (const tool of kit.family) {
    assert.doesNotMatch(tool.evidence, figure, `${tool.name} evidence states a figure`);
    assert.doesNotMatch(tool.proof, figure, `${tool.name} proof states a figure`);
    assert.ok(
      tool.succeeds === undefined || tool.buildsOn === undefined,
      `${tool.name} is either a successor or a new development, not both`,
    );
    assert.equal(kit.isSuccessor(tool), tool.succeeds !== undefined);
  }
});

test("every engine has source-backed evergreen editorial copy and its own presentation order", () => {
  const engines = kit.family.filter(kit.isEngine);
  const orders = new Set();
  for (const tool of engines) {
    assert.ok(tool.editorial, tool.name);
    const entry = tool.editorial;
    assert.ok(entry.navigation && entry.subtitle && entry.introduction, tool.name);
    assert.ok(entry.notes.length >= 2 && entry.notes.length <= 3, tool.name);
    for (const note of entry.notes) {
      assert.ok(note.title && note.body, tool.name);
      assert.match(
        note.href,
        /^https:\/\/github\.com\/sebastian-software\/[a-z]+\/blob\/[a-f0-9]{40}\//u,
      );
    }
    assert.ok(!entry.introduction.includes(tool.version), "release numbers belong to live facts");
    orders.add(entry.order);
  }
  assert.equal(orders.size, engines.length);
});

test("live registry figures come from one bulk request per registry and survive failures", async (t) => {
  const calls = [];
  const fetchStub = t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(String(url));
    if (String(url).includes("/crates?")) {
      return body({
        crates: [
          { id: "ferroni", max_stable_version: "9.9.9", max_version: "9.9.9", downloads: 42 },
        ],
      });
    }
    if (String(url).includes("/point/last-month/")) {
      return body({ ferromark: { downloads: 7, package: "ferromark" }, ferrocat: null });
    }
    if (String(url).endsWith("/ferromark/latest")) return body({ version: "3.0.0" });
    throw new Error("offline");
  });

  const live = await kit.fetchLiveRegistry({ crates: ["ferroni"], npm: ["ferromark", "ferrocat"] });
  assert.deepEqual(live.ferroni, { crates: { version: "9.9.9", downloads: 42 } });
  assert.deepEqual(live.ferromark, { npm: { version: "3.0.0", lastMonth: 7 } });
  assert.equal(live.ferrocat, undefined, "an unanswered package is left out, not zeroed");
  assert.equal(calls.filter((url) => url.includes("/crates?")).length, 1, "one crates.io request");
  assert.ok(calls.some((url) => url.startsWith(kit.REGISTRY_ENDPOINTS.crates)));

  fetchStub.mock.mockImplementation(async () => {
    throw new Error("offline");
  });
  assert.deepEqual(await kit.fetchLiveRegistry({ crates: ["ferroni"], npm: ["ferromark"] }), {});
});

test("every entry loads in a bare Node process", async () => {
  // No bundler, no loader hooks, resolved through the exports map: the case a
  // git consumer hits before its own build ever runs.
  const script = [
    'const registry = await import("ferramenta-family/registry");',
    'const root = await import("ferramenta-family");',
    'const mono = await import("ferramenta-family/monografie");',
    "console.log(JSON.stringify({",
    "  tiers: Object.keys(registry.familyTiers()),",
    "  members: registry.family.length,",
    "  site: registry.FAMILY_SITE,",
    "  engines: registry.family.filter((tool) => registry.isEngine(tool)).length,",
    "  root: [typeof root.RegistryFacts, typeof root.MarkDefs, typeof root.family],",
    "  mono: [typeof mono.MonoHeader, typeof mono.MarkDefs, typeof mono.RegistryFacts],",
    "}));",
  ].join("\n");
  const { stdout } = await promisify(execFile)(
    process.execPath,
    ["--input-type=module", "-e", script],
    { cwd: new URL("../../../", import.meta.url) },
  );
  const result = JSON.parse(stdout);
  assert.deepEqual(result.tiers, ["engines", "applications"]);
  assert.equal(result.members, kit.family.length);
  assert.equal(result.site, kit.FAMILY_SITE);
  assert.ok(result.engines > 0, "the registry knows which members are engines");
  assert.deepEqual(result.root, ["function", "function", "object"]);
  assert.deepEqual(result.mono, ["function", "function", "function"]);
});
