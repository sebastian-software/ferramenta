import { type ReactNode } from "react";
export type ToolSwitcherProps = {
    /**
     * The family member this site belongs to, e.g. "ferroni". Its entry in the
     * flyout is omitted; the current project appears as plain text.
     */
    current?: string;
    /** The trigger's text. Defaults to "Tools"; the accessible name stays "All tools". */
    label?: ReactNode;
    /**
     * Which edge of the trigger the flyout hangs from. "end" (the default) is
     * right-aligned, for a switcher at the end of a bar; "start" is for a trigger
     * near the left edge, where a right-aligned flyout would run off-screen.
     */
    align?: "end" | "start";
    /** Extra classes on the `<details>` root, for a host that has to place it. */
    className?: string;
    /**
     * The switcher as the way back to the family, for a site whose brand slot
     * carries its own lockup: the trigger shows the Ferramenta icon and name
     * instead of "Tools", and the flyout opens with a link to the family site.
     * `SiteHeader lockup="project"` sets it; a host header that is not ours sets
     * it itself.
     */
    family?: boolean;
};
/**
 * The family-wide tool switcher: the engines, then the applications the
 * workshop also makes, each tier under its own label.
 *
 * `SiteHeader` renders it, and it also stands on its own: a docs site whose
 * framework owns the header — an Ardo site placing it into
 * `<ArdoHeaderActions>` — renders `<ToolSwitcher current="ferroni" />` there
 * and gets the same flyout. Standing alone it needs only `MarkDefs` on the
 * page and the package's `tokens.css` plus `chrome.css`; the flyout carries its
 * own colors and is positioned against the trigger, so the host header's
 * height and theme do not matter.
 */
export declare function ToolSwitcher(props?: ToolSwitcherProps): import("react").JSX.Element;
