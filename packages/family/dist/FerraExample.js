import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { Mark } from "./Mark.js";
/** A controlled example; callers own the state and rendered result. */
export function FerraExample({ title, introduction, source, controls, footer, children, }) {
    const id = useId();
    return (_jsxs("section", { className: "ferra-example", "aria-labelledby": id, children: [_jsxs("header", { children: [_jsx("h3", { id: id, children: title }), introduction !== undefined && _jsx("p", { children: introduction })] }), _jsx("div", { className: "ferra-example-controls", children: controls }), _jsxs("div", { className: "ferra-example-grid", children: [_jsxs("div", { className: "ferra-example-source", children: [_jsx("p", { className: "ferra-example-label", children: "Source" }), _jsx("pre", { children: _jsx("code", { children: source }) })] }), _jsxs("div", { className: "ferra-example-preview", children: [_jsx("p", { className: "ferra-example-label", children: "Result" }), _jsx("div", { className: "ferra-example-result", children: children })] })] }), footer !== undefined && _jsx("div", { className: "ferra-example-footer", children: footer })] }));
}
export function FerraToggle({ pressed, label, description, ...props }) {
    return (_jsxs("button", { ...props, className: "ferra-toggle", type: "button", "aria-pressed": pressed, children: [_jsxs("span", { children: [_jsx("strong", { children: label }), _jsx("span", { children: description })] }), _jsx("span", { className: "ferra-toggle-state", "aria-hidden": "true", children: _jsx(Mark, { name: "check", size: 18 }) })] }));
}
