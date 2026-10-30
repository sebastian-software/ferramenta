import type { FamilyTool } from "ferramenta-family/registry";

import {
  FerraContents,
  FerraEditorial,
  FerraEditorialRow,
  FerraEngineArticle,
  FerraNotes,
} from "ferramenta-family/ferra";

import { SAMPLE } from "./sample";

const sample: FamilyTool = {
  name: SAMPLE.name,
  what: SAMPLE.what,
  job: "Unit conversion",
  does: "An invented engine for the kit.",
  audience: "For this fictional specimen only.",
  proof: "This is sample copy, not a real product claim.",
  evidence: "Fictional sample data",
  buildsOn: "SI unit conventions",
  version: "0.1.0",
  status: "early",
  repo: SAMPLE.home,
  docs: SAMPLE.docs,
  editorial: {
    order: 1,
    navigation: "Units and measurements",
    subtitle: "A fictional engine for measurements.",
    introduction:
      "This sample shows how an image, title and explanation share one soft reading surface. A related decision stays in the adjacent margin. The release is fictional; no live engine measurements are used here.",
    notes: [
      {
        title: "Keep the context close",
        body: "Explain a decision alongside the example it belongs to. The source order places this note after the article on a narrow screen.",
        href: "#sample-input",
      },
      {
        title: "An attached facts strip",
        body: "Release details belong to the article they describe. The full-width footer keeps those details together without consuming the reading area.",
        href: "#sample-input",
      },
    ],
  },
};
const contents = [
  { href: `#${SAMPLE.name}`, label: SAMPLE.title, description: "An invented measurement engine" },
  { href: "#sample-input", label: "Sample guide", description: "Host-owned documentation" },
];

export function FerraEditorialSpecimen() {
  return (
    <section
      className="ferra-kit-editorial"
      aria-labelledby="editorial-specimen-title"
      id="editorial"
    >
      <header className="ferra-wrap">
        <h2 id="editorial-specimen-title">Soft surfaces, connected reading.</h2>
        <p>
          Real exported components with the invented tool Ferrometro. All release data below is
          fictional.
        </p>
      </header>
      <FerraEditorial navigation={<FerraContents items={contents} label="Sample contents" />}>
        <FerraEditorialRow
          notes={<FerraNotes label="About this sample" notes={sample.editorial?.notes ?? []} />}
        >
          <FerraEngineArticle
            tool={sample}
            art={
              <svg
                className="ferra-kit-ruler"
                viewBox="0 0 400 160"
                role="img"
                aria-label="An illustrative measuring scale"
              >
                <rect x="20" y="44" width="360" height="72" rx="4" />
                {[40, 72, 104, 136, 168, 200, 232, 264, 296, 328, 360].map((x, index) => (
                  <path key={x} d={`M${x} 44v${index % 2 === 0 ? 34 : 20}`} />
                ))}
                <path className="ferra-kit-ruler-index" d="M200 30v100" />
              </svg>
            }
          />
        </FerraEditorialRow>
      </FerraEditorial>
    </section>
  );
}
