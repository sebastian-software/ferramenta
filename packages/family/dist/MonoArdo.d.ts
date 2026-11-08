import { ArdoErrorBoundary } from "ardo/ui";
import { type ElementType, type ReactElement, type ReactNode } from "react";
import type { Identity } from "./identity.js";
/** One page in a documentation section's list. */
export type MonoDocsPage = {
    label: string;
    to: string;
};
/** One documentation section: a tab on the rail, with its own page list. */
export type MonoDocsSection = {
    id: string;
    label: string;
    to: string;
    /** A line icon from the sprite, shown on the rail. */
    icon?: string;
    pages: MonoDocsPage[];
};
/** Pages listed under every section's own, such as shared concepts. */
export type MonoDocsGroup = {
    title: string;
    pages: MonoDocsPage[];
    /** Section ids that leave the group out. */
    hiddenIn?: string[];
};
export type MonoArdoLayoutProps = {
    /** The member's favicon, as a URL the site's bundler resolved. */
    icon: string;
    appleTouchIcon: string;
    children: ReactNode;
};
/** The document around every page: Monografie's one light scheme and the member's icons. */
export declare function MonoArdoLayout({ icon, appleTouchIcon, children }: MonoArdoLayoutProps): import("react").JSX.Element;
export declare const MonoArdoErrorBoundary: typeof ArdoErrorBoundary;
export type MonoArdoSiteProps = {
    product: Identity;
    /** The member's name in prose, e.g. "Ferromark". */
    name: string;
    /** The release shown in the header. */
    release?: string;
    /** The header's links. */
    links: ReactElement[];
    /** The footer's links. */
    footer?: ReactNode;
    /** The documentation sections; without them every page is a homepage. */
    sections?: MonoDocsSection[];
    groups?: MonoDocsGroup[];
    /** MDX components beside the reading table and the reading layout, e.g. `h2`. */
    components?: Record<string, ElementType>;
    /** Extra classes on the page: the homepage's and the documentation's. */
    homeClassName?: string;
    docsClassName?: string;
};
/** An engine site's whole shell on Monografie: homepage and documentation. */
export declare function MonoArdoSite({ product, name, release, links, footer, sections, groups, components, homeClassName, docsClassName, }: MonoArdoSiteProps): import("react").JSX.Element;
