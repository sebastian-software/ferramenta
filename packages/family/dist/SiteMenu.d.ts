import { type ReactNode } from "react";
export type SiteMenuProps = {
    /** The trigger's text: what the menu holds, e.g. "Docs". It is the accessible name too. */
    label?: ReactNode;
    /** The links, as the site's own elements (`<a>`, a router's `NavLink`). */
    children: ReactNode;
};
/**
 * A site's own sections as a menu in the bar, for the widths where there is no
 * room to show them: below 64rem, where an Ardo docs layout hides its sidebar
 * and would otherwise leave a phone with no way to the other pages. Put it in
 * `SiteHeader`'s `actions` slot. Above 64rem it is not shown. It needs
 * `MarkDefs` on the page.
 */
export declare function SiteMenu({ children, label }: SiteMenuProps): import("react").JSX.Element;
