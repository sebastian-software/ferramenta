import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Mark } from "./Mark.js";
import { useDismissible } from "./useDismissible.js";
/**
 * A site's own sections as a menu in the bar, for the widths where there is no
 * room to show them: below 64rem, where an Ardo docs layout hides its sidebar
 * and would otherwise leave a phone with no way to the other pages. Put it in
 * `SiteHeader`'s `actions` slot. Above 64rem it is not shown. It needs
 * `MarkDefs` on the page.
 */
export function SiteMenu({ children, label = "Menu" }) {
    const menuRef = useRef(null);
    useDismissible(menuRef);
    // Client-side navigation keeps the page mounted, so the menu has to close
    // itself when one of its links is taken.
    useEffect(() => {
        const menu = menuRef.current;
        function closeOnLink(event) {
            if (event.target instanceof Element && event.target.closest("a") !== null) {
                menu?.removeAttribute("open");
            }
        }
        menu?.addEventListener("click", closeOnLink);
        return () => {
            menu?.removeEventListener("click", closeOnLink);
        };
    }, []);
    return (_jsxs("details", { className: "site-menu", ref: menuRef, children: [_jsxs("summary", { children: [label, " ", _jsx(Mark, { name: "chev", className: "chev icon", size: 16 })] }), _jsx("div", { className: "site-menu-flyout", children: children })] }));
}
