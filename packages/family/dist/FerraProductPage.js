import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
/** A product's continuous reading flow, without the family catalog's contents rail. */
export function FerraProductPage({ className, ...props }) {
    return (_jsx("div", { ...props, className: ["ferra-product-page ferra-wrap", className].filter(Boolean).join(" ") }));
}
/** An editorial cover: instrument, purpose, introduction, entry points and byline. */
export function FerraProductLead({ title, introduction, art, headingLevel = 1, byline, meta, children, className, ...props }) {
    const generatedId = useId();
    const headingId = props.id === undefined ? generatedId : `${props.id}-title`;
    const Heading = headingLevel === 1 ? "h1" : "h2";
    return (_jsxs("section", { ...props, className: ["ferra-product-lead", className].filter(Boolean).join(" "), "aria-labelledby": headingId, children: [_jsxs("div", { className: "ferra-product-lead-body", children: [_jsx("div", { className: "ferra-product-lead-art", children: art }), _jsxs("header", { className: "ferra-product-lead-heading", children: [_jsx(Heading, { id: headingId, children: title }), _jsx("p", { children: introduction })] }), _jsxs("div", { className: "ferra-product-lead-copy", children: [children, byline !== undefined && _jsx("p", { className: "ferra-product-byline", children: byline })] })] }), meta !== undefined && _jsx("footer", { className: "ferra-engine-meta", children: meta })] }));
}
