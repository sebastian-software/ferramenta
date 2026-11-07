import type { ReactNode } from "react";

import {
  displayName,
  familyTiers,
  type FamilyTool,
  plannedRunsOnTools,
  relationsOf,
  runsOnTools,
  STATUS_MEANING,
  toolHref,
  WORKSHOP_REFERENCES,
} from "./family.js";
import { isFerraProduct } from "./FerraIdentity.js";
import { useToolFacts } from "./RegistryFacts.js";

/* The family site's overview, on the Monografie page: every engine on its own
   plate, the applications on light cards under their own logos, and the
   workshop's two brands. Everything reads the registry; nothing is hardcoded. */

const number = new Intl.NumberFormat("en-US");

const KIND_LABEL = {
  "runs-on": "Runs on",
  "pairs-with": "Pairs with",
  carries: "Used by",
} as const;

function joined(tools: FamilyTool[]): ReactNode[] {
  return tools.flatMap((tool, index) => [
    index === 0 ? "" : index === tools.length - 1 ? " and " : ", ",
    <a key={tool.name} href={toolHref(tool)}>
      {displayName(tool)}
    </a>,
  ]);
}

/** One sentence per kind of relation: "Used by Ferriki and Ardo." */
function Relations({ tool }: { tool: FamilyTool }) {
  const relations = relationsOf(tool);
  if (relations.length === 0) return null;
  const kinds = (["runs-on", "pairs-with", "carries"] as const)
    .map((kind) => ({
      kind,
      tools: relations
        .filter((relation) => relation.kind === kind)
        .map((relation) => relation.tool),
    }))
    .filter((group) => group.tools.length > 0);
  return (
    <p className="mono-engine-relations">
      {kinds.map((group, index) => (
        <span key={group.kind}>
          {index > 0 && " "}
          {KIND_LABEL[group.kind]} {joined(group.tools)}.
        </span>
      ))}
    </p>
  );
}

function Facts({ tool }: { tool: FamilyTool }) {
  const facts = useToolFacts(tool);
  return (
    <dl className="mono-engine-facts" aria-label={`${displayName(tool)} registry facts`}>
      <div>
        <dt>Version</dt>
        <dd>{facts.version}</dd>
      </div>
      {facts.onCrates && (
        <div>
          <dt>crates.io downloads</dt>
          <dd>{number.format(facts.crateDownloads)}</dd>
        </div>
      )}
    </dl>
  );
}

function Engine({ tool, hrefFor }: { tool: FamilyTool; hrefFor: (tool: FamilyTool) => string }) {
  if (!isFerraProduct(tool.name)) throw new Error(`Missing ferra identity: ${tool.name}`);
  const name = displayName(tool);
  const href = hrefFor(tool);
  return (
    <article className="mono-engine" id={tool.name} aria-labelledby={`${tool.name}-title`}>
      <a className="mono-engine-plate" href={href} tabIndex={-1} aria-hidden="true">
        <span className="ferra-instrument" data-product={tool.name} />
      </a>
      <div className="mono-engine-text">
        <h3 id={`${tool.name}-title`}>
          <a href={href}>{name}</a>
          <span className="mono-engine-status" title={STATUS_MEANING[tool.status]}>
            {tool.status}
          </span>
        </h3>
        <p className="mono-engine-subtitle">{tool.editorial?.subtitle ?? tool.what}</p>
        <p>{tool.editorial?.introduction ?? tool.does}</p>
        <Relations tool={tool} />
        <Facts tool={tool} />
        <a className="mono-engine-link" href={href}>
          Explore {name}
          {tool.docs === undefined && " on GitHub"}
        </a>
      </div>
      {tool.editorial !== undefined && (
        <dl className="mono-engine-notes" aria-label={`About ${name}`}>
          {tool.editorial.notes.map((note) => (
            <div key={note.title}>
              <dt>{note.title}</dt>
              <dd>
                {note.body} <a href={note.href}>Source</a>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

export type MonoEngineCatalogProps = {
  /** Where each engine leads; its own site, else its repository. */
  hrefFor?: (tool: FamilyTool) => string;
};

/** Every engine in the registry, in editorial order, each on its own plate. */
export function MonoEngineCatalog({ hrefFor = toolHref }: MonoEngineCatalogProps) {
  const engines = [...familyTiers().engines].sort(
    (a, b) => (a.editorial?.order ?? 99) - (b.editorial?.order ?? 99),
  );
  return (
    <div className="mono-engines">
      {engines.map((tool) => (
        <Engine key={tool.name} tool={tool} hrefFor={hrefFor} />
      ))}
    </div>
  );
}

/** The applications, each on a light card under its own logo, in its own colors. */
export function MonoApplications() {
  return (
    <div className="mono-applications">
      {familyTiers().applications.map((tool) => {
        const engines = runsOnTools(tool);
        const planned = plannedRunsOnTools(tool);
        const name = displayName(tool);
        return (
          <article className="mono-application" key={tool.name}>
            <span
              className="mono-application-logo"
              data-brand={tool.name}
              role="img"
              aria-label={name}
            />
            <h3>{name}</h3>
            <p>
              {tool.what}. {tool.does}
            </p>
            {engines.length > 0 && (
              <p className="mono-application-runs">
                Runs on {engines.map((engine) => displayName(engine)).join(", ")}.
              </p>
            )}
            {planned.length > 0 && (
              <p className="mono-application-runs">
                Planned: {planned.map((engine) => displayName(engine)).join(", ")}.
              </p>
            )}
            <a href={toolHref(tool)}>Explore {name}</a>
          </article>
        );
      })}
    </div>
  );
}

/** The workshop's two brands, unchanged, on a light ground. */
export function MonoWorkshop({ children }: { children?: ReactNode }) {
  return (
    <ul className="mono-workshop">
      {WORKSHOP_REFERENCES.map((reference) => (
        <li key={reference.id}>
          <a href={reference.href}>
            <span
              className="ferra-workshop-logo"
              data-brand={reference.id}
              role="img"
              aria-label={reference.name}
            />
            <span>{reference.description}</span>
          </a>
        </li>
      ))}
      {children}
    </ul>
  );
}
