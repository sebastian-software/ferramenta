import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * A code example on iron under a rust top rule. Iron is dark in both themes,
 * so one set of syntax colors reads everywhere. It scrolls sideways in its own
 * box, never the page, and takes keyboard focus so that scroll is reachable.
 */
export function CodePanel({ caption, children }) {
    return (_jsxs("figure", { className: "fam-code", children: [_jsx("figcaption", { children: caption }), _jsx("pre", { tabIndex: 0, children: _jsx("code", { children: children }) })] }));
}
