/**
 * Reviews the built site in a real browser: every page at every width, its
 * flyouts open, its keyboard order, and its motion. It writes the captures to
 * `.impeccable/review/` and exits 1 when a check fails.
 *
 *   pnpm build && CHROME=/path/to/chromium pnpm review
 *
 * Not part of CI: it needs a Chromium binary (Playwright's
 * chrome-headless-shell works). Run it before a design change is called done;
 * a still of one width proves nothing about the others.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { launchBrowser } from "./lib/browser.mjs";
import {
  barProblems,
  comparisonProblems,
  flyoutState,
  focused,
  motion,
  plateProblems,
  sidewaysScroll,
} from "./lib/review-checks.mjs";
import { serveStatic } from "./lib/static-server.mjs";

const chrome = process.env.CHROME;
if (!chrome) throw new Error("CHROME is required: the path to a Chromium binary");

const build = fileURLToPath(new URL("../build/client", import.meta.url));
const out = new URL("../.impeccable/review/", import.meta.url);

const PAGES = [
  { name: "home", path: "/" },
  { name: "kit", path: "/kit/" },
  { name: "kit-tool", path: "/kit/tool/" },
  { name: "kit-docs", path: "/kit/docs/getting-started/" },
  { name: "kit-docs-benchmarks", path: "/kit/docs/benchmarks/" },
];
/** Phones from the narrowest still in use, a tablet, and desktops up to a wide one. */
const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];
/** The order a keyboard walks the home page's bar in. */
const HOME_TAB_ORDER = [
  "Skip to content",
  "ferramenta",
  "Engines",
  "Applications",
  "Work with us",
  "GitHub",
];

const failures = [];
let checks = 0;

/** Records one check; a failed one is listed at the end and fails the run. */
function expect(condition, what) {
  checks += 1;
  if (!condition) failures.push(what);
}

/** A check from review-checks.mjs as the source the page runs. */
const call = (check, ...parameters) =>
  `(${check})(${parameters.map((parameter) => JSON.stringify(parameter)).join(", ")})`;

const clickSummary = (selector) =>
  `document.querySelector(${JSON.stringify(`${selector} summary`)}).click()`;

async function save(name, png) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- a fixed directory inside this repository, names from the lists above
  await writeFile(new URL(`${name}.png`, out), png);
}

/** One page at one width: no layout problem, and a full-page capture. */
async function reviewLayout(page, { name, url, width }) {
  await page.viewport(width, 900);
  await page.open(url);
  const scroll = await page.evaluate(call(sidewaysScroll));
  const inBar = await page.evaluate(call(barProblems));
  const onPlates = await page.evaluate(call(plateProblems));
  const inComparisons = await page.evaluate(call(comparisonProblems));
  const problems = [...inBar, ...onPlates, ...inComparisons];
  expect(scroll === 0, `${name} at ${width}px: the page scrolls sideways by ${scroll}px`);
  expect(problems.length === 0, `${name} at ${width}px: ${problems.join("; ")}`);
  await save(`${name}-${width}`, await page.screenshot({ fullPage: true }));
}

/** Opens a flyout and checks the open panel; leaves it open. */
async function reviewOpenFlyout(page, { label, selector, width }) {
  const where = `${label} at ${width}px`;
  await page.evaluate(clickSummary(selector));
  const open = await page.evaluate(call(flyoutState, selector));
  expect(open.open, `${where}: it does not open`);
  expect(open.inside, `${where}: the open panel leaves the viewport`);
  expect(open.links.length > 0, `${where}: the panel lists nothing`);
  await save(`${label}-${width}-open`, await page.screenshot());
}

/** A flyout opens inside the viewport, and closes on Escape and on a click elsewhere. */
async function reviewFlyout(page, { label, selector, url, width }) {
  const where = `${label} at ${width}px`;
  await page.viewport(width, 900);
  await page.open(url);
  await reviewOpenFlyout(page, { label, selector, width });

  await page.press("Escape");
  const escaped = await page.evaluate(call(flyoutState, selector));
  expect(!escaped.open, `${where}: Escape does not close it`);
  expect(escaped.focusOnTrigger, `${where}: focus does not return to the trigger after Escape`);

  await page.evaluate(clickSummary(selector));
  await page.click(Math.round(width / 2), 860);
  const clicked = await page.evaluate(call(flyoutState, selector));
  expect(!clicked.open, `${where}: a click elsewhere does not close it`);
}

