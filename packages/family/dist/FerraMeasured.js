import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Keep measurement conditions, source revision and reproduction links beside the result. */
export function FerraMeasured({ on, machine, revision, more, children }) {
    const rows = [
        { label: "Measured", value: on },
        { label: "Machine", value: machine },
        ...(revision === undefined ? [] : [{ label: "Revision", value: revision }]),
        ...(more ?? []),
        ...(children === undefined ? [] : [{ label: "Reproduce", value: children }]),
    ];
    return (_jsx("dl", { className: "ferra-measured", children: rows.map((row) => (_jsxs("div", { children: [_jsx("dt", { children: row.label }), _jsx("dd", { children: row.value })] }, row.label))) }));
}
