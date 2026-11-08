import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useArdoPageData, useArdoPath } from "ardo/runtime";
import { ArdoDocContent, ArdoErrorBoundary, ArdoHeaderSearch, ArdoMobileNavigation, ArdoRoot, ArdoRootLayout, ArdoSidebar, ArdoSidebarGroup, ArdoSidebarLink, ArdoSidebarSection, } from "ardo/ui";
import { useState } from "react";
import { Mark, MarkDefs } from "./Mark.js";
import { MonoFooter, MonoHeader, MonoPage } from "./MonoChrome.js";
import { MonoReadingTable } from "./MonoReading.js";
/** The document around every page: Monografie's one light scheme and the member's icons. */
export function MonoArdoLayout({ icon, appleTouchIcon, children }) {
    return (_jsx(ArdoRootLayout, { colorScheme: "light", className: "mono-ardo", icon: icon, appleTouchIcon: appleTouchIcon, iconBasePath: false, children: children }));
}
export const MonoArdoErrorBoundary = ArdoErrorBoundary;
function inSection(id) {
    return (path) => path === `/${id}` || path.startsWith(`/${id}/`);
}
function SidebarLinks({ pages }) {
    return pages.map(({ label, to }) => (_jsx(ArdoSidebarLink, { to: to, children: label }, to)));
}
/**
 * Ardo's own documentation sidebar: one tab per section on its outer edge, the
 * section's pages beside it, and the groups that section shows. In the mobile
 * menu the same tabs lie flat above the pages.
 */
function DocsSidebar({ sections, groups }) {
    return (_jsx(ArdoSidebar, { children: sections.map((section) => (_jsxs(ArdoSidebarSection, { id: section.id, label: section.label, to: section.to, match: inSection(section.id), icon: section.icon === undefined ? null : _jsx(Mark, { name: section.icon, size: 16 }), children: [_jsx(SidebarLinks, { pages: section.pages }), groups
                    .filter((group) => !(group.hiddenIn ?? []).includes(section.id))
                    .map((group) => (_jsx(ArdoSidebarGroup, { title: group.title, collapsible: false, children: _jsx(SidebarLinks, { pages: group.pages }) }, group.title)))] }, section.id))) }));
}
/**
 * The documentation menu and search. Where Ardo's sidebar folds away, its menu
 * carries the header's links above the sections and pages.
 */
function DocsActions({ name, links, ...navigation }) {
    const [open, setOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsx(ArdoMobileNavigation, { title: `${name} documentation`, open: open, onOpenChange: setOpen, nav: _jsx("nav", { className: "mono-docs-links", "aria-label": `${name} site`, children: _jsx("ul", { children: links.map((link) => (_jsx("li", { children: link }, link.key))) }) }), children: _jsx(DocsSidebar, { ...navigation }) }), _jsx(ArdoHeaderSearch, { variant: "icon", onActivate: () => {
                    setOpen(false);
                } })] }));
}
/**
 * The MDX wrapper: Ardo's article and outline around Monografie's prose. The
 * outline reads the rendered page, so headings from components count, and the
 * title drops its code marks.
 */
function Article({ children }) {
    const page = useArdoPageData();
    return (_jsx(ArdoDocContent, { tocSource: "dom", header: _jsx("header", { className: "mono-prose", children: _jsx("h1", { children: page?.title.replaceAll("`", "") ?? "Documentation" }) }), children: _jsx("div", { className: "mono-prose", children: children }) }));
}
/**
 * An engine site's whole shell on Monografie: homepage and documentation.
 * Search stays in the header on every page; documentation adds its menu.
 */
export function MonoArdoSite({ product, name, release, links, footer, sections = [], groups = [], components, home: homeHref = "/", homeClassName, docsClassName, }) {
    const path = useArdoPath();
    const home = path === "/" || path === "" || sections.length === 0;
    const classes = (base, extra) => extra === undefined ? base : `${base} ${extra}`.trim();
    const navigation = { sections, groups };
    return (_jsxs(MonoPage, { className: home ? homeClassName : classes("mono-docs", docsClassName), children: [_jsx(MarkDefs, {}), _jsx(ArdoRoot, { className: "mono-ardo-shell", scrollMode: "document", header: _jsx(MonoHeader, { product: product, home: homeHref, release: release, links: links, actions: home ? (_jsx(ArdoHeaderSearch, { variant: "icon" })) : (_jsx(DocsActions, { name: name, links: links, ...navigation })) }), sidebar: home ? false : _jsx(DocsSidebar, { ...navigation }), footer: false, components: { table: MonoReadingTable, wrapper: Article, ...components } }), _jsx(MonoFooter, { product: product, home: homeHref, children: footer })] }));
}
