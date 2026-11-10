/** Render the social card with the same browser and shared assets as the site. */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { launchBrowser } from "./lib/browser.mjs";
import { serveStatic } from "./lib/static-server.mjs";

const chrome = process.env.CHROME;
if (!chrome) throw new Error("CHROME is required: the path to a Chromium binary");

const server = await serveStatic(fileURLToPath(new URL("../", import.meta.url)));
const browser = await launchBrowser(chrome);
try {
  await browser.page.viewport(1200, 630);
  await browser.page.open(`${server.origin}/design/social/card.html`);
  const errors = browser.page.errors();
  if (errors.length > 0) throw new Error(errors.join("\n"));
  const ready = await browser.page.evaluate(
    `document.querySelector("h1")?.textContent === "Ferramenta." && [...document.images].every((image) => image.complete && image.naturalWidth > 0)`,
  );
  if (!ready) throw new Error("The social card or its images did not load.");
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- fixed output inside this repository
  await writeFile(
    new URL("../public/social.png", import.meta.url),
    await browser.page.screenshot(),
  );
} finally {
  await browser.close();
  server.close();
}
console.log("Rendered public/social.png at 1200×630.");
