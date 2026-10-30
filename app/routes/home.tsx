import type { ArdoMetaDescriptor, ArdoMetaFunction } from "ardo/runtime";

import { RegistryFacts } from "ferramenta-family";
import {
  FerraAction,
  FerraApplications,
  FerraContents,
  type FerraContentsItem,
  FerraEditorial,
  FerraEditorialRow,
  FerraEngineArticle,
  FerraNote,
  FerraNotes,
  isFerraProduct,
} from "ferramenta-family/ferra";
import {
  displayName,
  familyTiers,
  WORKSHOP,
  WORKSHOP_REFERENCES,
} from "ferramenta-family/registry";

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

const engines = familyTiers().engines;
const stories = [...engines].sort((a, b) => (a.editorial?.order ?? 0) - (b.editorial?.order ?? 0));
const contents: FerraContentsItem[] = engines.map((tool) => {
  if (!isFerraProduct(tool.name)) throw new Error(`Missing ferra identity: ${tool.name}`);
  return {
    href: `#${tool.name}`,
    label: displayName(tool),
    description: tool.editorial?.navigation ?? tool.what,
    product: tool.name,
  };
});

function WorkshopNote() {
  return (
    <FerraNote title="The people behind the tools" id="workshop">
      <p>
        We build Ferramenta at {WORKSHOP.name} in {WORKSHOP.place}. Open source shaped our work,
        including our time leading qooxdoo at 1&amp;1. Ferramenta is one way we contribute reusable
        parts back.
      </p>
    </FerraNote>
  );
}

export default function HomePage() {
  return (
    <RegistryFacts snapshot={registryStats.tools} snapshotGeneratedAt={registryStats.generatedAt}>
      <FerraEditorial navigation={<FerraContents items={contents} />}>
        <FerraEditorialRow className="ferra-editorial-opening" notes={<WorkshopNote />}>
          <header className="ferra-editorial-intro">
            <h1>
              A workshop for
              <br />
              independent Rust engines.
            </h1>
            <p>
              Useful software carries years of knowledge in its formats, grammars and edge cases. We
              build focused engines around that knowledge, each with a job of its own and a
              documented boundary. Choose the tool your work needs.
            </p>
            <p className="ferra-editorial-byline">
              An open-source project by <a href={WORKSHOP.openSource}>{WORKSHOP.company}</a>.
            </p>
          </header>
        </FerraEditorialRow>
        <div className="ferra-editorial-context">
          <section aria-labelledby="why-rust-title">
            <h2 id="why-rust-title">Why Rust.</h2>
            <p>
              Rust gives us native code and explicit ownership without a garbage collector in the
              engine. We favor safe Rust and keep exceptions deliberate. Speed matters, but
              compatibility and predictable behavior come first.
            </p>
          </section>
          <section aria-labelledby="approach-title">
            <h2 id="approach-title">Keep the knowledge. Make it reusable.</h2>
            <p>
              We build on familiar formats, grammars and dictionaries, checking behavior against
              original implementations and conformance suites. Each engine has a defined scope and
              stands on its own. Adopt the part your application needs.
            </p>
          </section>
        </div>
        <div id="engines" className="ferra-editorial-stories" aria-label="Independent engines">
          {stories.map((tool) => (
            <FerraEditorialRow
              key={tool.name}
              notes={
                tool.editorial !== undefined && (
                  <FerraNotes label={`About ${displayName(tool)}`} notes={tool.editorial.notes} />
                )
              }
            >
              <FerraEngineArticle tool={tool} />
            </FerraEditorialRow>
          ))}
        </div>
        <section
          className="ferra-editorial-closing"
          id="applications"
          aria-labelledby="applications-title"
        >
          <h2 id="applications-title">From the same workshop.</h2>
          <p>
            Products with their own purpose and identity. Each keeps its own site and documentation.
          </p>
          <FerraApplications />
        </section>
        <section className="ferra-editorial-closing" id="work" aria-labelledby="work-title">
          <h2 id="work-title">Bring us the difficult part.</h2>
          <p>
            Integration, support and long-term maintenance. Tell us what you are building and where
            an engine could help.
          </p>
          <FerraAction href={WORKSHOP.consulting}>Work with us</FerraAction>
          <ul className="ferra-editorial-workshop-links">
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
          </ul>
        </section>
      </FerraEditorial>
    </RegistryFacts>
  );
}
