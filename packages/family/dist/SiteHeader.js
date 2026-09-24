import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FAMILY_SITE } from "./family.js";
import { Mark } from "./Mark.js";
import { ToolSwitcher } from "./ToolSwitcher.js";
/** Iron header bar: lockup, family-wide tool switcher, GitHub, theme toggle. */
export function SiteHeader({ actions, as = "header", current, home = "/", lockup = "family", nav, themeToggle, } = {}) {
    const Root = as;
    const project = lockup === "project";
    // One construction for both lockups (PRODUCT.md): mark plus lowercase wordmark.
    let name = "ferramenta";
    let href = current === undefined ? "/" : FAMILY_SITE;
    if (project) {
        if (current === undefined) {
            throw new Error('SiteHeader: lockup="project" needs `current`, the project it names');
        }
        name = current;
        href = home;
    }
    return (_jsx(Root, { className: "site-header", children: _jsxs("div", { className: "wrap bar", children: [_jsxs("a", { className: "lockup", href: href, children: [_jsx(Mark, { name: name, size: 26 }), _jsx("span", { children: name })] }), nav, _jsxs("nav", { className: "site", "aria-label": "Site", children: [_jsx(ToolSwitcher, { current: current, family: project }), _jsx("a", { className: "ghlink", href: "https://github.com/sebastian-software", "aria-label": "GitHub", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("use", { href: "#i-github" }) }) }), actions, themeToggle] })] }) }));
}
