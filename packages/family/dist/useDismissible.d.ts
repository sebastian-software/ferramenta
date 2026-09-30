import { type RefObject } from "react";
/** A `<details>` flyout is not modal: it closes on an outside click and on Escape. */
export declare function useDismissible(ref: RefObject<HTMLDetailsElement | null>): void;
