import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FAMILY_SITE, relatedTools, toolHref } from "./family.js";
import { Mark } from "./Mark.js";
import { RepoNote } from "./RepoNote.js";
/** Compact family navigation. Mount MarkDefs once in the host page. */
export function FamilyLinks({ current, label = "More from Ferramenta", className, }) {
    return (_jsxs("nav", { "aria-label": label, className: ["ferramenta-family", className].filter(Boolean).join(" "), children: [_jsxs("a", { className: "ferramenta-family-heading", href: FAMILY_SITE, children: [_jsx(Mark, { name: "ferramenta", size: 24 }), " ", label] }), _jsx("p", { children: "A family of Rust tools." }), _jsx("ul", { children: relatedTools(current).map((tool) => (_jsxs("li", { children: [_jsxs("a", { href: toolHref(tool), children: [tool.name, _jsx(RepoNote, { tool: tool })] }), _jsxs("span", { children: [" \u2014 ", tool.job] })] }, tool.name))) })] }));
}
