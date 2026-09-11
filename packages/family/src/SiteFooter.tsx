import type { ElementType, ReactNode } from "react";

import { FAMILY_SITE, familyGroups, type FamilyTool } from "./family.js";
import { Mark } from "./Mark.js";

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
};

function ToolList({ tools }: { tools: FamilyTool[] }) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.name}>
          <a href={tool.docs ?? tool.repo}>{tool.name}</a>
          <span className="family-job">{tool.job}</span>
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

function footerGroups(line: "company" | "family", current?: string) {
  return familyGroups(line === "family" ? current : undefined);
}

/** Steel-plate footer: lockup, family columns from the registry, company links. */
export function SiteFooter({
  as = "footer",
  current,
  legal = DEFAULT_LEGAL,
  line = "family",
}: SiteFooterProps = {}) {
  const { pipeline, language, workbench } = footerGroups(line, current);
  const Root: ElementType = as;

  return (
    <Root className="site-footer">
      <div className={line === "company" ? "wrap foot foot-company" : "wrap foot"}>
        <div>
          <a className="lockup" href={current === undefined ? "/" : FAMILY_SITE}>
            <Mark name="ferramenta" size={22} />
            More from Ferramenta
          </a>
          <p>A family of Rust tools by Sebastian Software.</p>
        </div>
        {line === "family" && (
          <div>
            <h3>Pipeline</h3>
            <ToolList tools={pipeline} />
            <h3 className="foot-gap">Language</h3>
            <ToolList tools={language} />
          </div>
        )}
        <div>
          {line === "family" && (
            <>
              <h3>Workbench</h3>
              <ToolList tools={workbench} />
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
