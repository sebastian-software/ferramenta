import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { Mark } from "./Mark.js";
/*
 * The parts a Monografie documentation page sets in its reading column: code,
 * worked examples, controls, steps, measurements and related links. Each takes
 * the props of its Ferra counterpart; the code sheets are in MonoDocsCode.
 * Styled by `monografie-docs.css`.
 */
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/** Links between variants of one page, such as runtimes; the current one carries `aria-current`. */
export function MonoTabs({ className, ...props }) {
    return _jsx("nav", { ...props, className: classes("mono-tabs", className) });
}
/** Related destinations on light sheets; each child is an `<article>` with a heading, a line and a link. */
export function MonoChoices({ children }) {
    return _jsx("div", { className: "mono-choices", children: children });
}
/** One picture, centered and never wider than the column. */
export function MonoMedia({ children }) {
    return _jsx("figure", { className: "mono-media", children: children });
}
/** Short headed paragraphs side by side, each under a hairline. */
export function MonoFeatureGrid({ items, }) {
    return (_jsx("div", { className: "mono-feature-grid", children: items.map((item) => (_jsxs("section", { children: [_jsx("h3", { children: item.heading }), _jsx("div", { children: item.text })] }, item.heading))) }));
}
/** Two columns that stack on narrow screens. */
export function MonoColumns({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("mono-columns", className) });
}
/** A story on a light sheet, with an optional picture first and its evidence in the footer. */
export function MonoArticle({ title, introduction, art, icon, meta, children, className, ...props }) {
    const generatedId = useId();
    const headingId = props.id === undefined ? generatedId : `${props.id}-title`;
    return (_jsxs("article", { tabIndex: -1, ...props, className: classes("mono-article", className), "aria-labelledby": headingId, children: [_jsxs("div", { className: "mono-article-content", children: [art !== undefined && _jsx("div", { className: "mono-article-art", children: art }), icon !== undefined && (_jsx("div", { className: "mono-article-icon", "aria-hidden": "true", children: icon })), _jsxs("header", { className: "mono-article-heading", children: [_jsx("h2", { id: headingId, children: title }), introduction !== undefined && _jsx("p", { children: introduction })] }), _jsx("div", { className: "mono-article-copy", children: children })] }), meta !== undefined && _jsx("footer", { className: "mono-article-meta", children: meta })] }));
}
/** A labeled native select; callers own its value and the content it controls. */
export function MonoSelect({ label, options, ...props }) {
    return (_jsxs("label", { className: "mono-select", children: [_jsx("span", { children: label }), _jsx("select", { ...props, children: options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }));
}
/** A worked example on facing sheets, source beside result; callers own the state and the output. */
export function MonoExample({ title, introduction, source, controls, footer, children, }) {
    const id = useId();
    return (_jsxs("section", { className: "mono-example", "aria-labelledby": id, children: [_jsxs("header", { children: [_jsx("h3", { id: id, children: title }), introduction !== undefined && _jsx("p", { children: introduction })] }), controls != null && _jsx("div", { className: "mono-example-controls", children: controls }), _jsxs("div", { className: "mono-example-grid", children: [_jsxs("div", { className: "mono-example-source", children: [_jsx("p", { className: "mono-example-label", children: "Source" }), _jsx("pre", { children: _jsx("code", { children: source }) })] }), _jsxs("div", { className: "mono-example-preview", children: [_jsx("p", { className: "mono-example-label", children: "Result" }), _jsx("div", { className: "mono-example-result", children: children })] })] }), footer !== undefined && _jsx("div", { className: "mono-example-footer", children: footer })] }));
}
/** An option that is on or off, with one line on what it changes. */
export function MonoToggle({ pressed, label, description, ...props }) {
    return (_jsxs("button", { ...props, className: "mono-toggle", type: "button", "aria-pressed": pressed, children: [_jsxs("span", { children: [_jsx("strong", { children: label }), _jsx("span", { children: description })] }), _jsx("span", { className: "mono-toggle-state", "aria-hidden": "true", children: _jsx(Mark, { name: "check", size: 14 }) })] }));
}
/** A short ordered explanation; content and processing logic belong to the host. */
export function MonoSteps({ caption, items, }) {
    return (_jsxs("figure", { className: "mono-steps", children: [_jsx("figcaption", { children: caption }), _jsx("ol", { children: items.map((item) => (_jsxs("li", { children: [_jsx("strong", { children: item.heading }), _jsx("div", { children: item.text })] }, item.heading))) })] }));
}
/** Measurement conditions, source revision and reproduction beside the result. */
export function MonoMeasured({ on, machine, revision, more, children }) {
    const rows = [
        { label: "Measured", value: on },
        { label: "Machine", value: machine },
        ...(revision === undefined ? [] : [{ label: "Revision", value: revision }]),
        ...(more ?? []),
        ...(children === undefined ? [] : [{ label: "Reproduce", value: children }]),
    ];
    return (_jsx("dl", { className: "mono-measured", children: rows.map((row) => (_jsxs("div", { children: [_jsx("dt", { children: row.label }), _jsx("dd", { children: row.value })] }, row.label))) }));
}
/**
 * One measure as bars in the instrument's steel, scaled to the largest value;
 * the highlighted bar is the engine's own, in rust. For a chart with a 1× line
 * and a task switch, use `MonoBarChart`.
 */
export function MonoBars({ caption, items, children }) {
    if (items.some((item) => !Number.isFinite(item.value) || item.value < 0))
        throw new RangeError("MonoBars requires finite, nonnegative values.");
    const max = Math.max(0, ...items.map((item) => item.value));
    return (_jsxs("figure", { className: "mono-bar-figure", children: [_jsx("figcaption", { children: caption }), _jsx("ul", { className: "mono-bar-list", children: items.map((item) => {
                    const own = item.highlight === true;
                    return (_jsxs("li", { "data-highlight": own ? true : undefined, children: [_jsx("span", { className: "mono-bar-label", children: item.label }), _jsx("span", { className: own ? "mono-bar-value mono-own" : "mono-bar-value", children: item.displayValue }), _jsx("span", { className: "mono-track", "aria-hidden": "true", children: _jsx("span", { className: own ? "mono-bar mono-own" : "mono-bar", style: { width: `${max === 0 ? 0 : (item.value / max) * 100}%` } }) })] }, item.id));
                }) }), children !== undefined && children !== null ? (_jsx("div", { className: "mono-measure-note", children: children })) : null] }));
}
