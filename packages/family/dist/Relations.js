import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { family, relationsOf, toolHref } from "./family.js";
import { Icon } from "./Icon.js";
/** The heading of each kind of relation, in the order a page shows them. */
const KINDS = [
    { kind: "runs-on", label: "Runs on" },
    { kind: "pairs-with", label: "Pairs with" },
    { kind: "carries", label: "Carries" },
];
function Chip({ tool }) {
    return (_jsx("li", { children: _jsxs("a", { className: "fam-chip", href: toolHref(tool), children: [_jsx("span", { className: "fam-tile", children: _jsx(Icon, { name: tool.name, size: 28 }) }), _jsxs("span", { children: [_jsx("b", { children: tool.name }), tool.shortJob] })] }) }));
}
/**
 * Where a member fits with the rest of the family, from the registry: what it
 * runs on, what it pairs with, what it carries. Each related member is a link
 * to its own site. Members are independent, so this names where two fit
 * together and never draws a chain; a member that stands alone renders nothing.
 */
export function Relations({ current }) {
    const tool = family.find((candidate) => candidate.name === current);
    const relations = tool === undefined ? [] : relationsOf(tool);
    if (relations.length === 0)
        return null;
    const groups = KINDS.map(({ kind, label }) => ({
        label,
        tools: relations.filter((relation) => relation.kind === kind).map((relation) => relation.tool),
    })).filter((group) => group.tools.length > 0);
    return (_jsx("dl", { className: "fam-relations", children: groups.map((group) => (_jsxs("div", { children: [_jsx("dt", { children: group.label }), _jsx("dd", { children: _jsx("ul", { className: "fam-chips", children: group.tools.map((related) => (_jsx(Chip, { tool: related }, related.name))) }) })] }, group.label))) }));
}
