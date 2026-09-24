import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FAMILY_SITE, familyGroups, toolHref } from "./family.js";
import { Mark } from "./Mark.js";
import { RepoNote } from "./RepoNote.js";
const DEFAULT_LEGAL = "This site is MIT-licensed; each tool states its own license in its repository.";
function ToolList({ jobs, tools }) {
    return (_jsx("ul", { children: tools.map((tool) => (_jsxs("li", { children: [_jsxs("a", { href: toolHref(tool), children: [tool.name, _jsx(RepoNote, { tool: tool })] }), _jsx("span", { className: "family-job", children: jobs === "short" ? tool.shortJob : tool.job })] }, tool.name))) }));
}
function CompanyList() {
    return (_jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "https://github.com/sebastian-software", children: "GitHub" }) }), _jsx("li", { children: _jsx("a", { href: "https://oss.sebastian-software.com", children: "Open Source" }) }), _jsx("li", { children: _jsx("a", { href: "https://sebastian-consulting.com", children: "Consulting" }) })] }));
}
/**
 * The footer's lockup. On the family site itself it is the family's name; on
 * a member's site it is the invitation back to the family.
 */
function FooterLockup({ current }) {
    const home = current === undefined;
    return (_jsxs("div", { children: [_jsxs("a", { className: "lockup", href: home ? "/" : FAMILY_SITE, children: [_jsx(Mark, { name: "ferramenta", size: 22 }), home ? "ferramenta" : "More from Ferramenta"] }), _jsx("p", { children: "A family of Rust tools by Sebastian Software." })] }));
}
function footerGroups(line, current) {
    return familyGroups(line === "family" ? current : undefined);
}
/** Steel-plate footer: lockup, family columns from the registry, company links. */
export function SiteFooter({ as = "footer", current, jobs = "full", legal = DEFAULT_LEGAL, line = "family", } = {}) {
    const { pipeline, language, workbench } = footerGroups(line, current);
    const Root = as;
    return (_jsx(Root, { className: "site-footer", children: _jsxs("div", { className: line === "company" ? "wrap foot foot-company" : "wrap foot", children: [_jsx(FooterLockup, { current: current }), line === "family" && (_jsxs("div", { children: [_jsx("h3", { children: "Pipeline" }), _jsx(ToolList, { jobs: jobs, tools: pipeline }), _jsx("h3", { className: "foot-gap", children: "Language" }), _jsx(ToolList, { jobs: jobs, tools: language })] })), _jsxs("div", { children: [line === "family" && (_jsxs(_Fragment, { children: [_jsx("h3", { children: "Workbench" }), _jsx(ToolList, { jobs: jobs, tools: workbench })] })), _jsx("h3", { className: line === "family" ? "foot-gap" : undefined, children: "Company" }), _jsx(CompanyList, {})] }), _jsx("p", { className: "foot-legal", children: legal })] }) }));
}
