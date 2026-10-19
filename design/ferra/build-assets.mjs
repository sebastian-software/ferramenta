/* eslint-disable security/detect-non-literal-fs-filename -- Paths come from the fixed master manifest and package output directories. */
import { spawnSync } from "node:child_process";
// cspell:words magick
/** Exports the approved masters; no image generation, redraw or font installation. */
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = import.meta.dirname;
const output = fileURLToPath(new URL("../../packages/family/ferra/", import.meta.url));
const styles = fileURLToPath(new URL("../../packages/family/styles/", import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
const tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"));
const font = JSON.parse(readFileSync(join(root, "fonts/manifest.json"), "utf8"));
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
        generatedWith: "ImageMagick export of approved built-in Imagegen master",
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
  materials: {},
  brands: {},
  typography: font,
};
const rules = [];
for (const { id, meaning } of manifest.products) {
  const folder = join(output, id);
  mkdirSync(folder, { recursive: true });
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
    tokens.palette.paper,
    "-gravity",
    "center",
    "-extent",
    "180x180",
    "-alpha",
    "remove",
    touch,
  ]);
  provenance(touch, master, "180px Apple touch icon on warm paper.");
  const instrument = join(root, "masters", id, "instrument.png");
  const hero = join(folder, "instrument.webp");
  magick([instrument, "-resize", "1600x1200>", "-quality", "90", hero]);
  provenance(
    hero,
    instrument,
    "Optimized transparent instrument; resample and WebP encoding only.",
  );
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
for (const material of manifest.materials) {
  mkdirSync(join(output, "textures"), { recursive: true });
  const master = join(root, "masters", `${material}.png`);
  const file = join(output, "textures", `${material}.webp`);
  magick([master, "-quality", "90", file]);
  provenance(
    file,
    master,
    "Optimized approved surface; cover a single field instead of tiling visible seams.",
  );
  assetManifest.materials[material] = `textures/${material}.webp`;
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
mkdirSync(join(output, "fonts"), { recursive: true });
for (const file of font.files) {
  const source = join(root, "fonts", file.file);
  if (createHash("sha256").update(readFileSync(source)).digest("hex") !== file.sha256)
    throw new Error(`Font provenance mismatch: ${file.file}`);
  copyFileSync(source, join(output, "fonts", file.file));
}
copyFileSync(join(root, "fonts/manifest.json"), join(output, "fonts/manifest.json"));
writeFileSync(
  join(styles, "ferra-fonts.css"),
  `/* Generated from design/ferra/fonts/manifest.json. */\n@font-face {\n  font-family: "IBM Plex Sans";\n  src: url("../ferra/fonts/ibm-plex-sans-600.woff2") format("woff2");\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n}\n`,
);
writeFileSync(join(output, "manifest.json"), `${JSON.stringify(assetManifest, null, 2)}\n`);
copyFileSync(join(root, "tokens.json"), join(output, "tokens.json"));
writeFileSync(
  join(styles, "ferra-assets.css"),
  `/* Generated by design/ferra/build-assets.mjs. */\n${rules.join("\n")}\n`,
);
const variables = [];
for (const [group, values] of Object.entries(tokens)) {
  for (const [name, value] of Object.entries(values)) {
    variables.push(`  --ferra-${group === "space" ? `space-${name}` : name}: ${value};`);
  }
}
writeFileSync(
  join(styles, "ferra-tokens.css"),
  `/* Generated from design/ferra/tokens.json. */\n.ferra-page,\n.ferra-tokens {\n${variables.join(
    "\n",
  )}\n}\n`,
);
console.log(
  `Exported ${manifest.products.length} identities and instruments, two textures and CSS/JSON tokens.`,
);
const formatter = spawnSync(
  fileURLToPath(new URL("../../node_modules/.bin/oxfmt", import.meta.url)),
  [
    "--write",
    output,
    join(styles, "ferra-assets.css"),
    join(styles, "ferra-tokens.css"),
    join(styles, "ferra-fonts.css"),
  ],
  { encoding: "utf8" },
);
if (formatter.status !== 0) throw new Error(formatter.stderr || formatter.stdout);
