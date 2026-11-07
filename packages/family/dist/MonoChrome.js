import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState, } from "react";
import { displayName, WORKSHOP } from "./family.js";
import { FerraMark } from "./FerraComponents.js";
const classes = (base, extra) => extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
/** The page ground: one authored light scheme, scoped to its wrapper. */
export function MonoPage({ className, ...props }) {
    return _jsx("div", { ...props, className: classes("mono", className) });
}
/** Menu state that closes on Escape, on a click outside or on a link, and when the screen widens. */
function useMenu() {
    const [open, setOpen] = useState(false);
    const headerRef = useRef(null);
    const buttonRef = useRef(null);
    useEffect(() => {
        const close = () => {
            setOpen(false);
        };
        if (!open)
            return undefined;
        const onKey = (event) => {
            if (event.key !== "Escape")
                return;
            close();
            buttonRef.current?.focus();
        };
        const onClick = (event) => {
            const target = event.target;
            if (!(target instanceof Element))
                return;
            if (headerRef.current?.contains(target) !== true || target.closest(".mono-menu a"))
                close();
        };
        const wide = matchMedia("(min-width: 961px)");
        const onWide = () => {
            if (wide.matches)
                close();
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("click", onClick);
        wide.addEventListener("change", onWide);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("click", onClick);
            wide.removeEventListener("change", onWide);
        };
    }, [open]);
    return { open, setOpen, headerRef, buttonRef };
}
function MonoMenu({ id, links, navLabel, release, familyHref }) {
    return (_jsxs("div", { className: "mono-menu", id: id, children: [_jsx("nav", { "aria-label": navLabel, children: _jsx("ul", { children: links.map((link) => (_jsx("li", { children: link }, link.key))) }) }), _jsxs("div", { className: "mono-header-end", children: [release !== undefined && (_jsxs("span", { className: "mono-release", title: "Current release", children: ["v", release] })), _jsxs("a", { className: "mono-family", href: familyHref, children: [_jsx(FerraMark, { product: "ferramenta", size: 32 }), "Ferramenta"] })] })] }));
}
/** The steel navigation bar. Its links fold into a menu below 961px. */
export function MonoHeader({ product, home, links, navLabel = "Main", release, actions, familyHref = "https://ferramenta.dev", }) {
    const { open, setOpen, headerRef, buttonRef } = useMenu();
    const menuId = useId();
    return (_jsx("header", { className: "mono-header", ref: headerRef, "data-open": open, children: _jsxs("div", { className: "mono-header-in", children: [_jsxs("a", { className: "mono-brand", href: home, children: [_jsx(FerraMark, { product: product, size: 32 }), displayName(product)] }), _jsxs("button", { ref: buttonRef, className: "mono-menu-button", type: "button", "aria-expanded": open, "aria-controls": menuId, onClick: () => {
                        setOpen(!open);
                    }, children: [_jsx("i", { "aria-hidden": "true" }), "Menu"] }), _jsx(MonoMenu, { id: menuId, links: links, navLabel: navLabel, release: release, familyHref: familyHref }), actions !== undefined && actions !== null && (_jsx("div", { className: "mono-header-actions", children: actions }))] }) }));
}
export function MonoFooter({ product, home, children }) {
    return (_jsx("footer", { className: "mono-footer", children: _jsxs("div", { className: "mono-footer-in", children: [_jsx(FerraMark, { product: product, size: 32 }), _jsxs("p", { children: [_jsx("a", { href: home, children: displayName(product) }), ", part of", " ", _jsx("a", { href: "https://ferramenta.dev", children: "Ferramenta" })] }), children, _jsx("a", { href: WORKSHOP.imprint, children: "Imprint" }), _jsx("a", { href: WORKSHOP.privacy, children: "Privacy" }), _jsxs("p", { className: "mono-footer-copy", children: ["\u00A9 ", new Date().getFullYear(), " ", WORKSHOP.company] })] }) }));
}
