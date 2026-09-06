import { type ReactNode, type RefObject, useEffect, useRef } from "react";

import { familyGroups } from "./family.js";
import { Mark } from "./Mark.js";

export type ToolSwitcherProps = {
  /**
   * The family member this site belongs to, e.g. "ferroni". Its entry in the
   * flyout is marked `aria-current="page"`.
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
export function ToolSwitcher({ align = "end", className, current, label }: ToolSwitcherProps = {}) {
  const switcherRef = useRef<HTMLDetailsElement>(null);
  const { pipeline, language, workbench } = familyGroups();
  const flyoutGroups = [
    { label: "Pipeline", tools: pipeline },
    { label: "Language", tools: language },
    { label: "Workbench", tools: workbench },
  ];

  useDismissible(switcherRef);

  const classes = ["switcher"];
  if (align === "start") classes.push("switcher-start");
  if (className !== undefined) classes.push(className);

  return (
    <details className={classes.join(" ")} ref={switcherRef}>
      <summary aria-label="All tools">
        {label ?? "Tools"} <Mark name="chev" className="chev icon" size={16} />
      </summary>
      <div className="flyout">
        {flyoutGroups.map((group) => (
          <div className="flygroup" key={group.label}>
            <small>{group.label}</small>
            {group.tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.docs ?? tool.repo}
                aria-current={tool.name === current ? "page" : undefined}
              >
                <span className="markplate">
                  <Mark name={tool.name} size={24} />
                </span>
                <span>
                  <b>{tool.name}</b>
                  <small>{tool.shortJob}</small>
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </details>
  );
}
