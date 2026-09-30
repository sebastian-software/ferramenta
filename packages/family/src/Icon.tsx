import type { CSSProperties } from "react";

/*
 * A member's icon. It is a picture, not a drawing in the sprite: each member
 * has one rendered object, shipped as files in `icons/` and placed by
 * `chrome.css` as a background image, so the consumer's bundler resolves them
 * the way it resolves the font.
 *
 * - `small` (the default): for every small place, the header, the switcher,
 *   the footer, a list. Shown at 24 to 48px.
 * - `rendered`: for a plate in a catalog (up to about 128px).
 * - `hero`: the same object at full size, for the plate of a first viewport.
 *
 * The small form holds from 24px up. Below that every one of these objects is
 * a smudge, so nothing in the family shows an icon smaller.
 */

export type IconForm = "hero" | "rendered" | "small";

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
export function Icon({ className, form = "small", label, name, size }: IconProps) {
  const style: CustomProperties | undefined =
    size === undefined ? undefined : { "--fam-icon-size": `${size}px` };
  const classes = className === undefined ? "fam-icon" : `fam-icon ${className}`;
  if (label === undefined) {
    return (
      <span
        className={classes}
        data-icon={name}
        data-form={form}
        style={style}
        aria-hidden="true"
      />
    );
  }
  return (
    <span
      className={classes}
      data-icon={name}
      data-form={form}
      style={style}
      role="img"
      aria-label={label}
    />
  );
}
