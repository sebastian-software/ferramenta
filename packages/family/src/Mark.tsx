import { MARK_DEFS } from "./mark-defs.js";

/**
 * Mounts the shared SVG sprite once per page: the line icons of the chrome
 * (chevron, arrow, GitHub, crate, adapter, external, package) and the marks
 * of a comparison (check, half, cross).
 *
 * Render it once, above the header. `Mark` only references symbols; without
 * `MarkDefs` on the page every one of them is empty. The members' own icons
 * are not in the sprite: see `Icon`.
 */
export function MarkDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs dangerouslySetInnerHTML={{ __html: MARK_DEFS }} />
    </svg>
  );
}

export type MarkProps = {
  /** Symbol name without the "i-" prefix, e.g. "arrow" */
  name: string;
  className?: string;
  size?: number;
};

/** A single line icon from the sprite. It takes the class "icon" unless told otherwise. */
export function Mark({ name, className = "icon", size }: MarkProps) {
  return (
    <svg className={className} width={size} height={size} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
