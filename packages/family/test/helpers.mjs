/** Shared by the package's test files: render from the build output, and order checks. */
import assert from "node:assert/strict";

const { renderToStaticMarkup } = await import("react-dom/server");
const { createElement } = await import("react");

/** The package as a consumer imports it: the committed build output. */
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
