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
   * The job line under each member: `"full"` (the default) is the registry's
   * `job`; `"short"` is its `shortJob`, for the family site, where the page
   * above already carries every full job and the footer only has to point.
   */
  jobs?: "full" | "short";
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

function footerGroups(line: "company" | "family", current?: string) {
  return familyGroups(line === "family" ? current : undefined);
}

/** Steel-plate footer: lockup, family columns from the registry, company links. */
export function SiteFooter({
  as = "footer",
  current,
  jobs = "full",
  legal = DEFAULT_LEGAL,
  line = "family",
}: SiteFooterProps = {}) {
  const { pipeline, language, workbench } = footerGroups(line, current);
  const Root: ElementType = as;

  return (
    <Root className="site-footer">
      <div className={line === "company" ? "wrap foot foot-company" : "wrap foot"}>
        <FooterLockup current={current} />
        {line === "family" && (
          <div>
            <h3>Pipeline</h3>
            <ToolList jobs={jobs} tools={pipeline} />
            <h3 className="foot-gap">Language</h3>
            <ToolList jobs={jobs} tools={language} />
          </div>
        )}
        <div>
          {line === "family" && (
            <>
              <h3>Workbench</h3>
              <ToolList jobs={jobs} tools={workbench} />
            </>
          )}
          <h3 className={line === "family" ? "foot-gap" : undefined}>Company</h3>
          <CompanyList />
        </div>
        <p className="foot-legal">{legal}</p>
      </div>
    </Root>
  );
}
