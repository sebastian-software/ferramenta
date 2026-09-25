/**
 * Renders the social card (public/social.png, 1200×630) from the world itself:
 * iron ground, the poster headline, and the pegboard strip with every member's
 * mark from the registry. Re-run it whenever the family's line-up changes.
 *
 *   CHROME=/path/to/chrome-headless-shell node scripts/render-social-card.mjs
 *
 * Needs a Chromium binary (Playwright's chrome-headless-shell works) and the
 * package's build output (`pnpm build:package`).
 */
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { family, MARK_DEFS } from "../packages/family/dist/index.js";

const chrome = process.env.CHROME;
if (!chrome) throw new Error("CHROME is required: the path to a Chromium binary");

const styles = (name) => new URL(`../packages/family/styles/${name}.css`, import.meta.url).href;
const output = fileURLToPath(new URL("../public/social.png", import.meta.url));

const plates = family
  .map(
    (tool) => `
      <figure>
        <svg class="hook" aria-hidden="true"><use href="#i-hook" /></svg>
        <span class="markplate"><svg class="mark"><use href="#i-${tool.name}" /></svg></span>
        <figcaption>${tool.name}</figcaption>
      </figure>`,
  )
  .join("");

const html = `<!doctype html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${styles("tokens")}" />
<link rel="stylesheet" href="${styles("fonts")}" />
<link rel="stylesheet" href="${styles("chrome")}" />
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: var(--texture-brush), linear-gradient(var(--iron), var(--iron));
    border-top: 10px solid var(--rust);
    color: var(--iron-ink); font-family: var(--body);
    position: relative;
  }
  h1 {
    position: absolute; left: 64px; top: 52px;
    font: var(--disp-weight) 118px/0.92 var(--display); text-transform: uppercase;
  }
  h1 em { font-style: normal; color: var(--ember); display: block; }
  p {
    position: absolute; left: 66px; top: 282px; max-width: 900px;
    color: var(--iron-soft); font-size: 25px; line-height: 1.35;
  }
  .brand {
    position: absolute; right: 64px; top: 58px; display: flex; gap: 14px; align-items: center;
    font: var(--disp-weight) 34px/1 var(--display); text-transform: uppercase;
  }
  .brand svg { width: 44px; height: 44px; }
  .strip {
    position: absolute; left: 44px; right: 44px; bottom: 26px;
    display: grid; grid-template-columns: repeat(${family.length}, 1fr);
  }
  figure { position: relative; display: grid; justify-items: center; gap: 12px; padding-top: 22px; }
  .markplate { width: 84px; height: 84px; }
  .markplate svg { width: 52px; height: 52px; }
  figcaption { font: 700 19px/1 var(--display); letter-spacing: 0.03em; text-transform: uppercase; }
</style>
</head>
<body class="on-iron">
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${MARK_DEFS}</defs></svg>
<h1>Heavy industry <em>for the web.</em></h1>
<div class="brand"><svg class="mark"><use href="#i-ferramenta" /></svg>Ferramenta</div>
<p>Rust-native developer tools, built on the standards you already know.</p>
<div class="strip">${plates}</div>
</body>
</html>`;

const dir = await mkdtemp(join(tmpdir(), "social-card-"));
try {
  const page = join(dir, "card.html");
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is this script's own mkdtemp scratch directory
  await writeFile(page, html);
  execFileSync(chrome, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=3000",
    `--screenshot=${output}`,
    `file://${page}`,
  ]);
  console.log(`wrote ${output}`);
} finally {
  await rm(dir, { recursive: true, force: true });
}
