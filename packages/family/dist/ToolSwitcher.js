import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { familyGroups } from "./family.js";
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
/**
 * The family-wide tool switcher, grouped the way the family site groups it.
 *
 * `SiteHeader` renders it, and it also stands on its own: a docs site whose
 * framework owns the header — an Ardo site placing it into
 * `<ArdoHeaderActions>` — renders `<ToolSwitcher current="ferroni" />` there
 * and gets the same flyout. Standing alone it needs only `MarkDefs` on the
 * page and the package's `tokens.css` plus `chrome.css`; it carries its own
 * duotone variables, and the flyout is positioned against the trigger, so the
 * host header's height does not matter.
 */
export function ToolSwitcher({ align = "end", className, current, label } = {}) {
    const switcherRef = useRef(null);
    const { pipeline, language, workbench } = familyGroups(current);
    const flyoutGroups = [
        { label: "Pipeline", tools: pipeline },
        { label: "Language", tools: language },
        { label: "Workbench", tools: workbench },
    ];
    useDismissible(switcherRef);
    const classes = ["switcher"];
    if (align === "start")
        classes.push("switcher-start");
    if (className !== undefined)
        classes.push(className);
    return (_jsxs("details", { className: classes.join(" "), ref: switcherRef, children: [_jsxs("summary", { "aria-label": "All tools", children: [label ?? "Tools", " ", _jsx(Mark, { name: "chev", className: "chev icon", size: 16 })] }), _jsxs("div", { className: "flyout", children: [current !== undefined && _jsxs("p", { className: "switcher-current", children: ["Current: ", current] }), flyoutGroups
                        .filter((group) => group.tools.length > 0)
                        .map((group) => (_jsxs("div", { className: "flygroup", children: [_jsx("small", { children: group.label }), group.tools.map((tool) => (_jsxs("a", { href: tool.docs ?? tool.repo, children: [_jsx("span", { className: "markplate", children: _jsx(Mark, { name: tool.name, size: 24 }) }), _jsxs("span", { children: [_jsx("b", { children: tool.name }), _jsx("small", { children: tool.shortJob })] })] }, tool.name)))] }, group.label)))] })] }));
}
