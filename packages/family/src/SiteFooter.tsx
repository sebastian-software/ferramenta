import type { ElementType, ReactNode } from "react";

import { FAMILY_SITE, familyTiers, type FamilyTool, toolHref, WORKSHOP } from "./family.js";
import { Icon } from "./Icon.js";
import { RepoNote } from "./RepoNote.js";

const DEFAULT_LEGAL =
  "This site is MIT-licensed; each tool states its own license in its repository.";

export type SiteFooterProps = {
  /**
   * The family member this site belongs to, e.g. "ferroni". Its own entry is
   * omitted, and the lockup links to the family site instead of this
   * site's root. Leave it out on ferramenta.dev itself.
   */
  current?: string;
  /** The small print under the columns. */
  legal?: ReactNode;
  /**
   * The element to render. `"footer"` (the default) is the contentinfo
   * landmark. Pass `"div"` when the host already provides one, or when the
   * chrome is shown as a specimen (the kit), so the page does not end up with
   * two. The classes, and therefore the styling, are the same either way.
   */
  as?: "div" | "footer";
  /**
   * The family columns. `"full"` (the default) lists every member with the
   * registry's `job`; `"short"` with its `shortJob`; `"none"` drops the
   * columns, for a page that is itself the family's index (ferramenta.dev).
   */
  members?: "full" | "none" | "short";
};

function ToolList({ jobs, tools }: { jobs: "full" | "short"; tools: FamilyTool[] }) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.name}>
          <a href={toolHref(tool)}>
            {tool.name}
            <RepoNote tool={tool} />
          </a>
          <span className="family-job">{jobs === "short" ? tool.shortJob : tool.job}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The workshop's own links. Consulting comes first: most visitors meet the
 * family on a tool's site, and this is where the people who build the engines
 * can be hired (ADR-0008).
 */
function WorkshopList() {
  return (
    <ul>
      <li>
        <a href={WORKSHOP.consulting}>Consulting</a>
        <span className="family-job">Integration, support, long-term maintenance</span>
      </li>
      <li>
        <a href={WORKSHOP.openSource}>Open Source</a>
      </li>
      <li>
        <a href={WORKSHOP.source}>GitHub</a>
      </li>
    </ul>
  );
}

/**
 * The footer's lockup. On the family site itself it is the family's name; on
 * a member's site it is the invitation back to the family.
 */
function FooterLockup({ current }: { current?: string }) {
  const home = current === undefined;
  return (
    <div>
      <a className="lockup" href={home ? "/" : FAMILY_SITE}>
        <span className="fam-tile">
          <Icon name="ferramenta" size={26} />
        </span>
        {home ? "ferramenta" : "More from Ferramenta"}
      </a>
      <p>Rust-native engines by {WORKSHOP.name}, built to the standards their fields agreed on.</p>
    </div>
  );
}

/**
 * The footer's columns: the engines, then the applications and the workshop
 * (only the workshop when the page is the family's own index). Headings are
 * h2: the footer is its own landmark, outside the page's outline.
 */
function FooterColumns({
  current,
  members,
}: { current?: string } & Required<Pick<SiteFooterProps, "members">>) {
  if (members === "none") {
    return (
      <div>
        <h2>Work with us</h2>
        <WorkshopList />
      </div>
    );
  }
  const { applications, engines } = familyTiers(current);
  return (
    <>
      <div>
        <h2>Engines</h2>
        <ToolList jobs={members} tools={engines} />
      </div>
      <div>
        {applications.length > 0 && (
          <>
            <h2>Applications</h2>
            <ToolList jobs={members} tools={applications} />
          </>
        )}
        <h2 className={applications.length > 0 ? "foot-gap" : undefined}>Work with us</h2>
        <WorkshopList />
      </div>
    </>
  );
}

/** The dark footer: lockup, the two tiers from the registry, the workshop's links. */
export function SiteFooter({
  as = "footer",
  current,
  legal = DEFAULT_LEGAL,
  members = "full",
}: SiteFooterProps = {}) {
  const Root: ElementType = as;

  return (
    <Root className="site-footer">
      <div className={members === "none" ? "wrap foot foot-index" : "wrap foot"}>
        <FooterLockup current={current} />
        <FooterColumns current={current} members={members} />
        <p className="foot-legal">{legal}</p>
      </div>
    </Root>
  );
}
