/**
 * What the package ships beside its code: the stylesheets a consumer imports,
 * and every file those stylesheets point at — the icons, the textures, the
 * display face.
 */
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";

import { kit as family, render } from "./helpers.mjs";

const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const chromeCss = await readFile(new URL("../styles/chrome.css", import.meta.url), "utf8");

/** Fails unless the package ships this icon file. */
const shipped = (file) => access(new URL(`../icons/${file}`, import.meta.url));

test("every family member has an icon in every form the chrome and the kit show", async () => {
  const css = chromeCss;
  for (const name of ["ferramenta", ...family.family.map((tool) => tool.name)]) {
    assert.ok(css.includes(`.fam-icon[data-icon="${name}"]`), `no icon rule for ${name}`);
  }
  for (const tool of family.family.filter((member) => family.isEngine(member))) {
    for (const form of ["rendered", "hero"]) {
      assert.ok(
        css.includes(`.fam-icon[data-form="${form}"][data-icon="${tool.name}"]`),
        `no ${form} icon rule for ${tool.name}`,
      );
    }
    for (const file of ["-96.webp", "-256.webp", ".webp"]) {
      await shipped(`${tool.name}${file}`);
    }
  }
  // Every file a rule points at is in the package: a missing one is a blank tile.
  for (const [, file] of css.matchAll(/url\("\.\.\/icons\/(?<file>[^"]+)"\)/gu))
    await shipped(file);
});

test("the sprite holds only the chrome's line icons, none of them a member's", () => {
  const symbols = [...family.MARK_DEFS.matchAll(/<symbol id="i-(?<name>[a-z-]+)"/gu)].map(
    (match) => match.groups.name,
  );
  assert.deepEqual(
    symbols.toSorted(),
    [
      "adapter",
      "arrow",
      "check",
      "chev",
      "crate",
      "cross",
      "external",
      "github",
      "half",
      "package",
    ],
    "the members' icons are pictures (`Icon`), not symbols",
  );
});

test("an icon is decoration beside a name, and an image when it stands alone", () => {
  assert.equal(
    render(family.Icon, { name: "ferroni" }),
    '<span class="fam-icon" data-icon="ferroni" data-form="small" aria-hidden="true"></span>',
  );
  assert.equal(
    render(family.Icon, { form: "rendered", label: "Ferroni", name: "ferroni", size: 96 }),
    '<span class="fam-icon" data-icon="ferroni" data-form="rendered" style="--fam-icon-size:96px" role="img" aria-label="Ferroni"></span>',
  );
});

test("the CSS a consumer imports is exported and shipped", async () => {
  for (const entry of [
    "./chrome.css",
    "./docs.css",
    "./fonts.css",
    "./landing.css",
    "./theme.css",
    "./tokens.css",
  ]) {
    const target = manifest.exports[entry];
    assert.equal(typeof target, "string", `missing export: ${entry}`);
    await access(new URL(`../${target}`, import.meta.url));
  }
  assert.equal(manifest.exports["./registry"].default, "./dist/family.js");
  // Everything a stylesheet points at travels with it: the face, the icons, the textures.
  for (const directory of ["styles", "fonts", "icons", "textures"]) {
    assert.ok(manifest.files.includes(directory), `the package does not ship ${directory}/`);
    if (directory !== "styles") {
      assert.equal(manifest.exports[`./${directory}/*`], `./${directory}/*`);
    }
  }
  for (const stylesheet of ["chrome.css", "fonts.css", "landing.css"]) {
    const css = await readFile(new URL(`../styles/${stylesheet}`, import.meta.url), "utf8");
    for (const [, file] of css.matchAll(/url\("\.\.\/(?<file>[^"]+)"\)/gu)) {
      await access(new URL(`../${file}`, import.meta.url));
    }
  }
});

test("the GitHub mark fills itself: the stroked `.icon` class would leave only its outline", () => {
  assert.match(
    family.MARK_DEFS,
    /<symbol id="i-github" viewBox="0 0 16 16"><path fill="currentColor" stroke="none" d=/u,
  );
});

test("the chrome CSS ships what a standalone switcher needs", () => {
  const css = chromeCss;
  assert.ok(
    css.slice(css.indexOf(".foot-legal")).includes(".foot .foot-legal"),
    "the legal line is still clamped to the 34ch measure `.foot p` sets",
  );
  // Both ship with the component: a consumer that renders only `ToolSwitcher`
  // cannot reach them any other way.
  assert.match(
    css,
    /@media \(max-width: 46rem\) \{\n {2}\.switcher > \.flyout \{/u,
    "the narrow-viewport flyout rules are not in the package",
  );
  const flyoutRule = css.indexOf("\n.flyout {");
  assert.ok(
    css.slice(flyoutRule, css.indexOf("}", flyoutRule)).includes("color: var(--iron-ink)"),
    "the flyout takes the host page's ink instead of its own",
  );
  assert.match(
    css,
    /\n\.site-footer \{\n {2}background:/u,
    'the footer is keyed on its class, so `as="div"` styles the same',
  );
});
