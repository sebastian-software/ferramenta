import { type ReactNode, type RefObject, useEffect, useState } from "react";

import type { ComparisonMark } from "./comparison-types.js";

/*
 * Behavior behind Monografie's reading components: only logic and plain text,
 * never a class name, so the components keep their own markup contract.
 */

/** True while the element is wider inside than its box: a table that scrolls sideways. */
export function useHorizontalOverflow(ref: RefObject<HTMLElement | null>) {
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (element === null) return;
    const measure = () => {
      setOverflows(element.scrollWidth > element.clientWidth + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild !== null) observer.observe(element.firstElementChild);
    return () => {
      observer.disconnect();
    };
  }, [ref]);
  return overflows;
}

/** Marks a `pre` that took a tab stop here, so it can be given back. */
const SCROLL_STOP = "data-scroll-stop";

/**
 * Gives every `pre` inside the element that scrolls sideways a tab stop, so a
 * keyboard can scroll it, and takes the stop back when it no longer scrolls. A
 * `pre` that sets its own `tabindex` is left alone. Pass what the element
 * renders as `content`, so new code is checked after the page changes.
 */
export function useScrollableCode(ref: RefObject<HTMLElement | null>, content?: unknown) {
  useEffect(() => {
    const root = ref.current;
    if (root === null) return;
    const blocks = [...root.querySelectorAll("pre")];
    const update = () => {
      for (const pre of blocks) {
        const scrolls =
          pre.scrollWidth > pre.clientWidth + 1 &&
          ["auto", "scroll"].includes(getComputedStyle(pre).overflowX);
        if (scrolls && !pre.hasAttribute("tabindex")) {
          pre.setAttribute("tabindex", "0");
          pre.setAttribute(SCROLL_STOP, "");
        } else if (!scrolls && pre.hasAttribute(SCROLL_STOP)) {
          pre.removeAttribute("tabindex");
          pre.removeAttribute(SCROLL_STOP);
        }
      }
    };
    const observer = new ResizeObserver(update);
    observer.observe(root);
    for (const pre of blocks) observer.observe(pre);
    return () => {
      observer.disconnect();
    };
  }, [ref, content]);
}

/** Regions that name themselves from the page around them carry this attribute. */
const DERIVED = "data-derived-label";

/** The last heading before the element in document order, if there is one. */
function headingBefore(element: Element): Element | undefined {
  const before = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter(
    (heading) => heading.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  return before.at(-1);
}

/** The text a region's own caption, or the last heading before it, gives it. */
function baseLabel(region: Element): string {
  const caption = region.querySelector("caption")?.textContent.trim() ?? "";
  if (caption.length > 0) return caption;
  const heading = headingBefore(region)?.textContent.trim() ?? "";
  return heading.length === 0 ? "Table" : `Table: ${heading}`;
}

/**
 * Names a table region the author left unnamed, uniquely on the page: its
 * caption, else the heading it stands under, numbered where two share one. The
 * prerendered page says "Table"; the name is set once the page runs. Returns
 * the attribute that marks such a region, empty when `enabled` is false.
 */
export function useDerivedRegionLabel(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    // Only a region that carries the attribute (an unnamed one) is named here.
    const peers = [...document.querySelectorAll(`[${DERIVED}]`)];
    const region = peers.find((peer) => peer === ref.current);
    if (region === undefined) return;
    const base = baseLabel(region);
    const namesakes = peers.filter((other) => baseLabel(other) === base);
    const place = namesakes.indexOf(region) + 1;
    region.setAttribute(
      "aria-label",
      namesakes.length > 1 ? `${base} (${place} of ${namesakes.length})` : base,
    );
  }, [ref]);
  return enabled ? { [DERIVED]: "" } : {};
}

function protectBackground(declaration: string) {
  return declaration.includes("!important") ? declaration : `${declaration} !important`;
}
function protectStyle(_: string, style: string) {
  return `style="${style.replaceAll(/background(?:-color)?:[^;]+/g, protectBackground)}"`;
}

/**
 * Highlighter output made keyboard-scrollable. Ardo resets renderer backgrounds
 * with !important, so the renderer's own background (and the foreground palette
 * that matches it, CSS variables included) is protected the same way.
 */
export function protectRenderedHtml(html: string) {
  return html.replaceAll(/<pre\b[^>]*>/g, (tag) => {
    const focusable = /\btabindex=/i.test(tag) ? tag : tag.replace("<pre", '<pre tabindex="0"');
    return focusable.replace(/style="([^"]*)"/, protectStyle);
  });
}

function isMark(value: unknown): value is ComparisonMark {
  return typeof value === "object" && value !== null && "mark" in value;
}

/** One comparison cell in words: Yes, No, Partial with its note, the value, or a dash. */
export function ComparisonWords({ value }: { value: ComparisonMark | ReactNode }) {
  if (value === true) return <>Yes</>;
  if (value === false) return <>No</>;
  if (isMark(value)) {
    const labels = { yes: "Yes", partial: "Partial", no: "No" };
    return (
      <>
        {labels[value.mark]}
        {value.note !== undefined && <>: {value.note}</>}
      </>
    );
  }
  return <>{value ?? "—"}</>;
}
