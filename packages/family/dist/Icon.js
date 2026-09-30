import { jsx as _jsx } from "react/jsx-runtime";
/** A member's icon as an inline box; see the forms above. */
export function Icon({ className, form = "flat", label, name, size }) {
    const style = size === undefined ? undefined : { "--fam-icon-size": `${size}px` };
    const classes = className === undefined ? "fam-icon" : `fam-icon ${className}`;
    if (label === undefined) {
        return (_jsx("span", { className: classes, "data-icon": name, "data-form": form, style: style, "aria-hidden": "true" }));
    }
    return (_jsx("span", { className: classes, "data-icon": name, "data-form": form, style: style, role: "img", "aria-label": label }));
}
