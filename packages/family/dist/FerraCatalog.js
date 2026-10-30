import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { displayName, familyTiers, plannedRunsOnTools, relationsOf, runsOnTools, toolHref, } from "./family.js";
import { FerraMark } from "./FerraComponents.js";
import { FerraSoftCard } from "./FerraEditorial.js";
import { isFerraProduct } from "./FerraIdentity.js";
import { useToolFacts } from "./RegistryFacts.js";
function EngineFacts({ tool }) {
    const facts = useToolFacts(tool);
    const registries = [facts.onCrates ? "crates.io" : null, facts.adapter ? "npm" : null].filter((registry) => registry !== null);
    return (_jsxs("dl", { className: "ferra-engine-facts", children: [_jsxs("div", { children: [_jsx("dt", { children: tool.succeeds !== undefined ? "Succeeds" : "Built to" }), _jsx("dd", { children: tool.succeeds ?? tool.buildsOn })] }), _jsxs("div", { children: [_jsx("dt", { children: "Checked against" }), _jsx("dd", { children: tool.evidence })] }), _jsxs("div", { children: [_jsx("dt", { children: "Release" }), _jsxs("dd", { children: ["v", facts.version] })] }), _jsxs("div", { children: [_jsx("dt", { children: "Published on" }), _jsx("dd", { children: registries.length === 0 ? "Git" : registries.join(" · ") })] })] }));
}
/** Independent engines, with registry-owned facts and live releases when provided. */
export function FerraEngineCatalog({ hrefFor = toolHref }) {
    return (_jsx("div", { className: "ferra-engine-grid", children: familyTiers().engines.map((tool) => {
            if (!isFerraProduct(tool.name))
                throw new Error(`Missing ferra identity: ${tool.name}`);
            const name = displayName(tool);
            return (_jsxs("article", { className: "ferra-engine", id: tool.name, children: [_jsxs("div", { className: "ferra-engine-heading", children: [_jsx(FerraMark, { product: tool.name, size: 64 }), _jsxs("div", { children: [_jsx("h3", { children: name }), _jsx("p", { className: "ferra-engine-role", children: tool.what })] })] }), _jsx("p", { children: tool.does }), _jsx("p", { className: "ferra-engine-audience", children: tool.audience }), _jsx("p", { children: tool.proof }), _jsx("ul", { className: "ferra-engine-relations", children: relationsOf(tool).map((relation) => (_jsxs("li", { children: [relation.kind === "pairs-with"
                                    ? "Pairs with "
                                    : relation.kind === "runs-on"
                                        ? "Runs on "
                                        : "Used by ", _jsx("a", { href: toolHref(relation.tool), children: displayName(relation.tool) }), "."] }, `${relation.kind}-${relation.tool.name}`))) }), _jsx(EngineFacts, { tool: tool }), _jsxs("a", { href: hrefFor(tool), children: ["Explore ", name, tool.docs === undefined && _jsx("span", { className: "ferra-repo-hint", children: " on GitHub" })] })] }, tool.name));
        }) }));
}
/** Applications keep their original logos on a flat light reading surface. */
export function FerraApplications() {
    return (_jsx("div", { className: "ferra-applications", children: familyTiers().applications.map((tool) => {
            const engines = runsOnTools(tool);
            const planned = plannedRunsOnTools(tool);
            return (_jsxs(FerraSoftCard, { as: "article", className: "ferra-application", children: [_jsx("span", { className: "ferra-application-logo", "data-brand": tool.name, role: "img", "aria-label": displayName(tool) }), _jsx("h3", { children: displayName(tool) }), _jsxs("p", { children: [tool.what, ". ", tool.does] }), _jsx("p", { children: tool.audience }), engines.length > 0 && (_jsxs("p", { children: ["Runs on ", engines.map((engine) => displayName(engine)).join(", "), "."] })), planned.length > 0 && (_jsxs("p", { children: ["Planned engine integration:", " ", planned.map((engine) => displayName(engine)).join(", "), "."] })), _jsxs("a", { href: toolHref(tool), children: ["Explore ", displayName(tool)] })] }, tool.name));
        }) }));
}
