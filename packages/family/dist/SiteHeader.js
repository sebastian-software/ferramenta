import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { FAMILY_SITE, familyGroups } from "./family.js";
import { Mark } from "./Mark.js";
/** A `<details>` flyout is not modal: it closes on an outside click and on Escape. */
function useDismissible(ref) {
    useEffect(() => {
        function closeOnOutsideClick(event) {
            const switcher = ref.current;
            const target = event.target;
            if (switcher?.open && target instanceof Node && !switcher.contains(target)) {
                switcher.removeAttribute("open");
            }
        }
        function closeOnEscape(event) {
            const switcher = ref.current;
            if (event.key === "Escape" && switcher?.open) {
                switcher.removeAttribute("open");
                switcher.querySelector("summary")?.focus();
            }
        }
        document.addEventListener("click", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("click", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [ref]);
}
/** The family-wide tool switcher, grouped the way the family site groups it. */
function ToolSwitcher({ current }) {
    const switcherRef = useRef(null);
    const { pipeline, language, workbench } = familyGroups();
    const flyoutGroups = [
        { label: "Pipeline", tools: pipeline },
        { label: "Language", tools: language },
        { label: "Workbench", tools: workbench },
    ];
    useDismissible(switcherRef);
    return (_jsxs("details", { className: "switcher", ref: switcherRef, children: [_jsxs("summary", { "aria-label": "All tools", children: ["Tools ", _jsx(Mark, { name: "chev", className: "chev icon", size: 16 })] }), _jsx("div", { className: "flyout", children: flyoutGroups.map((group) => (_jsxs("div", { className: "flygroup", children: [_jsx("small", { children: group.label }), group.tools.map((tool) => (_jsxs("a", { href: tool.docs ?? tool.repo, "aria-current": tool.name === current ? "page" : undefined, children: [_jsx("span", { className: "markplate", children: _jsx(Mark, { name: tool.name, size: 24 }) }), _jsxs("span", { children: [_jsx("b", { children: tool.name }), _jsx("small", { children: tool.shortJob })] })] }, tool.name)))] }, group.label))) })] }));
}
/** Iron header bar: lockup, family-wide tool switcher, GitHub, theme toggle. */
export function SiteHeader({ current, themeToggle } = {}) {
    return (_jsx("header", { className: "site-header", children: _jsxs("div", { className: "wrap bar", children: [_jsxs("a", { className: "lockup", href: current === undefined ? "/" : FAMILY_SITE, children: [_jsx(Mark, { name: "ferramenta", size: 26 }), _jsx("span", { children: "ferramenta" })] }), _jsxs("nav", { className: "site", "aria-label": "Site", children: [_jsx(ToolSwitcher, { current: current }), _jsx("a", { className: "ghlink", href: "https://github.com/sebastian-software", "aria-label": "GitHub", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("use", { href: "#i-github" }) }) }), themeToggle] })] }) }));
}
