import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from "react";
/** A row of pressed/unpressed buttons; the caller owns the value. */
export function MonoSegmented({ label, options, value, onChange }) {
    return (_jsx("div", { className: "mono-seg", role: "group", "aria-label": label, children: options.map((option) => (_jsx("button", { type: "button", "aria-pressed": option.value === value, onClick: () => {
                onChange(option.value);
            }, children: option.label }, option.value))) }));
}
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
/**
 * Holds the bars at zero (`mono-armed`) until the chart first comes into view,
 * unless it starts in view or motion is reduced. Server markup keeps the full
 * widths, so the chart reads without scripts.
 */
function useGrowOnView(element) {
    useEffect(() => {
        const target = element.current;
        if (target === null || reduced() || typeof IntersectionObserver !== "function")
            return;
        const box = target.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0)
            return;
        target.classList.add("mono-armed");
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting))
                return;
            target.classList.remove("mono-armed");
            observer.disconnect();
        }, { threshold: 0.4 });
        observer.observe(target);
        return () => {
            observer.disconnect();
        };
    }, [element]);
}
function Bar({ row, index, scale, tipId, onShow, onHide }) {
    const cut = row.value > scale;
    const width = (Math.min(row.value, scale) / scale) * 100;
    const own = row.own === true ? " mono-own" : "";
    const sub = row.sub === undefined ? "" : `, ${row.sub}`;
    return (_jsxs("li", { tabIndex: 0, "aria-describedby": tipId, "aria-label": `${row.label}${sub}: ${row.value.toFixed(2)}×`, onMouseEnter: (event) => {
            onShow(row, event.currentTarget);
        }, onFocus: (event) => {
            onShow(row, event.currentTarget);
        }, onMouseLeave: onHide, onBlur: onHide, children: [_jsxs("span", { className: "mono-bar-name", "aria-hidden": "true", children: [row.label, row.sub !== undefined && _jsx("small", { children: row.sub })] }), _jsxs("span", { className: "mono-track", "aria-hidden": "true", children: [_jsx("span", { className: `mono-bar${own}`, "data-cut": cut ? "" : undefined, style: {
                            width: `${width}%`,
                            transitionDelay: `${60 + index * 90}ms`,
                        } }), _jsx("span", { className: "mono-ref", style: { left: `${(1 / scale) * 100}%` } })] }), _jsxs("span", { className: `mono-bar-value${own}`, "aria-hidden": "true", children: [row.value.toFixed(2), "\u00D7"] })] }));
}
function Scale({ scale, ticks }) {
    return (_jsxs("div", { className: "mono-scale", "aria-hidden": "true", children: [_jsx("span", {}), _jsx("span", { className: "mono-ticks", children: ticks.map((tick) => (_jsxs("span", { style: { left: `${(tick / scale) * 100}%` }, children: [tick, "\u00D7"] }, tick))) }), _jsx("span", {})] }));
}
/** The bars with their shared tooltip. */
function Bars({ label, rows, scale, describe, }) {
    const listRef = useRef(null);
    const tipRef = useRef(null);
    const [active, setActive] = useState();
    useGrowOnView(listRef);
    const tipId = useId();
    const onShow = (row, item) => {
        const box = listRef.current?.getBoundingClientRect();
        if (box === undefined)
            return;
        const width = tipRef.current?.offsetWidth ?? 300;
        setActive({
            row,
            left: Math.max(0, Math.min(210, box.width - width)),
            top: item.getBoundingClientRect().bottom - box.top - 2,
        });
    };
    const onHide = () => {
        setActive(undefined);
    };
    return (_jsxs("div", { className: "mono-bars-wrap", children: [_jsx("ol", { className: "mono-bars", ref: listRef, "aria-label": label, children: rows.map((row, index) => (_jsx(Bar, { row, index, scale, tipId, onShow, onHide }, row.id))) }), _jsx("div", { className: "mono-tip", ref: tipRef, id: tipId, "data-show": active === undefined ? undefined : "", style: active === undefined ? undefined : { left: active.left, top: active.top }, children: active !== undefined && describe(active.row, active.row.value > scale) })] }));
}
/**
 * Horizontal comparison bars: the engine's own row in rust, the others in
 * steel, a hairline at 1×, the value at the end of every row, a tooltip on
 * hover and focus, and one growth when the chart first comes into view.
 */
export function MonoBarChart({ title, description, toggles, rows, scale, ticks, describe, after, conditions, label, }) {
    return (_jsxs("figure", { className: "mono-chart", children: [_jsxs("div", { children: [_jsxs("div", { className: "mono-chart-head", children: [_jsx("h3", { children: title }), description !== undefined && _jsx("p", { children: description }), toggles !== undefined && _jsx("div", { className: "mono-toggles", children: toggles })] }), _jsx(Bars, { label: label, rows: rows, scale: scale, describe: describe }), _jsx(Scale, { scale: scale, ticks: ticks }), after !== undefined && _jsx("div", { className: "mono-chart-after", children: after })] }), conditions !== undefined && _jsx("aside", { className: "mono-conditions", children: conditions })] }));
}
/** The same figures as a plain table, folded under the chart. */
export function MonoTableView({ summary = "Show the figures as a table", children, }) {
    return (_jsxs("details", { className: "mono-table-view", children: [_jsx("summary", { children: summary }), children] }));
}
