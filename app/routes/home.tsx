import type { MetaFunction } from "react-router";

import {
  ClosingAction,
  displayName,
  family,
  FamilyDownloads,
  familyGroups,
  IronBand,
  JobIndex,
  Mark,
  Pegboard,
  PipelineAssembly,
  ProjectHero,
  RegistryFacts,
  RunSample,
  runsOnTools,
  Section,
  StampKey,
  ToolLedger,
} from "ferramenta-family";
import { useId } from "react";

import consultingLogo from "../assets/logos/sebastian-consulting.svg";
import softwareLogo from "../assets/logos/sebastian-software.svg";
import pipelineSample from "../data/pipeline-sample.json";
import registryStats from "../data/registry-stats.json";

/** Fully custom shell: disable Ardo's default header/footer for this route. */
export const handle = { chrome: false };

const description =
  "Ferramenta is a family of Rust-native developer tools built around familiar standards and APIs, with compatibility measured against established predecessors where they exist.";

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native developer tools" },
  { name: "description", content: description },
  { property: "og:title", content: "Ferramenta — Rust-native developer tools" },
  { property: "og:description", content: description },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://ferramenta.dev/" },
  { property: "og:image", content: "https://ferramenta.dev/social.png" },
  { name: "twitter:card", content: "summary_large_image" },
];

const beliefs = [
  {
    heading: "Proven, not promised",
    text: "Where a tool succeeds an established implementation, differential suites measure it against that reference: Hunspell, Shiki, Oniguruma. Claims stay tied to current evidence and maturity.",
  },
  {
    heading: "Open standards first",
    text: "CommonMark and GFM, PO and ICU MessageFormat, Hunspell dictionaries, TextMate grammars. We build on what the ecosystem already agreed on, never on formats only we control.",
  },
  {
    heading: "Earned, tool by tool",
    text: "A successor earns compatibility with the implementation it replaces; a new development earns trust with the standards it builds on. Either way, the stamp on each tool says how far it has come.",
  },
  {
    heading: "Safe defaults",
    text: "Rust cores without a C toolchain, tuned for memory layout, with SIMD and NEON where it pays. Sanitized output, bounded memory and time: production behavior out of the box.",
  },
];

/** Every repository of the workshop; the family is a subset, named on this page. */
const sourceUrl = "https://github.com/sebastian-software";

/** The stable members, from the registry, as a sentence list. */
const listFormat = new Intl.ListFormat("en", { type: "conjunction" });

/** What the pipeline sample was rendered with, from the artifact itself. */
const sampleRun = `Rendered by Ferromark ${pipelineSample.rendered.ferromark} with Ferriki ${pipelineSample.rendered.ferriki}`;

/** Group sizes in words, for the section intros: the registry decides how many. */
const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six"];
const countWord = (count: number) => COUNT_WORDS[count] ?? String(count);

const stableNames = listFormat.format(
  family.filter((tool) => tool.status === "stable").map((tool) => displayName(tool)),
);

