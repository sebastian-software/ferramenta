import type { ElementType, ReactNode } from "react";

import { family, FAMILY_SITE, WORKSHOP } from "./family.js";
import { Icon } from "./Icon.js";
import { ToolSwitcher } from "./ToolSwitcher.js";

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
   * Pass `"div"` when the host already provides one, or when the chrome is
   * shown as a specimen (the kit), so the page does not end up with two. The
   * classes, and therefore the styling, are the same either way.
   */
  as?: "div" | "header";
};

function githubLink(current?: string) {
  const currentTool = family.find((tool) => tool.name === current);
  return {
    href: currentTool?.repo ?? WORKSHOP.source,
    label: currentTool === undefined ? "GitHub" : `${currentTool.name} on GitHub`,
  };
}

/** The dark header bar: lockup, family-wide tool switcher, GitHub, the site's own slots. */
export function SiteHeader({
  actions,
  as = "header",
  current,
  home = "/",
  lockup = "family",
  nav,
  switcher = true,
  themeToggle,
}: SiteHeaderProps = {}) {
  const Root: ElementType = as;
  const project = lockup === "project";
  const github = githubLink(current);
  // One construction for both lockups: the small icon on a steel tile, then the wordmark.
  let name = "ferramenta";
  let href = current === undefined ? "/" : FAMILY_SITE;
  if (project) {
    if (current === undefined) {
      throw new Error('SiteHeader: lockup="project" needs `current`, the project it names');
    }
    name = current;
    href = home;
  }

  return (
    <Root className="site-header">
      <div className="wrap bar">
        <a className="lockup" href={href}>
          <span className="fam-tile">
            <Icon name={name} size={28} />
          </span>
          <span>{name}</span>
        </a>
        {nav}
        <nav className="site-nav" aria-label="Site">
          {switcher && <ToolSwitcher current={current} family={project} />}
          <a className="ghlink" href={github.href} aria-label={github.label}>
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
