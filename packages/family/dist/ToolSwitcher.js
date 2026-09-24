import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { FAMILY_SITE, familyGroups, toolHref } from "./family.js";
import { Mark } from "./Mark.js";
import { RepoNote } from "./RepoNote.js";
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
function switcherClasses({ align, className, family }) {
    const classes = ["switcher"];
    if (align === "start")
        classes.push("switcher-start");
    if (family === true)
        classes.push("switcher-family");
    if (className !== undefined)
        classes.push(className);
    return classes.join(" ");
}
/** The trigger's default content: "Tools", or the family's mark and name. */
function defaultTrigger(family) {
    if (!family)
        return "Tools";
    return (_jsxs(_Fragment, { children: [_jsx(Mark, { name: "ferramenta", size: 18 }), _jsx("span", { children: "Ferramenta" })] }));
}
/** The family site's own entry, on top of the flyout: the link a project lockup gave up. */
function FamilyHome() {
    return (_jsxs("a", { className: "flyhome", href: FAMILY_SITE, children: [_jsx("span", { className: "markplate", children: _jsx(Mark, { name: "ferramenta", size: 24 }) }), _jsxs("span", { children: [_jsx("b", { children: "ferramenta" }), _jsx("small", { children: "the family site" })] })] }));
}
/** The registry's display groups, minus the current project; empty groups drop out. */
function FlyoutGroups({ current }) {
    const { pipeline, language, workbench } = familyGroups(current);
    const groups = [
        { label: "Pipeline", tools: pipeline },
        { label: "Language", tools: language },
        { label: "Workbench", tools: workbench },
    ];
    return groups
        .filter((group) => group.tools.length > 0)
        .map((group) => (_jsxs("div", { className: "flygroup", children: [_jsx("small", { children: group.label }), group.tools.map((tool) => (_jsxs("a", { href: toolHref(tool), children: [_jsx("span", { className: "markplate", children: _jsx(Mark, { name: tool.name, size: 24 }) }), _jsxs("span", { children: [_jsxs("b", { children: [tool.name, _jsx(RepoNote, { tool: tool })] }), _jsx("small", { children: tool.shortJob })] })] }, tool.name)))] }, group.label)));
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
export function ToolSwitcher(props = {}) {
    const { current, family = false, label } = props;
    const switcherRef = useRef(null);
    useDismissible(switcherRef);
    return (_jsxs("details", { className: switcherClasses(props), ref: switcherRef, children: [_jsxs("summary", { "aria-label": family ? "Ferramenta: all tools" : "All tools", children: [label ?? defaultTrigger(family), " ", _jsx(Mark, { name: "chev", className: "chev icon", size: 16 })] }), _jsxs("div", { className: "flyout", children: [family && _jsx(FamilyHome, {}), current !== undefined && _jsxs("p", { className: "switcher-current", children: ["Current: ", current] }), _jsx(FlyoutGroups, { current: current })] })] }));
}
