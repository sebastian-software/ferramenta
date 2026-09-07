import { type ReactNode } from "react";
export type ToolSwitcherProps = {
    /**
     * The family member this site belongs to, e.g. "ferroni". Its entry in the
     * flyout is marked `aria-current="page"`.
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
};
/**
 * The family-wide tool switcher, grouped the way the family site groups it.
 *
 * `SiteHeader` renders it, and it also stands on its own: a docs site whose
 * framework owns the header — an Ardo site placing it into
 * `<ArdoHeaderActions>` — renders `<ToolSwitcher current="ferroni" />` there
 * and gets the same flyout. Standing alone it needs only `MarkDefs` on the
 * page and the package's `tokens.css` plus `chrome.css`; it carries its own
 * duotone variables, and the flyout is positioned against the trigger, so the
 * host header's height does not matter.
 */
export declare function ToolSwitcher({ align, className, current, label }?: ToolSwitcherProps): import("react").JSX.Element;
