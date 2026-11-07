import { type ReactNode, type RefObject } from "react";
import type { ComparisonMark } from "./comparison-types.js";
/** True while the element is wider inside than its box: a table that scrolls sideways. */
export declare function useHorizontalOverflow(ref: RefObject<HTMLElement | null>): boolean;
/**
 * Gives every `pre` inside the element that scrolls sideways a tab stop, so a
 * keyboard can scroll it, and takes the stop back when it no longer scrolls. A
 * `pre` that sets its own `tabindex` is left alone. Pass what the element
 * renders as `content`, so new code is checked after the page changes.
 */
export declare function useScrollableCode(ref: RefObject<HTMLElement | null>, content?: unknown): void;
/**
 * Names a table region the author left unnamed, uniquely on the page: its
 * caption, else the heading it stands under, numbered where two share one. The
 * prerendered page says "Table"; the name is set once the page runs. Returns
 * the attribute that marks such a region, empty when `enabled` is false.
 */
export declare function useDerivedRegionLabel(ref: RefObject<HTMLElement | null>, enabled: boolean): {
    "data-derived-label": string;
} | {
    "data-derived-label"?: undefined;
};
/**
 * Highlighter output made keyboard-scrollable. Ardo resets renderer backgrounds
 * with !important, so the renderer's own background (and the foreground palette
 * that matches it, CSS variables included) is protected the same way.
 */
export declare function protectRenderedHtml(html: string): string;
/** One comparison cell in words: Yes, No, Partial with its note, the value, or a dash. */
export declare function ComparisonWords({ value }: {
    value: ComparisonMark | ReactNode;
}): import("react").JSX.Element;
