import type { ReactNode } from "react";

import { FAMILY_SITE, familyGroups, type FamilyTool } from "./family.js";
import { Mark } from "./Mark.js";

const DEFAULT_LEGAL =
  "This site is MIT-licensed; each tool states its own license in its repository.";

export type SiteFooterProps = {
  /**
   * The family member this site belongs to, e.g. "ferroni". Its own entry is
   * de-emphasized, and the lockup links to the family site instead of this
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
};

function ToolList({ tools, current }: { tools: FamilyTool[]; current?: string }) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.name}>
          <a
            href={tool.docs ?? tool.repo}
            aria-current={tool.name === current ? "page" : undefined}
          >
            {tool.name}
          </a>
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

/** Steel-plate footer: lockup, family columns from the registry, company links. */
export function SiteFooter({
  current,
  legal = DEFAULT_LEGAL,
  line = "family",
}: SiteFooterProps = {}) {
  const { pipeline, language, workbench } = familyGroups();

  return (
    <footer className="site-footer">
      <div className={line === "company" ? "wrap foot foot-company" : "wrap foot"}>
        <div>
          <a className="lockup" href={current === undefined ? "/" : FAMILY_SITE}>
            <Mark name="ferramenta" size={22} />
            ferramenta
          </a>
          <p>Rust-native developer tools by Sebastian Software. Open source, openly verified.</p>
        </div>
        {line === "family" && (
          <div>
            <h3>Pipeline</h3>
            <ToolList tools={pipeline} current={current} />
            <h3 className="foot-gap">Language</h3>
            <ToolList tools={language} current={current} />
          </div>
        )}
        <div>
          {line === "family" && (
            <>
              <h3>Workbench</h3>
              <ToolList tools={workbench} current={current} />
            </>
          )}
          <h3 className={line === "family" ? "foot-gap" : undefined}>Company</h3>
          <CompanyList />
        </div>
        <p className="foot-legal">{legal}</p>
      </div>
    </footer>
  );
}
