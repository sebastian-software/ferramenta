import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef } from "react";
import { ComparisonWords, useHorizontalOverflow } from "./ReadingSupport.js";
/*
 * Monografie's documentation pages (ADR-0012): the reading layout between the
 * host's navigation and the page outline, and the tables that stand in it.
 * Each component takes the props of its Ferra counterpart, so a site moves by
 * renaming imports. Styled by `monografie-docs.css`.
 */
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/**
 * One reading column between host-owned navigation and the page outline. Both
 * panels stay in view under the sticky header; the outline steps aside below
 * 1181px and the navigation below 961px, where the host's menu carries it.
 */
export function MonoReadingLayout({ navigation, outline, children, className, ...props }) {
    return (_jsxs("article", { ...props, className: classes("mono-reading", className), children: [_jsx("div", { className: "mono-reading-navigation", children: navigation }), _jsx("div", { className: "mono-reading-surface", children: _jsx("div", { className: "mono-prose", children: children }) }), _jsx("div", { className: "mono-reading-outline", children: outline })] }));
}
/**
 * The pages of the current section. The host supplies the links, marks the
 * current one with `aria-current="page"` or `data-active="true"`, groups them
 * under `<p>` labels and names the landmark.
 */
export function MonoGuideNavigation({ className, ...props }) {
    return _jsx("nav", { ...props, className: classes("mono-guide-navigation", className) });
}
/**
 * Documentation sections, placed directly before `MonoGuideNavigation`. In the
 * reading layout they stand as a short list above the pages, divided from them
 * by a hairline; anywhere else, such as the host's mobile panel, they lie flat
 * as a row of tabs. The host supplies one link per section, marks the current
 * one with `data-active="true"` or `aria-current`, and names the landmark. The
 * tabs are links, not an ARIA tablist: switching a section navigates.
 */
export function MonoSectionRail({ className, ...props }) {
    return _jsx("nav", { ...props, className: classes("mono-section-rail", className) });
}
/** Keeps native table geometry and scrolls a wide table inside its own box, never the page. */
export function MonoTableViewport({ children, className, ...props }) {
    const regionRef = useRef(null);
    const overflows = useHorizontalOverflow(regionRef);
    return (_jsxs("div", { className: classes("mono-table-frame", className), children: [_jsx("p", { className: "mono-table-hint", hidden: !overflows, children: "Scroll sideways for more columns." }), _jsx("div", { ...props, className: "mono-table-region", role: "region", tabIndex: 0, ref: regionRef, children: children })] }));
}
/** The MDX `table` slot: prose may wrap, but comparison columns keep readable words. */
export function MonoReadingTable(props) {
    return (_jsx(MonoTableViewport, { className: "mono-reading-table", "aria-label": props["aria-label"] ?? "Data table", children: _jsx("table", { ...props }) }));
}
/** A captioned hairline table; native children keep the consumer's header relationships. */
export function MonoTable({ caption, children, className, ...props }) {
    const id = useId();
    return (_jsx(MonoTableViewport, { "aria-labelledby": id, children: _jsxs("table", { ...props, className: classes("mono-data-table", className), children: [_jsx("caption", { id: id, children: caption }), children] }) }));
}
/**
 * Measurements in a table; callers keep units, platform groups, sources and
 * missing values. The cells may use `mono-benchmark-name`, `-detail`,
 * `-source`, `-conformance` and `-reference`.
 */
export function MonoBenchmarkTable({ className, ...props }) {
    return _jsx(MonoTable, { ...props, className: classes("mono-benchmark-table", className) });
}
function ComparisonRow({ row, contenders, verdict, }) {
    return (_jsxs("tr", { "data-behind": row.behind ?? undefined, children: [_jsxs("th", { scope: "row", children: [row.label, row.detail !== undefined && _jsx("span", { className: "mono-comparison-detail", children: row.detail })] }), contenders.map((entry) => (_jsx("td", { "data-own": entry.own ?? undefined, children: _jsx(ComparisonWords, { value: row.values[entry.id] }) }, entry.id))), verdict && (_jsx("td", { children: _jsx(ComparisonWords, { value: row.verdict }) }))] }));
}
/** The shared comparison data contract as a hairline table; the own column is set apart. */
export function MonoComparisonTable({ caption, subject, contenders, rows, verdictLabel, align = "start", }) {
    return (_jsxs(MonoTable, { caption: caption, className: "mono-comparison-table", "data-align": align, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: subject }), contenders.map((entry) => (_jsx("th", { scope: "col", "data-own": entry.own ?? undefined, children: entry.label }, entry.id))), verdictLabel !== undefined && _jsx("th", { scope: "col", children: verdictLabel })] }) }), _jsx("tbody", { children: rows.map((row) => (_jsx(ComparisonRow, { row: row, contenders: contenders, verdict: verdictLabel !== undefined }, row.label))) })] }));
}
