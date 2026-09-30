import { type ElementType, type ReactNode } from "react";
/** Four rivets, one per corner of the plate they hold. */
export declare function Rivets(): import("react").JSX.Element;
export type PlateProps = {
    /** The element to render. Defaults to `div`. */
    as?: ElementType;
    className?: string;
    /** Rivets at the corners. On by default; off for a plate too small to hold them. */
    rivets?: boolean;
    children?: ReactNode;
};
/** A riveted steel plate around its children. */
export declare function Plate({ as, children, className, rivets }: PlateProps): import("react").JSX.Element;
export type PlateFact = {
    /** What the value is: "Succeeds", "Checked against", "Release". Also the key, so keep it unique. */
    label: string;
    value: ReactNode;
};
/**
 * The measured facts of whatever the plate above it names, on a small tag
 * hanging from that plate by two links. They come second: the plate says what
 * the thing is, the tag says what it is checked against.
 */
export declare function HangingTag({ facts }: {
    facts: PlateFact[];
}): import("react").JSX.Element;
/**
 * One light for every plate on the page: the reflection on the steel follows
 * the pointer. Render it once per page; the hero does. It draws nothing, and
 * does nothing for a visitor who asked for reduced motion.
 */
export declare function PlateLight(): null;
