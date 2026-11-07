import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
/*
 * Behavior the reading components of both page systems share (Ferra and
 * Monografie): only logic and plain text, never a class name, so each system
 * keeps its own markup contract.
 */
/** True while the element is wider inside than its box: a table that scrolls sideways. */
export function useHorizontalOverflow(ref) {
    const [overflows, setOverflows] = useState(false);
    useEffect(() => {
        const element = ref.current;
        if (element === null)
            return;
        const measure = () => {
            setOverflows(element.scrollWidth > element.clientWidth + 1);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        if (element.firstElementChild !== null)
            observer.observe(element.firstElementChild);
        return () => {
            observer.disconnect();
        };
    }, [ref]);
    return overflows;
}
function protectBackground(declaration) {
    return declaration.includes("!important") ? declaration : `${declaration} !important`;
}
function protectStyle(_, style) {
    return `style="${style.replaceAll(/background(?:-color)?:[^;]+/g, protectBackground)}"`;
}
/**
 * Highlighter output made keyboard-scrollable. Ardo resets renderer backgrounds
 * with !important, so the renderer's own background (and the foreground palette
 * that matches it, CSS variables included) is protected the same way.
 */
export function protectRenderedHtml(html) {
    return html.replaceAll(/<pre\b[^>]*>/g, (tag) => {
        const focusable = /\btabindex=/i.test(tag) ? tag : tag.replace("<pre", '<pre tabindex="0"');
        return focusable.replace(/style="([^"]*)"/, protectStyle);
    });
}
function isMark(value) {
    return typeof value === "object" && value !== null && "mark" in value;
}
/** One comparison cell in words: Yes, No, Partial with its note, the value, or a dash. */
export function ComparisonWords({ value }) {
    if (value === true)
        return _jsx(_Fragment, { children: "Yes" });
    if (value === false)
        return _jsx(_Fragment, { children: "No" });
    if (isMark(value)) {
        const labels = { yes: "Yes", partial: "Partial", no: "No" };
        return (_jsxs(_Fragment, { children: [labels[value.mark], value.note !== undefined && _jsxs(_Fragment, { children: [": ", value.note] })] }));
    }
    return _jsx(_Fragment, { children: value ?? "—" });
}
