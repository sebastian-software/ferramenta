import { family, type FamilyRelation, type FamilyTool, relationsOf, toolHref } from "./family.js";
import { Icon } from "./Icon.js";

/** The heading of each kind of relation, in the order a page shows them. */
const KINDS: Array<{ kind: FamilyRelation["kind"]; label: string }> = [
  { kind: "runs-on", label: "Runs on" },
  { kind: "pairs-with", label: "Pairs with" },
  { kind: "carries", label: "Carries" },
];

function Chip({ tool }: { tool: FamilyTool }) {
  return (
    <li>
      <a className="fam-chip" href={toolHref(tool)}>
        <span className="fam-tile">
          <Icon name={tool.name} size={28} />
        </span>
        <span>
          <b>{tool.name}</b>
          {tool.shortJob}
        </span>
      </a>
    </li>
  );
}

export type RelationsProps = {
  /** The member whose page this is, e.g. "ferroni". */
  current: string;
};

/**
 * Where a member fits with the rest of the family, from the registry: what it
 * runs on, what it pairs with, what it carries. Each related member is a link
 * to its own site. Members are independent, so this names where two fit
 * together and never draws a chain; a member that stands alone renders nothing.
 */
export function Relations({ current }: RelationsProps) {
  const tool = family.find((candidate) => candidate.name === current);
  const relations = tool === undefined ? [] : relationsOf(tool);
  if (relations.length === 0) return null;
  const groups = KINDS.map(({ kind, label }) => ({
    label,
    tools: relations.filter((relation) => relation.kind === kind).map((relation) => relation.tool),
  })).filter((group) => group.tools.length > 0);

  return (
    <dl className="fam-relations">
      {groups.map((group) => (
        <div key={group.label}>
          <dt>{group.label}</dt>
          <dd>
            <ul className="fam-chips">
              {group.tools.map((related) => (
                <Chip key={related.name} tool={related} />
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
