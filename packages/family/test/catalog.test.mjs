/**
 * The family catalog, rendered the way a sibling home page renders it: the
 * pegboard, the tool ledger and the job index from the package's build output,
 * and the registry-facts policy behind their release figures.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

const { renderToStaticMarkup } = await import("react-dom/server");
const { createElement } = await import("react");
const kit = await import("../dist/index.js");

const render = (component, props) => renderToStaticMarkup(createElement(component, props));

test("the job index lists every member A to Z by job, and ranks none", () => {
  const sorted = kit.byJob().map((tool) => tool.shortJob.toLowerCase());
  assert.deepEqual(
    sorted,
    [...sorted].sort((a, b) => a.localeCompare(b, "en")),
  );
  assert.equal(kit.byJob().length, kit.family.length);

  const html = render(kit.JobIndex);
  assert.match(html, /^<ul class="fam-jobs">/u);
  assert.equal(html.match(/class="fam-job"/gu).length, kit.family.length);
  const positions = kit.byJob().map((tool) => html.indexOf(`>${tool.shortJob}</span>`));
  assert.deepEqual(
    positions,
    [...positions].sort((a, b) => a - b),
    "rendered in job order",
  );
  for (const tool of kit.family) {
    assert.ok(html.includes(`href="${kit.toolHref(tool)}"`), `a link to ${tool.name}`);
  }
  const own = render(kit.JobIndex, { current: "ferroni" });
  assert.ok(!own.includes("#i-ferroni"), "a site leaves itself out");
});

test("the pegboard hangs every member with its stamp, grouped like the family", () => {
  const html = render(kit.Pegboard);
  assert.match(html, /^<nav class="fam-board" aria-label="The tool family">/u);
  assert.equal(html.match(/class="fam-board-item"/gu).length, kit.family.length);
  assert.equal(html.match(/class="fam-board-stamp"/gu).length, kit.family.length);
  assert.equal(html.match(/class="fam-board-group"/gu).length, 3);
  assert.equal(render(kit.Pegboard, { current: "ferroni" }).match(/fam-board-item/gu).length, 8);
});

test("the tool ledger numbers only a real sequence, and names what each member rests on", () => {
  const { language, pipeline } = kit.familyGroups();
  const chain = render(kit.ToolLedger, { steps: true, tools: pipeline });
  assert.match(chain, /^<div class="fam-tools" data-steps="">/u);
  assert.ok(chain.includes('<span class="fam-tool-num" aria-hidden="true">01</span>'));
  const plain = render(kit.ToolLedger, { tools: language });
  assert.ok(!plain.includes("fam-tool-num"), "no empty step column");
  assert.ok(!plain.includes("data-steps"));
  const palamedes = kit.family.find((tool) => tool.name === "palamedes");
  assert.ok(
    plain.includes(
      `<dt>Runs on</dt><dd class="fam-tool-names">${palamedes.runsOn.join(" · ")}</dd>`,
    ),
  );
  for (const tool of kit.family) {
    for (const name of tool.runsOn ?? []) {
      assert.ok(
        kit.family.some((member) => member.name === name),
        `${tool.name} runs on ${name}`,
      );
    }
    assert.equal(
      tool.runsOn !== undefined,
      !kit.isEngine(tool),
      "only an application runs on engines",
    );
  }
  // Outside RegistryFacts a row shows the registry's fallback version.
  assert.ok(plain.includes(`v${language[0].version}`));
});

test("registry facts: live over snapshot over fallback, and only owned packages are asked for", () => {
  const tool = kit.family.find((member) => member.name === "ferrocat");
  const stat = {
    crates: { version: "3.4.2", downloads: 10 },
    npm: { version: "0.2.0", lastMonth: 5 },
  };
  assert.deepEqual(kit.toolFacts(tool, stat), {
    version: "3.4.2",
    crateDownloads: 10,
    onCrates: true,
    adapter: true,
  });
  assert.equal(
    kit.toolFacts(tool, stat, { crates: { version: "3.5.0", downloads: 11 } }).version,
    "3.5.0",
  );
  assert.equal(kit.toolFacts(tool, undefined).version, tool.version, "the registry's fallback");
  assert.equal(
    kit.toolFacts(tool, {
      crates: null,
      npm: { version: "1.0.0", lastMonth: 0, placeholder: true },
    }).adapter,
    false,
    "a held npm name is no adapter",
  );

  const request = kit.liveRequestFor({
    ferroni: { crates: { version: "1", downloads: 1 }, npm: null },
    ferrocat: stat,
    palamedes: { crates: null, npm: { version: "1", lastMonth: 1, placeholder: true } },
    ferriki: { crates: null, npm: { version: "1", lastMonth: 1 } },
  });
  assert.deepEqual(request.crates, ["ferroni", "ferrocat"]);
  assert.deepEqual(request.npm, ["ferriki"], "npm only where no crate carries the version");
  assert.deepEqual(kit.liveRequestFor({ stranger: stat }), { crates: [], npm: [] });
});
