/**
 * What a review looks for in a rendered page. Each function here runs inside
 * the page (it is sent there as source), so it may only use what a browser
 * has, it must carry its helpers inside itself, and it returns plain data: a
 * list of problems, or a small fact.
 */

/** How far the page scrolls sideways at the current viewport, in pixels (0 when it does not). */
export function sidewaysScroll() {
  const root = document.documentElement;
  return Math.max(0, root.scrollWidth - root.clientWidth);
}

/** Problems of the header bar: it wraps, an item leaves the gutter, is too small to tap, or two overlap. */
export function barProblems() {
  const bar = document.querySelector(".site-header .bar");
  if (bar === null) return ["there is no header bar"];
  const width = document.documentElement.clientWidth;
  const phone = width < 768;
  // What a visitor can see in the bar: not the entries of a closed flyout.
  const items = [...bar.querySelectorAll("a, summary, button")]
    .filter((element) => element.checkVisibility())
    .map((element) => ({
      box: element.getBoundingClientRect(),
      name: `"${element.textContent.trim() || "an icon"}" in the header`,
    }))
    .filter((item) => item.box.width > 0);
  const outside = (box) => box.left < 8 || box.right > width - 8;
  const overlaps = (first, second) =>
    second.box.left < first.box.right - 1 && second.box.top < first.box.bottom;
  return [
    ...(bar.getBoundingClientRect().height > 72 ? ["the header bar wraps onto a second row"] : []),
    ...items.filter((item) => outside(item.box)).map((item) => `${item.name} leaves the gutter`),
    ...items
      .filter((item) => phone && item.box.height < 44)
      .map((item) => `${item.name} is a ${Math.round(item.box.height)}px target`),
    ...items
      .slice(1)
      .filter((item, index) => overlaps(items[index], item))
      .map((item) => `${item.name} overlaps the item before it`),
  ];
}

/** Text that leaves the plate it is lettered on. */
export function plateProblems() {
  const leaves = (box, edge) =>
    box.width > 0 && (box.right > edge.right + 1 || box.left < edge.left - 1);
  return [...document.querySelectorAll(".fam-plate")].flatMap((plate) => {
    const edge = plate.getBoundingClientRect();
    return [...plate.querySelectorAll("h1, h3, p, dt, dd, a, b, code")]
      .filter((element) => leaves(element.getBoundingClientRect(), edge))
      .map((element) => `"${element.textContent.trim().slice(0, 40)}" leaves its plate`);
  });
}

/** Whether a `<details>` flyout is open, and whether its panel is inside the viewport. */
export function flyoutState(selector) {
  const details = document.querySelector(selector);
  if (details === null) return { found: false };
  const summary = details.querySelector("summary");
  const panel = details.querySelector(":scope > div");
  const box = panel.getBoundingClientRect();
  return {
    found: true,
    shown: summary.getBoundingClientRect().width > 0,
    open: details.open,
    inside: box.left >= 0 && box.right <= document.documentElement.clientWidth,
    links: [...panel.querySelectorAll("a")].map((link) => link.textContent.trim()),
    focusOnTrigger: document.activeElement === summary,
  };
}

/** What has focus: its name as a visitor reads it, and whether the focus shows. */
export function focused() {
  const element = document.activeElement;
  if (element === null || element === document.body) return { name: "", shows: false };
  const style = getComputedStyle(element);
  return {
    name: (element.getAttribute("aria-label") ?? element.textContent).trim(),
    shows: style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0,
  };
}

/** The two motions of a plate: the tag's sway, and where the reflection stands. */
export function motion() {
  const tag = document.querySelector(".fam-hanger");
  return {
    sway: tag === null ? "none" : getComputedStyle(tag).animationName,
    sheen: document.documentElement.style.getPropertyValue("--fam-sheen"),
  };
}
