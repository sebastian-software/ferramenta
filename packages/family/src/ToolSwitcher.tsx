import { type ReactNode, useRef } from "react";

import { FAMILY_SITE, familyTiers, type FamilyTool, toolHref, whatLabel } from "./family.js";
import { Icon } from "./Icon.js";
import { Mark } from "./Mark.js";
import { RepoNote } from "./RepoNote.js";
import { useDismissible } from "./useDismissible.js";

export type ToolSwitcherProps = {
  /**
   * The family member this site belongs to, e.g. "ferroni". Its entry in the
   * flyout is omitted; the current project appears as plain text.
   */
  current?: string;
  /**
   * Which edge of the trigger the flyout hangs from. "end" (the default) is
   * right-aligned, for a switcher at the end of a bar; "start" is for a trigger
   * near the left edge, where a right-aligned flyout would run off-screen.
   */
  align?: "end" | "start";
  /**
   * The switcher as the way back to the family, for a site whose brand slot
   * carries its own lockup: the trigger shows the Ferramenta icon and name
   * instead of "Tools", and the flyout opens with a link to the family site.
   * `SiteHeader lockup="project"` sets it; a page that places the switcher
   * itself sets it too.
   */
  family?: boolean;
};

function switcherClasses({ align, family }: ToolSwitcherProps) {
  const classes = ["switcher"];
  if (align === "start") classes.push("switcher-start");
  if (family === true) classes.push("switcher-family");
  return classes.join(" ");
}

/** The trigger's content: "Tools", or the family's icon and name. */
function trigger(family: boolean): ReactNode {
  if (!family) return "Tools";
  return (
    <>
      <Icon name="ferramenta" size={32} />
      <span>Ferramenta</span>
    </>
  );
}

/** The family site's own entry, on top of the flyout: the link a project lockup gave up. */
function FamilyHome() {
  return (
    <a className="flyhome" href={FAMILY_SITE}>
      <Icon name="ferramenta" size={36} />
      <span>
        <b>ferramenta</b>
        <small>the family site</small>
      </span>
    </a>
  );
}

/**
 * One tier of the flyout. The applications' group stands on a light ground:
 * their logos are foreign brands, drawn for one, and on the dark iron they
 * either vanish or fight it.
 */
function FlyoutGroup({
  label,
  tier,
  tools,
}: {
  label: string;
  tier: "applications" | "engines";
  tools: FamilyTool[];
}) {
  if (tools.length === 0) return null;
  return (
    <div className="flygroup" data-tier={tier}>
      <small>{label}</small>
      {tools.map((tool) => (
        <a key={tool.name} href={toolHref(tool)}>
          <Icon name={tool.name} size={36} />
          <span>
            <b>
              {tool.name}
              <RepoNote tool={tool} />
            </b>
            <small>{whatLabel(tool)}</small>
          </span>
        </a>
      ))}
    </div>
  );
}

/**
 * The family-wide tool switcher: the engines, then the applications the
 * workshop also makes, each tier under its own label.
 *
 * `SiteHeader` renders it. A page that fills the header's slots itself can
 * place it too, as the kit's sample header does; it then needs `MarkDefs` on
 * the page. The flyout carries its own colors and hangs from the trigger, so
 * where the trigger sits does not matter.
 */
export function ToolSwitcher(props: ToolSwitcherProps = {}) {
  const { current, family = false } = props;
  const switcherRef = useRef<HTMLDetailsElement>(null);
  useDismissible(switcherRef);
  const { applications, engines } = familyTiers(current);

  return (
    <details className={switcherClasses(props)} ref={switcherRef}>
      {/* The accessible name keeps the visible word, so a voice user can say it. */}
      <summary aria-label={family ? "Ferramenta: all tools" : "All tools"}>
        {trigger(family)} <Mark name="chev" className="chev icon" size={16} />
      </summary>
      <div className="flyout">
        {family && <FamilyHome />}
        {current !== undefined && <p className="switcher-current">Current: {current}</p>}
        <FlyoutGroup label="Engines" tier="engines" tools={engines} />
        <FlyoutGroup label="Applications" tier="applications" tools={applications} />
      </div>
    </details>
  );
}
