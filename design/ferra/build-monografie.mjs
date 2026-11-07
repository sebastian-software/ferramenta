/* eslint-disable security/detect-non-literal-fs-filename -- Paths come from fixed master folders and package output directories. */
// cspell:words magick
/**
 * Exports the Monografie assets into the package: the Blender surface bands
 * (steel for the navigation, rust for small accents) and the Source Serif 4
 * heading faces. No rendering here; the masters come from
 * design/ferra/blender/surfaces.py and the pinned upstream font release.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = import.meta.dirname;
const output = fileURLToPath(new URL("../../packages/family/ferra/", import.meta.url));
const sha256 = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

function magick(args) {
  const run = spawnSync("magick", args, { encoding: "utf8" });
  if (run.status !== 0) throw new Error(run.stderr || "ImageMagick export failed");
  return run.stdout.trim();
}

mkdirSync(join(output, "textures"), { recursive: true });
// The steel's grain is faint; lossy settings below 100 flatten it into blocks.
for (const [surface, quality] of [
  ["steel-fine-strip", "100"],
  ["rust-fine-strip", "86"],
]) {
  const master = join(root, "masters/surfaces", `${surface}.png`);
  const record = JSON.parse(readFileSync(`${master}.json`, "utf8"));
  if (sha256(master) !== record.sha256) throw new Error(`Master provenance mismatch: ${surface}`);
  const file = join(output, "textures", `${surface}.webp`);
  magick([master, "-quality", quality, file]);
  writeFileSync(
    `${file}.json`,
    `${JSON.stringify(
      {
        generatedWith: `ImageMagick export of ${record.generatedWith} master`,
        construction: record.construction,
        role: record.role,
        source: `design/ferra/masters/surfaces/${surface}.png`,
        sourceSha256: record.sha256,
        prompt: record.prompt,
        geometry: magick(["identify", "-format", "%wx%h", file]),
        sha256: sha256(file),
      },
      null,
      2,
    )}\n`,
  );
}

const fonts = join(root, "fonts/source-serif-4");
const manifest = JSON.parse(readFileSync(join(fonts, "manifest.json"), "utf8"));
mkdirSync(join(output, "fonts/source-serif-4"), { recursive: true });
for (const entry of manifest.files) {
  const source = join(fonts, entry.file);
  if (sha256(source) !== entry.sha256) throw new Error(`Font provenance mismatch: ${entry.file}`);
  copyFileSync(source, join(output, "fonts/source-serif-4", entry.file));
}
copyFileSync(join(fonts, "manifest.json"), join(output, "fonts/source-serif-4/manifest.json"));
console.log("Exported the Monografie surfaces and heading faces.");
