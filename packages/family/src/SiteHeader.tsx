import { type ReactNode, type RefObject, useEffect, useRef } from "react";

import { FAMILY_SITE, familyGroups } from "./family.js";
import { Mark } from "./Mark.js";

export type SiteHeaderProps = {
  /**
   * The family member this site belongs to, e.g. "ferroni". The switcher marks
   * that entry as the current page, and the lockup links to the family site
   * instead of this site's root. Leave it out on ferramenta.dev itself.
   */
  current?: string;
  /**
   * Rendered at the end of the bar, where the family site puts Ardo's
   * `<ArdoThemeToggle />`. A slot rather than an import: `ardo/ui` only loads
   * inside a bundler, and the theme switch belongs to the site's framework, not
   * to the family chrome.
   */
  themeToggle?: ReactNode;
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

/** The family-wide tool switcher, grouped the way the family site groups it. */
function ToolSwitcher({ current }: { current?: string }) {
  const switcherRef = useRef<HTMLDetailsElement>(null);
  const { pipeline, language, workbench } = familyGroups();
  const flyoutGroups = [
    { label: "Pipeline", tools: pipeline },
    { label: "Language", tools: language },
    { label: "Workbench", tools: workbench },
  ];

  useDismissible(switcherRef);

  return (
    <details className="switcher" ref={switcherRef}>
      <summary aria-label="All tools">
        Tools <Mark name="chev" className="chev icon" size={16} />
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

/** Iron header bar: lockup, family-wide tool switcher, GitHub, theme toggle. */
export function SiteHeader({ current, themeToggle }: SiteHeaderProps = {}) {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <a className="lockup" href={current === undefined ? "/" : FAMILY_SITE}>
          <Mark name="ferramenta" size={26} />
          <span>ferramenta</span>
        </a>
        <nav className="site" aria-label="Site">
          <ToolSwitcher current={current} />
          <a className="ghlink" href="https://github.com/sebastian-software" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
              <use href="#i-github" />
            </svg>
          </a>
          {themeToggle}
        </nav>
      </div>
    </header>
  );
}