/** The docs menu: only where the sidebar is gone, and it closes when a page is chosen. */
async function reviewDocsMenu(page, origin) {
  const url = `${origin}/kit/docs/getting-started/`;
  const selector = "details.site-menu";
  await page.viewport(1440, 900);
  await page.open(url);
  const wide = await page.evaluate(call(flyoutState, selector));
  expect(!wide.shown, "docs at 1440px: the section menu shows beside the sidebar");

  for (const width of [320, 390, 768]) {
    await reviewFlyout(page, { label: "docs-menu", selector, url, width });
  }
  await page.evaluate(clickSummary(selector));
  await page.evaluate(`document.querySelector("${selector} a:not([aria-current])").click()`);
  await page.evaluate("new Promise((resolve) => setTimeout(resolve, 600))");
  const after = await page.evaluate(call(flyoutState, selector));
  const path = await page.evaluate("location.pathname");
  expect(path.includes("/configuration"), "docs menu: choosing a page does not go there");
  expect(!after.open, "docs menu: it stays open after a page is chosen");
}

/** Tab walks the bar in reading order, and every stop shows its focus. */
async function reviewKeyboard(page, origin) {
  await page.viewport(1440, 900);
  await page.open(`${origin}/`);
  const stops = [];
  for (const expected of HOME_TAB_ORDER) {
    await page.press("Tab");
    const stop = await page.evaluate(call(focused));
    stops.push(stop.name);
    expect(stop.shows, `keyboard: "${expected}" shows no focus ring`);
  }
  expect(
    stops.join(" > ") === HOME_TAB_ORDER.join(" > "),
    `keyboard: the bar's order is ${stops.join(" > ")}`,
  );
  await save("home-1440-focus", await page.screenshot());
}

/** The tag sways and the reflection follows the pointer; both stand still on request. */
async function reviewMotion(page, origin) {
  await page.viewport(1440, 900);
  await page.media({ "prefers-reduced-motion": "no-preference" });
  await page.open(`${origin}/`);
  const resting = await page.evaluate(call(motion));
  await page.move(1300, 400);
  const moved = await page.evaluate(call(motion));
  expect(resting.sway !== "none", "motion: the hanging tag has no sway");
  expect(moved.sheen !== resting.sheen, "motion: the reflection does not follow the pointer");

  await page.media({ "prefers-reduced-motion": "reduce" });
  await page.open(`${origin}/`);
  const reduced = await page.evaluate(call(motion));
  await page.move(200, 400);
  const afterMove = await page.evaluate(call(motion));
  expect(reduced.sway === "none", "reduced motion: the hanging tag still sways");
  expect(afterMove.sheen === reduced.sheen, "reduced motion: the reflection still moves");
}

/** The switchers of the chrome, where each one appears. */
async function reviewSwitchers(page, origin) {
  for (const width of [390, 1440]) {
    await reviewFlyout(page, {
      label: "switcher",
      selector: "details.switcher",
      url: `${origin}/kit/`,
      width,
    });
  }
  await reviewFlyout(page, {
    label: "family-switcher",
    selector: "details.switcher-family",
    url: `${origin}/kit/tool/`,
    width: 360,
  });
}

// eslint-disable-next-line security/detect-non-literal-fs-filename -- a fixed directory inside this repository
await mkdir(out, { recursive: true });
const server = await serveStatic(build);
const browser = await launchBrowser(chrome);
try {
  const { page } = browser;
  // Stills are taken with motion at rest, so an entrance animation is never mistaken for a defect.
  await page.media({ "prefers-reduced-motion": "reduce" });
  for (const { name, path } of PAGES) {
    const url = server.origin + path;
    for (const width of WIDTHS) await reviewLayout(page, { name, url, width });
  }
  await reviewSwitchers(page, server.origin);
  await reviewDocsMenu(page, server.origin);
  await reviewKeyboard(page, server.origin);
  await reviewMotion(page, server.origin);
} finally {
  await browser.close();
  server.close();
}

console.log(`${checks} checks, ${failures.length} failed. Captures in .impeccable/review/`);
for (const failure of failures) console.error(`  ✖ ${failure}`);
process.exitCode = failures.length === 0 ? 0 : 1;
