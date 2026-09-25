import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { byJob, displayName, family, familyGroups, isEngine, leadsToRepo, runsOnTools, toolHref, } from "./family.js";
import { Fasteners } from "./Fasteners.js";
import { Stamp } from "./Ledger.js";
import { Mark } from "./Mark.js";
import { Count, useToolFacts } from "./RegistryFacts.js";
import { RepoNote } from "./RepoNote.js";
/*
 * The family's members as a site shows them: hung on the pegboard, set in the
 * tool ledger, looked up in the job index. Everything comes from the registry,
 * and the release figures from `RegistryFacts`. Styled by `landing.css`.
 */
const GROUPS = [
    { key: "pipeline", label: "Pipeline" },
    { key: "language", label: "Language" },
    { key: "workbench", label: "Workbench" },
];
function boardGroups(current) {
    const groups = familyGroups(current);
    return GROUPS.map((group) => ({ ...group, tools: groups[group.key] })).filter((group) => group.tools.length > 0);
}
function BoardItem({ tool }) {
    return (_jsxs("a", { className: "fam-board-item", href: toolHref(tool), children: [_jsx("svg", { className: "hook", "aria-hidden": "true", children: _jsx("use", { href: "#i-hook" }) }), _jsx("span", { className: "markplate", children: _jsx(Mark, { name: tool.mark ?? tool.name }) }), _jsx("span", { className: "fam-board-stamp", children: _jsx(Stamp, { solid: tool.status === "stable", children: tool.status }) }), _jsxs("span", { className: "fam-board-copy", children: [_jsxs("b", { children: [tool.name, leadsToRepo(tool) ? (_jsx(Mark, { name: "github", className: "icon fam-board-repo", size: 11 })) : null, _jsx(RepoNote, { tool: tool })] }), _jsx("small", { children: tool.shortJob })] })] }));
}
function BoardGroup({ label, tools }) {
    const labelId = useId();
    return (_jsxs("div", { className: "fam-board-group", role: "group", "aria-labelledby": labelId, children: [_jsx("small", { className: "fam-board-label", id: labelId, children: label }), _jsx("div", { className: "fam-board-row", children: tools.map((tool) => (_jsx(BoardItem, { tool: tool }, tool.name))) })] }));
}
/**
 * The pegboard: every member on a hook, grouped the way the family is, each
 * plate stamped with its maturity so none outranks another. Its geometry is
 * the 28px wall grid (see DESIGN.md); it fits the hero's `aside`.
 */
export function Pegboard({ current, label = "The tool family" } = {}) {
    return (_jsxs("nav", { className: "fam-board", "aria-label": label, children: [_jsx(Fasteners, {}), _jsx("div", { className: "fam-board-grid", children: boardGroups(current).map((group) => (_jsx(BoardGroup, { label: group.label, tools: group.tools }, group.key))) })] }));
}
/**
 * The facts under a row's proof, as a definition list a screen reader can
 * pace. A successor names what it succeeds, a new development the standards it
 * builds on, an application the engines it runs on; each names its evidence,
 * qualitatively, never with a figure.
 */
