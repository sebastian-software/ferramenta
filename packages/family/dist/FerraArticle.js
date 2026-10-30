import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { FerraSoftCard } from "./FerraEditorial.js";
/** An image-first story with an attached evidence footer; the host owns its content. */
export function FerraArticle({ title, introduction, art, icon, meta, children, className, ...props }) {
    const generatedId = useId();
    const headingId = props.id === undefined ? generatedId : `${props.id}-title`;
    return (_jsxs(FerraSoftCard, { tabIndex: -1, ...props, as: "article", className: ["ferra-article", className].filter(Boolean).join(" "), "aria-labelledby": headingId, children: [_jsxs("div", { className: "ferra-article-content", children: [art !== undefined && _jsx("div", { className: "ferra-article-art", children: art }), icon !== undefined && (_jsx("div", { className: "ferra-article-icon", "aria-hidden": "true", children: icon })), _jsxs("header", { className: "ferra-article-heading", children: [_jsx("h2", { id: headingId, children: title }), introduction !== undefined && _jsx("p", { children: introduction })] }), _jsx("div", { className: "ferra-article-copy", children: children })] }), meta !== undefined && _jsx("footer", { className: "ferra-engine-meta", children: meta })] }));
}
export function FerraFeatureGrid({ items, }) {
    return (_jsx("div", { className: "ferra-feature-grid", children: items.map((item) => (_jsxs("section", { children: [_jsx("h3", { children: item.heading }), _jsx("div", { children: item.text })] }, item.heading))) }));
}
export function FerraTabs({ className, ...props }) {
    return _jsx("nav", { ...props, className: ["ferra-tabs", className].filter(Boolean).join(" ") });
}
/** Related destinations, with the title and action supplied by the host. */
export function FerraChoices({ children }) {
    return _jsx("div", { className: "ferra-choices", children: children });
}
export function FerraMedia({ children }) {
    return _jsx("figure", { className: "ferra-media", children: children });
}
export function FerraGuideNavigation({ className, ...props }) {
    return (_jsx("nav", { ...props, className: ["ferra-guide-navigation", className].filter(Boolean).join(" ") }));
}
