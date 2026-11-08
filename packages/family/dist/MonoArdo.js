import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ArdoActiveLink as NavLink, useArdoPageData, useArdoPath } from "ardo/runtime";
import { ArdoErrorBoundary, ArdoHeaderSearch, ArdoMobileNavigation, ArdoRoot, ArdoRootLayout, ArdoTOC, } from "ardo/ui";
import { createContext, Fragment, use, useState, } from "react";
import { Mark, MarkDefs } from "./Mark.js";
import { MonoFooter, MonoHeader, MonoPage } from "./MonoChrome.js";
import { MonoGuideNavigation, MonoReadingLayout, MonoReadingTable, MonoSectionRail, } from "./MonoReading.js";
/** The document around every page: Monografie's one light scheme and the member's icons. */
export function MonoArdoLayout({ icon, appleTouchIcon, children }) {
    return (_jsx(ArdoRootLayout, { colorScheme: "light", className: "mono-ardo", icon: icon, appleTouchIcon: appleTouchIcon, iconBasePath: false, children: children }));
}
export const MonoArdoErrorBoundary = ArdoErrorBoundary;
function currentSection(sections, path) {
    return sections.find((section) => path === `/${section.id}` || path.startsWith(`/${section.id}/`));
}
function DocsNavigation({ sections, groups, onNavigate }) {
    const path = useArdoPath();
    const current = currentSection(sections, path) ?? sections.at(0);
    if (current === undefined)
        return null;
    return (_jsxs(_Fragment, { children: [sections.length > 1 && (_jsx(MonoSectionRail, { "aria-label": "Documentation sections", children: sections.map((section) => (_jsxs(NavLink, { to: section.to, "data-active": current.id === section.id, onClick: onNavigate, children: [section.icon !== undefined && _jsx(Mark, { name: section.icon }), section.label] }, section.id))) })), _jsxs(MonoGuideNavigation, { "aria-label": "Documentation pages", children: [_jsx(NavLink, { to: "/", end: true, onClick: onNavigate, children: "Overview" }), _jsx("p", { children: current.label }), current.pages.map(({ label, to }) => (_jsx(NavLink, { to: to, end: true, onClick: onNavigate, children: label }, to))), groups
                        .filter((group) => !(group.hiddenIn ?? []).includes(current.id))
                        .map((group) => (_jsxs(Fragment, { children: [_jsx("p", { children: group.title }), group.pages.map(({ label, to }) => (_jsx(NavLink, { to: to, end: true, onClick: onNavigate, children: label }, to)))] }, group.title)))] })] }));
}
function DocsActions({ name, ...navigation }) {
    const [open, setOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsx(ArdoMobileNavigation, { title: `${name} documentation`, open: open, onOpenChange: setOpen, children: _jsx(DocsNavigation, { ...navigation, onNavigate: () => {
                        setOpen(false);
                    } }) }), _jsx(ArdoHeaderSearch, { variant: "icon", onActivate: () => {
                    setOpen(false);
                } })] }));
}
const SiteContext = createContext({ name: "", articleId: "", sections: [], groups: [] });
/** The MDX wrapper: the reading layout with the navigation, the outline and the page title, its code marks dropped. */
function Article({ children }) {
    const { name, articleId, sections, groups } = use(SiteContext);
    const page = useArdoPageData();
    const current = currentSection(sections, useArdoPath());
    return (_jsxs(MonoReadingLayout, { id: articleId, navigation: _jsx(DocsNavigation, { sections: sections, groups: groups }), outline: _jsx(ArdoTOC, { source: "dom", scope: `#${articleId}` }), children: [_jsxs("header", { children: [_jsxs("p", { children: [name, " / ", current?.label ?? "Documentation"] }), _jsx("h1", { children: page?.title.replaceAll("`", "") ?? "Documentation" })] }), children] }));
}
/** An engine site's whole shell on Monografie: homepage and documentation. */
export function MonoArdoSite({ product, name, release, links, footer, sections = [], groups = [], components, homeClassName, docsClassName, }) {
    const path = useArdoPath();
    const home = path === "/" || path === "" || sections.length === 0;
    const classes = (base, extra) => extra === undefined ? base : `${base} ${extra}`.trim();
    const site = { name, articleId: `${product}-article`, sections, groups };
    return (_jsx(SiteContext, { value: site, children: _jsxs(MonoPage, { className: home ? homeClassName : classes("mono-docs", docsClassName), children: [_jsx(MarkDefs, {}), _jsx(ArdoRoot, { className: "mono-ardo-shell", scrollMode: "document", header: _jsx(MonoHeader, { product: product, home: "/", release: release, links: links, actions: home ? undefined : _jsx(DocsActions, { name: name, sections: sections, groups: groups }) }), sidebar: false, footer: false, components: { table: MonoReadingTable, wrapper: Article, ...components } }), _jsx(MonoFooter, { product: product, home: "/", children: footer })] }) }));
}