function ToolFactsList({ tool }) {
    const facts = useToolFacts(tool);
    const runsOn = runsOnTools(tool);
    return (_jsxs("dl", { className: "fam-tool-facts", children: [tool.succeeds === undefined ? null : (_jsxs("div", { children: [_jsx("dt", { children: "Succeeds" }), _jsx("dd", { children: tool.succeeds })] })), tool.buildsOn === undefined ? null : (_jsxs("div", { children: [_jsx("dt", { children: "Builds on" }), _jsx("dd", { children: tool.buildsOn })] })), runsOn.length === 0 ? null : (_jsxs("div", { children: [_jsx("dt", { children: "Runs on" }), _jsx("dd", { children: runsOn.map((member) => displayName(member)).join(" · ") })] })), _jsxs("div", { children: [_jsx("dt", { children: "Evidence" }), _jsx("dd", { children: tool.evidence })] }), facts.onCrates ? (_jsxs("div", { children: [_jsx("dt", { children: "Downloads" }), _jsxs("dd", { children: [_jsx(Count, { value: facts.crateDownloads }), " on crates.io"] })] })) : null] }));
}
function ToolMeta({ tool }) {
    const facts = useToolFacts(tool);
    return (_jsxs("div", { className: "fam-tool-meta", children: [_jsxs("b", { className: "fam-tool-version", children: ["v", facts.version] }), _jsxs("span", { className: "fam-tool-platforms", children: [facts.onCrates ? (_jsxs("span", { className: "fam-tool-platform", children: [_jsx(Mark, { name: "crate", className: "icon", size: 15 }), "crates.io"] })) : null, facts.adapter ? (_jsxs("span", { className: "fam-tool-platform", children: [_jsx(Mark, { name: "adapter", className: "icon", size: 15 }), "npm"] })) : null, isEngine(tool) && !facts.onCrates && !facts.adapter ? (_jsx("span", { className: "fam-tool-platform", children: "install from Git" })) : null] }), _jsx(Stamp, { solid: tool.status === "stable", children: tool.status })] }));
}
/**
 * One ledger row. The name is the link, stretched over the whole row, so the
 * target stays the row while a screen reader hears the name, not every fact
 * at once. A row that leads to a repository rather than a site says so.
 */
function ToolRow({ step, tool }) {
    return (_jsxs("article", { className: "fam-tool", children: [step === undefined ? null : (_jsx("span", { className: "fam-tool-num", "aria-hidden": "true", children: String(step).padStart(2, "0") })), _jsx("span", { className: "markplate fam-tool-plate", "aria-hidden": "true", children: _jsx(Mark, { name: tool.mark ?? tool.name }) }), _jsxs("div", { className: "fam-tool-who", children: [_jsx("h3", { className: "fam-tool-name", children: _jsxs("a", { className: "fam-tool-link", href: toolHref(tool), children: [tool.name, _jsx(RepoNote, { tool: tool })] }) }), _jsx("p", { className: "fam-tool-job", children: tool.job })] }), _jsxs("div", { className: "fam-tool-proof", children: [_jsx("p", { className: "fam-tool-story", children: tool.proof }), _jsx(ToolFactsList, { tool: tool })] }), _jsx(ToolMeta, { tool: tool }), _jsx(Mark, { name: leadsToRepo(tool) ? "github" : "arrow", className: "fam-tool-go icon", size: 22 })] }));
}
/** The registry ledger: one hairline row per member, with proof, facts and release. */
export function ToolLedger({ steps = false, tools }) {
    return (_jsx("div", { className: "fam-tools", "data-steps": steps ? "" : undefined, children: tools.map((tool, index) => (_jsx(ToolRow, { tool: tool, step: steps ? index + 1 : undefined }, tool.name))) }));
}
/**
 * The job index, like the aisle directory by a hardware store's door: every
 * job A to Z, and the tool that does it. Each member works on its own, so the
 * index recommends none; the stamp says how far each has come.
 */
export function JobIndex({ current } = {}) {
    const tools = byJob(family.filter((tool) => tool.name !== current));
    return (_jsx("ul", { className: "fam-jobs", children: tools.map((tool) => (_jsx("li", { children: _jsxs("a", { className: "fam-job", href: toolHref(tool), "aria-label": `${tool.shortJob}: ${displayName(tool)}, ${tool.status}${leadsToRepo(tool) ? " (GitHub repository)" : ""}`, children: [_jsx("span", { className: "fam-job-name", children: tool.shortJob }), _jsx("span", { className: "fam-job-leader", "aria-hidden": "true" }), _jsxs("span", { className: "fam-job-tool", children: [_jsx(Mark, { name: tool.mark ?? tool.name, className: "mark", size: 22 }), _jsx("b", { children: tool.name })] }), _jsx(Stamp, { solid: tool.status === "stable", children: tool.status })] }) }, tool.name))) }));
}
