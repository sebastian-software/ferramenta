import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { useScrollableCode } from "./ReadingSupport.js";
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/** Breaks out of the reading column to the wide measure. */
export function MonoWide({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("mono-wide", className) });
}
/** Two facing pages of real output, with a gutter between them. */
export function MonoFacing({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("mono-facing", className) });
}
export function MonoSheet({ label, meta, className, children, ...props }) {
    const ref = useRef(null);
    useScrollableCode(ref, children);
    return (_jsxs("div", { ...props, ref: ref, className: classes("mono-sheet", className), children: [_jsxs("div", { className: "mono-sheet-head", children: [_jsx("span", { children: label }), meta !== undefined && _jsx("span", { children: meta })] }), children] }));
}
export function MonoCaption({ className, ...props }) {
    return _jsx("p", { ...props, className: classes("mono-caption", className) });
}
export function MonoCredit({ className, ...props }) {
    return _jsx("p", { ...props, className: classes("mono-credit", className) });
}
/** Short terms with a line each: modules, steps, scope. */
export function MonoTerms({ items, columns = 4, prose = false, className }) {
    const style = {
        "--mono-terms-columns": String(columns),
    };
    return (_jsx("dl", { className: classes("mono-terms", className), style: style, "data-prose": prose ? "" : undefined, children: items.map((item, index) => (_jsxs("div", { children: [_jsx("dt", { children: item.term }), _jsx("dd", { children: item.description })] }, index))) }));
}
/** Passed checks, each with its count, joined by a dotted leader. */
export function MonoProofs({ items, className }) {
    return (_jsx("ul", { className: classes("mono-proofs", className), children: items.map((item, index) => (_jsxs("li", { children: [_jsx("span", { children: item.label }), _jsx("span", { className: "mono-dots", "aria-hidden": "true" }), _jsx("b", { children: item.value })] }, index))) }));
}
export function MonoCards({ layout = "three", className, ...props }) {
    return (_jsx("div", { ...props, className: classes("mono-cards", className), "data-layout": layout === "three" ? undefined : layout }));
}
/** A short example under its title; code in it that scrolls sideways is reachable by keyboard. */
export function MonoCard({ title, api, className, children, ...props }) {
    const ref = useRef(null);
    useScrollableCode(ref, children);
    return (_jsxs("div", { ...props, ref: ref, className: classes("mono-card", className), children: [_jsx("h3", { children: title }), api !== undefined && _jsx("p", { className: "mono-card-api", children: api }), children] }));
}
export function MonoVerdict({ className, ...props }) {
    return _jsx("p", { ...props, className: classes("mono-card-verdict", className) });
}
