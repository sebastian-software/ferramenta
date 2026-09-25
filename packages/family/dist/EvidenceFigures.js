import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Measured figures as a definition list: mono label, big rust display value,
 * rust rule on the left. Only numbers someone can reproduce — put where and
 * when they were measured in the section's `note`.
 */
export function EvidenceFigures({ figures }) {
    return (_jsx("dl", { className: "fam-figures", children: figures.map((figure) => (_jsxs("div", { children: [_jsx("dt", { children: figure.label }), _jsx("dd", { className: "fam-figure-value", children: figure.value }), (figure.detail !== undefined || figure.measure !== undefined) && (_jsxs("dd", { className: "fam-figure-detail", children: [figure.detail, figure.measure !== undefined && _jsx("span", { children: figure.measure })] }))] }, figure.label))) }));
}
