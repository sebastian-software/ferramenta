import { type ReactNode, type RefObject } from "react";
import type { ComparisonMark } from "./Comparison.js";
/** True while the element is wider inside than its box: a table that scrolls sideways. */
export declare function useHorizontalOverflow(ref: RefObject<HTMLElement | null>): boolean;
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
