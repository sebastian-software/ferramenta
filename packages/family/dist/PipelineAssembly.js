import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment } from "react";
import { family, familyGroups, PIPELINE } from "./family.js";
import { Fasteners } from "./Fasteners.js";
import { Mark } from "./Mark.js";
/** One member of the chain: its step, its plate, its name. A link unless it is this site. */
function Stage({ current, step, tool }) {
    const content = (_jsxs(_Fragment, { children: [_jsx("span", { className: "fam-assembly-step", children: String(step).padStart(2, "0") }), _jsx("span", { className: "markplate", children: _jsx(Mark, { name: tool.name }) }), _jsxs("span", { className: "fam-assembly-copy", children: [_jsx("b", { children: tool.name }), _jsx("small", { children: tool.shortJob })] })] }));
    return current ? (_jsx("span", { className: "fam-assembly-stage", "aria-current": "true", children: content })) : (_jsx("a", { className: "fam-assembly-stage", href: tool.docs ?? tool.repo, children: content }));
}
/**
 * The content pipeline as one assembled machine: a chamfered steel chassis on
 * four fasteners, the pipeline members in chain order between an input and an
 * output terminal. Horizontal on wide screens, vertical below 46rem.
 */
export function PipelineAssembly({ current, input = PIPELINE.input, label = PIPELINE.description, output = PIPELINE.output, } = {}) {
    if (current !== undefined && !family.some((tool) => tool.name === current)) {
        throw new Error(`Unknown Ferramenta project: ${current}`);
    }
    const { pipeline } = familyGroups();
    return (_jsxs("figure", { className: "fam-assembly", "aria-label": label, children: [_jsx(Fasteners, {}), _jsxs("div", { className: "fam-assembly-flow", children: [_jsxs("span", { className: "fam-assembly-end", children: [_jsx("small", { children: input.label }), _jsx("b", { children: input.text })] }), _jsx(Mark, { name: "arrow", className: "fam-assembly-connector icon" }), pipeline.map((tool, index) => (_jsxs(Fragment, { children: [_jsx(Stage, { current: tool.name === current, step: index + 1, tool: tool }), _jsx(Mark, { name: "arrow", className: "fam-assembly-connector icon" })] }, tool.name))), _jsxs("span", { className: "fam-assembly-end fam-assembly-output", children: [_jsx("small", { children: output.label }), _jsx("b", { children: output.text })] })] })] }));
}
