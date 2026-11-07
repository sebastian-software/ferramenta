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

/** Fictional reading tables keep native geometry rather than compressing words into letters. */
export function readingTableProblems() {
  const problems = [];
  for (const table of document.querySelectorAll(".mono-reading-table table")) {
    if (getComputedStyle(table).display !== "table")
      problems.push("a reading table lost native table layout");
    for (const row of table.rows) {
      if (row.getBoundingClientRect().height > 160)
        problems.push("a sample reading-table row is taller than 160px");
    }
  }
  return problems;
}

/** Problems of the header bar: it wraps, an item leaves the gutter, is too small to tap, or two overlap. */
export function barProblems() {
  const bar = document.querySelector(".mono-header-in");
  if (bar === null) return ["there is no header bar"];
  const width = document.documentElement.clientWidth;
  const phone = width < 768;
  // A search field may take a second row on a phone: that row is the bar's bottom padding.
  const row =
    bar.getBoundingClientRect().height - Number.parseFloat(getComputedStyle(bar).paddingBottom);
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
    ...(row > 72 ? ["the header bar wraps onto a second row"] : []),
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

/** Code and tables that scroll sideways but cannot be reached or scrolled by keyboard. */
export function scrollProblems() {
  const problems = [];
  for (const element of document.querySelectorAll(".mono pre, .mono .mono-table-region")) {
    const scrolls =
      element.scrollWidth > element.clientWidth + 1 &&
      ["auto", "scroll"].includes(getComputedStyle(element).overflowX);
    const reachable = element.tabIndex >= 0 || element.querySelector("a, button, [tabindex]");
    if (scrolls && !reachable)
      problems.push(
        `"${element.textContent.trim().slice(0, 30)}" scrolls but a keyboard cannot reach it`,
      );
  }
  return problems;
}

/** Named regions that share a name: a screen reader's landmark list cannot tell them apart. */
export function landmarkProblems() {
  const names = [...document.querySelectorAll('[role="region"][aria-label]')].map((region) =>
    region.getAttribute("aria-label"),
  );
  return names
    .filter((name, index) => names.indexOf(name) !== index)
    .map((name) => `two regions are both named "${name}"`);
}
