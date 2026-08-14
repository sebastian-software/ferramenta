import { useEffect, useRef } from "react"
import { ArdoThemeToggle } from "ardo/ui"
import { familyGroups } from "@ferramenta/ardo-config"
import { Mark } from "./Marks"

/** Iron header bar: lockup, family-wide tool switcher, GitHub, theme toggle. */
export function SiteHeader() {
  const switcherRef = useRef<HTMLDetailsElement>(null)
  const { pipeline, language, workbench } = familyGroups()
  const flyoutGroups = [
    { label: "Pipeline", tools: pipeline },
    { label: "Language", tools: language },
    { label: "Workbench", tools: workbench },
  ]

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const switcher = switcherRef.current
      if (switcher?.open && !switcher.contains(event.target as Node)) {
        switcher.removeAttribute("open")
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      const switcher = switcherRef.current
      if (event.key === "Escape" && switcher?.open) {
        switcher.removeAttribute("open")
        switcher.querySelector<HTMLElement>("summary")?.focus()
      }
    }
    document.addEventListener("click", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("click", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [])

  return (
    <header className="site-header">
      <div className="wrap bar">
        <a className="lockup" href="/">
          <Mark name="ferramenta" size={26} />
          <span>ferramenta</span>
        </a>
        <nav className="site" aria-label="Site">
          <details className="switcher" ref={switcherRef}>
            <summary aria-label="All tools">
              Tools <Mark name="chev" className="chev icon" size={16} />
            </summary>
            <div className="flyout">
              {flyoutGroups.map((group) => (
                <div className="flygroup" key={group.label}>
                  <small>{group.label}</small>
                  {group.tools.map((tool) => (
                    <a key={tool.name} href={tool.docs ?? tool.repo}>
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
          <a
            className="ghlink"
            href="https://github.com/sebastian-software"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
              <use href="#i-github" />
            </svg>
          </a>
          <ArdoThemeToggle />
        </nav>
      </div>
    </header>
  )
}
