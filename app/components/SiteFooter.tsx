import { familyGroups } from "@ferramenta/ardo-config"
import { Mark } from "./Marks"

/** Steel-plate footer: lockup, family columns from the registry, company links. */
export function SiteFooter() {
  const { pipeline, language, workbench } = familyGroups()

  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <a className="lockup" href="/">
            <Mark name="ferramenta" size={22} />
            ferramenta
          </a>
          <p>Rust-native developer tools by Sebastian Software. Open source, openly verified.</p>
        </div>
        <div>
          <h3>Pipeline</h3>
          <ul>
            {pipeline.map((tool) => (
              <li key={tool.name}>
                <a href={tool.docs ?? tool.repo}>{tool.name}</a>
              </li>
            ))}
          </ul>
          <h3 className="foot-gap">Language</h3>
          <ul>
            {language.map((tool) => (
              <li key={tool.name}>
                <a href={tool.docs ?? tool.repo}>{tool.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Workbench</h3>
          <ul>
            {workbench.map((tool) => (
              <li key={tool.name}>
                <a href={tool.docs ?? tool.repo}>{tool.name}</a>
              </li>
            ))}
          </ul>
          <h3 className="foot-gap">Company</h3>
          <ul>
            <li>
              <a href="https://github.com/sebastian-software">GitHub</a>
            </li>
            <li>
              <a href="https://oss.sebastian-software.com">Open Source</a>
            </li>
            <li>
              <a href="https://sebastian-consulting.com">Consulting</a>
            </li>
          </ul>
        </div>
        <p className="foot-legal">
          This site is MIT-licensed; each tool states its own license in its repository.
        </p>
      </div>
    </footer>
  )
}
