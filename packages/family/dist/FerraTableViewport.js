import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { useHorizontalOverflow } from "./ReadingSupport.js";
/** Keep native table geometry and expose overflow without stretching the page. */
export function FerraTableViewport({ children, className, ...props }) {
    const regionRef = useRef(null);
    const overflows = useHorizontalOverflow(regionRef);
    return (_jsxs("div", { className: ["ferra-table-frame", className].filter(Boolean).join(" "), children: [_jsx("p", { className: "ferra-table-hint", hidden: !overflows, children: "Scroll sideways for more columns." }), _jsx("div", { ...props, className: "ferra-table-region", role: "region", tabIndex: 0, ref: regionRef, children: children })] }));
}
/** MDX table slot: prose may wrap, but comparison columns must retain readable words. */
export function FerraReadingTable(props) {
    return (_jsx(FerraTableViewport, { className: "ferra-reading-table", "aria-label": props["aria-label"] ?? "Data table", children: _jsx("table", { ...props }) }));
}
