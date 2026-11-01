import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** An unframed reading column between host-owned navigation and the page outline. */
export function FerraReadingLayout({ navigation, outline, children, className, ...props }) {
    return (_jsxs("article", { ...props, className: ["ferra-reading ferra-wrap", className].filter(Boolean).join(" "), children: [_jsx("div", { className: "ferra-reading-navigation", children: navigation }), _jsx("div", { className: "ferra-reading-surface", children: _jsx("div", { className: "ferra-prose", children: children }) }), _jsx("div", { className: "ferra-reading-outline", children: outline })] }));
}
