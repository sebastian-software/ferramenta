import type { ElementType, ReactNode } from "react";

import { FAMILY_SITE } from "./family.js";
import { Mark } from "./Mark.js";
import { ToolSwitcher } from "./ToolSwitcher.js";

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
   * The element to render. `"header"` (the default) is the banner landmark.
   * Pass `"div"` when the host already provides one — an Ardo site rendering
   * this inside `<ArdoHeader>` — so the page does not end up with two. The
   * classes, and therefore the styling, are the same either way.
   */
  as?: "div" | "header";
};

/** Iron header bar: lockup, family-wide tool switcher, GitHub, theme toggle. */
export function SiteHeader({
  actions,
  as = "header",
  current,
  nav,
  themeToggle,
}: SiteHeaderProps = {}) {
  const Root: ElementType = as;

  return (
    <Root className="site-header">
      <div className="wrap bar">
        <a className="lockup" href={current === undefined ? "/" : FAMILY_SITE}>
          <Mark name="ferramenta" size={26} />
          <span>ferramenta</span>
        </a>
        {nav}
        <nav className="site" aria-label="Site">
          <ToolSwitcher current={current} />
          <a className="ghlink" href="https://github.com/sebastian-software" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
              <use href="#i-github" />
            </svg>
          </a>
          {actions}
          {themeToggle}
        </nav>
      </div>
    </Root>
  );
}
