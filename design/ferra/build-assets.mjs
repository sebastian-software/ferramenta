/* eslint-disable security/detect-non-literal-fs-filename -- Paths come from the fixed master manifest and package output directories. */
import { spawnSync } from "node:child_process";
// cspell:words magick
/**
 * Exports the approved identity masters into the package: the members' marks,
 * favicon files and hero instruments, the workshop logos, and `ferra-assets.css`,
 * which places them. No image generation, redraw or font installation. The
 * Monografie surfaces and heading faces come from build-monografie.mjs.
 */
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = import.meta.dirname;
const output = fileURLToPath(new URL("../../packages/family/ferra/", import.meta.url));
const styles = fileURLToPath(new URL("../../packages/family/styles/", import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
/** The warm paper behind the Apple touch icons, kept so a re-export reproduces them. */
const TOUCH_ICON_GROUND = "#F4F0E6";
const sizes = [32, 48, 64, 128, 256, 512];
const magick = (args) => {
  const run = spawnSync("magick", args, { encoding: "utf8" });
  if (run.status !== 0) throw new Error(run.stderr || "ImageMagick export failed");
  return run.stdout.trim();
};
function provenance(file, source, role) {
  const original = JSON.parse(readFileSync(`${source}.json`, "utf8"));
  writeFileSync(
    `${file}.json`,
    `${JSON.stringify(
      {
        generatedWith: original.generatedWith.startsWith("Blender ")
          ? `ImageMagick export of ${original.generatedWith} master`
          : "ImageMagick export of approved built-in Imagegen master",
        role,
        source: `design/ferra/${source.slice(root.length + 1)}`,
        sourceSha256: createHash("sha256").update(readFileSync(source)).digest("hex"),
        prompt: original.prompt,
        geometry: magick(["identify", "-format", "%wx%h ", file]),
        sha256: createHash("sha256").update(readFileSync(file)).digest("hex"),
      },
      null,
      2,
    )}\n`,
  );
}
mkdirSync(output, { recursive: true });
const assetManifest = {
  direction: manifest.direction,
  products: {},
  brands: {},
};
const instrumentsOnly = process.argv.includes("--instruments-only");
const selected = new Set(process.argv.slice(2).filter((id) => id !== "--instruments-only"));
for (const id of selected) {
  if (!manifest.products.some((product) => product.id === id))
    throw new Error(`Unknown product: ${id}`);
}
const rules = [];
function registerProduct(id, meaning, hero) {
  const [width, height] = magick(["identify", "-format", "%w %h", hero]).split(" ").map(Number);
  assetManifest.products[id] = {
    meaning,
    mark: `${id}/mark.webp`,
    instrument: `${id}/instrument.webp`,
    ratio: width / height,
    favicon: `${id}/favicon.ico`,
    sizes,
  };
  rules.push(
    `.ferra-mark[data-product="${id}"] { background-image: url("../ferra/${id}/mark.webp"); }`,
    `.ferra-instrument[data-product="${id}"] { background-image: url("../ferra/${id}/instrument.webp"); aspect-ratio: ${width} / ${height}; }`,
  );
}
function exportInstrument(id, meaning, folder) {
  const instrument = join(root, "masters", id, "instrument.png");
  const hero = join(folder, "instrument.webp");
  magick([instrument, "-resize", "1600x1200>", "-quality", "90", hero]);
  provenance(
    hero,
    instrument,
    "Optimized transparent instrument; resample and WebP encoding only.",
  );
  registerProduct(id, meaning, hero);
}
for (const { id, meaning } of manifest.products) {
  const folder = join(output, id);
  mkdirSync(folder, { recursive: true });
  if (selected.size > 0 && !selected.has(id)) {
    registerProduct(id, meaning, join(folder, "instrument.webp"));
    continue;
  }
  if (instrumentsOnly) {
    exportInstrument(id, meaning, folder);
    continue;
  }
  const master = join(root, "masters", id, "mark.png");
  const bounds = magick([
    master,
    "-alpha",
    "extract",
    "-threshold",
    "10%",
    "-trim",
    "-format",
    "%wx%h%X%Y",
    "info:",
  ]);
  for (const size of sizes) {
    const path = join(folder, `mark-${size}.png`);
    magick([
      master,
      "-crop",
      bounds,
      "+repage",
      "-background",
      "none",
      "-gravity",
      "center",
      "-extent",
      "%[fx:ceil(max(w,h)/0.875)]x%[fx:ceil(max(w,h)/0.875)]",
      "-filter",
      "Lanczos",
      "-resize",
      `${size}x${size}`,
      path,
    ]);
    provenance(
      path,
      master,
      "Transparent mark; padding normalization and Lanczos resize only. Alpha threshold measures bounds and never changes color pixels.",
    );
  }
  const mark = join(folder, "mark.webp");
  magick([join(folder, "mark-256.png"), "-define", "webp:lossless=true", mark]);
  provenance(mark, master, "Lossless WebP of the 256px mark for CSS display at 32–128px.");
  const ico = join(folder, "favicon.ico");
  magick([...sizes.filter((s) => s <= 64).map((s) => join(folder, `mark-${s}.png`)), ico]);
  provenance(ico, master, "32/48/64px ICO frames; no 16px frame.");
  const touch = join(folder, "apple-touch-icon.png");
  magick([
    join(folder, "mark-256.png"),
    "-resize",
    "156x156",
    "-background",
    TOUCH_ICON_GROUND,
    "-gravity",
    "center",
    "-extent",
    "180x180",
    "-alpha",
    "remove",
    touch,
  ]);
  provenance(touch, master, "180px Apple touch icon on warm paper.");
  exportInstrument(id, meaning, folder);
}
// These original workshop logos are copied byte for byte, without raster conversion or recoloring.
mkdirSync(join(output, "brands"), { recursive: true });
for (const brand of ["software", "consulting"]) {
  const source = fileURLToPath(
    new URL(`../../app/assets/logos/sebastian-${brand}.svg`, import.meta.url),
  );
  const file = `brands/sebastian-${brand}.svg`;
  copyFileSync(source, join(output, file));
  const sha256 = createHash("sha256").update(readFileSync(source)).digest("hex");
  writeFileSync(
    join(output, `${file}.json`),
    `${JSON.stringify({ source: `app/assets/logos/sebastian-${brand}.svg`, sha256, treatment: "Unchanged original SVG; preserve its colors on a flat light ground." }, null, 2)}\n`,
  );
  assetManifest.brands[brand] = file;
  rules.push(
    `.ferra-workshop-logo[data-brand="${brand}"] { background-image: url("../ferra/${file}"); }`,
  );
}
writeFileSync(join(output, "manifest.json"), `${JSON.stringify(assetManifest, null, 2)}\n`);
writeFileSync(
  join(styles, "ferra-assets.css"),
  `/* Generated by design/ferra/build-assets.mjs. */\n${rules.join("\n")}\n`,
);
console.log(
  instrumentsOnly
    ? `Exported ${selected.size || manifest.products.length} instrument assets and refreshed the CSS and manifest references.`
    : `Exported ${manifest.products.length} identities and instruments and the workshop logos.`,
);
const formatter = spawnSync(
  fileURLToPath(new URL("../../node_modules/.bin/oxfmt", import.meta.url)),
  ["--write", output, join(styles, "ferra-assets.css")],
  { encoding: "utf8" },
);
if (formatter.status !== 0) throw new Error(formatter.stderr || formatter.stdout);
