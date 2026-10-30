import type { ArdoMetaDescriptor, ArdoMetaFunction } from "ardo/runtime";

import { RegistryFacts } from "ferramenta-family";
import {
  FerraAction,
  FerraApplications,
  FerraColumns,
  FerraEngineCatalog,
  FerraHero,
  FerraSection,
  FerraTable,
  FerraWorkshop,
} from "ferramenta-family/ferra";
import { displayName, familyTiers, toolHref, WORKSHOP } from "ferramenta-family/registry";

import registryStats from "../data/registry-stats.json";
import { SITE_DESCRIPTION } from "../site-metadata";

export const handle = { layout: "bare" };

export const meta: ArdoMetaFunction = (): ArdoMetaDescriptor[] => [
  { title: "Ferramenta — Rust-native engines" },
  { name: "description", content: SITE_DESCRIPTION },
  { property: "og:title", content: "Ferramenta — Rust-native engines" },
  { property: "og:description", content: SITE_DESCRIPTION },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://ferramenta.dev/" },
  { property: "og:image", content: "https://ferramenta.dev/social.png" },
  { name: "twitter:card", content: "summary_large_image" },
  { tagName: "link", rel: "canonical", href: "https://ferramenta.dev/" },
];

const { engines } = familyTiers();

export default function HomePage() {
  return (
    <RegistryFacts snapshot={registryStats.tools} snapshotGeneratedAt={registryStats.generatedAt}>
      <FerraHero
        product="ferramenta"
        what="A family of Rust engines."
        actions={
          <>
            <FerraAction href="#engines">Explore the engines</FerraAction>
            <FerraAction href={WORKSHOP.source} variant="secondary">
              Source on GitHub
            </FerraAction>
          </>
        }
      >
        <p>
          Focused tools for text, code and documents. Choose the engine your work needs, with a
          shared standard of care and a contract of its own.
        </p>
      </FerraHero>

      <FerraSection
        id="engines"
        label="The engines"
        intro="Independent engines. One workshop."
        title="An engine for each job."
      >
        <p>
          Each engine has its own scope, documentation and repository. Start with the task in front
          of you.
        </p>
        <FerraEngineCatalog />
      </FerraSection>

      <FerraSection
        id="choosing"
        label="Familiar contracts"
        intro="Know what you are choosing."
        title={
          <>
            Familiar inputs.
            <br />
            Explicit boundaries.
          </>
        }
        surface="pewter"
      >
        <p>
          The engines work with established formats and contracts. Compatibility evidence belongs
          with each project, where its scope and limitations can be read in full.
        </p>
        <FerraTable caption="The engines, their foundations and the evidence in each repository">
          <thead>
            <tr>
              <th scope="col">Engine</th>
              <th scope="col">Familiar foundation</th>
              <th scope="col">Evidence to look for</th>
            </tr>
          </thead>
          <tbody>
            {engines.map((tool) => (
              <tr key={tool.name}>
                <th scope="row">
                  <a href={toolHref(tool)}>{displayName(tool)}</a>
                </th>
                <td>{tool.succeeds ?? tool.buildsOn}</td>
                <td>{tool.evidence}</td>
              </tr>
            ))}
          </tbody>
        </FerraTable>
        <p>Read each project's evidence and limits before adopting it.</p>
      </FerraSection>

      <FerraSection
        id="applications"
        label="Applications"
        intro="Products from the same workshop, with their own brands."
        title="The family at work."
      >
        <FerraApplications />
      </FerraSection>

      <FerraSection
        id="workshop"
        label="The workshop"
        intro="Built with care. Adopted independently."
        title={
          <>
            Shared workmanship.
            <br />
            Independent tools.
          </>
        }
      >
        <FerraColumns>
          <div>
            <h3>Take the tool you need.</h3>
            <p>
              Each engine keeps a focused purpose. Where two fit together, their documentation
              explains the relationship. Choose the engine for the work it does.
            </p>
          </div>
          <div>
            <h3>Keep the evidence close.</h3>
            <p>
              Read the reference tests, compatibility notes and measurements in each repository.
              That is where the conditions stay attached to the claim and where limitations can be
              checked against your workload.
            </p>
          </div>
        </FerraColumns>
        <p>
          Built by {WORKSHOP.name} in {WORKSHOP.place}.
        </p>
      </FerraSection>

      <FerraSection
        id="work"
        label="Work with us"
        intro="The people behind the engines, for hire."
        title="Bring us the difficult part."
        surface="plain"
      >
        <p>
          Integration, support and long-term maintenance. Tell us what you are building and where an
          engine could help.
        </p>
        <div className="ferra-actions">
          <FerraAction href={WORKSHOP.consulting}>Work with us</FerraAction>
        </div>
      </FerraSection>
      <FerraWorkshop />
    </RegistryFacts>
  );
}
