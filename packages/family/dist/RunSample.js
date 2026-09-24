import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePanel } from "./CodePanel.js";
import { Mark } from "./Mark.js";
/**
 * A tool, run for real: the input on iron, an arrow, and the output as it came
 * out, rendered in the page's own type on a ruled sheet. Proof without a
 * figure. The rendered side repeats the input for the eye only, so it is
 * `inert`: assistive technology reads the input once and does not meet the
 * sample's headings as page headings.
 *
 * Below 54rem the two stack, and the input folds into a `<details>`: the output
 * is the proof, the source is there on request. Both variants are in the
 * markup; CSS shows one (`display: none` hides the other from assistive
 * technology too), so nothing waits for JavaScript and nothing shifts.
 */
export function RunSample({ input, inputCaption, inputKind = "Source", output, outputCaption, }) {
    return (_jsxs("div", { className: "fam-run", children: [_jsxs("div", { className: "fam-run-input", children: [_jsx("div", { className: "fam-run-wide", children: _jsx(CodePanel, { caption: inputCaption, children: input }) }), _jsxs("details", { className: "fam-run-narrow", children: [_jsxs("summary", { children: [_jsx("span", { children: inputCaption }), _jsx("small", { children: inputKind }), _jsx(Mark, { name: "chev", className: "icon", size: 16 })] }), _jsx(CodePanel, { caption: inputCaption, children: input })] })] }), _jsx(Mark, { name: "arrow", className: "icon fam-run-arrow" }), _jsxs("figure", { className: "fam-run-output", children: [_jsx("figcaption", { children: outputCaption }), _jsx("div", { className: "fam-run-doc", inert: true, dangerouslySetInnerHTML: { __html: output } })] })] }));
}
