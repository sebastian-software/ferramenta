import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
/*
 * The plate: the family's one prop. A sheet of brushed steel, riveted at its
 * corners, that says what a thing is. Text on it is dark and solid; small
 * measured facts never sit on the steel itself but on a dark inlay or on a tag
 * hanging below it. Styled by `landing.css`.
 */
const corners = ["tl", "tr", "br", "bl"];
/** Four rivets, one per corner of the plate they hold. */
export function Rivets() {
    return (_jsx(_Fragment, { children: corners.map((corner) => (_jsx("i", { className: "fam-rivet", "data-corner": corner, "aria-hidden": "true" }, corner))) }));
}
/** A riveted steel plate around its children. */
export function Plate({ as = "div", children, className, rivets = true }) {
    const Root = as;
    return (_jsxs(Root, { className: className === undefined ? "fam-plate" : `fam-plate ${className}`, children: [rivets && _jsx(Rivets, {}), children] }));
}
/**
 * The measured facts of whatever the plate above it names, on a small tag
 * hanging from that plate by two links. They come second: the plate says what
 * the thing is, the tag says what it is checked against.
 */
export function HangingTag({ facts }) {
    return (_jsxs("div", { className: "fam-hanger", children: [_jsx("i", { className: "fam-link", "data-side": "left", "aria-hidden": "true" }), _jsx("i", { className: "fam-link", "data-side": "right", "aria-hidden": "true" }), _jsx("dl", { className: "fam-plate fam-tag", children: facts.map((fact) => (_jsxs("div", { children: [_jsx("dt", { children: fact.label }), _jsx("dd", { children: fact.value })] }, fact.label))) })] }));
}
let lights = 0;
function followPointer(event) {
    const across = event.clientX / globalThis.innerWidth;
    document.documentElement.style.setProperty("--fam-sheen", `${(120 - across * 140).toFixed(1)}%`);
}
/** Starts following the pointer for one more light; returns how to stop. */
function switchOn() {
    if (lights === 0)
        globalThis.addEventListener("pointermove", followPointer, { passive: true });
    lights += 1;
    return () => {
        lights -= 1;
        if (lights === 0)
            globalThis.removeEventListener("pointermove", followPointer);
    };
}
/** Nothing to stop: the light never moved. */
function stayStill() {
    // A visitor who asked for reduced motion keeps the reflection where it is.
}
/**
 * One light for every plate on the page: the reflection on the steel follows
 * the pointer. Render it once per page; the hero does. It draws nothing, and
 * does nothing for a visitor who asked for reduced motion.
 */
export function PlateLight() {
    useEffect(() => {
        const still = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
        return still ? stayStill : switchOn();
    }, []);
    return null;
}
