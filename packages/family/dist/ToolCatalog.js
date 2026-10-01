import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { displayName, familyTiers, leadsToRepo, relationsOf, runsOnTools, toolHref, } from "./family.js";
import { Icon } from "./Icon.js";
import { Mark } from "./Mark.js";
import { Plate } from "./Plate.js";
import { useToolFacts } from "./RegistryFacts.js";
import { RepoNote } from "./RepoNote.js";
/*
 * The family's two tiers as a site shows them: the engines as a catalog of
 * name plates, the applications as a band in their own colors. Everything
 * comes from the registry, the release figures from `RegistryFacts`. Styled by
 * `landing.css`.
 */
/** Where a member's link leads, as the page names it: its host, or its repository. */
function linkLabel(tool) {
    return leadsToRepo(tool) ? "GitHub repository" : new URL(toolHref(tool)).host;
}
function RelationLine({ relation }) {
    const link = _jsx("a", { href: toolHref(relation.tool), children: displayName(relation.tool) });
    let text = _jsxs(_Fragment, { children: ["Pairs with ", link] });
    if (relation.kind === "runs-on")
        text = _jsxs(_Fragment, { children: ["Runs on ", link] });
    if (relation.kind === "carries")
        text = _jsxs(_Fragment, { children: [link, " runs on it"] });
    return (_jsxs("li", { children: [_jsx(Mark, { name: "adapter", size: 16 }), _jsx("span", { children: text })] }));
}
/**
 * Where a member fits with others, as lines in its catalog row (the exported
 * `Relations` shows the same facts as chips on a member's own page). Empty for
 * one that stands entirely alone.
 */
function EngineRelations({ tool }) {
    const relations = relationsOf(tool);
    if (relations.length === 0)
        return null;
    return (_jsx("ul", { className: "fam-engine-fits", children: relations.map((relation) => (_jsx(RelationLine, { relation: relation }, `${relation.kind}-${relation.tool.name}`))) }));
}
/** The measured facts, last and quiet: lineage, evidence, release, registries. */
function EngineFacts({ tool }) {
    const facts = useToolFacts(tool);
    const registries = [facts.onCrates ? "crates.io" : null, facts.adapter ? "npm" : null].filter((registry) => registry !== null);
    return (_jsxs("dl", { className: "fam-engine-facts", children: [tool.succeeds === undefined ? null : (_jsxs("div", { children: [_jsx("dt", { children: "Succeeds" }), _jsx("dd", { children: tool.succeeds })] })), tool.buildsOn === undefined ? null : (_jsxs("div", { children: [_jsx("dt", { children: "Built to" }), _jsx("dd", { children: tool.buildsOn })] })), _jsxs("div", { children: [_jsx("dt", { children: "Checked against" }), _jsx("dd", { children: tool.evidence })] }), _jsxs("div", { children: [_jsx("dt", { children: "Release" }), _jsxs("dd", { className: "fam-engine-version", children: ["v", facts.version] })] }), _jsxs("div", { children: [_jsx("dt", { children: "Published on" }), _jsx("dd", { children: registries.length === 0 ? "Git" : registries.join(" · ") })] })] }));
}
/**
 * One catalog row. The plate says what the engine is, and nothing else: no
 * maturity stamp, because the release beside it already says how far it has
 * come. The copy says what it does, for whom, and only then where it comes
 * from. The name is the link, stretched over the plate.
 */
function EngineRow({ tool }) {
    return (_jsx("li", { children: _jsxs("article", { className: "fam-engine", id: tool.name, children: [_jsxs(Plate, { className: "fam-engine-plate", children: [_jsx(Icon, { name: tool.name, form: "rendered" }), _jsxs("div", { children: [_jsx("h3", { className: "fam-engine-name", children: _jsxs("a", { className: "fam-engine-link", href: toolHref(tool), children: [tool.name, _jsx(RepoNote, { tool: tool })] }) }), _jsx("p", { className: "fam-engine-what", children: tool.what })] })] }), _jsxs("div", { className: "fam-engine-body", children: [_jsx("p", { className: "fam-engine-does", children: tool.does }), _jsx("p", { children: tool.audience }), _jsx("p", { children: tool.proof }), _jsx(EngineRelations, { tool: tool }), _jsx(EngineFacts, { tool: tool }), _jsx("p", { className: "fam-engine-go", children: _jsxs("a", { href: toolHref(tool), children: [linkLabel(tool), " ", _jsx(Mark, { name: "arrow", size: 18 })] }) })] })] }) }));
}
/**
 * The engine catalog: one row per engine, each with its name plate. Every
 * engine works on its own; where two fit together, the row says so.
 */
export function EngineCatalog({ current, tools } = {}) {
    const engines = tools ?? familyTiers(current).engines;
    return (_jsx("ul", { className: "fam-engines", children: engines.map((tool) => (_jsx(EngineRow, { tool: tool }, tool.name))) }));
}
/** An application's brand color as custom properties, for the one card that shows it. */
function brandStyle(tool) {
    if (tool.brand === undefined)
        return undefined;
    return { "--fam-app-color": tool.brand.color, "--fam-app-on-color": tool.brand.onColor };
}
/** The engines an application runs on: each icon on a steel tile, name and job on a dark inlay. */
function RunsOn({ engines }) {
    return (_jsxs(_Fragment, { children: [_jsx("p", { className: "fam-app-label", children: "Runs on" }), _jsx("ul", { className: "fam-app-runs", children: engines.map((engine) => (_jsxs("li", { children: [_jsx("span", { className: "fam-tile", children: _jsx(Icon, { name: engine.name, size: 28 }) }), _jsxs("span", { children: [_jsx("b", { children: engine.name }), engine.shortJob] })] }, engine.name))) })] }));
}
function ApplicationCard({ tool }) {
    const engines = runsOnTools(tool);
    return (_jsxs("article", { className: "fam-app", "data-lead": engines.length > 0 ? "" : undefined, style: brandStyle(tool), children: [_jsx("span", { className: "fam-app-logo", children: _jsx(Icon, { name: tool.name }) }), _jsxs("div", { children: [_jsx("h3", { className: "fam-app-name", children: displayName(tool) }), _jsx("p", { className: "fam-app-job", children: tool.job }), _jsx("p", { children: tool.does }), engines.length > 0 ? (_jsx(RunsOn, { engines: engines })) : (_jsx("p", { className: "fam-app-note", children: "From the same workshop. It stands on its own." })), _jsxs("a", { className: "fam-app-go", href: toolHref(tool), children: ["Visit ", linkLabel(tool), " ", _jsx(Mark, { name: "arrow", size: 18 })] })] })] }));
}
/**
 * The applications, each on a light card under its own logo and color: the
 * one place the family shows a brand that is not its own. An application that
 * runs on family engines leads and names them; one that stands alone is from
 * the same workshop, and says no more than that.
 */
export function ApplicationsBand({ current, id = "applications", intro, title = "Applications", } = {}) {
    const titleId = useId();
    const { applications } = familyTiers(current);
    if (applications.length === 0)
        return null;
    return (_jsx("section", { className: "fam-band fam-apps on-iron", id: id, "aria-labelledby": titleId, children: _jsxs("div", { className: "wrap", children: [_jsx("h2", { className: "fam-heading", id: titleId, children: title }), intro !== undefined && _jsx("p", { className: "fam-intro", children: intro }), _jsx("div", { className: "fam-apps-grid", children: applications.map((tool) => (_jsx(ApplicationCard, { tool: tool }, tool.name))) })] }) }));
}
