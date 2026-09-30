import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { Mark } from "./Mark.js";
const MARKS = {
    yes: { icon: "check", text: "Yes" },
    partial: { icon: "half", text: "Partial" },
    no: { icon: "cross", text: "No" },
};
function isMark(value) {
    return typeof value === "object" && value !== null && "mark" in value;
}
function MarkCell({ mark, note }) {
    const { icon, text } = MARKS[mark];
    return (_jsxs("span", { className: "fam-compare-mark", "data-mark": mark, children: [_jsx(Mark, { name: icon, size: 18 }), _jsx("span", { className: "fam-sr-only", children: note === undefined ? text : `${text}: ` }), note] }));
}
function Cell({ value }) {
    if (value === true)
        return _jsx(MarkCell, { mark: "yes" });
    if (value === false)
        return _jsx(MarkCell, { mark: "no" });
    if (isMark(value))
        return _jsx(MarkCell, { ...value });
    if (value === undefined || value === null) {
        return (_jsxs("span", { className: "fam-compare-mark", "data-mark": "none", children: [_jsx("span", { "aria-hidden": "true", children: "\u2013" }), _jsx("span", { className: "fam-sr-only", children: "No value" })] }));
    }
    return value;
}
function Row({ contenders, row, verdict, }) {
    return (_jsxs("tr", { "data-behind": row.behind === true ? "" : undefined, children: [_jsxs("th", { scope: "row", children: [row.label, row.detail !== undefined && _jsx("small", { children: row.detail })] }), contenders.map((contender) => (_jsx("td", { "data-own": contender.own === true ? "" : undefined, children: _jsx(Cell, { value: row.values[contender.id] }) }, contender.id))), verdict && _jsx("td", { className: "fam-compare-verdict", children: row.verdict })] }));
}
function Head({ contenders, subject, verdictLabel, }) {
    return (_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: subject }), contenders.map((contender) => (_jsx("th", { scope: "col", "data-own": contender.own === true ? "" : undefined, children: contender.label }, contender.id))), verdictLabel !== undefined && _jsx("th", { scope: "col", children: verdictLabel })] }) }));
}
/**
 * A table of contenders: one row per workload or feature, one column per
 * contender, the project's own column set apart. It is a real table, so it
 * reads row by row in a screen reader, and it scrolls sideways in its own box,
 * never the page. Where the project is behind, mark the row `behind`: a table
 * that only shows leads is an advertisement.
 */
export function ComparisonTable({ align = "start", caption, contenders, rows, subject, verdictLabel, }) {
    const captionId = useId();
    // The stylesheet keeps room for every value column before the table scrolls.
    const columns = {
        "--fam-compare-columns": String(contenders.length + (verdictLabel === undefined ? 0 : 1)),
    };
    return (_jsxs("figure", { className: "fam-compare", "data-align": align === "end" ? "end" : undefined, style: columns, children: [_jsx("figcaption", { className: "fam-compare-caption", id: captionId, children: caption }), _jsx("div", { className: "fam-compare-scroll", role: "region", "aria-labelledby": captionId, tabIndex: 0, children: _jsxs("table", { className: "fam-compare-table", children: [_jsx(Head, { contenders: contenders, subject: subject, verdictLabel: verdictLabel }), _jsx("tbody", { children: rows.map((row) => (_jsx(Row, { contenders: contenders, row: row, verdict: verdictLabel !== undefined }, row.label))) })] }) })] }));
}
/** A bar's length as a share of the longest, as a custom property for the stylesheet. */
function barLength(value, top) {
    const share = top > 0 ? Math.min(1, Math.max(0, value / top)) : 0;
    return { "--fam-bar": `${(share * 100).toFixed(2)}%` };
}
/**
 * One measure across several contenders, as bars from a common baseline. Every
 * bar carries its figure as text; the bar itself is for the eye only. Use it
 * for one measure in one unit, and a table for anything wider.
 */
export function ComparisonBars({ bars, caption, max }) {
    const top = max ?? Math.max(...bars.map((bar) => bar.value));
    return (_jsxs("figure", { className: "fam-bars", children: [_jsx("figcaption", { className: "fam-compare-caption", children: caption }), _jsx("ul", { className: "fam-bars-list", children: bars.map((bar) => (_jsxs("li", { className: "fam-bar", "data-own": bar.own === true ? "" : undefined, style: barLength(bar.value, top), children: [_jsxs("span", { className: "fam-bar-label", children: [_jsx("b", { children: bar.label }), bar.detail !== undefined && _jsx("small", { children: bar.detail })] }), _jsx("span", { className: "fam-bar-track", "aria-hidden": "true" }), _jsx("span", { className: "fam-bar-value", children: bar.text ?? bar.value })] }, bar.label))) })] }));
}
/**
 * Where a figure comes from: when it was measured, on which machine, at which
 * revision, and where the full report is. It belongs under every table, bar
 * chart or set of figures that states a measurement.
 */
export function Measured({ children, machine, more, on, revision }) {
    const rows = [
        { label: "Measured", value: on },
        { label: "Machine", value: machine },
        ...(revision === undefined ? [] : [{ label: "Revision", value: revision }]),
        ...(more ?? []),
        ...(children === undefined ? [] : [{ label: "Reproduce", value: children }]),
    ];
    return (_jsx("dl", { className: "fam-measured", children: rows.map((row) => (_jsxs("div", { children: [_jsx("dt", { children: row.label }), _jsx("dd", { children: row.value })] }, row.label))) }));
}
