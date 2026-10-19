import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));
const sizes = [32, 48, 64, 128, 256, 512];
const font = "/System/Library/Fonts/HelveticaNeue.ttc";

function magick(args) {
  const result = spawnSync("magick", args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || "ImageMagick failed");
  return result.stdout;
}

function provenance(path, data) {
  const bytes = readFileSync(path);
  const geometry = magick(["identify", "-format", "%wx%h ", path]).trim();
  writeFileSync(
    path + ".json",
    JSON.stringify(
      { ...data, geometry, sha256: createHash("sha256").update(bytes).digest("hex") },
      null,
      2,
    ) + "\n",
  );
}

for (const [slug, product] of [
  ["ferromark", "Ferromark"],
  ["ferroni", "Ferroni"],
]) {
  const folder = join(root, slug);
  const master = join(folder, "mark-master.png");
  const original = JSON.parse(readFileSync(master + ".json", "utf8"));
  provenance(master, original);
  const base = {
    createdAt: "2026-10-19",
    product,
    source: "mark-master.png",
    generatedWith: "ImageMagick export of built-in Imagegen master",
    prompt: original.prompt,
  };
  for (const size of sizes) {
    const output = join(folder, `mark-${size}.png`);
    const args = [
      master,
      "-trim",
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
      "-define",
      "png:compression-level=9",
      output,
    ];
    magick(args);
    provenance(output, {
      ...base,
      role: "transparent product mark",
      size,
      derivation:
        "Trim transparent margin; center silhouette at 87.5% square; Lanczos resize. No redraw or material edit.",
    });
  }
  const ico = join(folder, "favicon.ico");
  magick([...[32, 48, 64].map((size) => join(folder, `mark-${size}.png`)), ico]);
  provenance(ico, {
    ...base,
    role: "favicon",
    sizes: [32, 48, 64],
    derivation: "ICO frames copied from corresponding PNG exports; no 16px frame.",
  });
  const lockup = join(folder, "logo-lockup.png");
  magick([
    join(folder, "mark-256.png"),
    "(",
    "-size",
    "32x256",
    "xc:none",
    ")",
    "(",
    "+size",
    "-background",
    "none",
    "-fill",
    "#25302e",
    "-font",
    font,
    "-pointsize",
    "108",
    `label:${product}`,
    ")",
    "-background",
    "none",
    "-gravity",
    "center",
    "+append",
    "-bordercolor",
    "none",
    "-border",
    "16",
    lockup,
  ]);
  provenance(lockup, {
    ...base,
    role: "horizontal logo lockup",
    wordmark: product,
    font: "Helvetica Neue Regular",
    derivation: "mark-256.png with a 32px gap and a real typeset wordmark; transparent PNG.",
  });
  const touch = join(folder, "apple-touch-icon.png");
  magick([
    join(folder, "mark-256.png"),
    "-resize",
    "156x156",
    "-background",
    "#fafaf7",
    "-gravity",
    "center",
    "-extent",
    "180x180",
    "-alpha",
    "remove",
    touch,
  ]);
  provenance(touch, {
    ...base,
    role: "Apple touch icon",
    size: 180,
    derivation: "Mark on the light study ground with platform-safe padding.",
  });
}
console.log(
  "Built two logo kits: six transparent sizes, horizontal lockup, 32/48/64 ICO and Apple touch icon per product.",
);
