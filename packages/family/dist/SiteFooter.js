import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FAMILY_SITE, familyTiers, toolHref, WORKSHOP } from "./family.js";
import { Icon } from "./Icon.js";
import { RepoNote } from "./RepoNote.js";
const DEFAULT_LEGAL = "This site is MIT-licensed; each tool states its own license in its repository.";
function ToolList({ jobs, tools }) {
    return (_jsx("ul", { children: tools.map((tool) => (_jsxs("li", { children: [_jsxs("a", { href: toolHref(tool), children: [tool.name, _jsx(RepoNote, { tool: tool })] }), _jsx("span", { className: "family-job", children: jobs === "short" ? tool.shortJob : tool.job })] }, tool.name))) }));
}
/**
 * The workshop's own links. Consulting comes first: most visitors meet the
 * family on a tool's site, and this is where the people who build the engines
 * can be hired (ADR-0008).
 */
function WorkshopList() {
    return (_jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: WORKSHOP.consulting, children: "Consulting" }), _jsx("span", { className: "family-job", children: "Integration, support, long-term maintenance" })] }), _jsx("li", { children: _jsx("a", { href: WORKSHOP.openSource, children: "Open Source" }) }), _jsx("li", { children: _jsx("a", { href: WORKSHOP.source, children: "GitHub" }) })] }));
}
/**
 * The footer's lockup. On the family site itself it is the family's name; on
 * a member's site it is the invitation back to the family.
 */
function FooterLockup({ current }) {
    const home = current === undefined;
    return (_jsxs("div", { children: [_jsxs("a", { className: "lockup", href: home ? "/" : FAMILY_SITE, children: [_jsx("span", { className: "fam-tile", children: _jsx(Icon, { name: "ferramenta", size: 26 }) }), home ? "ferramenta" : "More from Ferramenta"] }), _jsxs("p", { children: ["Rust-native engines by ", WORKSHOP.name, ", built to the standards their fields agreed on."] })] }));
}
/**
 * The footer's columns: the engines, then the applications and the workshop
 * (unless the page is the family's own index, or the site is on the company
 * line). Headings are h2: the footer is its own landmark, outside the page's
 * outline.
 */
function FooterColumns({ current, line, members, }) {
    if (line === "company" || members === "none") {
        return (_jsxs("div", { children: [_jsx("h2", { children: "Work with us" }), _jsx(WorkshopList, {})] }));
    }
    const { applications, engines } = familyTiers(current);
    const jobs = members;
    return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h2", { children: "Engines" }), _jsx(ToolList, { jobs: jobs, tools: engines })] }), _jsxs("div", { children: [applications.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { children: "Applications" }), _jsx(ToolList, { jobs: jobs, tools: applications })] })), _jsx("h2", { className: applications.length > 0 ? "foot-gap" : undefined, children: "Work with us" }), _jsx(WorkshopList, {})] })] }));
}
/** Black-steel footer: lockup, the two tiers from the registry, the workshop's links. */
export function SiteFooter({ as = "footer", current, legal = DEFAULT_LEGAL, line = "family", members = "full", } = {}) {
    const Root = as;
    const columns = line === "family" && members !== "none";
    return (_jsx(Root, { className: "site-footer", children: _jsxs("div", { className: columns ? "wrap foot" : "wrap foot foot-company", children: [_jsx(FooterLockup, { current: current }), _jsx(FooterColumns, { current: current, line: line, members: members }), _jsx("p", { className: "foot-legal", children: legal })] }) }));
}
