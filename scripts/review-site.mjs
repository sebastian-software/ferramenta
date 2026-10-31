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
  editorialProblems,
  flyoutState,
  focused,
  mobileCardProblems,
  motion,
  plateProblems,
  productGridProblems,
  readingTableProblems,
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
  { name: "ferra-kit", path: "/kit/ferra/" },
  { name: "ferra-instruments", path: "/kit/ferra/instruments/" },
  { name: "kit-tool", path: "/kit/tool/" },
  { name: "kit-docs", path: "/kit/docs/getting-started/" },
  { name: "kit-docs-benchmarks", path: "/kit/docs/benchmarks/" },
];
/** Phones from the narrowest still in use, a tablet, and desktops up to a wide one. */
const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];
/** The order a keyboard walks the home page's bar in. */
const HOME_TAB_ORDER = ["Skip to content", "Ferramenta", "Engines", "Workshop", "GitHub"];

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
  expect(
    page.errors().length === 0,
    `${name} at ${width}px: browser errors: ${page.errors().join("; ")}`,
  );
  const scroll = await page.evaluate(call(sidewaysScroll));
  const groups = await Promise.all(
    [
      barProblems,
      plateProblems,
      comparisonProblems,
      editorialProblems,
      mobileCardProblems,
      productGridProblems,
      readingTableProblems,
    ].map((check) => page.evaluate(call(check))),
  );
  const problems = groups.flat();
  expect(scroll === 0, `${name} at ${width}px: the page scrolls sideways by ${scroll}px`);
  expect(problems.length === 0, `${name} at ${width}px: ${problems.join("; ")}`);
  await save(`${name}-${width}`, await page.screenshot({ fullPage: true }));
  if (name === "home" && [390, 1024, 1440].includes(width))
    await save(`${name}-${width}-opening`, await page.screenshot());
}

async function reviewDesktopContents(page, origin) {
  await page.viewport(1024, 900);
  await page.open(`${origin}/`);
  const articles = await page.evaluate(`document.querySelectorAll('.ferra-engine-article').length`);
  const entries = await page.evaluate(`document.querySelectorAll('.ferra-contents-list a').length`);
  expect(entries === articles && articles > 0, "editorial contents: every article has one entry");
  // The contents and article orders intentionally differ; location follows document geometry.
  for (const id of ["ferriki", "ferrocat", "ferrigura"]) {
    await page.evaluate(`document.querySelector('.ferra-contents a[href="#${id}"]').click()`);
    await page.evaluate("new Promise((resolve) => setTimeout(resolve, 120))");
    const active = await page.evaluate(
      `document.querySelector('.ferra-contents [aria-current="location"]')?.getAttribute('href')`,
    );
    expect(active === `#${id}`, `editorial contents: ${id} is current after navigation`);
  }
}

async function reviewMobileContents(page, origin) {
  await page.viewport(390, 900);
  await page.open(`${origin}/`);
  await page.evaluate(`document.querySelector('.ferra-contents-toggle').focus()`);
  await page.press("Enter");
  await page.evaluate(
    "new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
  );
  const open = await page.evaluate(
    `document.querySelector('.ferra-contents-toggle').getAttribute('aria-expanded')`,
  );
  expect(open === "true", "mobile contents: Enter opens the disclosure");
  expect(
    (await page.evaluate(call(sidewaysScroll))) === 0,
    "mobile contents: expanded list fits the viewport",
  );
  await save("home-390-contents-open", await page.screenshot());
  await page.press("Escape");
  const closed = await page.evaluate(
    `document.querySelector('.ferra-contents-toggle').getAttribute('aria-expanded') === 'false' && document.activeElement.matches('.ferra-contents-toggle')`,
  );
  expect(closed, "mobile contents: Escape closes the list and retains trigger focus");
}

async function reviewContentsChoice(page) {
  await page.press("Enter");
  await page.evaluate(
    "new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
  );
  await page.evaluate(`document.querySelector('.ferra-contents a[href="#ferrocat"]').click()`);
  await page.evaluate("new Promise((resolve) => setTimeout(resolve, 120))");
  const chosen = await page.evaluate(
    `({closed: document.querySelector('.ferra-contents-toggle').getAttribute('aria-expanded') === 'false', hash: location.hash, focus: document.activeElement.id})`,
  );
  expect(
    chosen.closed && chosen.hash === "#ferrocat" && chosen.focus === "ferrocat",
    "mobile contents: choosing an engine closes the list and focuses its article",
  );
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

/** The original landing kit still moves on request, and rests for reduced motion. */
async function reviewMotion(page, origin) {
  await page.viewport(1440, 900);
  await page.media({ "prefers-reduced-motion": "no-preference" });
  await page.open(`${origin}/kit/tool/`);
  const resting = await page.evaluate(call(motion));
  await page.move(1300, 400);
  const moved = await page.evaluate(call(motion));
  expect(resting.sway !== "none", "motion: the hanging tag has no sway");
  expect(moved.sheen !== resting.sheen, "motion: the reflection does not follow the pointer");

  await page.media({ "prefers-reduced-motion": "reduce" });
  await page.open(`${origin}/kit/tool/`);
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
  await reviewDesktopContents(page, server.origin);
  await reviewMobileContents(page, server.origin);
  await reviewContentsChoice(page);
  await reviewMotion(page, server.origin);
} finally {
  await browser.close();
  server.close();
}

console.log(`${checks} checks, ${failures.length} failed. Captures in .impeccable/review/`);
for (const failure of failures) console.error(`  ✖ ${failure}`);
process.exitCode = failures.length === 0 ? 0 : 1;
