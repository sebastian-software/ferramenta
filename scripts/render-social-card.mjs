/**
 * Renders the social card (public/social.png, 1200×630) from the world itself:
 * the dark oak bench, one riveted plate with the headline and the family's toolbox,
 * and every engine's icon from the registry below it. Re-run it whenever the
 * family's line-up changes.
 *
 *   CHROME=/path/to/chromium node scripts/render-social-card.mjs
 *
 * Needs a Chromium binary (Playwright's chrome-headless-shell works) and the
 * package's build output (`pnpm build:package`).
 */
import { spawn } from "node:child_process";
import { copyFile, mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { familyTiers } from "../packages/family/dist/index.js";

const chrome = process.env.CHROME;
if (!chrome) throw new Error("CHROME is required: the path to a Chromium binary");

const asset = (path) => new URL(`../packages/family/${path}`, import.meta.url).href;
const output = fileURLToPath(new URL("../public/social.png", import.meta.url));
const { engines } = familyTiers();

const strip = engines
  .map(
    (tool) => `
      <figure>
        <img src="${asset(`icons/${tool.name}-256.webp`)}" alt="" />
        <figcaption>${tool.name}</figcaption>
      </figure>`,
  )
  .join("");

const rivets = ["tl", "tr", "br", "bl"]
  .map((corner) => `<i class="fam-rivet" data-corner="${corner}"></i>`)
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${asset("styles/tokens.css")}" />
<link rel="stylesheet" href="${asset("styles/fonts.css")}" />
<link rel="stylesheet" href="${asset("styles/landing.css")}" />
<link rel="stylesheet" href="${asset("styles/chrome.css")}" />
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    position: relative; width: 1200px; height: 630px; overflow: hidden;
    background: var(--oak) url("${asset("textures/oak.webp")}") center / cover;
    color: var(--iron-ink); font-family: var(--body);
  }
  .plate {
    position: absolute; inset: 44px 44px auto; height: 382px;
    display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 32px;
    padding: 0 56px 0 64px;
  }
  .plate::after { transition: none; }
  small {
    display: block; margin-bottom: 18px;
    font: 600 26px/1 var(--display); letter-spacing: 0.16em; text-transform: uppercase;
  }
  h1 { font: 700 86px/0.95 var(--display); letter-spacing: 0.005em; text-transform: uppercase; }
  h1 em { font-style: normal; color: var(--rust-on-steel); }
  .plate img {
    width: 300px; height: 300px;
    filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.5)) drop-shadow(0 14px 14px rgb(0 0 0 / 0.3));
  }
  .strip {
    position: absolute; inset: auto 44px 34px;
    display: grid; grid-template-columns: repeat(${engines.length}, 1fr);
  }
  figure { display: grid; justify-items: center; gap: 8px; }
  figure img { width: 88px; height: 88px; }
  figcaption {
    font: 700 22px/1 var(--display); letter-spacing: 0.08em; text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="fam-plate plate">
  ${rivets}
  <div>
    <small>Ferramenta</small>
    <h1>The engines under your tools, rebuilt in <em>Rust</em>.</h1>
  </div>
  <img src="${asset("icons/ferramenta.webp")}" alt="" />
</div>
<div class="strip">${strip}</div>
</body>
</html>`;

/** Resolves once the file exists and has stopped growing. */
async function written(path, attempts = 100) {
  let last = -1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    await sleep(200);
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is this script's own output file
    const size = await stat(path).then(
      (entry) => entry.size,
      () => -1,
    );
    if (size > 0 && size === last) return;
    last = size;
  }
  throw new Error(`the browser wrote no ${path}`);
}

const dir = await mkdtemp(join(tmpdir(), "social-card-"));
try {
  const page = join(dir, "card.html");
  const shot = join(dir, "card.png");
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is this script's own mkdtemp scratch directory
  await writeFile(page, html);
  // Some Chromium builds keep running after the screenshot, so the browser is
  // stopped once the file is complete instead of waited for.
  const browser = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      `--user-data-dir=${join(dir, "profile")}`,
      `--screenshot=${shot}`,
      `file://${page}`,
    ],
    { stdio: "ignore" },
  );
  try {
    await written(shot);
  } finally {
    browser.kill();
  }
  await copyFile(shot, output);
  console.log(`wrote ${output}`);
} finally {
  await rm(dir, { recursive: true, force: true });
}
