import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** A status stamp: mono, uppercase, zero radius. */
export function Stamp({ children, solid = false }) {
    return (_jsx("span", { className: "fam-stamp", "data-tone": solid ? "solid" : undefined, children: children }));
}
/**
 * A coverage or compatibility ledger: hairline rows of name, status stamp and
 * the sentence behind it. Say what is not covered as plainly as what is.
 */
export function Ledger({ entries }) {
    return (_jsx("ul", { className: "fam-ledger", children: entries.map((entry) => (_jsxs("li", { className: "fam-ledger-row", children: [_jsx("b", { className: "fam-ledger-name", children: entry.name }), _jsx(Stamp, { solid: entry.settled, children: entry.status }), entry.detail !== undefined && _jsx("p", { children: entry.detail })] }, entry.name))) }));
}
