export type ToolSwitcherProps = {
    /**
     * The family member this site belongs to, e.g. "ferroni". Its entry in the
     * flyout is omitted; the current project appears as plain text.
     */
    current?: string;
    /**
     * Which edge of the trigger the flyout hangs from. "end" (the default) is
     * right-aligned, for a switcher at the end of a bar; "start" is for a trigger
     * near the left edge, where a right-aligned flyout would run off-screen.
     */
    align?: "end" | "start";
    /**
     * The switcher as the way back to the family, for a site whose brand slot
     * carries its own lockup: the trigger shows the Ferramenta icon and name
     * instead of "Tools", and the flyout opens with a link to the family site.
     * `SiteHeader lockup="project"` sets it; a page that places the switcher
     * itself sets it too.
     */
    family?: boolean;
};
/**
 * The family-wide tool switcher: the engines, then the applications the
 * workshop also makes, each tier under its own label.
 *
 * `SiteHeader` renders it. A page that fills the header's slots itself can
 * place it too, as the kit's sample header does; it then needs `MarkDefs` on
 * the page. The flyout carries its own colors and hangs from the trigger, so
 * where the trigger sits does not matter.
 */
export declare function ToolSwitcher(props?: ToolSwitcherProps): import("react").JSX.Element;
