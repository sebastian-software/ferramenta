import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FAMILY_SITE, family } from "./family.js";
/**
 * Cross-links to every family member plus the family site.
 * Drop into an Ardo footer or header; styled via theme.css.
 */
export function FamilyLinks({ current, label = "Ferramenta family", className }) {
    return (_jsxs("nav", { className: className ? `ferramenta-family ${className}` : "ferramenta-family", children: [_jsx("a", { href: FAMILY_SITE, children: label }), _jsx("span", { className: "ferramenta-family-label", children: "\u00B7" }), family.map((tool) => (_jsx("a", { href: tool.docs ?? tool.repo, "aria-current": tool.name === current ? "true" : undefined, children: tool.name }, tool.name)))] }));
}
