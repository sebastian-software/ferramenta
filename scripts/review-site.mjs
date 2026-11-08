/**
 * Reviews the built site in a real browser: every page at every width, its
 * menus open, its keyboard order, and its motion. It writes the captures to
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
  focused,
  landmarkProblems,
  readingTableProblems,
  scrollProblems,
  sidewaysScroll,
} from "./lib/review-checks.mjs";
import { serveStatic } from "./lib/static-server.mjs";

const chrome = process.env.CHROME;
if (!chrome) throw new Error("CHROME is required: the path to a Chromium binary");

const build = fileURLToPath(new URL("../build/client", import.meta.url));
const out = new URL("../.impeccable/review/", import.meta.url);

const KIT_DOCS = "/kit/docs/";
const PAGES = [
  { name: "home", path: "/" },
  { name: "kit", path: "/kit/" },
  { name: "kit-docs", path: KIT_DOCS },
];
/**
 * Phones from the narrowest still in use, a tablet, the first width with the
 * header's links in the bar, and desktops up to a wide one.
 */
const WIDTHS = [320, 360, 390, 768, 980, 1024, 1280, 1440, 1920];
/** The order a keyboard walks the home page's bar in. */
const HOME_TAB_ORDER = [
  "Skip to content",
  "Ferramenta",
  "Engines",
  "Applications",
  "Workshop",
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
    [barProblems, readingTableProblems, scrollProblems, landmarkProblems].map((check) =>
      page.evaluate(call(check)),
    ),
  );
  const problems = groups.flat();
  expect(scroll === 0, `${name} at ${width}px: the page scrolls sideways by ${scroll}px`);
  expect(problems.length === 0, `${name} at ${width}px: ${problems.join("; ")}`);
  await save(`${name}-${width}`, await page.screenshot({ fullPage: true }));
  if (name === "home" && [390, 1024, 1440].includes(width))
    await save(`${name}-${width}-opening`, await page.screenshot());
}

/** The homepage's engine catalog follows the registry, one plate per engine. */
async function reviewCatalog(page, origin) {
  await page.viewport(1024, 900);
  await page.open(`${origin}/`);
  const engines = await page.evaluate(`document.querySelectorAll('.mono-engine').length`);
  const plates = await page.evaluate(
    `[...document.querySelectorAll('.mono-engine .ferra-instrument')].filter((plate) => getComputedStyle(plate).backgroundImage !== 'none').length`,
  );
  expect(engines > 0 && plates === engines, "catalog: every engine shows its instrument");
}

/** On a phone the header's links fold into a menu that opens, fits and closes on Escape. */
async function reviewHomeMenu(page, origin) {
  await page.viewport(390, 900);
  await page.open(`${origin}/`);
  await page.evaluate(`document.querySelector('.mono-menu-button').click()`);
  const open = await page.evaluate(
    `(() => { const menu = document.querySelector('.mono-menu'); const box = menu.getBoundingClientRect(); return { open: document.querySelector('.mono-menu-button').getAttribute('aria-expanded') === 'true' && getComputedStyle(menu).display !== 'none', inside: box.left >= 0 && box.right <= innerWidth }; })()`,
  );
  expect(open.open, "home menu at 390px: it does not open");
  expect(open.inside, "home menu at 390px: the open menu leaves the viewport");
  await save("home-390-menu-open", await page.screenshot());
  await page.press("Escape");
  const closed = await page.evaluate(
    `document.querySelector('.mono-menu-button').getAttribute('aria-expanded') === 'false' && document.activeElement.matches('.mono-menu-button')`,
  );
  expect(closed, "home menu: Escape closes it and returns focus to the button");
}

const ARDO_MENU = ".mono-header-actions > button[aria-expanded]:not([aria-keyshortcuts])";

/** On a phone Ardo's menu carries the docs navigation (the Monografie menu button steps aside) and opens inside the viewport. */
async function reviewMonoDocsMenu(page, origin) {
  await page.viewport(390, 900);
  await page.open(origin + KIT_DOCS);
  const buttons = await page.evaluate(
    `(() => { const mono = document.querySelector('.mono-menu-button'); const ardo = document.querySelector('${ARDO_MENU}'); return { mono: mono !== null && mono.checkVisibility(), ardo: ardo !== null && ardo.checkVisibility() }; })()`,
  );
  expect(!buttons.mono, "kit docs at 390px: the Monografie menu button shows beside Ardo's");
  expect(buttons.ardo, "kit docs at 390px: there is no documentation menu");
  await page.evaluate(`document.querySelector('${ARDO_MENU}').click()`);
  await page.evaluate("new Promise((resolve) => setTimeout(resolve, 300))");
  const menu = await page.evaluate(
    `(() => { const panel = document.querySelector('.ardo-mobile-panel'); if (panel === null) return { open: false, inside: false, links: 0 }; const box = panel.getBoundingClientRect(); return { open: true, inside: box.left >= 0 && box.right <= innerWidth, links: panel.querySelectorAll('.ardo-sidebar-tabs a').length && panel.querySelectorAll('.ardo-sidebar a').length && panel.querySelectorAll('.mono-docs-links a').length }; })()`,
  );
  expect(menu.open && menu.inside, "kit docs menu at 390px: it does not open inside the viewport");
  expect(
    menu.links > 0,
    "kit docs menu at 390px: it lacks the header's links, the sections or the pages",
  );
  await save("kit-docs-390-menu-open", await page.screenshot());
}

