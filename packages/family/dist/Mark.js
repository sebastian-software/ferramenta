import { jsx as _jsx } from "react/jsx-runtime";
import { MARK_DEFS } from "./mark-defs.js";
/**
 * Mounts the shared SVG sprite once per page: duotone project marks,
 * the pegboard hook, and the line-style chrome icons.
 *
 * Render it once, above the header. `Mark` only references symbols; without
 * `MarkDefs` on the page every mark is empty.
 */
export function MarkDefs() {
    return (_jsx("svg", { width: "0", height: "0", style: { position: "absolute" }, "aria-hidden": "true", children: _jsx("defs", { dangerouslySetInnerHTML: { __html: MARK_DEFS } }) }));
}
/** A single symbol from the sprite. Project marks use class "mark", chrome icons "icon". */
export function Mark({ name, className = "mark", size }) {
    return (_jsx("svg", { className: className, width: size, height: size, "aria-hidden": "true", children: _jsx("use", { href: `#i-${name}` }) }));
}
