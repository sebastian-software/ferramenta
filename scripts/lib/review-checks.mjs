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

/** Editorial cells retain their text, and every instrument precedes its product title. */
export function editorialProblems() {
  const problems = [];
  for (const card of document.querySelectorAll(".ferra-soft-card")) {
    const edge = card.getBoundingClientRect();
    for (const text of card.querySelectorAll("h2, h3, p, dl")) {
      const box = text.getBoundingClientRect();
      if (box.left < edge.left - 1 || box.right > edge.right + 1)
        problems.push("text leaves a soft card");
    }
  }
  for (const article of document.querySelectorAll(".ferra-engine-article")) {
    const art = article.querySelector(".ferra-engine-art").getBoundingClientRect();
    const title = article.querySelector("h2").getBoundingClientRect();
    if (art.bottom > title.top + 1) problems.push("an instrument is not above its product title");
  }
  return problems;
}

/** Mobile cards need breathing room even when their text remains inside the frame. */
export function mobileCardProblems() {
  if (innerWidth > 704) return [];
  const problems = [];
  for (const card of document.querySelectorAll(".ferra-soft-card")) {
    const edge = card.getBoundingClientRect();
    for (const text of card.querySelectorAll("h2, h3, p, dl")) {
      const box = text.getBoundingClientRect();
      if (box.width > 0 && (box.left < edge.left + 16 || box.right > edge.right - 16))
        problems.push("mobile text has less than 16px of space inside a soft card");
    }
  }
  return problems;
}

/** Compare rendered card edges, so stacked and paired rows retain the same gutter. */
export function productGridProblems() {
  const problems = [];
  for (const row of document.querySelectorAll(".ferra-product-page > .ferra-columns")) {
    const first = row.children[0]?.getBoundingClientRect();
    const second = row.children[1]?.getBoundingClientRect();
    const next = row.nextElementSibling?.getBoundingClientRect();
    if (first === undefined || second === undefined || next === undefined) continue;
    const paired = Math.abs(first.top - second.top) < 1;
    const innerGap = paired ? second.left - first.right : second.top - first.bottom;
    const outerGap = next.top - row.getBoundingClientRect().bottom;
    if (Math.abs(innerGap - outerGap) > 1)
      problems.push("product card rows and columns have different gutters");
  }
  return problems;
}

/** Fictional reading tables keep native geometry rather than compressing words into letters. */
export function readingTableProblems() {
  const problems = [];
  for (const table of document.querySelectorAll(".ferra-reading-table table")) {
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
  const bar = document.querySelector(".site-header .bar, .ferra-header");
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
    // Ferra deliberately wraps its navigation on small screens; the original fixed bar cannot.
    ...(row > 72 && !bar.matches(".ferra-header")
      ? ["the header bar wraps onto a second row"]
      : []),
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

/** Problems of a comparison: a table that scrolls out of reach, a bar or a mark without its text. */
export function comparisonProblems() {
  const scrolls = [...document.querySelectorAll(".fam-compare-scroll")].filter(
    (box) => box.scrollWidth > box.clientWidth + 1,
  );
  const silent = (selector) =>
    [...document.querySelectorAll(selector)].filter((element) => element.textContent.trim() === "");
  return [
    ...scrolls
      .filter((box) => box.tabIndex !== 0 || !box.hasAttribute("aria-labelledby"))
      .map(() => "a table scrolls sideways, but a keyboard cannot reach or name it"),
    ...silent(".fam-bar-value").map(() => "a bar has no figure as text"),
    ...silent(".fam-compare-mark").map(() => "a mark has no meaning as text"),
  ];
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
