import type { ArdoMetaDescriptor, ArdoMetaFunction } from "ardo/runtime";

import { RegistryFacts } from "ferramenta-family";
import {
  MonoAction,
  MonoApplications,
  MonoClosing,
  MonoColophon,
  MonoEngineCatalog,
  MonoEngraving,
  MonoLeadIn,
  MonoOpening,
  MonoPassage,
  MonoSection,
  MonoWide,
  MonoWorkshop,
} from "ferramenta-family/monografie";
import { familyTiers, WORKSHOP } from "ferramenta-family/registry";

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

const { engines, applications } = familyTiers();
const spelled = [
  "no",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];
const count = (value: number) => spelled[value] ?? String(value);
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default function HomePage() {
  return (
    <RegistryFacts snapshot={registryStats.tools} snapshotGeneratedAt={registryStats.generatedAt}>
      <MonoOpening
        product="ferramenta"
        instrumentLabel="Ferramenta's instrument: a precision register in which independent tool inserts each hold their own slot on one rail."
        caption="A precision register: independent tool inserts, each in a slot of its own, share one rail without depending on each other."
        kicker={`Ferramenta, open source by ${WORKSHOP.company}`}
        title="A workshop for independent Rust engines."
        subtitle="Each with a job of its own."
        standfirst="Useful software carries years of knowledge in its formats, grammars and edge cases. We build focused engines around that knowledge, each with a documented boundary and checked against the work it continues. Choose the tool your work needs; none requires another."
        actions={
          <>
            <MonoAction href="#engines" primary detail={`${count(engines.length)} engines`}>
              See the engines
            </MonoAction>
            <MonoAction href={WORKSHOP.consulting} detail="Integration and support">
              Work with us
            </MonoAction>
          </>
        }
        facts={[
          {
            value: (
              <>
                <em>{engines.length}</em> engines
              </>
            ),
            label: "each one adopted on its own",
          },
          {
            value: `${applications.length} apps`,
            label: "from the same workshop, on their own sites",
          },
          { value: "Rust", label: "native code, safe by default" },
          { value: "Open", label: "source on GitHub, under permissive licenses" },
        ]}
      />
      <MonoEngraving seed={1} />
      <MonoSection
        id="approach"
        title="Keep the knowledge. Make it reusable."
        standfirst="We build on familiar formats, grammars and dictionaries, and check each engine against the implementation or conformance suite it continues."
      >
        <MonoPassage
          note={{
            term: "Engine",
            children:
              "A library that does one job inside your application: reading Markdown, matching a pattern, drawing a diagram.",
          }}
        >
          <p>
            <MonoLeadIn>Most applications rest</MonoLeadIn> on a few pieces of knowledge that took
            years to get right: how Markdown is read, how a regex engine backtracks, how a
            translation catalog merges. That knowledge often lives in a C library that is aging, or
            in a JavaScript tool that needs a browser. Each Ferramenta engine takes one such piece,
            keeps its behavior and makes it a native library you can add to your own program.
          </p>
        </MonoPassage>
        <MonoPassage
          note={{
            side: "right",
            term: "Why Rust",
            children:
              "Native speed and explicit ownership, without a garbage collector inside the engine.",
          }}
        >
          <p>
            Rust gives us native code and explicit ownership without a garbage collector in the
            engine. We favor safe Rust and keep every exception deliberate and documented. Speed
            matters, but compatibility and predictable behavior come first: an engine that is fast
            and slightly wrong is not one you can build on.
          </p>
        </MonoPassage>
        <p>
          Every engine has a defined scope and stands on its own. Some fit well together, and the
          catalog below says where. None of them is a step you have to take before another.
        </p>
      </MonoSection>
      <MonoEngraving seed={2} />
      <MonoSection
        id="engines"
        title={`${capital(count(engines.length))} engines, one bench.`}
        standfirst="Each engine has its own site, its own documentation and its own release. The plate shows the instrument that stands for its job."
      >
        <MonoWide>
          <MonoEngineCatalog />
        </MonoWide>
      </MonoSection>
      <MonoEngraving seed={3} />
      <MonoSection
        id="applications"
        title="From the same workshop."
        standfirst="Products with their own purpose and identity. Each keeps its own site and documentation, and some run on the engines above."
      >
        <MonoWide>
          <MonoApplications />
        </MonoWide>
      </MonoSection>
      <MonoEngraving seed={4} />
      <MonoColophon>
        We build Ferramenta at {WORKSHOP.name} in {WORKSHOP.place}. Open source shaped our work,
        including our time leading qooxdoo at 1&amp;1, and Ferramenta is one way we give reusable
        parts back.
      </MonoColophon>
      <MonoClosing
        id="workshop"
        title="Bring us the difficult part."
        standfirst="Integration, support and long-term maintenance. Tell us what you are building and where an engine could help."
        actions={
          <MonoAction href={WORKSHOP.consulting} primary detail="sebastian-consulting.com">
            Work with us
          </MonoAction>
        }
      >
        <MonoWorkshop />
      </MonoClosing>
    </RegistryFacts>
  );
}
