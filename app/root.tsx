import type { LinksFunction, MetaFunction } from "react-router";

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
import displayFont from "ferramenta-family/fonts/barlow-condensed-700.woff2?url";
import { Link, NavLink, useLocation } from "react-router";
import config from "virtual:ardo/config";

import { isSampleDocsPath, isSamplePath, SAMPLE, SAMPLE_DOCS } from "./kit/sample";
import { SITE_DESCRIPTION } from "./site-metadata";
import "ardo/ui/styles.css";
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

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: displayFont,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

export const meta: MetaFunction = () => [
  { title: "Ferramenta — Rust-native engines" },
  {
    name: "description",
    content: SITE_DESCRIPTION,
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return <ArdoRootLayout>{children}</ArdoRootLayout>;
}

export const ErrorBoundary = ArdoErrorBoundary;

/*
 * The family chrome replaces Ardo's own header and footer on every page, so
 * Ardo renders neither: `chrome` is read from every route match, and no route
 * below this one overrides it.
 */
export const handle = { chrome: false };

/** The family site's own bar: the page's anchors on the index, the kit's pages inside the kit. */
function FamilyHeader({ inKit }: { inKit: boolean }) {
  if (inKit) {
    const pages = (
      <>
        <NavLink to="/kit" end>
          Kit
        </NavLink>
        <NavLink to={SAMPLE.home}>Sample tool</NavLink>
        <NavLink to={SAMPLE.docs}>Sample docs</NavLink>
      </>
    );
    // The same three links twice: in the bar where there is room, in a menu where there is not.
    return (
      <SiteHeader
        nav={<div className="site-links">{pages}</div>}
        actions={<SiteMenu label="Kit">{pages}</SiteMenu>}
      />
    );
  }
  // The index already is the list the switcher would open, so the bar carries the page's anchors.
  return (
    <SiteHeader
      switcher={false}
      nav={
        <div className="site-links">
          <a href="/#engines">Engines</a>
          <a href="/#applications">Applications</a>
          {/* The one link a phone keeps: the hero's own action already leads to the engines. */}
          <a href="/#work" data-keep="">
            Work with us
          </a>
        </div>
      }
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

/*
THESIS: Every machine carries a data plate that says what it is. The family
site is the workshop's catalog of such plates: one riveted steel plate per
engine, read before anything else. Refuses the SaaS hero-plus-feature-cards
arrangement and the dark developer-tool default.
OWN-WORLD: A light ground in warm iron greys with deliberately dark passages in
dark oak, the bench the plates lie on; brushed-steel plates with rivets and one
moving reflection; a dark iron bar and footer; lettering in a condensed
data-plate face; each engine one rendered object of forged steel with a single
glowing or rust-orange element; oxidized rust only as the closing band.
STORY: A developer arriving from one tool's site learns what the family is
(the plate), reads each engine as what it is, what it does, and for whom,
before where it comes from; sees what the engines carry (the applications,
under their own logos); learns what every engine is held to; meets the people
and their workshop; and is offered their help.
FIRST VIEWPORT: Dark iron bar; one steel plate on the oak bench with the
headline, the lede, the one action, and the family's toolbox; the measured
facts on a small tag hanging below it.
FORM: Code-led. Direction 1 of 3 ("Typenschild"), chosen by the owner from three
coded comps and iterated in review to the quiet version on graphite (ADR-0008;
concept seed 59e2994f). design/comp/2026-10/typenschild-home.html and
typenschild-tool.html are the comps that review ended on: the reference for
structure and tone, not pixel law. Copy and facts come from the registry.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, and DESIGN.md
*/
export default function Root() {
  const { pathname } = useLocation();
  const inKit = pathname.startsWith("/kit");
  const sample = isSamplePath(pathname);
  const docs = isSampleDocsPath(pathname);

  // The family chrome sits outside ArdoRoot, so the header and footer are the
  // page's banner and contentinfo landmarks rather than parts of Ardo's <main>.
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <MarkDefs />
      {/* The kit is public but not for search results: React hoists this into the head. */}
      {inKit && <meta name="robots" content="noindex" />}
      {sample ? <SampleHeader docs={docs} /> : <FamilyHeader inKit={inKit} />}
      {docs ? (
        <div className="fam-docs-shell">
          <ArdoRoot config={config}>
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
          </ArdoRoot>
        </div>
      ) : (
        <ArdoRoot config={config} className="ferramenta-site" />
      )}
      {sample ? (
        <SiteFooter legal="A sample page of the Ferramenta kit. Ferrometro is invented; nothing on it is a real tool or a real measurement." />
      ) : (
        <SiteFooter members="short" />
      )}
    </>
  );
}
