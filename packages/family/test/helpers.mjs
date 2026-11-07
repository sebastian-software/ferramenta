/** Shared by the package's test files: render from the build output, and order checks. */
import assert from "node:assert/strict";

const { renderToStaticMarkup } = await import("react-dom/server");
const { createElement } = await import("react");

/** The root entry as a consumer imports it: the committed build output. */
export const kit = await import("../dist/index.js");

/** Renders a component to static markup, the way a prerendering sibling does. */
export const render = (component, props) => renderToStaticMarkup(createElement(component, props));

/** A member by name; the test fails if the registry has none. */
export function member(name) {
  const tool = kit.family.find((candidate) => candidate.name === name);
  assert.ok(tool, `the registry has no member named ${name}`);
  return tool;
}

/** Asserts that every piece occurs in `html`, each after the one before it. */
export function assertInOrder(html, pieces, message) {
  let from = 0;
  for (const piece of pieces) {
    const at = html.indexOf(piece, from);
    assert.notEqual(at, -1, `${message} (missing or out of order: ${piece})`);
    from = at + piece.length;
  }
}

/** Splits a selector list at its top-level commas, not those inside :is() or :where(). */
export function selectorsOf(list) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const character of list) {
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else current += character;
  }
  return [...parts, current.trim()];
}

/** Every selector of a stylesheet, comments removed, at-rules skipped. */
export function selectorsIn(sheet) {
  const body = sheet.replaceAll(/\/\*[\s\S]*?\*\//gu, "");
  // Each block opens after the selectors that follow the previous rule's end.
  return body
    .split("{")
    .slice(0, -1)
    .map((before) => before.slice(Math.max(before.lastIndexOf("}"), before.lastIndexOf(";")) + 1))
    .filter((selectors) => !selectors.trim().startsWith("@"))
    .flatMap((selectors) => selectorsOf(selectors))
    .filter((selector) => selector !== "");
}
