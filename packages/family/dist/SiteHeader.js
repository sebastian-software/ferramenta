import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { family, FAMILY_SITE, WORKSHOP } from "./family.js";
import { Icon } from "./Icon.js";
import { ToolSwitcher } from "./ToolSwitcher.js";
function githubLink(current) {
    const currentTool = family.find((tool) => tool.name === current);
    return {
        href: currentTool?.repo ?? WORKSHOP.source,
        label: currentTool === undefined ? "GitHub" : `${currentTool.name} on GitHub`,
    };
}
/** The dark header bar: lockup, family-wide tool switcher, GitHub, the site's own slots. */
export function SiteHeader({ actions, as = "header", current, home = "/", lockup = "family", nav, switcher = true, themeToggle, } = {}) {
    const Root = as;
    const project = lockup === "project";
    const github = githubLink(current);
    // One construction for both lockups: the small icon on a steel tile, then the wordmark.
    let name = "ferramenta";
    let href = current === undefined ? "/" : FAMILY_SITE;
    if (project) {
        if (current === undefined) {
            throw new Error('SiteHeader: lockup="project" needs `current`, the project it names');
        }
        name = current;
        href = home;
    }
    return (_jsx(Root, { className: "site-header", children: _jsxs("div", { className: "wrap bar", children: [_jsxs("a", { className: "lockup", href: href, children: [_jsx(Icon, { name: name, size: 48 }), _jsx("span", { children: name })] }), nav, _jsxs("nav", { className: "site-nav", "aria-label": "Site", children: [switcher && _jsx(ToolSwitcher, { current: current, family: project }), _jsx("a", { className: "ghlink", href: github.href, "aria-label": github.label, children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("use", { href: "#i-github" }) }) }), actions, themeToggle] })] }) }));
}
