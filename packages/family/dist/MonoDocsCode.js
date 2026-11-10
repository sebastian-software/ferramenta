import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { protectRenderedHtml } from "./ReadingSupport.js";
/*
 * Code on a Monografie documentation page: source, highlighter output and
 * diagrams on light sheets.
 * Styled by `monografie-docs.css`.
 */
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/** Source on a light sheet, its caption and file name in the sheet's head. */
export function MonoCode({ caption, file, children }) {
    return (_jsxs("figure", { className: "mono-code", children: [_jsxs("figcaption", { children: [_jsx("span", { children: caption }), file !== undefined && file.length > 0 && _jsx("span", { className: "mono-code-file", children: file })] }), _jsx("pre", { tabIndex: 0, children: _jsx("code", { children: children }) })] }));
}
/** Trusted build-time highlighter output in its own colors. Never pass visitor-supplied HTML. */
export function MonoRenderedCode({ caption, html, children, className, ...props }) {
    const output = html === undefined ? undefined : protectRenderedHtml(html);
    return (_jsxs("figure", { ...props, className: classes("mono-rendered-code", className), children: [_jsx("figcaption", { children: caption }), output === undefined ? (_jsx("div", { className: "mono-rendered-code-content", children: children })) : (_jsx("div", { className: "mono-rendered-code-content", dangerouslySetInnerHTML: { __html: output } }))] }));
}
/** Two code sheets side by side, such as input and output; they stack on narrow screens. */
export function MonoCodePair({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("mono-code-pair", className) });
}
/** A responsive, selectable SVG on a light sheet, in a named keyboard-scrollable viewport. */
export function MonoDiagram({ caption, label, svg, className, ...props }) {
    const id = useId();
    return (_jsxs("figure", { ...props, className: classes("mono-diagram", className), children: [_jsx("figcaption", { id: id, children: caption }), _jsx("div", { className: "mono-diagram-viewport", role: "region", "aria-labelledby": id, tabIndex: 0, children: _jsx("div", { className: "mono-diagram-output", role: "img", "aria-label": label, dangerouslySetInnerHTML: { __html: svg } }) })] }));
}
