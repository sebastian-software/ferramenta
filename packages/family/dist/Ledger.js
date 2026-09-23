import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { STATUS_MEANING, STATUS_ORDER } from "./family.js";
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
/**
 * The stamp legend: every maturity status with the one line it promises, from
 * the registry. Put it where the stamps first need reading; on iron it takes
 * the iron stamp set.
 */
export function StampKey({ statuses = STATUS_ORDER }) {
    return (_jsx("dl", { className: "fam-stamp-key", children: statuses.map((status) => (_jsxs("div", { children: [_jsx("dt", { children: _jsx(Stamp, { solid: status === "stable", children: status }) }), _jsx("dd", { children: STATUS_MEANING[status] })] }, status))) }));
}
