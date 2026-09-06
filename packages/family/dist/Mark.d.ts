/**
 * Mounts the shared SVG sprite once per page: duotone project marks,
 * the pegboard hook, and the line-style chrome icons.
 *
 * Render it once, above the header. `Mark` only references symbols; without
 * `MarkDefs` on the page every mark is empty.
 */
export declare function MarkDefs(): import("react").JSX.Element;
export type MarkProps = {
    /** Symbol name without the "i-" prefix, e.g. "ferroni" or "arrow" */
    name: string;
    className?: string;
    size?: number;
};
/** A single symbol from the sprite. Project marks use class "mark", chrome icons "icon". */
export declare function Mark({ name, className, size }: MarkProps): import("react").JSX.Element;
