import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useId, useState } from "react";
import { FerraMark } from "./FerraComponents.js";
import { Mark } from "./Mark.js";
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
function useCurrentSection(items) {
    const [current, setCurrent] = useState(items.find((item) => item.href.startsWith("#"))?.href);
    useEffect(() => {
        const targets = items.flatMap((item) => {
            if (!item.href.startsWith("#"))
                return [];
            const element = document.getElementById(item.href.slice(1));
            return element === null ? [] : [{ element, href: item.href }];
        });
        let frame = 0;
        const update = () => {
            frame = 0;
            const position = globalThis.innerHeight * 0.3;
            let active = targets.at(0);
            let nearest = -Infinity;
            for (const target of targets) {
                const top = target.element.getBoundingClientRect().top;
                if (top <= position && top > nearest) {
                    active = target;
                    nearest = top;
                }
            }
            if (active !== undefined)
                setCurrent(active.href);
        };
        const schedule = () => {
            if (frame === 0)
                frame = globalThis.requestAnimationFrame(update);
        };
        schedule();
        globalThis.addEventListener("scroll", schedule, { passive: true });
        globalThis.addEventListener("resize", schedule);
        globalThis.addEventListener("hashchange", schedule);
        return () => {
            globalThis.cancelAnimationFrame(frame);
            globalThis.removeEventListener("scroll", schedule);
            globalThis.removeEventListener("resize", schedule);
            globalThis.removeEventListener("hashchange", schedule);
        };
    }, [items]);
    return current;
}
/** One ungrouped contents list, disclosed on small screens and scroll-aware on desktop. */
export function FerraContents({ items, label = "Engines", className, ...props }) {
    const id = useId();
    const [expanded, setExpanded] = useState(false);
    const current = useCurrentSection(items);
    return (_jsxs("nav", { ...props, className: classes("ferra-contents", className), "aria-label": label, "data-expanded": expanded, onKeyDown: (event) => {
            props.onKeyDown?.(event);
            if (event.key === "Escape" && expanded) {
                setExpanded(false);
                event.currentTarget.querySelector("button")?.focus();
            }
        }, children: [_jsxs("button", { type: "button", className: "ferra-contents-toggle", "aria-expanded": expanded, "aria-controls": id, onClick: () => {
                    setExpanded(!expanded);
                }, children: [_jsxs("span", { children: ["Explore the ", label.toLowerCase()] }), _jsx(Mark, { name: "chev", size: 18 })] }), _jsx(ContentsEntries, { id: id, items: items, current: current, onChoose: () => {
                    setExpanded(false);
                } })] }));
}
function ContentsEntries({ id, items, current, onChoose, }) {
    return (_jsx("ul", { className: "ferra-contents-list", id: id, children: items.map((item) => (_jsx("li", { children: _jsxs("a", { href: item.href, "aria-current": current === item.href ? "location" : undefined, onClick: onChoose, children: [item.product !== undefined && _jsx(FerraMark, { product: item.product, size: 64 }), _jsxs("span", { className: "ferra-contents-copy", children: [_jsx("span", { className: "ferra-contents-name", children: item.label }), _jsx("span", { className: "ferra-contents-description", children: item.description })] })] }) }, item.href))) }));
}
