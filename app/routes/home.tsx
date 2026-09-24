import type { MetaFunction } from "react-router";

import {
  ClosingAction,
  family,
  familyGroups,
  type FamilyTool,
  Fasteners,
  IronBand,
  isEngine,
  leadsToRepo,
  leadTool,
  Mark,
  PipelineAssembly,
  ProjectHero,
  RegistryBadge,
  RepoNote,
  Section,
  Stamp,
  StampKey,
  toolHref,
} from "ferramenta-family";
import { useId } from "react";

import consultingLogo from "../assets/logos/sebastian-consulting.svg";
import softwareLogo from "../assets/logos/sebastian-software.svg";
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
    text: "Where a tool succeeds an established implementation, differential suites measure it against that reference — from Hunspell and Shiki to SVGO and Oniguruma. Claims stay tied to current evidence and maturity.",
  },
  {
    heading: "Open standards first",
    text: "CommonMark and GFM, PO and ICU MessageFormat, Hunspell dictionaries, TextMate grammars. We build on what the ecosystem already agreed on — never on formats only we control.",
  },
  {
    heading: "Earned, tool by tool",
    text: "A successor earns compatibility with the implementation it replaces; a new development earns trust with the standards it builds on. Either way, the stamp on each tool says how far it has come.",
  },
  {
    heading: "Safe defaults",
    text: "Rust cores without a C toolchain — memory-layout-tuned, SIMD and NEON where it pays. Sanitized output, bounded memory and time: production behavior out of the box.",
  },
];

/* Only what the build needs: where a member is published, and its version. */
type RegistryStat = {
  crates: { version: string } | null;
  npm: { version: string; placeholder: boolean } | null;
};

/** Every repository of the workshop; the family is a subset, named on this page. */
const sourceUrl = "https://github.com/sebastian-software";

const stats = registryStats.tools as Record<string, RegistryStat | undefined>;

/** The stable members, from the registry, as a sentence list. */
const stableNames = new Intl.ListFormat("en", { type: "conjunction" }).format(
  family.filter((tool) => tool.status === "stable").map((tool) => tool.name),
);

/**
 * Where a member is published and its version, from the build-time stats
 * (scripts/refresh-registry-stats.mjs). The registry entry keeps a fallback
 * version so an offline build still renders. Download counts are not baked
 * in: they render live, as registry badges.
 */
function toolFacts(tool: FamilyTool) {
  const stat = stats[tool.name];
  const adapter = stat?.npm && !stat.npm.placeholder ? stat.npm : null;
  return {
    version: stat?.crates?.version ?? adapter?.version ?? tool.version,
    onCrates: Boolean(stat?.crates),
    adapter: Boolean(adapter),
  };
}

/**
 * The facts under a row's proof, as a definition list a screen reader can
 * pace. A successor names what it succeeds; a new development names the
 * standards it builds on; both name their evidence, qualitatively, never with a figure.
 */
function ProofFacts({ tool }: { tool: FamilyTool }) {
  return (
    <dl className="proof-facts">
      {tool.succeeds === undefined ? null : (
        <div>
          <dt>Succeeds</dt>
          <dd>{tool.succeeds}</dd>
        </div>
      )}
      {tool.buildsOn === undefined ? null : (
        <div>
          <dt>Builds on</dt>
          <dd>{tool.buildsOn}</dd>
        </div>
      )}
      <div>
        <dt>Evidence</dt>
        <dd>{tool.evidence}</dd>
      </div>
    </dl>
  );
}

function ToolMeta({ tool }: { tool: FamilyTool }) {
  const facts = toolFacts(tool);
  return (
    <div className="meta">
      <b>v{facts.version}</b>
      <span className="platforms">
        {facts.onCrates ? (
          <span className="platform">
            <Mark name="crate" className="icon" size={15} />
            <RegistryBadge registry="crates" name={tool.name} />
          </span>
        ) : null}
        {facts.adapter ? (
          <span className="platform">
            <Mark name="adapter" className="icon" size={15} />
            <RegistryBadge registry="npm" name={tool.name} />
          </span>
        ) : null}
        {isEngine(tool) && !facts.onCrates && !facts.adapter ? (
          <span className="platform">git only</span>
        ) : null}
      </span>
      <Stamp solid={tool.status === "stable"}>{tool.status}</Stamp>
    </div>
  );
}

