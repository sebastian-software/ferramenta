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
  /** The trigger's text. Defaults to "Tools"; the accessible name stays "All tools". */
  label?: ReactNode;
  /**
   * Which edge of the trigger the flyout hangs from. "end" (the default) is
   * right-aligned, for a switcher at the end of a bar; "start" is for a trigger
   * near the left edge, where a right-aligned flyout would run off-screen.
   */
  align?: "end" | "start";
  /** Extra classes on the `<details>` root, for a host that has to place it. */
  className?: string;
  /**
   * The switcher as the way back to the family, for a site whose brand slot
   * carries its own lockup: the trigger shows the Ferramenta icon and name
   * instead of "Tools", and the flyout opens with a link to the family site.
   * `SiteHeader lockup="project"` sets it; a host header that is not ours sets
   * it itself.
   */
  family?: boolean;
};

function switcherClasses({ align, className, family }: ToolSwitcherProps) {
  const classes = ["switcher"];
  if (align === "start") classes.push("switcher-start");
  if (family === true) classes.push("switcher-family");
  if (className !== undefined) classes.push(className);
  return classes.join(" ");
}

/** The trigger's default content: "Tools", or the family's icon and name. */
function defaultTrigger(family: boolean): ReactNode {
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
 * `SiteHeader` renders it, and it also stands on its own: a docs site whose
 * framework owns the header — an Ardo site placing it into
 * `<ArdoHeaderActions>` — renders `<ToolSwitcher current="ferroni" />` there
 * and gets the same flyout. Standing alone it needs only `MarkDefs` on the
 * page and the package's `tokens.css` plus `chrome.css`; the flyout carries its
 * own colors and is positioned against the trigger, so the host header's
 * height and theme do not matter.
 */
export function ToolSwitcher(props: ToolSwitcherProps = {}) {
  const { current, family = false, label } = props;
  const switcherRef = useRef<HTMLDetailsElement>(null);
  useDismissible(switcherRef);
  const { applications, engines } = familyTiers(current);

  return (
    <details className={switcherClasses(props)} ref={switcherRef}>
      {/* The accessible name keeps the visible word, so a voice user can say it. */}
      <summary aria-label={family ? "Ferramenta: all tools" : "All tools"}>
        {label ?? defaultTrigger(family)} <Mark name="chev" className="chev icon" size={16} />
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