/** Ardo's menu button shows exactly where Ardo's sidebar folds away, and then the Monografie menu steps aside. */
async function reviewMonoDocsBar(page, origin) {
  for (const width of [980, 1024, 1100, 1440]) {
    await page.viewport(width, 900);
    await page.open(origin + KIT_DOCS);
    const state = await page.evaluate(
      `(() => { const button = document.querySelector('${ARDO_MENU}'); const sidebar = document.querySelector('.mono-ardo-shell .ardo-sidebar'); const mono = document.querySelector('.mono-header .mono-menu'); return { menu: button !== null && button.checkVisibility(), sidebar: sidebar !== null && sidebar.checkVisibility(), mono: mono !== null && mono.checkVisibility() }; })()`,
    );
    expect(
      state.menu !== state.sidebar,
      `kit docs at ${width}px: Ardo's menu button and sidebar show together or not at all`,
    );
    expect(
      !state.menu || !state.mono,
      `kit docs at ${width}px: the Monografie menu shows beside Ardo's`,
    );
  }
}

/** Unnamed tables take distinct names from their headings once the page runs. */
async function reviewTableNames(page, origin) {
  await page.viewport(1440, 900);
  await page.open(origin + KIT_DOCS);
  const names = await page.evaluate(
    `[...document.querySelectorAll('.mono-reading-table [role="region"]')].map((region) => region.getAttribute('aria-label'))`,
  );
  expect(names.length >= 2, "kit docs: the sample has fewer than two reading tables");
  expect(
    names.every((name) => name.startsWith("Table: ")) && new Set(names).size === names.length,
    `kit docs: reading tables are not named after their headings (${names.join(", ")})`,
  );
}

/** On a wide screen the docs navigation and outline stay in view under the sticky header. */
async function reviewMonoDocsPanels(page, origin) {
  await page.viewport(1440, 900);
  await page.open(origin + KIT_DOCS);
  await page.evaluate("window.scrollTo(0, 2400)");
  const tops = await page.evaluate(
    `[...document.querySelectorAll('.mono-ardo-shell .ardo-sidebar, .mono-ardo-shell .ardo-page-rail')].map((panel) => Math.round(panel.getBoundingClientRect().top))`,
  );
  expect(
    tops.length === 2 && tops.every((top) => top >= 60 && top <= 100),
    `kit docs at 1440px: the side panels do not stay under the header (${tops.join(", ")})`,
  );
  await save("kit-docs-1440-scrolled", await page.screenshot());
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

/** The kit's chart grows its bars on request, and sets them at once for reduced motion. */
async function reviewMotion(page, origin) {
  const duration = `getComputedStyle(document.querySelector('.mono-bar')).transitionDuration`;
  await page.viewport(1440, 900);
  await page.media({ "prefers-reduced-motion": "no-preference" });
  await page.open(`${origin}/kit/`);
  expect((await page.evaluate(duration)) !== "0s", "motion: the chart's bars do not grow");
  await page.media({ "prefers-reduced-motion": "reduce" });
  await page.open(`${origin}/kit/`);
  expect((await page.evaluate(duration)) === "0s", "reduced motion: the chart's bars still grow");
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
  await reviewMonoDocsMenu(page, server.origin);
  await reviewMonoDocsBar(page, server.origin);
  await reviewMonoDocsPanels(page, server.origin);
  await reviewTableNames(page, server.origin);
  await reviewKeyboard(page, server.origin);
  await reviewCatalog(page, server.origin);
  await reviewHomeMenu(page, server.origin);
  await reviewMotion(page, server.origin);
} finally {
  await browser.close();
  server.close();
}

console.log(`${checks} checks, ${failures.length} failed. Captures in .impeccable/review/`);
for (const failure of failures) console.error(`  ✖ ${failure}`);
process.exitCode = failures.length === 0 ? 0 : 1;
