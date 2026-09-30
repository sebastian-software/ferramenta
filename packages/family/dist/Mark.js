import { jsx as _jsx } from "react/jsx-runtime";
import { MARK_DEFS } from "./mark-defs.js";
/**
 * Mounts the shared SVG sprite once per page: the line icons of the chrome
 * (chevron, arrow, GitHub, crate, adapter, external, package).
 *
 * Render it once, above the header. `Mark` only references symbols; without
 * `MarkDefs` on the page every one of them is empty. The members' own icons
 * are not in the sprite: see `Icon`.
 */
export function MarkDefs() {
    return (_jsx("svg", { width: "0", height: "0", style: { position: "absolute" }, "aria-hidden": "true", children: _jsx("defs", { dangerouslySetInnerHTML: { __html: MARK_DEFS } }) }));
}
/** A single line icon from the sprite. It takes the class "icon" unless told otherwise. */
export function Mark({ name, className = "icon", size }) {
    return (_jsx("svg", { className: className, width: size, height: size, "aria-hidden": "true", children: _jsx("use", { href: `#i-${name}` }) }));
}
