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
      "Ferramenta is a family of Rust-native developer tools built around familiar standards and APIs, with compatibility measured against established predecessors where they exist.",
  },
]

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
    heading: "Familiar contracts",
    text: "Compatibility is earned tool by tool. Stable projects can be adopted against familiar contracts; alpha and early tools show the standard they are working toward.",
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
      <span className="proof">
        <span className="proof-story">{tool.proof}</span>
        <span className="proof-facts">
          <span>
            <b>{tool.compat ? "Contract" : "Purpose"}</b>
            {tool.compat ?? tool.job}
          </span>
          <span>
            <b>Evidence</b>
            {tool.evidence}
          </span>
        </span>
      </span>
      <span className="meta">
        <b>v{tool.version}</b>
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
                Ferramenta — Italian for hardware store — is a family of Rust-native tools built
                around standards and APIs developers already know. Each project is re-engineered
                in Rust; where an established predecessor exists, compatibility is checked
                differentially and performance is measured in the open.
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
                    <span className="board-copy">
                      <b>{tool.name}</b>
                      <small>{tool.shortJob}</small>
                    </span>
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
              Two more tools taking shape — early, cut from the same steel, and explicit about
              what is proven now and what is still on the bench.
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
            <h2>What earns the stamp</h2>
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
                    <b>Stable through evidence.</b> Every tool earns stability through evidence
                    appropriate to its contract — ferroni and ferrocat are stable today; the rest
                    keep their maturity visible.
                  </li>
                  <li>
                    <b>Match before outrun.</b> Where there is a predecessor contract,
                    compatibility comes first and performance claims follow published benchmarks
                    — never a compatibility asterisk.
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

        <section className="next-step">
          <div className="wrap">
            <h2>Choose a tool. Check the proof.</h2>
            <div className="next-grid">
              <p>
                Start with the job you need, then compare its contract, evidence, and maturity in
                the ledger. Every project is open source; early work is labeled early.
              </p>
              <div className="cta-row">
                <a className="btn primary chamfer" href="#pipeline">
                  Compare the tools <Mark name="arrow" className="icon" size={18} />
                </a>
                <a className="btn ghost" href="https://github.com/sebastian-software">
                  View all source
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="partners">
          <div className="wrap">
            <h2>The wider workshop</h2>
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
