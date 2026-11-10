/**
 * Mounts the shared SVG sprite once per page: the line icons of the pages and
 * the documentation navigation (chevron, arrow, GitHub, crate, adapter,
 * external, package, document, pen) and the marks of a comparison (check,
 * half, cross).
 *
 * Render it once, above the header. `Mark` only references symbols; without
 * `MarkDefs` on the page every one of them is empty. The members' own marks
 * are rendered pictures, not in the sprite (`ferra-assets.css`).
 */
export declare function MarkDefs(): import("react").JSX.Element;
export type MarkProps = {
    /** Symbol name without the "i-" prefix, e.g. "arrow" */
    name: string;
    className?: string;
    size?: number;
};
/** A single line icon from the sprite. It takes the class "icon" unless told otherwise. */
export declare function Mark({ name, className, size }: MarkProps): import("react").JSX.Element;
