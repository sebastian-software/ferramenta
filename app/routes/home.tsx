import type { MetaFunction } from "react-router"
import "../styles/home.css"

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native developer tools" },
  {
    name: "description",
    content:
      "A family of Rust-native developer tools by Sebastian Software: ferroni, ferriki, ferromark and more — with the APIs you already know.",
  },
]

const pipeline = [
  {
    name: "ferroni",
    role: "Regex engine",
    text: "Oniguruma-compatible regex engine in pure Rust. Named captures, variable-length look-behind, 886 Unicode properties — no C toolchain.",
    compat: "Oniguruma / vscode-oniguruma",
    registry: "crates.io",
    href: "https://github.com/sebastian-software/ferroni",
  },
  {
    name: "ferriki",
    role: "Syntax highlighting",
    text: "Shiki-compatible syntax highlighting with a native Rust core. The API you know from Shiki, verified against the upstream test suite.",
    compat: "Shiki",
    registry: "npm",
    href: "https://github.com/sebastian-software/ferriki",
  },
  {
    name: "ferromark",
    role: "Markdown",
    text: "Markdown to HTML at 300+ MiB/s. Full CommonMark, every GFM extension, footnotes, callouts, math — and MDX without a JS toolchain.",
    compat: "CommonMark / GFM",
    registry: "crates.io",
    href: "https://github.com/sebastian-software/ferromark",
  },
]

const workshop = [
  {
    name: "ferrovia",
    text: "SVGO-compatible SVG optimizer with differential verification against svgo.",
    href: "https://github.com/sebastian-software/ferrovia",
  },
  {
    name: "ferrocat",
    text: "Translation catalog engine for PO, FCL, and ICU MessageFormat — git-merge-friendly and AI-translation-native.",
    href: "https://github.com/sebastian-software/ferrocat",
  },
  {
    name: "ferrolex",
    text: "Spell, dictionary, and brand validation toolkit for code and localization workflows.",
    href: "https://github.com/sebastian-software/ferrolex",
  },
  {
    name: "ferrugo",
    text: "Rust-native PDF previews for server-side thumbnails and document automation.",
    href: "https://github.com/sebastian-software/ferrugo",
  },
]

const principles = [
  {
    heading: "Compatible by contract",
    text: "Each tool keeps the API of the ecosystem standard it replaces — Oniguruma, Shiki, CommonMark, SVGO — and proves it against the upstream test suites, not just in the README.",
  },
  {
    heading: "Native core, familiar surface",
    text: "The heavy lifting happens in Rust. JavaScript stays a thin host layer where the ecosystem needs one, published as prebuilt binaries for every major platform.",
  },
  {
    heading: "Boring releases",
    text: "Every tool ships the same way: conventional commits, release-please, CI gates against upstream compatibility suites, MIT licensed.",
  },
]

export default function HomePage() {
  return (
    <main className="landing">
      <section className="hero">
        <p className="eyebrow">Ferramenta &middot; Italian for “hardware store”</p>
        <h1>Rust-native tools. The APIs you already know.</h1>
        <p className="lead">
          Ferramenta is a family of developer tools by Sebastian Software. Each one takes a job the
          web ecosystem already solved — regex scanning, syntax highlighting, Markdown, SVG
          optimization — and rebuilds it on a fast, memory-safe Rust core, without breaking the
          contract of the original.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="https://github.com/sebastian-software">
            Browse on GitHub
          </a>
          <a
            className="button button-secondary"
            href="https://oss.sebastian-software.com"
          >
            About Sebastian Software
          </a>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <p className="eyebrow">The content pipeline</p>
          <h2>Three tools, one chain</h2>
          <p>
            ferroni scans, ferriki highlights, ferromark renders. Together they turn Markdown with
            code into highlighted HTML — end to end in Rust.
          </p>
        </div>
        <div className="feature-grid pipeline-grid">
          {pipeline.map((tool, index) => (
            <article key={tool.name}>
              <p className="step">{String(index + 1).padStart(2, "0")}</p>
              <h3>
                <a href={tool.href}>{tool.name}</a>
              </h3>
              <p className="tool-role">{tool.role}</p>
              <p className="tool-text">{tool.text}</p>
              <p className="tool-meta">
                <span>{tool.compat}</span>
                <span>{tool.registry}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel panel-mesh">
        <div className="section-head">
          <p className="eyebrow">The rest of the shelf</p>
          <h2>More tools in the store</h2>
        </div>
        <div className="feature-grid">
          {workshop.map((tool) => (
            <article key={tool.name}>
              <h3>
                <a href={tool.href}>{tool.name}</a>
              </h3>
              <p className="tool-text">{tool.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <p className="eyebrow">How we build</p>
          <h2>Same principles, every tool</h2>
        </div>
        <div className="feature-grid">
          {principles.map((principle) => (
            <article key={principle.heading}>
              <h3>{principle.heading}</h3>
              <p className="tool-text">{principle.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
