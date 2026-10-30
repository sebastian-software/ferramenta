import type { FerraEngineCatalogProps } from "./FerraTypes.js";

import {
  displayName,
  familyTiers,
  type FamilyTool,
  plannedRunsOnTools,
  relationsOf,
  runsOnTools,
  toolHref,
} from "./family.js";
import { FerraMark } from "./FerraComponents.js";
import { FerraSoftCard } from "./FerraEditorial.js";
import { isFerraProduct } from "./FerraIdentity.js";
import { useToolFacts } from "./RegistryFacts.js";

function EngineFacts({ tool }: { tool: FamilyTool }) {
  const facts = useToolFacts(tool);
  const registries = [facts.onCrates ? "crates.io" : null, facts.adapter ? "npm" : null].filter(
    (registry) => registry !== null,
  );
  return (
    <dl className="ferra-engine-facts">
      <div>
        <dt>{tool.succeeds !== undefined ? "Succeeds" : "Built to"}</dt>
        <dd>{tool.succeeds ?? tool.buildsOn}</dd>
      </div>
      <div>
        <dt>Checked against</dt>
        <dd>{tool.evidence}</dd>
      </div>
      <div>
        <dt>Release</dt>
        <dd>v{facts.version}</dd>
      </div>
      <div>
        <dt>Published on</dt>
        <dd>{registries.length === 0 ? "Git" : registries.join(" · ")}</dd>
      </div>
    </dl>
  );
}

/** Independent engines, with registry-owned facts and live releases when provided. */
export function FerraEngineCatalog({ hrefFor = toolHref }: FerraEngineCatalogProps) {
  return (
    <div className="ferra-engine-grid">
      {familyTiers().engines.map((tool) => {
        if (!isFerraProduct(tool.name)) throw new Error(`Missing ferra identity: ${tool.name}`);
        const name = displayName(tool);
        return (
          <article className="ferra-engine" id={tool.name} key={tool.name}>
            <div className="ferra-engine-heading">
              <FerraMark product={tool.name} size={64} />
              <div>
                <h3>{name}</h3>
                <p className="ferra-engine-role">{tool.what}</p>
              </div>
            </div>
            <p>{tool.does}</p>
            <p className="ferra-engine-audience">{tool.audience}</p>
            <p>{tool.proof}</p>
            <ul className="ferra-engine-relations">
              {relationsOf(tool).map((relation) => (
                <li key={`${relation.kind}-${relation.tool.name}`}>
                  {relation.kind === "pairs-with"
                    ? "Pairs with "
                    : relation.kind === "runs-on"
                      ? "Runs on "
                      : "Used by "}
                  <a href={toolHref(relation.tool)}>{displayName(relation.tool)}</a>.
                </li>
              ))}
            </ul>
            <EngineFacts tool={tool} />
            <a href={hrefFor(tool)}>
              Explore {name}
              {tool.docs === undefined && <span className="ferra-repo-hint"> on GitHub</span>}
            </a>
          </article>
        );
      })}
    </div>
  );
}

/** Applications keep their original logos on a flat light reading surface. */
export function FerraApplications() {
  return (
    <div className="ferra-applications">
      {familyTiers().applications.map((tool) => {
        const engines = runsOnTools(tool);
        const planned = plannedRunsOnTools(tool);
        return (
          <FerraSoftCard as="article" className="ferra-application" key={tool.name}>
            <span
              className="ferra-application-logo"
              data-brand={tool.name}
              role="img"
              aria-label={displayName(tool)}
            />
            <h3>{displayName(tool)}</h3>
            <p>
              {tool.what}. {tool.does}
            </p>
            <p>{tool.audience}</p>
            {engines.length > 0 && (
              <p>Runs on {engines.map((engine) => displayName(engine)).join(", ")}.</p>
            )}
            {planned.length > 0 && (
              <p>
                Planned engine integration:{" "}
                {planned.map((engine) => displayName(engine)).join(", ")}.
              </p>
            )}
            <a href={toolHref(tool)}>Explore {displayName(tool)}</a>
          </FerraSoftCard>
        );
      })}
    </div>
  );
}