/**
 * One ledger row. A successor carries the implementation it succeeds, a new
 * development the standards it builds on; an application carries neither —
 * what it promises is the product, and the engines it is built on are named
 * in the evidence.
 *
 * The name is the link, stretched over the whole row, so the target stays the
 * row while a screen reader hears the name, not every fact at once. A row
 * that leads to a repository rather than a site says so.
 */
function ToolRow({ tool, step }: { tool: FamilyTool; step?: number }) {
  const onSite = !leadsToRepo(tool);
  return (
    <article className="row">
      <span className="num" aria-hidden="true">
        {step === undefined ? "" : String(step).padStart(2, "0")}
      </span>
      <span className="plate markplate" aria-hidden="true">
        <Mark name={tool.name} />
      </span>
      <div className="who">
        <h3>
          <a className="row-link" href={toolHref(tool)}>
            {tool.name}
            <RepoNote tool={tool} />
          </a>
        </h3>
        <p className="sub">{tool.job}</p>
      </div>
      <div className="proof">
        <p className="proof-story">{tool.proof}</p>
        <ProofFacts tool={tool} />
      </div>
      <ToolMeta tool={tool} />
      <Mark name={onSite ? "arrow" : "github"} className="go icon" size={22} />
    </article>
  );
}

const boardGroups = () => {
  const { pipeline, language, workbench } = familyGroups();
  return [
    { label: "Pipeline", tools: pipeline },
    { label: "Language", tools: language },
    { label: "Workbench", tools: workbench },
  ];
};

