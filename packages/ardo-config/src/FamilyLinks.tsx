import { FAMILY_SITE, family } from "./family.js"

export interface FamilyLinksProps {
  /** Name of the tool whose site is rendering this (highlighted, not linked) */
  current?: string
  /** Label in front of the links (default: "Ferramenta family") */
  label?: string
  className?: string
}

/**
 * Cross-links to every family member plus the family site.
 * Drop into an Ardo footer or header; styled via theme.css.
 */
export function FamilyLinks({ current, label = "Ferramenta family", className }: FamilyLinksProps) {
  return (
    <nav className={className ? `ferramenta-family ${className}` : "ferramenta-family"}>
      <a href={FAMILY_SITE}>{label}</a>
      <span className="ferramenta-family-label">·</span>
      {family.map((tool) => (
        <a
          key={tool.name}
          href={tool.docs ?? tool.repo}
          aria-current={tool.name === current ? "true" : undefined}
        >
          {tool.name}
        </a>
      ))}
    </nav>
  )
}
