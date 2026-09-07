import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FAMILY_SITE, familyGroups } from "./family.js";
import { Mark } from "./Mark.js";
const DEFAULT_LEGAL = "This site is MIT-licensed; each tool states its own license in its repository.";
function ToolList({ tools, current }) {
    return (_jsx("ul", { children: tools.map((tool) => (_jsx("li", { children: _jsx("a", { href: tool.docs ?? tool.repo, "aria-current": tool.name === current ? "page" : undefined, children: tool.name }) }, tool.name))) }));
}
function CompanyList() {
    return (_jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "https://github.com/sebastian-software", children: "GitHub" }) }), _jsx("li", { children: _jsx("a", { href: "https://oss.sebastian-software.com", children: "Open Source" }) }), _jsx("li", { children: _jsx("a", { href: "https://sebastian-consulting.com", children: "Consulting" }) })] }));
}
/** Steel-plate footer: lockup, family columns from the registry, company links. */
export function SiteFooter({ as = "footer", current, legal = DEFAULT_LEGAL, line = "family", } = {}) {
    const { pipeline, language, workbench } = familyGroups();
    const Root = as;
    return (_jsx(Root, { className: "site-footer", children: _jsxs("div", { className: line === "company" ? "wrap foot foot-company" : "wrap foot", children: [_jsxs("div", { children: [_jsxs("a", { className: "lockup", href: current === undefined ? "/" : FAMILY_SITE, children: [_jsx(Mark, { name: "ferramenta", size: 22 }), "ferramenta"] }), _jsx("p", { children: "Rust-native developer tools by Sebastian Software. Open source, openly verified." })] }), line === "family" && (_jsxs("div", { children: [_jsx("h3", { children: "Pipeline" }), _jsx(ToolList, { tools: pipeline, current: current }), _jsx("h3", { className: "foot-gap", children: "Language" }), _jsx(ToolList, { tools: language, current: current })] })), _jsxs("div", { children: [line === "family" && (_jsxs(_Fragment, { children: [_jsx("h3", { children: "Workbench" }), _jsx(ToolList, { tools: workbench, current: current })] })), _jsx("h3", { className: line === "family" ? "foot-gap" : undefined, children: "Company" }), _jsx(CompanyList, {})] }), _jsx("p", { className: "foot-legal", children: legal })] }) }));
}
