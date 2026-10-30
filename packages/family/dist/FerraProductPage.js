import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { FerraSoftCard } from "./FerraEditorial.js";
/** A product's continuous reading flow, without the family catalog's contents rail. */
export function FerraProductPage({ className, ...props }) {
    return (_jsx("div", { ...props, className: ["ferra-product-page ferra-wrap", className].filter(Boolean).join(" ") }));
}
/** The purpose and entry points face the instrument; release facts share their footer. */
export function FerraProductLead({ title, introduction, art, headingLevel = 1, byline, meta, children, className, ...props }) {
    const generatedId = useId();
    const headingId = props.id === undefined ? generatedId : `${props.id}-title`;
    const Heading = headingLevel === 1 ? "h1" : "h2";
    return (_jsxs(FerraSoftCard, { ...props, as: "section", className: ["ferra-product-lead", className].filter(Boolean).join(" "), "aria-labelledby": headingId, children: [_jsxs("div", { className: "ferra-product-lead-body", children: [_jsxs("header", { className: "ferra-product-lead-heading", children: [_jsx(Heading, { id: headingId, children: title }), _jsx("p", { children: introduction })] }), _jsxs("div", { className: "ferra-product-lead-copy", children: [children, byline !== undefined && _jsx("p", { className: "ferra-product-byline", children: byline })] }), _jsx("div", { className: "ferra-product-lead-art", children: art })] }), meta !== undefined && _jsx("footer", { className: "ferra-engine-meta", children: meta })] }));
}
