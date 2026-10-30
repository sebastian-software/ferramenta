import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { displayName, family, WORKSHOP, WORKSHOP_REFERENCES } from "./family.js";
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/** One authored light scheme; the stylesheet has no global reset. */
export function FerraPage({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("ferra-page", className) });
}
export function FerraMark({ product, label, size = 48, className }) {
    const style = { "--ferra-mark-size": `${size}px` };
    return (_jsx("span", { className: classes("ferra-mark", className), "data-product": product, style: style, role: label !== undefined && label.length > 0 ? "img" : undefined, "aria-label": label, "aria-hidden": label !== undefined && label.length > 0 ? undefined : true }));
}
export function FerraLogo({ product = "ferramenta", mark = true, className, ...props }) {
    return (_jsxs("a", { ...props, className: classes("ferra-brand", className), children: [mark && _jsx(FerraMark, { product: product }), _jsx("span", { children: displayName(product) })] }));
}
export function FerraInstrument({ product, label, className }) {
    return (_jsx("span", { className: classes("ferra-instrument", className), "data-product": product, role: label !== undefined && label.length > 0 ? "img" : undefined, "aria-label": label, "aria-hidden": label !== undefined && label.length > 0 ? undefined : true }));
}
export function FerraHeader({ product = "ferramenta", mark, home, nav, navLabel = "Main", actions, }) {
    return (_jsxs("header", { className: "ferra-header ferra-wrap", children: [_jsx(FerraLogo, { product: product, href: home, mark: mark }), nav !== undefined && nav !== null ? (_jsx("nav", { className: "ferra-nav", "aria-label": navLabel, children: nav })) : null, actions !== undefined && actions !== null ? (_jsx("div", { className: "ferra-header-actions", children: actions })) : null] }));
}
export function FerraFooter({ product = "ferramenta", home, children }) {
    return (_jsxs("footer", { className: "ferra-footer ferra-wrap", children: [_jsxs("div", { className: "ferra-footer-brand", children: [_jsx(FerraLogo, { product: product, href: home }), _jsx("p", { children: product === "ferramenta" ? "Rust engines from one workshop." : "Part of Ferramenta." })] }), _jsxs("nav", { className: "ferra-nav", "aria-label": "Footer", children: [_jsx("a", { href: WORKSHOP.source, children: "GitHub" }), _jsx("a", { href: WORKSHOP.imprint, children: "Imprint" }), _jsx("a", { href: WORKSHOP.privacy, children: "Privacy" }), children] })] }));
}
/** Place before the footer; original outside brands belong on a flat, light ground. */
export function FerraWorkshop({ id, className, } = {}) {
    return (_jsx(FerraSection, { id: id, className: classes("ferra-workshop", className), surface: "plain", label: "Beyond the engines", intro: "The people and projects behind Ferramenta.", title: "From the same workshop.", children: _jsx("ul", { className: "ferra-workshop-links", children: WORKSHOP_REFERENCES.map((reference) => (_jsx("li", { children: _jsxs("a", { href: reference.href, children: [_jsx("span", { className: "ferra-workshop-logo", "data-brand": reference.id, role: "img", "aria-label": reference.name }), _jsx("p", { children: reference.description }), _jsx("span", { className: "ferra-workshop-action", children: reference.action })] }) }, reference.id))) }) }));
}
export function FerraHero({ product, title, what, children, actions, art }) {
    const id = useId();
    const tool = family.find((member) => member.name === product);
    return (_jsxs("section", { className: "ferra-hero ferra-wrap", "aria-labelledby": id, children: [_jsxs("div", { className: "ferra-hero-copy", children: [_jsx("h1", { id: id, children: title ?? `${displayName(product)}.` }), _jsx("p", { className: "ferra-subtitle", children: what ?? tool?.what ?? "A family of Rust engines." }), children !== undefined && children !== null ? (_jsx("div", { className: "ferra-lede", children: children })) : null, actions !== undefined && actions !== null ? (_jsx("div", { className: "ferra-actions", children: actions })) : null] }), _jsx("div", { className: "ferra-hero-art", children: art ?? _jsx(FerraInstrument, { product: product }) })] }));
}
export function FerraSection({ title, label, intro, surface = "paper", children, className, id, ...props }) {
    const generatedId = useId();
    const titleId = `${id ?? generatedId}-title`;
    return (_jsx("section", { ...props, id: id, className: classes("ferra-section", className), "data-surface": surface, "aria-labelledby": titleId, children: _jsxs("div", { className: "ferra-section-layout ferra-wrap", children: [_jsxs("aside", { className: "ferra-margin", children: [_jsx("p", { className: "ferra-label", children: label }), _jsx("div", { children: intro })] }), _jsxs("div", { className: "ferra-story", children: [_jsx("h2", { id: titleId, children: title }), children] })] }) }));
}
export function FerraColumns({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("ferra-columns", className) });
}
export function FerraAction({ variant = "primary", className, children, ...props }) {
    return (_jsx("a", { ...props, className: classes("ferra-action", className), "data-variant": variant, children: children }));
}
/** Native children preserve the consumer's column and row header relationships. */
export function FerraTable({ caption, children, className, ...props }) {
    const id = useId();
    return (_jsx("div", { className: "ferra-table-region", role: "region", "aria-labelledby": id, tabIndex: 0, children: _jsxs("table", { ...props, className: classes("ferra-table", className), children: [_jsx("caption", { id: id, children: caption }), children] }) }));
}
export function FerraCode({ caption, file, children }) {
    return (_jsxs("figure", { className: "ferra-code", children: [_jsxs("figcaption", { children: [_jsx("span", { children: caption }), file !== undefined && file.length > 0 && _jsx("span", { className: "ferra-code-file", children: file })] }), _jsx("pre", { tabIndex: 0, children: _jsx("code", { children: children }) })] }));
}
/** A reading surface for the actual output of a worked example. */
export function FerraSpecimen({ caption, children }) {
    return (_jsxs("figure", { className: "ferra-specimen", children: [_jsx("figcaption", { children: caption }), _jsx("div", { className: "ferra-specimen-output", children: children })] }));
}
export function FerraBars({ caption, items, children }) {
    if (items.some((item) => !Number.isFinite(item.value) || item.value < 0))
        throw new RangeError("FerraBars requires finite, nonnegative values.");
    const max = Math.max(0, ...items.map((item) => item.value));
    return (_jsxs("figure", { className: "ferra-bars", children: [_jsx("figcaption", { children: caption }), _jsx("ul", { children: items.map((item) => (_jsxs("li", { "data-highlight": item.highlight === true ? true : undefined, children: [_jsx("span", { className: "ferra-bar-label", children: item.label }), _jsx("span", { className: "ferra-bar-value", children: item.displayValue }), _jsx("span", { className: "ferra-bar-track", "aria-hidden": "true", children: _jsx("span", { style: { width: `${max === 0 ? 0 : (item.value / max) * 100}%` } }) })] }, item.id))) }), children !== undefined && children !== null ? (_jsx("div", { className: "ferra-measure-note", children: children })) : null] }));
}
