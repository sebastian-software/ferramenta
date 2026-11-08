import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from "react";
import { displayName, familyTiers, plannedRunsOnTools, relationsOf, runsOnTools, STATUS_MEANING, toolHref, WORKSHOP_REFERENCES, } from "./family.js";
import { hasIdentity } from "./identity.js";
import { MonoInfoIcon } from "./MonoParts.js";
import { useToolFacts } from "./RegistryFacts.js";
/* The family site's overview, on the Monografie page: every engine on its own
   plate, the applications on light cards under their own logos, and the
   workshop's two brands. Everything reads the registry; nothing is hardcoded. */
const number = new Intl.NumberFormat("en-US");
const KIND_LABEL = {
    "runs-on": "Runs on",
    "pairs-with": "Pairs with",
    carries: "Used by",
};
function joined(tools) {
    return tools.flatMap((tool, index) => [
        index === 0 ? "" : index === tools.length - 1 ? " and " : ", ",
        _jsx("a", { href: toolHref(tool), children: displayName(tool) }, tool.name),
    ]);
}
/** One sentence per kind of relation: "Used by Ferriki and Ardo." */
function Relations({ tool }) {
    const relations = relationsOf(tool);
    if (relations.length === 0)
        return null;
    const kinds = ["runs-on", "pairs-with", "carries"]
        .map((kind) => ({
        kind,
        tools: relations
            .filter((relation) => relation.kind === kind)
            .map((relation) => relation.tool),
    }))
        .filter((group) => group.tools.length > 0);
    return (_jsx("p", { className: "mono-engine-relations", children: kinds.map((group, index) => (_jsxs("span", { children: [index > 0 && " ", KIND_LABEL[group.kind], " ", joined(group.tools), "."] }, group.kind))) }));
}
function Facts({ tool }) {
    const facts = useToolFacts(tool);
    return (_jsxs("dl", { className: "mono-engine-facts", "aria-label": `${displayName(tool)} registry facts`, children: [_jsxs("div", { children: [_jsx("dt", { children: "Version" }), _jsx("dd", { children: facts.version })] }), facts.onCrates && (_jsxs("div", { children: [_jsx("dt", { children: "crates.io downloads" }), _jsx("dd", { children: number.format(facts.crateDownloads) })] }))] }));
}
/** The registry's background notes; folded behind a toggle on narrow screens. */
function EngineNotes({ name, notes }) {
    const [open, setOpen] = useState(false);
    const notesId = useId();
    return (_jsxs("div", { className: "mono-engine-more", "data-open": open ? "" : undefined, children: [_jsxs("button", { type: "button", className: "mono-note-toggle", "aria-expanded": open, "aria-controls": notesId, onClick: () => {
                    setOpen(!open);
                }, children: [_jsx(MonoInfoIcon, {}), "More about ", name] }), _jsx("dl", { className: "mono-engine-notes", id: notesId, "aria-label": `About ${name}`, children: notes.map((note) => (_jsxs("div", { children: [_jsx("dt", { children: note.title }), _jsxs("dd", { children: [note.body, " ", _jsx("a", { href: note.href, children: "Source" })] })] }, note.title))) })] }));
}
function Engine({ tool, hrefFor }) {
    if (!hasIdentity(tool.name))
        throw new Error(`Missing identity: ${tool.name}`);
    const name = displayName(tool);
    const href = hrefFor(tool);
    return (_jsxs("article", { className: "mono-engine", id: tool.name, "aria-labelledby": `${tool.name}-title`, children: [_jsx("a", { className: "mono-engine-plate", href: href, tabIndex: -1, "aria-hidden": "true", children: _jsx("span", { className: "ferra-instrument", "data-product": tool.name }) }), _jsxs("div", { className: "mono-engine-text", children: [_jsxs("h3", { id: `${tool.name}-title`, children: [_jsx("a", { href: href, children: name }), _jsx("span", { className: "mono-engine-status", title: STATUS_MEANING[tool.status], children: tool.status })] }), _jsx("p", { className: "mono-engine-subtitle", children: tool.editorial?.subtitle ?? tool.what }), _jsx("p", { children: tool.editorial?.introduction ?? tool.does }), _jsx(Relations, { tool: tool }), _jsx(Facts, { tool: tool }), _jsxs("a", { className: "mono-engine-link", href: href, children: ["Explore ", name, tool.docs === undefined && " on GitHub"] })] }), tool.editorial !== undefined && _jsx(EngineNotes, { name: name, notes: tool.editorial.notes })] }));
}
/** Every engine in the registry, in editorial order, each on its own plate. */
export function MonoEngineCatalog({ hrefFor = toolHref }) {
    const engines = [...familyTiers().engines].sort((a, b) => (a.editorial?.order ?? 99) - (b.editorial?.order ?? 99));
    return (_jsx("div", { className: "mono-engines", children: engines.map((tool) => (_jsx(Engine, { tool: tool, hrefFor: hrefFor }, tool.name))) }));
}
/** The applications, each on a light card under its own logo, in its own colors. */
export function MonoApplications() {
    return (_jsx("div", { className: "mono-applications", children: familyTiers().applications.map((tool) => {
            const engines = runsOnTools(tool);
            const planned = plannedRunsOnTools(tool);
            const name = displayName(tool);
            return (_jsxs("article", { className: "mono-application", children: [_jsx("span", { className: "mono-application-logo", "data-brand": tool.name, role: "img", "aria-label": name }), _jsx("h3", { children: name }), _jsxs("p", { children: [tool.what, ". ", tool.does] }), engines.length > 0 && (_jsxs("p", { className: "mono-application-runs", children: ["Runs on ", engines.map((engine) => displayName(engine)).join(", "), "."] })), planned.length > 0 && (_jsxs("p", { className: "mono-application-runs", children: ["Planned: ", planned.map((engine) => displayName(engine)).join(", "), "."] })), _jsxs("a", { href: toolHref(tool), children: ["Explore ", name] })] }, tool.name));
        }) }));
}
/** The workshop's two brands, unchanged, on a light ground. */
export function MonoWorkshop({ children }) {
    return (_jsxs("ul", { className: "mono-workshop", children: [WORKSHOP_REFERENCES.map((reference) => (_jsx("li", { children: _jsxs("a", { href: reference.href, children: [_jsx("span", { className: "ferra-workshop-logo", "data-brand": reference.id, role: "img", "aria-label": reference.name }), _jsx("span", { children: reference.description })] }) }, reference.id))), children] }));
}
