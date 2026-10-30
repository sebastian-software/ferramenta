import type { ReactNode } from "ardo/react";

import {
  ArdoLink as Link,
  type ArdoMetaFunction as MetaFunction,
  ArdoActiveLink as NavLink,
  useArdoPath,
} from "ardo/runtime";
import {
  ArdoErrorBoundary,
  ArdoRoot,
  ArdoRootLayout,
  ArdoSearch,
  ArdoSidebar,
  ArdoSidebarGroup,
  ArdoSidebarLink,
  ArdoSidebarSection,
  ArdoThemeToggle,
} from "ardo/ui";
import { MarkDefs, SiteFooter, SiteHeader, SiteMenu, ToolSwitcher } from "ferramenta-family";
import { FerraFooter, FerraHeader, FerraPage } from "ferramenta-family/ferra";
import touchIcon from "ferramenta-family/ferra-assets/ferramenta/apple-touch-icon.png?url";
import favicon from "ferramenta-family/ferra-assets/ferramenta/favicon.ico?url";

import { isSampleDocsPath, isSamplePath, SAMPLE, SAMPLE_DOCS } from "./kit/sample";
import { SITE_DESCRIPTION } from "./site-metadata";
import "ferramenta-family/ferra.css";

import "./styles/ferra-site.css";
import "ferramenta-family/tokens.css";
import "ferramenta-family/fonts.css";
import "ferramenta-family/theme.css";
// The docs shell is only at work on the kit's sample documentation.
import "ferramenta-family/docs.css";
// The landing kit before the site's own stylesheet, so site.css adjusts it on ties.
import "ferramenta-family/landing.css";

import "./styles/site.css";
import "./styles/kit.css";

// Last on purpose: the shared chrome has to win the ties the scoped reset in
// site.css would otherwise take, exactly as it did when both lived in one file.
import "ferramenta-family/chrome.css";

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native engines" },
  {
    name: "description",
    content: SITE_DESCRIPTION,
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <ArdoRootLayout icon={favicon} appleTouchIcon={touchIcon} iconBasePath={false}>
      {children}
    </ArdoRootLayout>
  );
}

export const ErrorBoundary = ArdoErrorBoundary;

/** The original kit's pages, repeated in a compact menu on narrow screens. */
function KitHeader() {
  const pages = (
    <>
      <NavLink to="/kit" end>
        Kit
      </NavLink>
      <NavLink to={SAMPLE.home}>Sample tool</NavLink>
      <NavLink to={SAMPLE.docs}>Sample docs</NavLink>
    </>
  );
  return (
    <SiteHeader
      nav={<div className="site-links">{pages}</div>}
      actions={<SiteMenu label="Kit">{pages}</SiteMenu>}
    />
  );
}

/*
 * The invented tool's bar, as a member's own site has it: its lockup, its
 * links, the way back to the family. The tool is not in the registry, so the
 * header cannot look it up: the switcher it would render is placed by hand,
 * without a `current`. A real member passes `current` and leaves the rest to
 * the header.
 */
function SampleHeader({ docs }: { docs: boolean }) {
  return (
    <SiteHeader
      current={SAMPLE.name}
      lockup="project"
      home={SAMPLE.home}
      switcher={false}
      nav={
        <>
          <div className="site-links">
            {/* On the documentation itself a phone gets the section menu instead. */}
            <NavLink to={SAMPLE.docs} data-keep={docs ? undefined : ""}>
              Docs
            </NavLink>
            <Link to="/kit">Back to the kit</Link>
          </div>
          <ToolSwitcher family />
        </>
      }
      actions={
        docs ? (
          <>
            <SiteMenu label="Docs">
              {SAMPLE_DOCS.map((page) => (
                <NavLink key={page.to} to={page.to}>
                  {page.label}
                </NavLink>
              ))}
            </SiteMenu>
            {/* The host's search component in the chrome's slot; it reads its index on its own. */}
            <div className="site-search">
              <ArdoSearch />
            </div>
          </>
        ) : undefined
      }
      themeToggle={docs ? <ArdoThemeToggle /> : undefined}
    />
  );
}

function KitFooter({ sample }: { sample: boolean }) {
  return sample ? (
    <SiteFooter legal="A sample page of the Ferramenta kit. Ferrometro is invented; nothing on it is a real tool or a real measurement." />
  ) : (
    <SiteFooter members="short" />
  );
}

/** Shared Ardo 6 shell; the original kit remains available during sibling migrations. */
export default function Root() {
  const pathname = useArdoPath();
  const inKit = pathname.startsWith("/kit");
  const ferraKit = pathname === "/kit/ferra" || pathname.startsWith("/kit/ferra/");
  const sample = isSamplePath(pathname);
  const docs = isSampleDocsPath(pathname);

  if (!inKit) {
    return (
      <FerraPage className="ferra-site">
        <ArdoRoot
          className="ferra-shell"
          scrollMode="document"
          sidebar={false}
          header={
            <FerraHeader
              home="/"
              nav={
                <>
                  <a href="/#engines">Engines</a>
                  <a href="/#choosing">Choosing an engine</a>
                  <a href="/#applications">Applications</a>
                  <a href="/#work">Work with us</a>
                </>
              }
            />
          }
          footer={false}
        />
        <FerraFooter home="/" />
      </FerraPage>
    );
  }

  const header = ferraKit ? false : sample ? <SampleHeader docs={docs} /> : <KitHeader />;

  return (
    <>
      <a className="skip-link" href={ferraKit ? "#ferra-main" : "#main-content"}>
        Skip to content
      </a>
      <MarkDefs />
      <meta name="robots" content="noindex" />
      <div className={docs ? "fam-docs-shell" : undefined}>
        <ArdoRoot
          header={header}
          footer={false}
          sidebar={docs ? undefined : false}
          scrollMode="document"
          className={docs ? undefined : "ferramenta-site"}
        >
          {docs && (
            <ArdoSidebar>
              <ArdoSidebarSection id="guide" label="Guide" to={SAMPLE.docs}>
                <ArdoSidebarGroup title="Guide" collapsible={false}>
                  {SAMPLE_DOCS.map((page) => (
                    <ArdoSidebarLink key={page.to} to={page.to}>
                      {page.label}
                    </ArdoSidebarLink>
                  ))}
                </ArdoSidebarGroup>
              </ArdoSidebarSection>
            </ArdoSidebar>
          )}
        </ArdoRoot>
      </div>
      {!ferraKit && <KitFooter sample={sample} />}
    </>
  );
}
