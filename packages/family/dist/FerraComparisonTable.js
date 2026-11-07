import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FerraTable } from "./FerraComponents.js";
import { ComparisonWords } from "./ReadingSupport.js";
function Row({ row, contenders, verdict, }) {
    return (_jsxs("tr", { "data-behind": row.behind ?? undefined, children: [_jsxs("th", { scope: "row", children: [row.label, row.detail !== undefined && _jsx("span", { className: "ferra-comparison-detail", children: row.detail })] }), contenders.map((entry) => (_jsx("td", { "data-own": entry.own ?? undefined, children: _jsx(ComparisonWords, { value: row.values[entry.id] }) }, entry.id))), verdict && (_jsx("td", { children: _jsx(ComparisonWords, { value: row.verdict }) }))] }));
}
/** The existing comparison data contract on Ferra's native, scrollable table. */
export function FerraComparisonTable({ caption, subject, contenders, rows, verdictLabel, align = "start", }) {
    return (_jsxs(FerraTable, { caption: caption, className: "ferra-comparison-table", "data-align": align, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: subject }), contenders.map((entry) => (_jsx("th", { scope: "col", "data-own": entry.own ?? undefined, children: entry.label }, entry.id))), verdictLabel !== undefined && _jsx("th", { scope: "col", children: verdictLabel })] }) }), _jsx("tbody", { children: rows.map((row) => (_jsx(Row, { row: row, contenders: contenders, verdict: verdictLabel !== undefined }, row.label))) })] }));
}
