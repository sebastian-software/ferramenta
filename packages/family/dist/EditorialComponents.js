import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { isEditorialProduct } from "./EditorialIdentity.js";
import { displayName, family, isEngine, toolHref, WORKSHOP, WORKSHOP_REFERENCES, } from "./family.js";
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/** One authored light scheme; the stylesheet has no global reset. */
export function EditorialPage({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("fe-page", className) });
}
export function EditorialMark({ product, label, size = 48, className }) {
    const style = { "--fe-mark-size": `${size}px` };
    return (_jsx("span", { className: classes("fe-mark", className), "data-product": product, style: style, role: label !== undefined && label.length > 0 ? "img" : undefined, "aria-label": label, "aria-hidden": label !== undefined && label.length > 0 ? undefined : true }));
}
export function EditorialLogo({ product = "ferramenta", className, ...props }) {
    return (_jsxs("a", { ...props, className: classes("fe-brand", className), children: [_jsx(EditorialMark, { product: product }), _jsx("span", { children: displayName(product) })] }));
}
export function EditorialInstrument({ product, label, className }) {
    return (_jsx("span", { className: classes("fe-instrument", className), "data-product": product, role: label !== undefined && label.length > 0 ? "img" : undefined, "aria-label": label, "aria-hidden": label !== undefined && label.length > 0 ? undefined : true }));
}
export function EditorialHeader({ product = "ferramenta", home, nav, navLabel = "Main", }) {
    return (_jsxs("header", { className: "fe-header fe-wrap", children: [_jsx(EditorialLogo, { product: product, href: home }), nav !== undefined && nav !== null ? (_jsx("nav", { className: "fe-nav", "aria-label": navLabel, children: nav })) : null] }));
}
export function EditorialFooter({ product = "ferramenta", home, children }) {
    return (_jsxs("footer", { className: "fe-footer fe-wrap", children: [_jsxs("div", { className: "fe-footer-brand", children: [_jsx(EditorialLogo, { product: product, href: home }), _jsx("p", { children: product === "ferramenta" ? "Rust engines from one workshop." : "Part of Ferramenta." })] }), _jsxs("nav", { className: "fe-nav", "aria-label": "Footer", children: [_jsx("a", { href: WORKSHOP.source, children: "GitHub" }), _jsx("a", { href: WORKSHOP.imprint, children: "Imprint" }), _jsx("a", { href: WORKSHOP.privacy, children: "Privacy" }), children] })] }));
}
/** Place before the footer; original outside brands belong on a flat, light ground. */
export function EditorialWorkshop({ id, className, } = {}) {
    return (_jsx(EditorialSection, { id: id, className: classes("fe-workshop", className), surface: "plain", label: "Beyond the engines", intro: "The people and projects behind Ferramenta.", title: "From the same workshop.", children: _jsx("ul", { className: "fe-workshop-links", children: WORKSHOP_REFERENCES.map((reference) => (_jsx("li", { children: _jsxs("a", { href: reference.href, children: [_jsx("span", { className: "fe-workshop-logo", "data-brand": reference.id, role: "img", "aria-label": reference.name }), _jsx("p", { children: reference.description }), _jsx("span", { className: "fe-workshop-action", children: reference.action })] }) }, reference.id))) }) }));
}
export function EditorialHero({ product, title, what, children, actions, art, }) {
    const id = useId();
    const tool = family.find((member) => member.name === product);
    return (_jsxs("section", { className: "fe-hero fe-wrap", "aria-labelledby": id, children: [_jsxs("div", { className: "fe-hero-copy", children: [_jsx("h1", { id: id, children: title ?? `${displayName(product)}.` }), _jsx("p", { className: "fe-subtitle", children: what ?? tool?.what ?? "A family of Rust engines." }), children !== undefined && children !== null ? (_jsx("div", { className: "fe-lede", children: children })) : null, actions !== undefined && actions !== null ? (_jsx("div", { className: "fe-actions", children: actions })) : null] }), _jsx("div", { className: "fe-hero-art", children: art ?? _jsx(EditorialInstrument, { product: product }) })] }));
}
export function EditorialSection({ title, label, intro, surface = "paper", children, className, id, ...props }) {
    const generatedId = useId();
    const titleId = `${id ?? generatedId}-title`;
    return (_jsx("section", { ...props, id: id, className: classes("fe-section", className), "data-surface": surface, "aria-labelledby": titleId, children: _jsxs("div", { className: "fe-editorial fe-wrap", children: [_jsxs("aside", { className: "fe-margin", children: [_jsx("p", { className: "fe-label", children: label }), _jsx("div", { children: intro })] }), _jsxs("div", { className: "fe-story", children: [_jsx("h2", { id: titleId, children: title }), children] })] }) }));
}
export function EditorialColumns({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("fe-columns", className) });
}
export function EditorialAction({ variant = "primary", className, children, ...props }) {
    return (_jsx("a", { ...props, className: classes("fe-action", className), "data-variant": variant, children: children }));
}
/** Registry facts remain authoritative even when a preview overrides the destinations. */
export function EditorialEngineCatalog({ hrefFor = toolHref }) {
    return (_jsx("div", { className: "fe-engine-grid", children: family
            .filter((tool) => isEngine(tool))
            .map((tool) => {
            if (!isEditorialProduct(tool.name))
                throw new Error(`Missing editorial identity: ${tool.name}`);
            const product = tool.name;
            const name = displayName(tool);
            return (_jsxs("article", { className: "fe-engine", children: [_jsxs("div", { className: "fe-engine-heading", children: [_jsx(EditorialMark, { product: product, size: 64 }), _jsxs("div", { children: [_jsx("h3", { children: name }), _jsx("p", { className: "fe-engine-role", children: tool.what })] })] }), _jsx("p", { children: tool.does }), _jsx("p", { className: "fe-engine-audience", children: tool.audience }), _jsxs("a", { href: hrefFor(tool), children: ["Explore ", name, tool.docs === undefined && _jsx("span", { className: "fe-repo-hint", children: " on GitHub" })] })] }, tool.name));
        }) }));
}
/** Native children preserve the consumer's column and row header relationships. */
export function EditorialTable({ caption, children }) {
    const id = useId();
    return (_jsx("div", { className: "fe-table-region", role: "region", "aria-labelledby": id, tabIndex: 0, children: _jsxs("table", { className: "fe-table", children: [_jsx("caption", { id: id, children: caption }), children] }) }));
}
export function EditorialCode({ caption, file, children }) {
    return (_jsxs("figure", { className: "fe-code", children: [_jsxs("figcaption", { children: [_jsx("span", { children: caption }), file !== undefined && file.length > 0 && _jsx("span", { className: "fe-code-file", children: file })] }), _jsx("pre", { tabIndex: 0, children: _jsx("code", { children: children }) })] }));
}
/** A reading surface for the actual output of a worked example. */
export function EditorialSpecimen({ caption, children }) {
    return (_jsxs("figure", { className: "fe-specimen", children: [_jsx("figcaption", { children: caption }), _jsx("div", { className: "fe-specimen-output", children: children })] }));
}
export function EditorialBars({ caption, items, children }) {
    if (items.some((item) => !Number.isFinite(item.value) || item.value < 0))
        throw new RangeError("EditorialBars requires finite, nonnegative values.");
    const max = Math.max(0, ...items.map((item) => item.value));
    return (_jsxs("figure", { className: "fe-bars", children: [_jsx("figcaption", { children: caption }), _jsx("ul", { children: items.map((item) => (_jsxs("li", { "data-highlight": item.highlight === true ? true : undefined, children: [_jsx("span", { className: "fe-bar-label", children: item.label }), _jsx("span", { className: "fe-bar-value", children: item.displayValue }), _jsx("span", { className: "fe-bar-track", "aria-hidden": "true", children: _jsx("span", { style: { width: `${max === 0 ? 0 : (item.value / max) * 100}%` } }) })] }, item.id))) }), children !== undefined && children !== null ? (_jsx("div", { className: "fe-measure-note", children: children })) : null] }));
}
