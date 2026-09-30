import { FamilyLinks, SiteFooter, SiteHeader, ToolSwitcher } from "ferramenta-family";

import { Caption, Chapter, Specimen } from "./Specimen";

/**
 * The chrome every family site shares, shown as a member's site renders it.
 * The header and footer specimens are `inert`: they are pictures of the chrome,
 * and live they would give this page three "Site" nav landmarks and a second set
 * of footer headings. The switcher specimen below them is the one to try.
 */
export function ChromeSpecimens() {
  return (
    <Chapter
      id="chrome"
      title="Chrome"
      intro="The header and footer every family site shares. They are dark iron in every scheme, and everything they list comes from the registry."
    >
      <Caption name={'<SiteHeader current="ferroni" lockup="project" />'}>
        A member&rsquo;s own site: its icon and name in the brand slot, the way back to the family
        in the switcher. The flyout lists the engines, then the applications.
      </Caption>
      <div className="wrap">
        <div className="kit-frame" inert>
          <SiteHeader as="div" current="ferroni" lockup="project" />
        </div>
      </div>

      <Caption name={'<SiteHeader current="ferroni" />'}>
        The family lockup, for a site that reads as a section of the family. The <code>nav</code>,{" "}
        <code>actions</code> and <code>themeToggle</code> slots take a site&rsquo;s own links and
        controls.
      </Caption>
      <div className="wrap">
        <div className="kit-frame" inert>
          <SiteHeader
            as="div"
            current="ferroni"
            nav={
              <div className="site-links">
                <a href="#chrome" aria-current="page">
                  Guide
                </a>
                <a href="#chrome">Performance</a>
              </div>
            }
          />
        </div>
      </div>

      <Specimen
        name="<ToolSwitcher />"
        rule="The switcher on its own, for a header the family does not render. It carries its own colors, so the host's theme does not matter."
      >
        <ToolSwitcher align="start" current="ferroni" />
      </Specimen>

      <Caption name={'<SiteFooter current="ferroni" />'}>
        The engines, the applications, and the workshop&rsquo;s own links. Every family site carries
        the consulting link: most visitors meet the family on a tool&rsquo;s site.
      </Caption>
      <div className="wrap">
        <div className="kit-frame" inert>
          <SiteFooter as="div" current="ferroni" members="short" />
        </div>
      </div>

      <Specimen
        name="<FamilyLinks />"
        rule="Compact family navigation for a page that renders none of the chrome. It takes the host's type and link color."
      >
        <FamilyLinks current="ferroni" />
      </Specimen>
    </Chapter>
  );
}
