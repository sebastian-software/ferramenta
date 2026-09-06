import { type ReactNode } from "react";
export type SiteHeaderProps = {
    /**
     * The family member this site belongs to, e.g. "ferroni". The switcher marks
     * that entry as the current page, and the lockup links to the family site
     * instead of this site's root. Leave it out on ferramenta.dev itself.
     */
    current?: string;
    /**
     * Rendered at the end of the bar, where the family site puts Ardo's
     * `<ArdoThemeToggle />`. A slot rather than an import: `ardo/ui` only loads
     * inside a bundler, and the theme switch belongs to the site's framework, not
     * to the family chrome.
     */
    themeToggle?: ReactNode;
};
/** Iron header bar: lockup, family-wide tool switcher, GitHub, theme toggle. */
export declare function SiteHeader({ current, themeToggle }?: SiteHeaderProps): import("react").JSX.Element;
