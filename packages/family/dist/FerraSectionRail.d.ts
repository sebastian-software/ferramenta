import type { ComponentPropsWithoutRef } from "react";
export type FerraSectionRailProps = ComponentPropsWithoutRef<"nav">;
/**
 * Documentation sections as a tab rail. Place it directly before
 * `FerraGuideNavigation`. In the reading layout's navigation column it stands
 * on the outer edge: each tab turned 90°, icon first, label reading bottom to
 * top, the active tab attached to the page list like a register tab. Anywhere
 * else, such as a host's mobile panel, the same tabs lie flat above the list.
 *
 * The host supplies one link per section, marks the current one with
 * `data-active="true"` or `aria-current` ("page" or "true"), and names the
 * landmark. The tabs are links, not an ARIA tablist: switching a section
 * navigates.
 */
export declare function FerraSectionRail({ className, ...props }: FerraSectionRailProps): import("react").JSX.Element;
