import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** A labeled native select; callers own its value and the content it controls. */
export function FerraSelect({ label, options, ...props }) {
    return (_jsxs("label", { className: "ferra-select", children: [_jsx("span", { children: label }), _jsx("select", { ...props, children: options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }));
}
