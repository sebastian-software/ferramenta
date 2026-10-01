import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { FAMILY_SITE, familyTiers, toolHref, whatLabel } from "./family.js";
import { Icon } from "./Icon.js";
import { Mark } from "./Mark.js";
import { RepoNote } from "./RepoNote.js";
import { useDismissible } from "./useDismissible.js";
function switcherClasses({ align, family }) {
    const classes = ["switcher"];
    if (align === "start")
        classes.push("switcher-start");
    if (family === true)
        classes.push("switcher-family");
    return classes.join(" ");
}
/** The trigger's content: "Tools", or the family's icon and name. */
function trigger(family) {
    if (!family)
        return "Tools";
    return (_jsxs(_Fragment, { children: [_jsx(Icon, { name: "ferramenta", size: 32 }), _jsx("span", { children: "Ferramenta" })] }));
}
/** The family site's own entry, on top of the flyout: the link a project lockup gave up. */
function FamilyHome() {
    return (_jsxs("a", { className: "flyhome", href: FAMILY_SITE, children: [_jsx(Icon, { name: "ferramenta", size: 36 }), _jsxs("span", { children: [_jsx("b", { children: "ferramenta" }), _jsx("small", { children: "the family site" })] })] }));
}
/**
 * One tier of the flyout. The applications' group stands on a light ground:
 * their logos are foreign brands, drawn for one, and on the dark iron they
 * either vanish or fight it.
 */
function FlyoutGroup({ label, tier, tools, }) {
    if (tools.length === 0)
        return null;
    return (_jsxs("div", { className: "flygroup", "data-tier": tier, children: [_jsx("small", { children: label }), tools.map((tool) => (_jsxs("a", { href: toolHref(tool), children: [_jsx(Icon, { name: tool.name, size: 36 }), _jsxs("span", { children: [_jsxs("b", { children: [tool.name, _jsx(RepoNote, { tool: tool })] }), _jsx("small", { children: whatLabel(tool) })] })] }, tool.name)))] }));
}
/**
 * The family-wide tool switcher: the engines, then the applications the
 * workshop also makes, each tier under its own label.
 *
 * `SiteHeader` renders it. A page that fills the header's slots itself can
 * place it too, as the kit's sample header does; it then needs `MarkDefs` on
 * the page. The flyout carries its own colors and hangs from the trigger, so
 * where the trigger sits does not matter.
 */
export function ToolSwitcher(props = {}) {
    const { current, family = false } = props;
    const switcherRef = useRef(null);
    useDismissible(switcherRef);
    const { applications, engines } = familyTiers(current);
    return (_jsxs("details", { className: switcherClasses(props), ref: switcherRef, children: [_jsxs("summary", { "aria-label": family ? "Ferramenta: all tools" : "All tools", children: [trigger(family), " ", _jsx(Mark, { name: "chev", className: "chev icon", size: 16 })] }), _jsxs("div", { className: "flyout", children: [family && _jsx(FamilyHome, {}), current !== undefined && _jsxs("p", { className: "switcher-current", children: ["Current: ", current] }), _jsx(FlyoutGroup, { label: "Engines", tier: "engines", tools: engines }), _jsx(FlyoutGroup, { label: "Applications", tier: "applications", tools: applications })] })] }));
}
