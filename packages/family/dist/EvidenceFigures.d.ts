import type { ReactNode } from "react";
export type EvidenceFigure = {
    /** What was measured. Also the row's key, so keep it unique. */
    label: string;
    /** The figure itself, large: a factor, a count, a percentage. */
    value: ReactNode;
    /** One line on the input it was measured on. */
    detail?: ReactNode;
    /** The raw measurement behind the figure, in mono — e.g. "~93 µs vs ~3.04 ms". */
    measure?: ReactNode;
};
/**
 * Measured figures, each stamped on a small steel plate: the figure large, its
 * label and input beneath. Only numbers someone can reproduce — put where and
 * when they were measured in the section's `note`. A project's own site shows
 * them; the family site never repeats a figure.
 */
export declare function EvidenceFigures({ figures }: {
    figures: EvidenceFigure[];
}): import("react").JSX.Element;
