import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from "react";
import { WORKSHOP } from "./family.js";
import { Icon } from "./Icon.js";
import { Mark } from "./Mark.js";
import { HangingTag, PlateLight, Rivets } from "./Plate.js";
/** The copy on the hero plate: the name, what it is, the lede, and the action row. */
function HeroCopy({ actions, install, lede, title, titleId, what, }) {
    const hasActions = actions !== undefined || install !== undefined;
    return (_jsxs("div", { className: "fam-hero-copy", children: [_jsx("h1", { className: "fam-title", id: titleId, children: title }), what !== undefined && _jsx("p", { className: "fam-what", children: what }), lede !== undefined && _jsx("p", { className: "fam-lede", children: lede }), hasActions && (_jsxs("div", { className: "fam-actions", children: [actions, install !== undefined && _jsx("p", { className: "fam-install", children: install })] }))] }));
}
/**
 * The first viewport: one steel plate on the oak bench. The plate carries the
 * name, what the thing is, and the action; the facts hang below it.
 */
export function ProjectHero({ aside, facts, icon, ...copy }) {
    const titleId = useId();
    let side = aside;
    if (side === undefined && icon !== undefined)
        side = _jsx(Icon, { name: icon, form: "hero" });
    return (_jsxs("section", { className: "fam-hero", "aria-labelledby": titleId, children: [_jsx(PlateLight, {}), _jsxs("div", { className: "wrap", children: [_jsxs("div", { className: "fam-plate fam-hero-plate", children: [_jsx(Rivets, {}), _jsx(HeroCopy, { ...copy, titleId: titleId }), side !== undefined && _jsx("div", { className: "fam-hero-side", children: side })] }), facts !== undefined && facts.length > 0 && _jsx(HangingTag, { facts: facts })] })] }));
}
/** A section on the light ground: display heading, intro, content. */
export function Section({ children, className, id, intro, layout = "stack", note, title, tone = "floor", }) {
    const titleId = useId();
    const head = (_jsxs(_Fragment, { children: [_jsx("h2", { className: "fam-heading", id: titleId, children: title }), intro !== undefined && _jsx("p", { className: "fam-intro", children: intro }), note !== undefined && _jsx("p", { className: "fam-note", children: note })] }));
    return (_jsx("section", { className: ["fam-section", className].filter(Boolean).join(" "), "data-tone": tone === "dim" ? "dim" : undefined, id: id, "aria-labelledby": titleId, children: layout === "split" ? (_jsxs("div", { className: "wrap fam-split", children: [_jsx("div", { children: head }), _jsx("div", { children: children })] })) : (_jsxs("div", { className: "wrap", children: [head, children] })) }));
}
/** Principles side by side, each under a heavy rule: what a project stands on. */
export function Principles({ items }) {
    return (_jsx("ul", { className: "fam-principles", "data-count": items.length, children: items.map((item) => (_jsxs("li", { children: [_jsx("h3", { children: item.heading }), _jsx("p", { children: item.text })] }, item.heading))) }));
}
/**
 * The full-bleed dark band between the light sections, in dark oak: a page's
 * one or two deliberately dark passages. Everything inside takes the on-iron
 * colors (`.on-iron`).
 */
export function IronBand({ children, id, intro, rows, title }) {
    const titleId = useId();
    return (_jsx("section", { className: "fam-band on-iron", id: id, "aria-labelledby": titleId, children: _jsxs("div", { className: "wrap", children: [_jsx("h2", { className: "fam-heading", id: titleId, children: title }), intro !== undefined && _jsx("p", { className: "fam-intro", children: intro }), rows !== undefined && rows.length > 0 && _jsx(Principles, { items: rows }), children] }) }));
}
/**
 * The flat return to the one action the page is for — no plate, no new
 * material. The copy, its action right under it, then the link line.
 */
export function ClosingAction({ actions, aside, children, id, links, title }) {
    const titleId = useId();
    return (_jsx("section", { className: "fam-section fam-closing", id: id, "aria-labelledby": titleId, children: _jsxs("div", { className: "wrap", children: [_jsx("h2", { className: "fam-heading", id: titleId, children: title }), _jsxs("div", { className: "fam-closing-grid", children: [_jsxs("div", { className: "fam-closing-copy", children: [children, actions !== undefined && _jsx("div", { className: "fam-actions", children: actions }), links !== undefined && _jsx("p", { className: "fam-links", children: links })] }), aside !== undefined && _jsx("div", { className: "fam-closing-aside", children: aside })] })] }) }));
}
const DEFAULT_OFFERS = [
    "Integration into your toolchain",
    "Support with a named contact",
    "Long-term maintenance",
];
/**
 * The rust band a family page closes on: the people who build the engines can
 * be hired. One action, to the workshop's consulting site; no form here.
 */
export function WorkWithUs({ action = "Talk to Sebastian Consulting", children, id = "work", offers = DEFAULT_OFFERS, title = "Need one of these in your stack?", } = {}) {
    const titleId = useId();
    return (_jsx("section", { className: "fam-work", id: id, "aria-labelledby": titleId, children: _jsxs("div", { className: "wrap fam-work-grid", children: [_jsxs("div", { children: [_jsx("h2", { className: "fam-heading", id: titleId, children: title }), children ?? (_jsx("p", { children: "The people who build the engines also integrate them, support them, and maintain them for the long run." }))] }), _jsxs("div", { children: [_jsx("ul", { className: "fam-offers", children: offers.map((offer) => (_jsx("li", { children: offer }, offer))) }), _jsxs("a", { className: "fam-btn fam-btn-steel", href: WORKSHOP.consulting, children: [action, " ", _jsx(Mark, { name: "arrow", size: 18 })] })] })] }) }));
}
