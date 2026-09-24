import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from "react";
import { Mark } from "./Mark.js";
/** The first viewport: poster headline left, the project's plate right, ember glow on the floor. */
export function ProjectHero({ actions, aside, install, lede, mark, title }) {
    const titleId = useId();
    let side = aside;
    if (side === undefined && mark !== undefined) {
        side = (_jsx("span", { className: "markplate fam-hero-plate", "aria-hidden": "true", children: _jsx(Mark, { name: mark }) }));
    }
    return (_jsx("section", { className: "fam-hero", "aria-labelledby": titleId, children: _jsxs("div", { className: "wrap", children: [_jsxs("div", { children: [_jsx("h1", { className: "fam-title", id: titleId, children: title }), lede !== undefined && _jsx("p", { className: "fam-lede", children: lede }), actions !== undefined && _jsx("div", { className: "fam-actions", children: actions }), install !== undefined && _jsx("p", { className: "fam-install", children: install })] }), side] }) }));
}
/** An open-ledger section on the shop floor: ruled display heading, intro, content. */
export function Section({ children, className, id, intro, layout = "stack", note, title, }) {
    const titleId = useId();
    const head = (_jsxs(_Fragment, { children: [_jsx("h2", { className: "fam-heading", id: titleId, children: title }), intro !== undefined && _jsx("p", { className: "fam-intro", children: intro }), note !== undefined && _jsx("p", { className: "fam-note", children: note })] }));
    return (_jsx("section", { className: ["fam-section", className].filter(Boolean).join(" "), id: id, "aria-labelledby": titleId, children: layout === "split" ? (_jsxs("div", { className: "wrap fam-split", children: [_jsx("div", { children: head }), _jsx("div", { children: children })] })) : (_jsxs("div", { className: "wrap", children: [head, children] })) }));
}
/**
 * The full-bleed dark band between the shop-floor sections, for what the
 * project stands on. Marks inside it take the iron duotone set (`.on-iron`).
 */
export function IronBand({ children, id, intro, rows, title }) {
    const titleId = useId();
    return (_jsx("section", { className: "fam-band on-iron", id: id, "aria-labelledby": titleId, children: _jsxs("div", { className: "wrap", children: [_jsx("h2", { className: "fam-heading", id: titleId, children: title }), intro !== undefined && _jsx("p", { className: "fam-intro", children: intro }), rows !== undefined && rows.length > 0 && (_jsx("div", { className: "fam-rows", children: rows.map((row) => (_jsxs("div", { children: [_jsx("h3", { children: row.heading }), _jsx("p", { children: row.text })] }, row.heading))) })), children] }) }));
}
/**
 * The flat, ruled return to the one action the page is for — no card, no new
 * material. Copy left, actions right; stacked below 54rem.
 */
export function ClosingAction({ actions, aside, children, id, links, title }) {
    const titleId = useId();
    return (_jsx("section", { className: "fam-section fam-closing", id: id, "aria-labelledby": titleId, children: _jsxs("div", { className: "wrap", children: [_jsx("h2", { className: "fam-heading", id: titleId, children: title }), _jsxs("div", { className: "fam-closing-grid", children: [_jsxs("div", { className: "fam-closing-copy", children: [children, links !== undefined && _jsx("p", { className: "fam-links", children: links })] }), actions !== undefined && _jsx("div", { className: "fam-actions", children: actions }), aside !== undefined && _jsx("div", { className: "fam-closing-aside", children: aside })] })] }) }));
}
