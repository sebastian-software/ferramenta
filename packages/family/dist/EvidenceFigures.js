import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plate } from "./Plate.js";
/**
 * Measured figures, each stamped on a small steel plate: the figure large, its
 * label and input beneath. Only numbers someone can reproduce — put where and
 * when they were measured in the section's `note`. A project's own site shows
 * them; the family site never repeats a figure.
 */
export function EvidenceFigures({ figures }) {
    return (_jsx("dl", { className: "fam-figures", children: figures.map((figure) => (_jsxs(Plate, { className: "fam-figure", children: [_jsx("dt", { children: figure.label }), _jsx("dd", { className: "fam-figure-value", children: figure.value }), (figure.detail !== undefined || figure.measure !== undefined) && (_jsxs("dd", { className: "fam-figure-detail", children: [figure.detail, figure.measure !== undefined && _jsx("span", { children: figure.measure })] }))] }, figure.label))) }));
}
