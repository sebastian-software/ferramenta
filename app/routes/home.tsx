import type { MetaFunction } from "react-router"
import { familyGroups, type FamilyTool } from "@ferramenta/ardo-config"
import { Mark, MarkDefs } from "../components/Marks"
import { SiteHeader } from "../components/SiteHeader"
import { SiteFooter } from "../components/SiteFooter"
import softwareLogo from "../assets/logos/sebastian-software.svg"
import consultingLogo from "../assets/logos/sebastian-consulting.svg"

/** Fully custom shell: disable Ardo's default header/footer for this route. */
export const handle = { chrome: false }

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native developer tools" },
  {
    name: "description",
    content:
      "Ferramenta is a family of Rust-native developer tools that keep the APIs you already know — held to the originals by differential testing, and built to outrun them.",
  },
]

const beliefs = [
  {
    heading: "Proven, not promised",
    text: "Compatibility is enforced, not advertised. Differential suites run every tool against the original — the Hunspell oracle, the mirrored Shiki tests, svgo byte for byte, Oniguruma's own C library.",
  },
  {
    heading: "Open standards first",
    text: "CommonMark and GFM, PO and ICU MessageFormat, Hunspell dictionaries, TextMate grammars. We build on what the ecosystem already agreed on — never on formats only we control.",
  },
  {
    heading: "Known APIs",
    text: "Drop-in by design: the same options, the same output. Adopting a Ferramenta tool is a swap, not a migration.",
  },
  {
    heading: "Safe defaults",
    text: "Rust cores without a C toolchain — memory-layout-tuned, SIMD and NEON where it pays. Sanitized output, bounded memory and time: production behavior out of the box.",
  },
]

function ToolRow({ tool, step }: { tool: FamilyTool; step?: number }) {
  return (
    <a className="row" href={tool.docs ?? tool.repo}>
      <span className="num">{step ?? ""}</span>
      <span className="plate">
        <Mark name={tool.name} />
      </span>
      <span className="who">
        <b>{tool.name}</b>
        <span className="sub">{tool.job}</span>
      </span>
      <span className="proof">{tool.proof}</span>
      <span className="meta">
        <b>v{tool.version}</b>
        {tool.registries ? <> · {tool.registries}</> : null}
        <br />
        <span className={tool.status === "stable" ? "st stable" : "st"}>{tool.status}</span>
      </span>
      <Mark name="arrow" className="go icon" size={22} />
    </a>
  )
}

export default function HomePage() {
  const { pipeline, language, workbench } = familyGroups()
  const board = [...pipeline, ...language, ...workbench]

  return (
    <>
      <script
        type="application/x-design-contract"
        dangerouslySetInnerHTML={{
          __html:
            "THESIS: hardware-store family site, tools on one pegboard. OWN-WORLD: brushed steel, iron bands, rust, duotone marks on octagon plates with hooks, Big Shoulders uppercase. COMP: design/comp/entwurf-c.html + user-approved why-section",
        }}
      />
      <MarkDefs />
      <SiteHeader />
      <div className="page-main">
        <div className="hero">
          <div className="wrap">
            <div>
              <h1>
                Heavy industry <em>for the web.</em>
              </h1>
              <p className="lede">
                Ferramenta — Italian for hardware store — is a family of Rust-native tools that
                keep the APIs you already know. No mechanical ports: each tool is re-engineered in
                Rust, held to its original by differential testing, and built to outrun it.
              </p>
              <div className="cta-row">
                <a className="btn primary chamfer" href="#pipeline">
                  Browse the tools <Mark name="arrow" className="icon" size={18} />
                </a>
                <a className="btn ghost" href="https://github.com/sebastian-software">
                  GitHub
                </a>
              </div>
            </div>
            <div className="board" aria-label="The tool family">
              <div className="board-grid">
                {board.map((tool) => (
                  <a key={tool.name} href={tool.docs ?? tool.repo}>
                    <svg className="hook" aria-hidden="true">
                      <use href="#i-hook" />
                    </svg>
                    <span className="markplate">
                      <Mark name={tool.name} />
                    </span>
                    {tool.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section id="pipeline">
          <div className="wrap">
            <h2>The content pipeline</h2>
            <p className="intro">
              Three tools, one chain: a regex engine drives a highlighter, the highlighter feeds a
              Markdown renderer. Markdown with code goes in, highlighted HTML comes out — end to
              end in Rust, and each stage is a drop-in for the tool it replaces.
            </p>
            <div className="ledger">
              {pipeline.map((tool, index) => (
                <ToolRow key={tool.name} tool={tool} step={index + 1} />
              ))}
            </div>
          </div>
        </section>

        <section id="language">
          <div className="wrap">
            <h2>The language workshop</h2>
            <p className="intro">
              Spelling and translation, treated as engineering problems: deterministic, diffable,
              verifiable.
            </p>
            <div className="ledger">
              {language.map((tool) => (
                <ToolRow key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        <section id="workbench">
          <div className="wrap">
            <h2>On the workbench</h2>
            <p className="intro">
              Two more tools taking shape — early, but cut from the same steel: verified against
              their originals from the first commit.
            </p>
            <div className="ledger">
              {workbench.map((tool) => (
                <ToolRow key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        <div className="ironband">
          <div className="wrap">
            <h2>Held to the originals</h2>
            <div className="beliefs">
              {beliefs.map((belief) => (
                <div key={belief.heading}>
                  <h3>{belief.heading}</h3>
                  <p>{belief.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="why" className="why">
          <div className="wrap">
            <h2>Why this store exists</h2>
            <div className="why-grid">
              <p className="why-pull">
                We&rsquo;ve been handed good tools all our lives. Time to forge some back.
              </p>
              <div className="why-body">
                <p>
                  Open source shaped our careers — from leading qooxdoo at 1&amp;1 more than a
                  decade ago to the tools we still rely on every day. Ferramenta is how we give
                  back: one workshop, building the boring, load-bearing parts properly.
                </p>
                <p>
                  Essential developer tooling is going native — Rust mostly, sometimes Go. Vite,
                  SWC, OXC and esbuild showed what happens when the tools everything else stands
                  on stop being slow. That movement isn&rsquo;t ours: we stand on its shoulders.
                  Ferramenta adds the pieces we know best — not mechanical ports, but engines
                  rebuilt the way you&rsquo;d design them for Rust today: memory-layout-conscious,
                  SIMD and NEON where it pays, allocation-free where it counts.
                </p>
                <ul className="goals">
                  <li>
                    <b>Stable everywhere.</b> Every tool earns a stable, differentially proven
                    API — ferroni and ferrocat carry theirs, the rest are on the anvil.
                  </li>
                  <li>
                    <b>Match, then outrun.</b> Same output as the tool each one replaces,
                    benchmarked in the open — never a compatibility asterisk.
                  </li>
                  <li>
                    <b>One chain, all Rust.</b> Markdown with highlighted code, end to end —
                    regex, highlighting, rendering — without a C toolchain or a JS runtime.
                  </li>
                </ul>
                <p className="why-sign">— Sebastian Werner, Sebastian Software</p>
              </div>
            </div>
          </div>
        </section>

        <section className="partners">
          <div className="wrap">
            <h2>From the same workshop</h2>
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
      </div>
      <SiteFooter />
    </>
  )
}