function BoardGroup({ label, tools }: { label: string; tools: FamilyTool[] }) {
  const labelId = useId();
  return (
    <div className="board-group" role="group" aria-labelledby={labelId}>
      <small className="board-group-label" id={labelId}>
        {label}
      </small>
      <div className="board-row">
        {tools.map((tool) => (
          <a key={tool.name} href={toolHref(tool)}>
            <svg className="hook" aria-hidden="true">
              <use href="#i-hook" />
            </svg>
            <span className="markplate">
              <Mark name={tool.name} />
            </span>
            {/* Maturity on the wall itself: every plate carries its stamp, so none outranks another. */}
            <span className="board-stamp">
              <Stamp solid={tool.status === "stable"}>{tool.status}</Stamp>
            </span>
            <span className="board-copy">
              <b>
                {tool.name}
                {leadsToRepo(tool) ? (
                  <Mark name="github" className="icon board-repo" size={11} />
                ) : null}
                <RepoNote tool={tool} />
              </b>
              <small>{tool.shortJob}</small>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/** The pegboard: every member on its hook, grouped the way the page is. */
function Pegboard() {
  return (
    <nav className="board" aria-label="The tool family">
      <Fasteners />
      <div className="board-grid">
        {boardGroups().map((group) => (
          <BoardGroup key={group.label} label={group.label} tools={group.tools} />
        ))}
      </div>
    </nav>
  );
}

/**
 * The close: one place to start per line of work — the group's stable member,
 * the one ready to adopt. A group with none says so and points at its section
 * instead of recommending an early tool as if it were proven.
 */
function StartHere() {
  return (
    <ul className="start-list">
      {boardGroups().map((group) => {
        const tool = leadTool(group.tools);
        if (tool === undefined) return null;
        if (tool.status !== "stable") {
          return (
            <li key={group.label}>
              <a className="start start-bench" href={`#${group.label.toLowerCase()}`}>
                <small className="start-group">{group.label}</small>
                <span className="start-copy">
                  <b>Nothing to adopt yet</b>
                  <span>{group.tools.length} tools taking shape — see what is proven so far</span>
                </span>
                <Stamp>{tool.status}</Stamp>
                <Mark name="arrow" className="go icon" size={20} />
              </a>
            </li>
          );
        }
        return (
          <li key={group.label}>
            <a className="start" href={toolHref(tool)}>
              <small className="start-group">{group.label}</small>
              <span className="plate markplate" aria-hidden="true">
                <Mark name={tool.name} />
              </span>
              <span className="start-copy">
                <b>
                  {tool.name}
                  <RepoNote tool={tool} />
                </b>
                <span>{tool.shortJob}</span>
              </span>
              <Stamp solid>{tool.status}</Stamp>
              <Mark name="arrow" className="go icon" size={20} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ToolLedger({ step, tools }: { step?: boolean; tools: FamilyTool[] }) {
  return (
    <div className="ledger">
      {tools.map((tool, index) => (
        <ToolRow key={tool.name} tool={tool} step={step === true ? index + 1 : undefined} />
      ))}
    </div>
  );
}

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
            Open source shaped our careers — from leading qooxdoo at 1&amp;1 more than a decade ago
            to the tools we still rely on every day. Ferramenta is how we give back: one workshop,
            building the boring, load-bearing parts properly.
          </p>
          <p>
            Essential developer tooling is going native — Rust mostly, sometimes Go. Vite, SWC, OXC
            and esbuild showed what happens when the tools everything else stands on stop being
            slow. That movement isn&rsquo;t ours: we stand on its shoulders. Ferramenta adds the
            pieces we know best — not mechanical ports, but engines rebuilt the way you&rsquo;d
            design them for Rust today: memory-layout-conscious, SIMD and NEON where it pays,
            allocation-free where it counts.
          </p>
          <ul className="goals">
            <li>
              <b>Stable through evidence.</b> Every tool earns stability through evidence
              appropriate to its contract — {stableNames} are stable today; the rest keep their
              maturity visible.
            </li>
            <li>
              <b>Match before outrun.</b> Where there is a predecessor contract, compatibility comes
              first and performance claims follow published benchmarks — never a compatibility
              asterisk.
            </li>
            <li>
              <b>One chain, all Rust.</b> Markdown with highlighted code, end to end — regex,
              highlighting, rendering — without a C toolchain or a JS runtime.
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
              Sixteen production-grade open-source projects across four languages — the wider
              workshop this family comes from.
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

export default function HomePage() {
  const { pipeline, language, workbench } = familyGroups();

  return (
    <>
      <ProjectHero
        title={
          <>
            Heavy industry <em>for the web.</em>
          </>
        }
        lede="Ferramenta — Italian for hardware store — is a family of Rust-native tools built around standards and APIs developers already know. Some succeed an established implementation and are checked against it differentially; others are new developments, built directly on open standards. Either way, what a tool claims is measured in the open."
        actions={
          <>
            <a className="fam-btn fam-btn-primary" href="#pipeline">
              Browse the tools <Mark name="arrow" className="icon" size={18} />
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
        intro="Three tools, one chain: a regex engine drives a highlighter, the highlighter feeds a Markdown renderer. Markdown with code goes in, highlighted HTML comes out — end to end in Rust, with each stage measured against the implementation it succeeds or the specification it follows."
      >
        <PipelineAssembly />
        <ToolLedger step tools={pipeline} />
      </Section>

      <Section
        id="language"
        title="The language workshop"
        intro="Spelling and translation, treated as engineering problems: deterministic, diffable, verifiable. Two engines, plus the application they carry — palamedes is the i18n toolchain built on this family, and the reason the engines have to hold."
      >
        <ToolLedger tools={language} />
      </Section>

      <Section
        id="workbench"
        title="On the workbench"
        intro="Three more tools taking shape — early, cut from the same steel, and explicit about what is proven now and what is still on the bench."
      >
        <ToolLedger tools={workbench} />
      </Section>

      <Why />

      <ClosingAction
        title="Choose a tool. Check the proof."
        actions={<StartHere />}
        links={
          <a href={sourceUrl}>
            <Mark name="github" className="icon" size={14} />
            github.com/sebastian-software
          </a>
        }
      >
        <p>
          Start where a line of work is ready: its stable tool, the one to adopt today. Every
          project is open source; early work is labeled early, and each tool's own site carries its
          current numbers.
        </p>
      </ClosingAction>

      <Partners />
    </>
  );
}
