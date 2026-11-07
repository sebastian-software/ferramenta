import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from "react";
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/* Five engraved hairlines between sections, one of them in oxide. The seed
   varies the lengths so neighboring rules never repeat. */
const LENGTHS = [128, 96, 120, 82, 112, 104, 130, 88, 118, 100, 124, 92, 110, 86, 116];
export function MonoEngraving({ seed }) {
    return (_jsx("svg", { className: "mono-engraving", viewBox: "0 0 132 34", "aria-hidden": "true", children: [0, 1, 2, 3, 4].map((line) => (_jsx("line", { x1: 2, x2: LENGTHS[(seed * 7 + line * 4) % LENGTHS.length], y1: 2 + line * 7, y2: 2 + line * 7, className: line === seed % 5 ? "mono-oxide" : undefined }, line))) }));
}
export function MonoAction({ href, primary = false, variant, detail, children, className, ...props }) {
    const rust = variant === undefined ? primary : variant === "primary";
    return (_jsxs("a", { ...props, className: classes("mono-action", className), href: href, "data-primary": rust ? "" : undefined, children: [children, detail !== undefined && _jsx("small", { children: detail })] }));
}
/** The instrument as a centered plate, the name and the first actions. */
export function MonoOpening({ product, instrumentLabel, caption, kicker, title, subtitle, standfirst, actions, facts, }) {
    const id = useId();
    return (_jsxs("section", { className: "mono-opening", "aria-labelledby": id, children: [_jsxs("figure", { className: "mono-plate", children: [_jsx("span", { className: "ferra-instrument", "data-product": product, role: "img", "aria-label": instrumentLabel }), caption !== undefined && _jsx("figcaption", { children: caption })] }), _jsx("p", { className: "mono-kicker", children: kicker }), _jsxs("h1", { id: id, children: [title, subtitle !== undefined && _jsx("span", { className: "mono-second", children: subtitle })] }), _jsx("p", { className: "mono-standfirst", children: standfirst }), _jsx("div", { className: "mono-actions", children: actions }), facts !== undefined && facts.length > 0 && (_jsx("ul", { className: "mono-facts", children: facts.map((fact, index) => (_jsxs("li", { children: [_jsx("strong", { children: fact.value }), fact.label] }, index))) }))] }));
}
/** A chapter on the reading axis: heading, standfirst, then its passages. */
export function MonoSection({ id, title, standfirst, children, className, ...props }) {
    const headingId = useId();
    return (_jsx("section", { ...props, id: id, className: className, "aria-labelledby": headingId, children: _jsxs("div", { className: "mono-axis", children: [_jsx("h2", { id: headingId, children: title }), standfirst !== undefined && _jsx("p", { className: "mono-standfirst", children: standfirst }), children] }) }));
}
/** Reading text on the axis, with an optional note in the margin beside it. */
export function MonoPassage({ note, children }) {
    if (note === undefined)
        return _jsx(_Fragment, { children: children });
    return (_jsxs("div", { className: "mono-row", children: [_jsxs("aside", { className: "mono-note", "data-side": note.side ?? "left", children: [note.figure !== undefined && _jsx("span", { className: "mono-note-figure", children: note.figure }), note.term !== undefined && _jsx("b", { children: note.term }), note.children] }), _jsx("div", { className: "mono-row-text", children: children })] }));
}
/** A lead-in: the first words of a passage in small capitals. */
export function MonoLeadIn({ children }) {
    return _jsx("span", { className: "mono-lead-in", children: children });
}
export function MonoColophon({ className, ...props }) {
    return _jsx("p", { ...props, className: classes("mono-colophon", className) });
}
export function MonoClosing({ id: anchor, title, standfirst, actions, links, children, }) {
    const id = useId();
    return (_jsxs("section", { className: "mono-closing", id: anchor, "aria-labelledby": id, children: [_jsx("h2", { id: id, children: title }), _jsx("p", { className: "mono-standfirst", children: standfirst }), _jsx("div", { className: "mono-actions", children: actions }), links !== undefined && _jsx("p", { className: "mono-closing-links", children: links }), children] }));
}
