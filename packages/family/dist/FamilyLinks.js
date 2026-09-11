import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FAMILY_SITE, relatedTools } from "./family.js";
import { Mark } from "./Mark.js";
/** Compact family navigation. Mount MarkDefs once in the host page. */
export function FamilyLinks({ current, label = "More from Ferramenta", className, }) {
    return (_jsxs("nav", { "aria-label": label, className: ["ferramenta-family", className].filter(Boolean).join(" "), children: [_jsxs("a", { className: "ferramenta-family-heading", href: FAMILY_SITE, children: [_jsx(Mark, { name: "ferramenta", size: 24 }), " ", label] }), _jsx("p", { children: "A family of Rust tools." }), _jsx("ul", { children: relatedTools(current).map((tool) => (_jsxs("li", { children: [_jsx("a", { href: tool.docs ?? tool.repo, children: tool.name }), _jsxs("span", { children: [" \u2014 ", tool.job] })] }, tool.name))) })] }));
}
