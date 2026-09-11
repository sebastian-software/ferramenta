import { FAMILY_SITE, relatedTools } from "./family.js";
import { Mark } from "./Mark.js";

export type FamilyLinksProps = {
  /** Omit this project from related links. Leave unset on the family overview. */
  current?: string;
  label?: string;
  className?: string;
};

/** Compact family navigation. Mount MarkDefs once in the host page. */
export function FamilyLinks({
  current,
  label = "More from Ferramenta",
  className,
}: FamilyLinksProps) {
  return (
    <nav aria-label={label} className={["ferramenta-family", className].filter(Boolean).join(" ")}>
      <a className="ferramenta-family-heading" href={FAMILY_SITE}>
        <Mark name="ferramenta" size={24} /> {label}
      </a>
      <p>A family of Rust tools.</p>
      <ul>
        {relatedTools(current).map((tool) => (
          <li key={tool.name}>
            <a href={tool.docs ?? tool.repo}>{tool.name}</a>
            <span> — {tool.job}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
