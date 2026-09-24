import type { ElementType, ReactNode } from "react";

import { FAMILY_SITE, familyGroups, type FamilyTool, toolHref } from "./family.js";
import { Mark } from "./Mark.js";
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
  /**
   * Which line the site belongs to. "family" (the default) lists the family
   * members; "company" is for the tools that share the workshop but not the
   * engines — they carry the company links alone (decision D2 of the 2026-09
   * family audit).
   */
  line?: "company" | "family";
  /** The small print under the columns. */
  legal?: ReactNode;
  /**
   * The element to render. `"footer"` (the default) is the contentinfo
   * landmark. Pass `"div"` when the host already provides one — an Ardo site
   * rendering this inside `<ArdoFooter>` — so the page does not end up with
   * two. The classes, and therefore the styling, are the same either way.
   */
  as?: "div" | "footer";
  /**
   * The family columns. `"full"` (the default) lists every member with the
   * registry's `job`; `"short"` with its `shortJob`; `"none"` drops the
   * columns, for a page that is itself the family's index (ferramenta.dev):
   * the header's switcher still reaches every member.
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

function CompanyList() {
  return (
    <ul>
      <li>
        <a href="https://github.com/sebastian-software">GitHub</a>
      </li>
      <li>
        <a href="https://oss.sebastian-software.com">Open Source</a>
      </li>
      <li>
        <a href="https://sebastian-consulting.com">Consulting</a>
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
        <Mark name="ferramenta" size={22} />
        {home ? "ferramenta" : "More from Ferramenta"}
      </a>
      <p>A family of Rust tools by Sebastian Software.</p>
    </div>
  );
}

/**
 * The footer's columns: the family in its groups (unless the page is the
 * family's own index, or the site is on the company line), then the company.
 * Headings are h2: the footer is its own landmark, outside the page's outline.
 */
function FooterColumns({
  current,
  line,
  members,
}: { current?: string } & Required<Pick<SiteFooterProps, "line" | "members">>) {
  if (line === "company" || members === "none") {
    return (
      <div>
        <h2>Company</h2>
        <CompanyList />
      </div>
    );
  }
  const { pipeline, language, workbench } = familyGroups(current);
  const jobs = members;
  return (
    <>
      <div>
        <h2>Pipeline</h2>
        <ToolList jobs={jobs} tools={pipeline} />
        <h2 className="foot-gap">Language</h2>
        <ToolList jobs={jobs} tools={language} />
      </div>
      <div>
        <h2>Workbench</h2>
        <ToolList jobs={jobs} tools={workbench} />
        <h2 className="foot-gap">Company</h2>
        <CompanyList />
      </div>
    </>
  );
}

/** Steel-plate footer: lockup, family columns from the registry, company links. */
export function SiteFooter({
  as = "footer",
  current,
  legal = DEFAULT_LEGAL,
  line = "family",
  members = "full",
}: SiteFooterProps = {}) {
  const Root: ElementType = as;
  const columns = line === "family" && members !== "none";

  return (
    <Root className="site-footer">
      <div className={columns ? "wrap foot" : "wrap foot foot-company"}>
        <FooterLockup current={current} />
        <FooterColumns current={current} line={line} members={members} />
        <p className="foot-legal">{legal}</p>
      </div>
    </Root>
  );
}
