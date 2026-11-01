import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** A short ordered explanation; content and processing logic belong to the host. */
export function FerraSteps({ caption, items, }) {
    return (_jsxs("figure", { className: "ferra-steps", children: [_jsx("figcaption", { children: caption }), _jsx("ol", { children: items.map((item) => (_jsxs("li", { children: [_jsx("strong", { children: item.heading }), _jsx("div", { children: item.text })] }, item.heading))) })] }));
}
