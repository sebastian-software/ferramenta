import { type ReactNode, useId } from "react";

import {
  displayName,
  type FamilyRelation,
  familyTiers,
  type FamilyTool,
  leadsToRepo,
  relationsOf,
  runsOnTools,
  toolHref,
  whatLabel,
} from "./family.js";
import { type CustomProperties, Icon } from "./Icon.js";
import { Mark } from "./Mark.js";
import { Rivets } from "./Plate.js";
import { useToolFacts } from "./RegistryFacts.js";
import { RepoNote } from "./RepoNote.js";

/*
 * The family's two tiers as a site shows them: the engines as a catalog of
 * name plates, the applications as a band in their own colors. Everything
 * comes from the registry, the release figures from `RegistryFacts`. Styled by
 * `landing.css`.
 */

/** Where a member's link leads, as the page names it: its host, or its repository. */
function linkLabel(tool: FamilyTool): string {
  return leadsToRepo(tool) ? "GitHub repository" : new URL(toolHref(tool)).host;
}

function RelationLine({ relation }: { relation: FamilyRelation }) {
  const link = <a href={toolHref(relation.tool)}>{displayName(relation.tool)}</a>;
  let text: ReactNode = <>Pairs with {link}</>;
  if (relation.kind === "runs-on") text = <>Runs on {link}</>;
  if (relation.kind === "carries") text = <>{link} runs on it</>;
  return (
    <li>
      <Mark name="adapter" size={16} />
      <span>{text}</span>
    </li>
  );
}

/** Where a member fits with others. Empty for one that stands entirely alone. */
function Relations({ tool }: { tool: FamilyTool }) {
  const relations = relationsOf(tool);
  if (relations.length === 0) return null;
  return (
    <ul className="fam-engine-fits">
      {relations.map((relation) => (
        <RelationLine key={`${relation.kind}-${relation.tool.name}`} relation={relation} />
      ))}
    </ul>
  );
}

/** The measured facts, last and quiet: lineage, evidence, release, registries. */
function EngineFacts({ tool }: { tool: FamilyTool }) {
  const facts = useToolFacts(tool);
  const registries = [facts.onCrates ? "crates.io" : null, facts.adapter ? "npm" : null].filter(
    (registry) => registry !== null,
  );
  return (
    <dl className="fam-engine-facts">
      {tool.succeeds === undefined ? null : (
        <div>
          <dt>Succeeds</dt>
          <dd>{tool.succeeds}</dd>
        </div>
      )}
      {tool.buildsOn === undefined ? null : (
        <div>
          <dt>Built to</dt>
          <dd>{tool.buildsOn}</dd>
        </div>
      )}
      <div>
        <dt>Checked against</dt>
        <dd>{tool.evidence}</dd>
      </div>
      <div>
        <dt>Release</dt>
        <dd className="fam-engine-version">v{facts.version}</dd>
      </div>
      <div>
        <dt>Published on</dt>
        <dd>{registries.length === 0 ? "Git" : registries.join(" · ")}</dd>
      </div>
    </dl>
  );
}

/**
 * One catalog row. The plate says what the engine is, and nothing else: no
 * maturity stamp, because the release beside it already says how far it has
 * come. The copy says what it does, for whom, and only then where it comes
 * from. The name is the link, stretched over the plate.
 */
function EngineRow({ tool }: { tool: FamilyTool }) {
  return (
    <li>
      <article className="fam-engine" id={tool.name}>
        <div className="fam-plate fam-engine-plate">
          <Rivets />
          <Icon name={tool.name} form="rendered" />
          <div>
            <h3 className="fam-engine-name">
              <a className="fam-engine-link" href={toolHref(tool)}>
                {tool.name}
                <RepoNote tool={tool} />
              </a>
            </h3>
            <p className="fam-engine-what">{whatLabel(tool)}</p>
          </div>
        </div>
        <div className="fam-engine-body">
          <p className="fam-engine-does">{tool.does}</p>
          <p>{tool.audience}</p>
          <p>{tool.proof}</p>
          <Relations tool={tool} />
          <EngineFacts tool={tool} />
          <p className="fam-engine-go">
            <a href={toolHref(tool)}>
              {linkLabel(tool)} <Mark name="arrow" size={18} />
            </a>
          </p>
        </div>
      </article>
    </li>
  );
}

export type EngineCatalogProps = {
  /** A member whose own site this is: it is left out of the catalog. */
  current?: string;
  /** The engines to show. Defaults to every engine in the registry, in catalog order. */
  tools?: FamilyTool[];
};

/**
 * The engine catalog: one row per engine, each with its name plate. Every
 * engine works on its own; where two fit together, the row says so.
 */
export function EngineCatalog({ current, tools }: EngineCatalogProps = {}) {
  const engines = tools ?? familyTiers(current).engines;
  return (
    <ul className="fam-engines">
      {engines.map((tool) => (
        <EngineRow key={tool.name} tool={tool} />
      ))}
    </ul>
  );
}

/** An application's brand color as custom properties, for the one card that shows it. */
function brandStyle(tool: FamilyTool): CustomProperties | undefined {
  if (tool.brand === undefined) return undefined;
  return { "--fam-app-color": tool.brand.color, "--fam-app-on-color": tool.brand.onColor };
}

/** The engines an application runs on: each icon, name and what it is, on a dark inlay. */
function RunsOn({ engines }: { engines: FamilyTool[] }) {
  return (
    <>
      <p className="fam-app-label">Runs on</p>
      <ul className="fam-app-runs">
        {engines.map((engine) => (
          <li key={engine.name}>
            <Icon name={engine.name} size={32} />
            <span>
              <b>{engine.name}</b>
              {whatLabel(engine)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function ApplicationCard({ tool }: { tool: FamilyTool }) {
  const engines = runsOnTools(tool);
  return (
    <article
      className="fam-app"
      data-lead={engines.length > 0 ? "" : undefined}
      style={brandStyle(tool)}
    >
      <span className="fam-app-logo">
        <Icon name={tool.name} />
      </span>
      <div>
        <h3 className="fam-app-name">{displayName(tool)}</h3>
        <p className="fam-app-job">{tool.job}</p>
        <p>{tool.does}</p>
        {engines.length > 0 ? (
          <RunsOn engines={engines} />
        ) : (
          <p className="fam-app-note">From the same workshop. It stands on its own.</p>
        )}
        <a className="fam-app-go" href={toolHref(tool)}>
          Visit {linkLabel(tool)} <Mark name="arrow" size={18} />
        </a>
      </div>
    </article>
  );
}

export type ApplicationsBandProps = {
  id?: string;
  title?: ReactNode;
  intro?: ReactNode;
  /** A member whose own site this is: it is left out. */
  current?: string;
};

/**
 * The applications, each on a light card under its own logo and color: the
 * one place the family shows a brand that is not its own. An application that
 * runs on family engines leads and names them; one that stands alone is from
 * the same workshop, and says no more than that.
 */
export function ApplicationsBand({
  current,
  id = "applications",
  intro,
  title = "Applications",
}: ApplicationsBandProps = {}) {
  const titleId = useId();
  const { applications } = familyTiers(current);
  if (applications.length === 0) return null;

  return (
    <section className="fam-band fam-apps on-iron" id={id} aria-labelledby={titleId}>
      <div className="wrap">
        <h2 className="fam-heading" id={titleId}>
          {title}
        </h2>
        {intro !== undefined && <p className="fam-intro">{intro}</p>}
        <div className="fam-apps-grid">
          {applications.map((tool) => (
            <ApplicationCard key={tool.name} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
