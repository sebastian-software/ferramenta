import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
const positions = ["tl", "tr", "br", "bl"];
/**
 * Four slotted steel screws, one per corner of the box they sit in (styled by
 * `.fastener` in `chrome.css`). Only on a surface that is already physically
 * modeled — the pegboard, a machine chassis (ADR-0005): a screw with nothing
 * to fasten is a defect. The host sets `position: relative` and, to move them
 * off the edge, `--fastener-inset`.
 */
export function Fasteners() {
    return (_jsx(_Fragment, { children: positions.map((position) => (_jsx("span", { className: "fastener", "data-position": position, "aria-hidden": "true" }, position))) }));
}
