import { type ReactNode, type RefObject, useEffect, useRef } from "react";

import { FAMILY_SITE, familyGroups, toolHref } from "./family.js";
import { Mark } from "./Mark.js";
import { RepoNote } from "./RepoNote.js";

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
   * carries its own lockup: the trigger shows the Ferramenta mark and name
   * instead of "Tools", and the flyout opens with a link to the family site.
   * `SiteHeader lockup="project"` sets it; a host header that is not ours sets
   * it itself.
   */
  family?: boolean;
};

/** A `<details>` flyout is not modal: it closes on an outside click and on Escape. */
function useDismissible(ref: RefObject<HTMLDetailsElement | null>) {
  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const switcher = ref.current;
      const target = event.target;
      if (switcher?.open && target instanceof Node && !switcher.contains(target)) {
        switcher.removeAttribute("open");
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      const switcher = ref.current;
      if (event.key === "Escape" && switcher?.open) {
        switcher.removeAttribute("open");
        switcher.querySelector<HTMLElement>("summary")?.focus();
      }
    }
    document.addEventListener("click", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [ref]);
}

function switcherClasses({ align, className, family }: ToolSwitcherProps) {
  const classes = ["switcher"];
  if (align === "start") classes.push("switcher-start");
  if (family === true) classes.push("switcher-family");
  if (className !== undefined) classes.push(className);
  return classes.join(" ");
}

/** The trigger's default content: "Tools", or the family's mark and name. */
function defaultTrigger(family: boolean): ReactNode {
  if (!family) return "Tools";
  return (
    <>
      <Mark name="ferramenta" size={18} />
      <span>Ferramenta</span>
    </>
  );
}

/** The family site's own entry, on top of the flyout: the link a project lockup gave up. */
function FamilyHome() {
  return (
    <a className="flyhome" href={FAMILY_SITE}>
      <span className="markplate">
        <Mark name="ferramenta" size={24} />
      </span>
      <span>
        <b>ferramenta</b>
        <small>the family site</small>
      </span>
    </a>
  );
}

/** The registry's display groups, minus the current project; empty groups drop out. */
function FlyoutGroups({ current }: { current?: string }) {
  const { pipeline, language, workbench } = familyGroups(current);
  const groups = [
    { label: "Pipeline", tools: pipeline },
    { label: "Language", tools: language },
    { label: "Workbench", tools: workbench },
  ];
  return groups
    .filter((group) => group.tools.length > 0)
    .map((group) => (
      <div className="flygroup" key={group.label}>
        <small>{group.label}</small>
        {group.tools.map((tool) => (
          <a key={tool.name} href={toolHref(tool)}>
            <span className="markplate">
              <Mark name={tool.name} size={24} />
            </span>
            <span>
              <b>
                {tool.name}
                <RepoNote tool={tool} />
              </b>
              <small>{tool.shortJob}</small>
            </span>
          </a>
        ))}
      </div>
    ));
}

/**
 * The family-wide tool switcher, grouped the way the family site groups it.
 *
 * `SiteHeader` renders it, and it also stands on its own: a docs site whose
 * framework owns the header — an Ardo site placing it into
 * `<ArdoHeaderActions>` — renders `<ToolSwitcher current="ferroni" />` there
 * and gets the same flyout. Standing alone it needs only `MarkDefs` on the
 * page and the package's `tokens.css` plus `chrome.css`; it carries its own
 * duotone variables, and the flyout is positioned against the trigger, so the
 * host header's height does not matter.
 */
export function ToolSwitcher(props: ToolSwitcherProps = {}) {
  const { current, family = false, label } = props;
  const switcherRef = useRef<HTMLDetailsElement>(null);
  useDismissible(switcherRef);

  return (
    <details className={switcherClasses(props)} ref={switcherRef}>
      {/* The accessible name keeps the visible word, so a voice user can say it. */}
      <summary aria-label={family ? "Ferramenta: all tools" : "All tools"}>
        {label ?? defaultTrigger(family)} <Mark name="chev" className="chev icon" size={16} />
      </summary>
      <div className="flyout">
        {family && <FamilyHome />}
        {current !== undefined && <p className="switcher-current">Current: {current}</p>}
        <FlyoutGroups current={current} />
      </div>
    </details>
  );
}
