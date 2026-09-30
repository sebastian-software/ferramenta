import type { ReactNode } from "react";
export type SiteHeaderProps = {
    /**
     * The family member this site belongs to, e.g. "ferroni". The switcher marks
     * that entry as the current page, and the lockup links to the family site
     * instead of this site's root. Leave it out on ferramenta.dev itself.
     */
    current?: string;
    /**
     * Rendered at the end of the bar, for a docs site that offers a theme switch
     * (Ardo's `<ArdoThemeToggle />`). A slot rather than an import: `ardo/ui`
     * only loads inside a bundler, and the switch belongs to the site's
     * framework, not to the family chrome. A landing page leaves it out: the
     * family's pages have one authored scheme (ADR-0008).
     */
    themeToggle?: ReactNode;
    /**
     * The family-wide tool switcher in the bar. On by default. The family site
     * turns it off on its own index, which already is the list the switcher
     * would open, and puts its page links in `nav` instead.
     */
    switcher?: boolean;
    /**
     * Rendered in the family navigation just before `themeToggle`, for the
     * controls a docs site keeps in the bar — search, a section menu. Its own
     * slot so those do not have to ride in `themeToggle` and blur what that slot
     * means.
     */
    actions?: ReactNode;
    /**
     * Rendered between the lockup and the family navigation, for a site that has
     * navigation of its own to put in the bar. It supplies its own element; the
     * bar is a flex row and the family navigation stays pushed to the end.
     */
    nav?: ReactNode;
    /**
     * What the brand slot carries. `"family"` (the default) is the Ferramenta
     * lockup — right on ferramenta.dev, and on a docs site that reads as a
     * section of the family. `"project"` puts the current project's own mark and
     * wordmark there, linking to `home`, and moves the way back to the family
     * into the switcher (`ToolSwitcher family`). It needs `current`.
     */
    lockup?: "family" | "project";
    /**
     * Where the project lockup links: the site's own root. Defaults to `/`; a
     * site served from a sub-path (GitHub Pages) passes its base, e.g.
     * `/ferroni/`. Ignored by the family lockup.
     */
    home?: string;
    /**
     * The element to render. `"header"` (the default) is the banner landmark.
     * Pass `"div"` when the host already provides one — an Ardo site rendering
     * this inside `<ArdoHeader>` — so the page does not end up with two. The
     * classes, and therefore the styling, are the same either way.
     */
    as?: "div" | "header";
};
/** The dark header bar: lockup, family-wide tool switcher, GitHub, the site's own slots. */
export declare function SiteHeader({ actions, as, current, home, lockup, nav, switcher, themeToggle, }?: SiteHeaderProps): import("react").JSX.Element;