function Why() {
  return (
    <Section id="why" title="Why this store exists">
      <div className="why-grid">
        <div className="why-lead">
          <p className="why-pull">
            We&rsquo;ve been handed good tools all our lives. Time to forge some back.
          </p>
          <footer className="why-author">
            <span>Written by</span>
            <b>Sebastian Werner</b>
            <small>Sebastian Software</small>
          </footer>
        </div>
        <div className="why-body">
          <p>
            Open source shaped our careers, from leading qooxdoo at 1&amp;1 more than a decade ago
            to the tools we still rely on every day. Ferramenta, Italian for hardware store, is how
            we give back: one workshop, building the boring, load-bearing parts properly.
          </p>
          <p>
            Essential developer tooling is going native. Vite, SWC, OXC and esbuild showed what
            happens when the tools everything else stands on stop being slow, and we stand on their
            shoulders. Ferramenta adds the pieces we know best, rebuilt the way you&rsquo;d design
            them for Rust today rather than ported line by line.
          </p>
          <ul className="goals">
            <li>
              <b>Stable through evidence.</b> Every tool earns stability through evidence
              appropriate to its contract. {stableNames} are stable today; the rest keep their
              maturity visible.
            </li>
            <li>
              <b>Match before outrun.</b> Where there is a predecessor contract, compatibility comes
              first, and performance claims follow published benchmarks, never a compatibility
              asterisk.
            </li>
            <li>
              <b>Alone or chained.</b> Each tool is useful on its own. Chained, Markdown with
              highlighted code runs end to end in Rust, without a C toolchain or a JS runtime.
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Partners() {
  const titleId = useId();
  return (
    <section className="fam-section partners" aria-labelledby={titleId}>
      <div className="wrap">
        <h2 id={titleId}>The wider workshop</h2>
        <div className="pgrid">
          <a href="https://oss.sebastian-software.com">
            <img src={softwareLogo} alt="Sebastian Software" />
            <p>
              Production-grade open-source projects across several languages: the wider workshop
              this family comes from.
            </p>
            <span className="plink">
              oss.sebastian-software.com <Mark name="arrow" className="icon" size={16} />
            </span>
          </a>
          <a href="https://sebastian-consulting.com">
            <img src={consultingLogo} alt="Sebastian Consulting" />
            <p>
              The people behind the tools, for hire: consulting for integration, support, and
              long-term maintenance.
            </p>
            <span className="plink">
              sebastian-consulting.com <Mark name="arrow" className="icon" size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** The engines Palamedes runs on, as the registry has them. */
const palamedesEngines = listFormat.format(
  family
    .filter((tool) => tool.name === "palamedes")
    .flatMap((tool) => runsOnTools(tool))
    .map((tool) => displayName(tool)),
);

export default function HomePage() {
  const { pipeline, language, workbench } = familyGroups();

  return (
    <RegistryFacts snapshot={registryStats.tools}>
      <ProjectHero
        title={
          <>
            Heavy industry <em>for the web.</em>
          </>
        }
        lede="Rust-native tools built on the standards developers already know. Each one works on its own: take the tool your job needs."
        actions={
          <>
            <a className="fam-btn fam-btn-primary" href="#pipeline">
              See the tools and their proof <Mark name="arrow" className="icon" size={18} />
            </a>
            <a className="fam-btn fam-btn-ghost" href={sourceUrl}>
              <Mark name="github" className="icon" size={18} /> GitHub
            </a>
          </>
        }
        aside={<Pegboard />}
      />

      {/* Straight after the wall: the stamps on it are explained before the ledgers use them. */}
      <IronBand title="What earns the stamp" rows={beliefs}>
        <StampKey />
      </IronBand>

      <Section
        id="pipeline"
        title="The content pipeline"
        intro="Three tools that also work as one chain. Each stands alone: Ferroni is a regex engine, Ferriki a highlighter, Ferromark a Markdown renderer. Chained, Markdown with code goes in and highlighted HTML comes out, end to end in Rust, as in Ferromark's own quick start below."
      >
        <PipelineAssembly />
        {/* The chain, run for real: a committed artifact (scripts/render-pipeline-sample.mjs), never hand-written. */}
        <RunSample
          input={pipelineSample.markdown}
          inputCaption="quick-start.md"
          output={pipelineSample.html}
          outputCaption={`${sampleRun}, unedited`}
        />
        <ToolLedger steps tools={pipeline} />
      </Section>

      <Section
        id="language"
        title="The language workshop"
        intro={`Spelling and translation, treated as engineering problems: deterministic, diffable, verifiable. Ferrolex and Ferrocat each stand alone; Palamedes, the i18n toolchain for TypeScript apps, runs on ${palamedesEngines}.`}
      >
        <ToolLedger tools={language} />
      </Section>

      <Section
        id="workbench"
        title="On the workbench"
        intro={`${countWord(workbench.length)} more tools taking shape: early, cut from the same steel, and explicit about what is proven now and what is still on the bench.`}
      >
        <ToolLedger tools={workbench} />
      </Section>

      <Why />

      <ClosingAction
        id="jobs"
        title="Pick the job. Take the tool."
        aside={<JobIndex />}
        links={
          <a href={sourceUrl}>
            <Mark name="github" className="icon" size={14} />
            github.com/sebastian-software
          </a>
        }
      >
        <p>
          Look a job up: the index names the tool that does it and how far it has come. No tool
          needs another beside it, and every project is open source.
        </p>
        <p className="tally">
          <FamilyDownloads /> downloads on crates.io across the published crates.
        </p>
      </ClosingAction>

      <Partners />
    </RegistryFacts>
  );
}
