import { FAMILY_SITE, relatedTools, toolHref } from "./family.js";
import { Icon } from "./Icon.js";
import { RepoNote } from "./RepoNote.js";

export type FamilyLinksProps = {
  /** Omit this project from related links. Leave unset on the family overview. */
  current?: string;
  label?: string;
  className?: string;
};

/** Compact family navigation, for a host page that renders none of the family chrome. */
export function FamilyLinks({
  current,
  label = "More from Ferramenta",
  className,
}: FamilyLinksProps) {
  return (
    <nav aria-label={label} className={["ferramenta-family", className].filter(Boolean).join(" ")}>
      <a className="ferramenta-family-heading" href={FAMILY_SITE}>
        <Icon name="ferramenta" size={24} /> {label}
      </a>
      <p>A family of Rust-native tools.</p>
      <ul>
        {relatedTools(current).map((tool) => (
          <li key={tool.name}>
            <a href={toolHref(tool)}>
              {tool.name}
              <RepoNote tool={tool} />
            </a>
            <span> — {tool.job}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
