import type { MetaFunction } from "react-router";

import {
  ApplicationsBand,
  displayName,
  EngineCatalog,
  familyTiers,
  type FamilyTool,
  Mark,
  Principles,
  ProjectHero,
  RegistryFacts,
  runsOnTools,
  Section,
  Voices,
  WORKSHOP,
  WorkWithUs,
} from "ferramenta-family";

import consultingLogo from "../assets/logos/sebastian-consulting.svg";
import softwareLogo from "../assets/logos/sebastian-software.svg";
import registryStats from "../data/registry-stats.json";
import { SITE_DESCRIPTION } from "../site-metadata";

/** A landing page: Ardo lays it out bare, without the docs sidebar. */
export const handle = { layout: "bare" };

export const meta: MetaFunction = () => [
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

const { applications, engines } = familyTiers();

const listFormat = new Intl.ListFormat("en", { type: "conjunction" });
const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

/** A small count as prose writes it: "seven", not "7". */
function numberWord(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The first name in a lineage fact: "Oniguruma" from "Oniguruma / vscode-oniguruma". */
function firstName(fact: string): string {
  return fact.split(" / ")[0] ?? fact;
}

/** The lineage facts of every engine that has one of this kind, in catalog order. */
function lineageNames(tools: FamilyTool[], kind: "buildsOn" | "succeeds"): string {
  return tools
    .map((tool) => tool[kind])
    .filter((fact) => fact !== undefined)
    .map((fact) => firstName(fact))
    .join(" · ");
}

const engineCount = numberWord(engines.length);

/** What each engine is, from the registry: "a regex engine, a syntax highlighter, …". */
const engineKinds = listFormat.format(
  engines.map((tool) => tool.what.charAt(0).toLowerCase() + tool.what.slice(1)),
);

/** The applications that run on family engines lead the band; the intro names the first. */
const lead = applications.find((tool) => runsOnTools(tool).length > 0);
const applicationsIntro =
  lead === undefined
    ? undefined
    : `${displayName(lead)} is built on ${numberWord(runsOnTools(lead).length)} of them. It is the family at work in one product.`;

const principles = [
  {
    heading: "Proven, not promised",
    text: "Where an engine succeeds an established implementation, differential suites measure it against that reference. Claims stay tied to current evidence.",
  },
  {
    heading: "Open standards first",
    text: "CommonMark, PO files, ICU MessageFormat, Hunspell dictionaries, TextMate grammars. We build on what the ecosystem already agreed on, never on formats only we control.",
  },
  {
    heading: "Match before outrun",
    text: "Compatibility comes first. Performance claims follow published benchmarks, never a compatibility asterisk.",
  },
];

/**
 * The workshop's two names, each under its own logo in its own colors. They
 * stand on the light ground, where they were drawn to stand: a foreign logo is
 * never put on steel, oak, rust or the dark chrome.
 */
function Workshop() {
  return (
    <div className="wrap">
      <ul className="workshop">
        <li>
          <a href={WORKSHOP.openSource}>
            <img src={softwareLogo} alt="Sebastian Software" width={231} height={45} />
            <p>
              Production-grade open-source projects across several languages: the wider workshop
              this family comes from.
            </p>
            <span>
              {new URL(WORKSHOP.openSource).host} <Mark name="arrow" size={16} />
            </span>
          </a>
        </li>
        <li>
          <a href={WORKSHOP.consulting}>
            <img src={consultingLogo} alt="Sebastian Consulting" width={239} height={45} />
            <p>
              The people behind the engines, for hire: integration, support, and long-term
              maintenance.
            </p>
            <span>
              {new URL(WORKSHOP.consulting).host} <Mark name="arrow" size={16} />
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
}

/**
 * What others say about the material, verbatim and linked. Not testimonials:
 * nobody here speaks about the family, only about building with Rust.
 */
const VOICES = [
  {
    quote: "…as damn near straight to the metal as you can get while still being portable.",
    who: "David Heinemeier Hansson",
    where: "on HEY's mail server, now in Rust · Rails World 2026 keynote",
    href: "https://www.youtube.com/watch?v=vDjW_dRyKXY&t=3922s",
  },
  {
    quote: "Vibe-coded projects written in Rust are faster, safer, and more likely to work…",
    who: "Justin Schroeder",
    where: "on X · August 2026",
    href: "https://x.com/jpschroeder/status/2094104291321462911",
  },
];

/** The personal note: who builds this, and why. Site-only, so it is not in the kit. */
function Story() {
  return (
    <section className="fam-section story" data-tone="dim" aria-label="Why this workshop exists">
      <div className="wrap story-grid">
        <blockquote>
          <p>We&rsquo;ve been handed good tools all our lives. Time to forge some back.</p>
          <footer>
            <b>Sebastian Werner</b>
            <span>{WORKSHOP.name}</span>
          </footer>
        </blockquote>
        <div className="story-body">
          <p>
            Open source shaped our careers, from leading qooxdoo at 1&amp;1 to the tools we rely on
            every day. Ferramenta, Italian for hardware store, is how we give back: one workshop,
            building the load-bearing parts properly.
          </p>
          <p>
            Much of that infrastructure was written decades ago, in C or across several languages.
            Most of what we build is its next generation: the same contracts, designed the way
            you&rsquo;d design them for Rust today.
          </p>
        </div>
      </div>
      <div className="wrap">
        <Voices title="The material, in other people's words" voices={VOICES} />
      </div>
      <Workshop />
    </section>
  );
}

export default function HomePage() {
  return (
    <RegistryFacts snapshot={registryStats.tools} snapshotGeneratedAt={registryStats.generatedAt}>
      <div className="fam-page">
        <ProjectHero
          title={
            <>
              The engines under your tools, rebuilt in <em>Rust</em>.
            </>
          }
          lede={`Ferramenta is a family of ${engineCount} Rust-native engines: ${engineKinds}. Each follows the standard its field already agreed on, and each works on its own.`}
          actions={
            <>
              <a className="fam-btn fam-btn-primary" href="#engines">
                See the {engineCount} engines <Mark name="arrow" size={18} />
              </a>
              <a className="fam-btn fam-btn-ghost" href={WORKSHOP.source}>
                <Mark name="github" size={18} /> GitHub
              </a>
            </>
          }
          icon="ferramenta"
          facts={[
            { label: "Material", value: "Rust" },
            { label: "Built to", value: lineageNames(engines, "buildsOn") },
            { label: "Succeeds", value: lineageNames(engines, "succeeds") },
            { label: "Made by", value: WORKSHOP.name },
          ]}
        />

        <Section
          id="engines"
          title={`${capitalize(engineCount)} engines, each for one job`}
          intro="Every engine works on its own. Where two fit together, the entry says so."
        >
          <EngineCatalog />
        </Section>

        <ApplicationsBand title="What the engines carry" intro={applicationsIntro} />

        <Section id="principles" title="What every engine is held to">
          <Principles items={principles} />
        </Section>

        <Story />

        <WorkWithUs />
      </div>
    </RegistryFacts>
  );
}
