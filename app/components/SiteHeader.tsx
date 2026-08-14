import { useEffect, useRef } from "react"
import { ArdoThemeToggle } from "ardo/ui"
import { family } from "@ferramenta/ardo-config"
import { Mark } from "./Marks"

const shortJob: Record<string, string> = {
  ferroni: "regex engine",
  ferriki: "syntax highlighting",
  ferromark: "markdown",
  ferrolex: "spell checking",
  ferrocat: "translation catalogs",
  ferrovia: "svg optimizer",
  ferrugo: "pdf previews",
}

/** Iron header bar: lockup, family-wide tool switcher, GitHub, theme toggle. */
export function SiteHeader() {
  const switcherRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const switcher = switcherRef.current
      if (switcher?.open && !switcher.contains(event.target as Node)) {
        switcher.removeAttribute("open")
      }
    }
    document.addEventListener("click", closeOnOutsideClick)
    return () => document.removeEventListener("click", closeOnOutsideClick)
  }, [])

  return (
    <header className="site-header">
      <div className="wrap bar">
        <a className="lockup" href="/">
          <Mark name="ferramenta" size={26} />
          ferramenta
        </a>
        <nav className="site" aria-label="Site">
          <details className="switcher" ref={switcherRef}>
            <summary aria-label="All tools">
              Tools <Mark name="chev" className="chev icon" size={16} />
            </summary>
            <div className="flyout">
              {family.map((tool) => (
                <a key={tool.name} href={tool.docs ?? tool.repo}>
                  <span className="markplate">
                    <Mark name={tool.name} size={24} />
                  </span>
                  <span>
                    <b>{tool.name}</b>
                    <small>{shortJob[tool.name] ?? tool.job}</small>
                  </span>
                </a>
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
