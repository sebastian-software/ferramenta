import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
/** A responsive, selectable SVG preview with a named keyboard-scrollable viewport. */
export function FerraDiagram({ caption, label, svg, className, ...props }) {
    const id = useId();
    return (_jsxs("figure", { ...props, className: ["ferra-diagram", className].filter(Boolean).join(" "), children: [_jsx("figcaption", { id: id, children: caption }), _jsx("div", { className: "ferra-diagram-viewport", role: "region", "aria-labelledby": id, tabIndex: 0, children: _jsx("div", { className: "ferra-diagram-output", role: "img", "aria-label": label, dangerouslySetInnerHTML: { __html: svg } }) })] }));
}
