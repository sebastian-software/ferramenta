import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Reading-page composition. The host retains the main landmark and routing state. */
export function FerraDocsLayout({ hero, navigation, outline, children, className, ...props }) {
    return (_jsxs("article", { ...props, className: ["ferra-docs", className].filter(Boolean).join(" "), children: [_jsxs("div", { className: "ferra-docs-header ferra-wrap", children: [_jsx("div", { className: "ferra-docs-navigation", children: navigation }), _jsx("div", { className: "ferra-docs-hero", children: hero }), _jsx("div", { className: "ferra-docs-outline", children: outline })] }), children] }));
}
