import type { CSSProperties } from "react";
export type IconForm = "flat" | "hero" | "rendered";
/** Inline styles that set custom properties, which `CSSProperties` alone does not allow. */
export type CustomProperties = CSSProperties & Record<`--${string}`, string>;
export type IconProps = {
    /** The member's `name`, or "ferramenta" for the family's toolbox. */
    name: string;
    form?: IconForm;
    /** The side in CSS pixels. Without it the icon takes `--fam-icon-size`, or 1.5rem. */
    size?: number;
    className?: string;
    /**
     * An accessible name. Leave it out wherever the member's name stands beside
     * the icon, which is nearly everywhere: the icon is then decoration.
     */
    label?: string;
};
/** A member's icon as an inline box; see the forms above. */
export declare function Icon({ className, form, label, name, size }: IconProps): import("react").JSX.Element;
